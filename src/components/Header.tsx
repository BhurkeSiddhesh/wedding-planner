import React, { useState, useEffect } from 'react';
import { useWedding } from '../context/WeddingContext';
import { useAuth } from '../context/AuthContext';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  RotateCcw, 
  Settings, 
  Printer, 
  Share2, 
  Heart, 
  CheckCircle2, 
  Database, 
  Cloud, 
  RefreshCw, 
  Trash2, 
  BookOpen,
  UserPlus,
  LogIn,
  LogOut,
  Sparkles,
  Edit2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { InvitePartnerModal } from './Modals/InvitePartnerModal';
import { AuthModal } from './Auth/AuthModal';
import { OnboardingSetupModal } from './Modals/OnboardingSetupModal';

interface HeaderProps {
  onOpenSettings: () => void;
  onPrintDossier: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSettings, onPrintDossier }) => {
  const { 
    profile, 
    isCloudSyncing, 
    isDbConnected, 
    resetAllData, 
    loadMarathiTemplate 
  } = useWedding();

  const { currentUser, userRole, signOutUser } = useAuth();

  const [daysRemaining, setDaysRemaining] = useState<number>(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);

  const isGroom = userRole === 'groom';
  const partnerRoleLabel = isGroom ? 'Invite Bride (वधू)' : 'Invite Groom (वर)';

  useEffect(() => {
    if (profile.weddingDate) {
      const target = new Date(profile.weddingDate).getTime();
      const now = new Date().getTime();
      const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
      setDaysRemaining(diff > 0 ? diff : 0);
    }
  }, [profile.weddingDate]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `लग्नसोहळा - ${profile.brideName} & ${profile.groomName}`,
        text: `Marathi Wedding Planner for ${profile.brideName} & ${profile.groomName}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href).then(() => {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      }).catch(() => {
        window.prompt('Copy this planner link:', window.location.href);
      });
    }
  };

  const handleConfirmReset = async () => {
    setIsResetting(true);
    await resetAllData();
    setIsResetting(false);
    setShowResetConfirm(false);
  };

  const handleLoadTemplate = async () => {
    setIsResetting(true);
    await loadMarathiTemplate();
    setIsResetting(false);
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
  };

  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-30 font-sans-google">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          
          {/* Couple & Date Info */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsOnboardingModalOpen(true)}
              title="Click to edit Wedding Date, Time & Venue"
              className="w-10 h-10 rounded-full bg-[#7a1c1c] text-amber-100 flex items-center justify-center font-bold text-sm shrink-0 shadow-xs hover:ring-2 hover:ring-[#7a1c1c]/40 transition cursor-pointer"
            >
              {profile.brideName?.charAt(0) || 'S'}&{profile.groomName?.charAt(0) || 'R'}
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-bold text-stone-900 tracking-tight flex items-center gap-1.5">
                  <span>{profile.brideName}</span>
                  <Heart className="w-4 h-4 text-rose-500 fill-rose-500 inline" />
                  <span>{profile.groomName}</span>
                </h1>
                
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200/70">
                  {daysRemaining > 0 ? `${daysRemaining} Days Left` : 'Wedding Day!'}
                </span>

                <button
                  type="button"
                  onClick={() => setIsOnboardingModalOpen(true)}
                  className="text-stone-400 hover:text-stone-700 p-0.5 rounded transition"
                  title="Edit Wedding Details (Date, Muhurta, Venue)"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-x-3 text-xs text-stone-500 mt-0.5">
                <span className="flex items-center gap-1 font-medium text-stone-700">
                  <Calendar className="w-3.5 h-3.5 text-[#7a1c1c]" />
                  {profile.weddingDate ? new Date(profile.weddingDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Set Date'}
                </span>
                <span className="hidden sm:flex items-center gap-1 text-amber-900 font-medium">
                  <Clock className="w-3.5 h-3.5 text-amber-700" />
                  {profile.mahuratTime}
                </span>
                <span className="hidden md:flex items-center gap-1 truncate max-w-[220px]">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" />
                  {profile.mainKaryalaya || profile.city}
                </span>
              </div>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center flex-wrap gap-2">
            
            {/* Role & Partner Invite or Gmail Sign In */}
            {currentUser ? (
              <div className="flex items-center gap-1.5 bg-stone-50 p-1 rounded-xl border border-stone-200">
                <div className="flex items-center gap-1 px-2 py-1 text-xs">
                  <span className="text-sm">{isGroom ? '🤵' : '👰'}</span>
                  <span className="font-bold text-stone-800 text-[11px]">
                    {isGroom ? 'वर (Groom)' : 'वधू (Bride)'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(true)}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-[#7a1c1c] to-[#962525] hover:from-[#581212] hover:to-[#7a1c1c] transition shadow-xs"
                  title="Invite partner to collaborate"
                >
                  <UserPlus className="w-3 h-3 text-amber-200" />
                  <span>{partnerRoleLabel}</span>
                </button>

                <button
                  type="button"
                  onClick={signOutUser}
                  className="p-1 text-stone-400 hover:text-rose-600 rounded transition"
                  title={`Sign out (${currentUser.email})`}
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-800 bg-white hover:bg-stone-50 border border-stone-300 transition shadow-xs"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Gmail Login</span>
              </button>
            )}

            {/* Load Template */}
            <button
              onClick={handleLoadTemplate}
              disabled={isResetting}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 transition border border-stone-200"
              title="Load Full Marathi Wedding Checklist & Budget Template"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-700" />
              <span className="hidden sm:inline">Load Template</span>
            </button>

            {/* Reset All Data Button */}
            <button
              onClick={() => setShowResetConfirm(true)}
              disabled={isResetting}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 transition border border-rose-200"
              title="Reset everything to clean slate"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
              <span className="hidden sm:inline">Clean Slate</span>
            </button>

            {/* Print Dossier */}
            <button
              onClick={onPrintDossier}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 transition border border-stone-200"
              title="Print Wedding Dossier & Checklist"
            >
              <Printer className="w-3.5 h-3.5 text-stone-600" />
              <span className="hidden sm:inline">Print</span>
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 transition border border-stone-200"
              title="Share Planner"
            >
              {copiedLink ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-stone-600" />}
              <span>{copiedLink ? 'Copied' : 'Share'}</span>
            </button>

            {/* Settings */}
            <button
              onClick={onOpenSettings}
              aria-label="Open planner settings"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#7a1c1c] hover:bg-[#581212] transition shadow-xs"
            >
              <Settings className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Settings</span>
            </button>
          </div>

        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 border border-stone-200 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-stone-900">Reset to Clean Slate?</h3>
            <p className="text-sm text-stone-600 mt-2">
              This will clear all tasks, expenses, and budget entries for a fresh start. Your wedding date and venue settings will be kept, and you can reload the Marathi template at any time.
            </p>

            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmReset}
                disabled={isResetting}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition shadow-xs flex items-center gap-1.5"
              >
                {isResetting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                <span>Yes, Reset to Clean Slate</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invite Partner Modal */}
      {isInviteModalOpen && (
        <InvitePartnerModal
          isOpen={isInviteModalOpen}
          onClose={() => setIsInviteModalOpen(false)}
        />
      )}

      {/* Auth Modal */}
      {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          defaultRole={userRole}
        />
      )}

      {/* Onboarding / Edit Details Modal */}
      {isOnboardingModalOpen && (
        <OnboardingSetupModal
          isOpen={isOnboardingModalOpen}
          onClose={() => setIsOnboardingModalOpen(false)}
        />
      )}
    </header>
  );
};

