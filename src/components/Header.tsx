import React, { useState, useEffect } from 'react';
import { useWedding } from '../context/WeddingContext';
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
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';

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

  const [daysRemaining, setDaysRemaining] = useState<number>(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

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
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          
          {/* Couple & Date Info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#7a1c1c] text-amber-100 flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
              {profile.brideName?.charAt(0) || 'S'}&{profile.groomName?.charAt(0) || 'R'}
            </div>

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
              </div>

              <div className="flex flex-wrap items-center gap-x-3 text-xs text-stone-500 mt-0.5">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-stone-400" />
                  {profile.weddingDate ? new Date(profile.weddingDate).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Set Date'}
                </span>
                <span className="hidden sm:flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-stone-400" />
                  {profile.mahuratTime}
                </span>
                <span className="hidden md:flex items-center gap-1 truncate max-w-[200px]">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" />
                  {profile.city || profile.mainKaryalaya}
                </span>
              </div>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center flex-wrap gap-2">
            {/* Live Database Sync Indicator */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <Cloud className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isCloudSyncing ? 'Syncing...' : 'Cloud Synced'}</span>
            </div>

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
              title="Reset everything to empty slate"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
              <span>Reset All</span>
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
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-[#7a1c1c] hover:bg-[#581212] transition shadow-xs"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Settings</span>
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

            <h3 className="text-lg font-bold text-stone-900">Reset All Wedding Data?</h3>
            <p className="text-sm text-stone-600 mt-2">
              This will permanently delete all tasks, expenses, and budget entries from your cloud database. You can start completely fresh or reload the Marathi template anytime.
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
                <span>Yes, Reset Everything</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
