import React, { useState } from 'react';
import { useAuth, UserRole } from '../../context/AuthContext';
import { X, Sparkles, ShieldCheck, Heart, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: UserRole;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, defaultRole = 'groom' }) => {
  const { signInWithGoogle, error, clearError } = useAuth();
  const [selectedRole, setSelectedRole] = useState<UserRole>(defaultRole);
  const [isSigningIn, setIsSigningIn] = useState(false);

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    clearError();
    const user = await signInWithGoogle(selectedRole);
    setIsSigningIn(false);
    if (user) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs font-sans-google">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-stone-200 flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#4a0e0e] via-[#6b1d1d] to-[#8c2525] text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-300 mb-2 shadow-inner">
            <Sparkles className="w-6 h-6" />
          </div>

          <h3 className="font-serif-marathi text-xl font-bold tracking-wide text-amber-100">
            ॥ शुभमंगल सावधान ॥
          </h3>
          <p className="text-xs text-amber-200/90 mt-1">
            Sign in with Gmail to collaborate with your partner
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          {/* Select Role */}
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-2">
              Select Your Role:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedRole('groom')}
                className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition ${
                  selectedRole === 'groom'
                    ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-500/20 text-blue-950 font-bold'
                    : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                }`}
              >
                <span className="text-xl">🤵</span>
                <div>
                  <p className="text-xs">Groom (वर)</p>
                  <p className="text-[10px] font-normal text-stone-500">Var Paksha</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('bride')}
                className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition ${
                  selectedRole === 'bride'
                    ? 'bg-rose-50 border-rose-500 ring-2 ring-rose-500/20 text-rose-950 font-bold'
                    : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                }`}
              >
                <span className="text-xl">👰</span>
                <div>
                  <p className="text-xs">Bride (वधू)</p>
                  <p className="text-[10px] font-normal text-stone-500">Vadhu Paksha</p>
                </div>
              </button>
            </div>
          </div>

          {/* Role Policy Explanation */}
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-[11px] text-stone-600 leading-relaxed">
            <p className="font-semibold text-stone-800 mb-1 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Real-Time Groom & Bride Partnership
            </p>
            {selectedRole === 'groom' ? (
              <p>
                When you log in as <strong>Groom</strong>, you will be able to invite your <strong>Bride</strong> to use this planner together with automatic 50:50 and ceremony-specific split cost isolation.
              </p>
            ) : (
              <p>
                When you log in as <strong>Bride</strong>, you will be able to invite your <strong>Groom</strong> to collaborate on wedding rituals, task checklists, and venue expenses.
              </p>
            )}
          </div>

          {error && (
            <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-rose-700 text-xs">
              {error}
            </div>
          )}

          {/* Google Sign In Button */}
          <button
            type="button"
            disabled={isSigningIn}
            onClick={handleGoogleSignIn}
            className="w-full py-3 px-4 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 font-semibold flex items-center justify-center gap-3 shadow-xs hover:shadow-md transition text-xs"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{isSigningIn ? 'Connecting with Gmail...' : `Sign in with Gmail as ${selectedRole === 'groom' ? 'Groom' : 'Bride'}`}</span>
          </button>
        </div>

        {/* Footer */}
        <div className="p-3 bg-stone-50 border-t border-stone-200 text-center text-[11px] text-stone-400">
          🔒 Secure Google Authentication • No passwords needed
        </div>

      </div>
    </div>
  );
};
