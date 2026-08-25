import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export type UserRole = 'groom' | 'bride' | 'viewer';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  userRole: UserRole | null;
  setUserRole: (role: UserRole) => void;
  signInWithGoogle: (preferredRole?: UserRole) => Promise<User | null>;
  signOutUser: () => Promise<void>;
  partnerRole: 'bride' | 'groom' | null;
  getInviteLink: () => string;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRoleState] = useState<UserRole | null>(() => {
    return (localStorage.getItem('wedding_user_role') as UserRole) || null;
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user && !user.isAnonymous) {
        try {
          // Check if there is an assigned role in Firestore
          const userDocRef = doc(db, 'wedding_users', user.uid);
          const snap = await getDoc(userDocRef);
          if (snap.exists()) {
            const data = snap.data();
            if (data.role) {
              setUserRoleState(data.role);
              localStorage.setItem('wedding_user_role', data.role);
            }
          }
        } catch (err) {
          console.warn('Could not fetch user role from db:', err);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const setUserRole = async (role: UserRole) => {
    setUserRoleState(role);
    localStorage.setItem('wedding_user_role', role);

    if (currentUser && !currentUser.isAnonymous) {
      try {
        const userDocRef = doc(db, 'wedding_users', currentUser.uid);
        await setDoc(
          userDocRef,
          {
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
            role,
            updatedAt: new Date().toISOString(),
          },
          { merge: true }
        );
      } catch (err) {
        console.warn('Error saving user role to db:', err);
      }
    }
  };

  const signInWithGoogle = async (preferredRole?: UserRole): Promise<User | null> => {
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account',
      });
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setCurrentUser(user);

      // Determine or assign role
      let assignedRole: UserRole = preferredRole || userRole || 'groom';

      // Check URL parameters for invitation role
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const inviteRole = urlParams.get('role') as UserRole;
        if (inviteRole === 'bride' || inviteRole === 'groom') {
          assignedRole = inviteRole;
        }
      }

      await setUserRole(assignedRole);
      return user;
    } catch (err: unknown) {
      console.error('Google sign-in error:', err);
      const message = err instanceof Error ? err.message : 'Google sign-in failed. Please try again.';
      setError(message);
      return null;
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      localStorage.removeItem('wedding_user_role');
      setUserRoleState(null);
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const partnerRole = userRole === 'groom' ? 'bride' : userRole === 'bride' ? 'groom' : null;

  const getInviteLink = () => {
    if (typeof window === 'undefined') return '';
    const targetRole = partnerRole || 'bride';
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}?invite=partner&role=${targetRole}`;
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        userRole,
        setUserRole,
        signInWithGoogle,
        signOutUser,
        partnerRole,
        getInviteLink,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
