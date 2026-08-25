import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useWedding } from '../../context/WeddingContext';
import { X, Copy, Check, Heart, Mail, ShieldCheck, Sparkles, UserPlus } from 'lucide-react';

interface InvitePartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InvitePartnerModal: React.FC<InvitePartnerModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, userRole, getInviteLink } = useAuth();
  const { profile, updateProfile } = useWedding();

  const isGroom = userRole === 'groom';
  const partnerRoleLabel = isGroom ? 'Bride (वधू पक्ष)' : 'Groom (वर पक्ष)';
  const partnerRoleShort = isGroom ? 'Bride' : 'Groom';
  const partnerRoleEmoji = isGroom ? '👰' : '🤵';

  const currentPartnerEmail = isGroom ? profile.brideEmail : profile.groomEmail;
  const [partnerEmailInput, setPartnerEmailInput] = useState(currentPartnerEmail || '');
  const [copied, setCopied] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const inviteLink = getInviteLink();

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleSavePartnerEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerEmailInput.trim()) return;

    if (isGroom) {
      updateProfile({ brideEmail: partnerEmailInput.trim().toLowerCase() });
    } else {
      updateProfile({ groomEmail: partnerEmailInput.trim().toLowerCase() });
    }

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs font-sans-google">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-stone-200 flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-[#5a1414] via-[#7a1c1c] to-[#962525] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
              <Heart className="w-4 h-4 text-rose-300 fill-rose-300" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">
                Invite {partnerRoleShort} ({partnerRoleEmoji})
              </h3>
              <p className="text-[11px] text-amber-200/90">
                Shared real-time Marathi Wedding Planner
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          {/* Active User Status */}
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base">{isGroom ? '🤵' : '👰'}</span>
              <div>
                <p className="font-semibold text-stone-900">
                  {isGroom ? 'Groom (वर पक्ष)' : 'Bride (वधू पक्ष)'} Account
                </p>
                <p className="text-[11px] text-stone-500">{currentUser?.email || 'Logged in via Gmail'}</p>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" /> Active
            </span>
          </div>

          {/* Role Restriction Note */}
          <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200/70 text-amber-900 text-[11px] leading-relaxed">
            <p className="font-semibold mb-0.5">🔒 Partner Invitation Policy:</p>
            <p>
              As the {isGroom ? 'Groom (वर)' : 'Bride (वधू)'}, you can invite your {partnerRoleLabel}. When your partner signs in with Gmail, they will automatically be linked to this wedding with full collaborative access to ceremonies, tasks, and split expense tracking.
            </p>
          </div>

          {/* Form: Set Partner Gmail */}
          <form onSubmit={handleSavePartnerEmail} className="space-y-2">
            <label className="block font-semibold text-stone-800">
              {partnerRoleShort}&apos;s Gmail Address
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  placeholder={`${partnerRoleShort.toLowerCase()}@gmail.com`}
                  value={partnerEmailInput}
                  onChange={(e) => setPartnerEmailInput(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-lg bg-stone-50 border border-stone-200 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#7a1c1c]/20 text-xs"
                />
              </div>
              <button
                type="submit"
                className="px-3.5 py-2 rounded-lg font-semibold text-white bg-[#7a1c1c] hover:bg-[#5a1414] transition shrink-0 flex items-center gap-1"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Save</span>
              </button>
            </div>
            {savedSuccess && (
              <p className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> {partnerRoleShort}&apos;s Gmail updated successfully!
              </p>
            )}
          </form>

          {/* Shareable Link */}
          <div className="space-y-1.5 pt-2 border-t border-stone-100">
            <label className="block font-semibold text-stone-800">
              Or Share Private {partnerRoleShort} Invite Link
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={inviteLink}
                className="w-full px-3 py-2 rounded-lg bg-stone-100 border border-stone-200 text-stone-600 text-[11px] font-mono select-all focus:outline-none"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-3 py-2 rounded-lg font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 border border-stone-300 transition flex items-center gap-1 shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <p className="text-[10px] text-stone-400">
              Send this link to your {partnerRoleShort} via WhatsApp or Gmail to connect instantly.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-stone-50 border-t border-stone-200 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold text-stone-700 bg-stone-200 hover:bg-stone-300 transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
