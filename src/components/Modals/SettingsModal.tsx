import React, { useState } from 'react';
import { useWedding } from '../../context/WeddingContext';
import { WeddingProfile } from '../../types/wedding';
import { X, Settings, RotateCcw, Save, ShieldAlert } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { profile, updateProfile, resetToDemoData } = useWedding();

  const [formData, setFormData] = useState<WeddingProfile>({ ...profile });
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    confetti({ particleCount: 50, spread: 60 });
    onClose();
  };

  const handleReset = () => {
    resetToDemoData();
    setShowConfirmReset(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#ffffff] rounded-xl max-w-xl w-full border border-[#e8e1d5] shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#4a0e0e] via-[#3d0b0b] to-[#2b0707] p-3.5 sm:p-4 text-[#faecd0] flex items-center justify-between border-b border-[#d4af37]/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-[#d4af37]/20 text-[#d4af37] flex items-center justify-center">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold font-serif-marathi text-white">Wedding Settings & Budget Configuration</h3>
              <p className="text-[10px] text-amber-200/80">लग्नसोहळा तपशील व बजेट मर्यादा</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-md bg-white/10 hover:bg-white/20 text-stone-200 flex items-center justify-center transition"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-3 max-h-[75vh] overflow-y-auto">
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-[#7d7063] uppercase tracking-wider mb-1">
                Bride Name (वधूचे नाव) *
              </label>
              <input
                type="text"
                required
                value={formData.brideName}
                onChange={(e) => setFormData({ ...formData, brideName: e.target.value })}
                className="w-full px-3 py-1.5 text-xs rounded-md bg-[#fcf9f2] border border-[#e8e1d5] text-[#2d2d2d] focus:border-[#6b1d1d] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#7d7063] uppercase tracking-wider mb-1">
                Groom Name (वराचे नाव) *
              </label>
              <input
                type="text"
                required
                value={formData.groomName}
                onChange={(e) => setFormData({ ...formData, groomName: e.target.value })}
                className="w-full px-3 py-1.5 text-xs rounded-md bg-[#fcf9f2] border border-[#e8e1d5] text-[#2d2d2d] focus:border-[#6b1d1d] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-[#7d7063] uppercase tracking-wider mb-1">
                Bride Family Title
              </label>
              <input
                type="text"
                placeholder="कुलकर्णी परिवार (पुणे)"
                value={formData.brideFamilyTitle}
                onChange={(e) => setFormData({ ...formData, brideFamilyTitle: e.target.value })}
                className="w-full px-3 py-1.5 text-xs rounded-md bg-[#fcf9f2] border border-[#e8e1d5] text-[#2d2d2d] focus:border-[#6b1d1d] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#7d7063] uppercase tracking-wider mb-1">
                Groom Family Title
              </label>
              <input
                type="text"
                placeholder="देशमुख परिवार (सातारा)"
                value={formData.groomFamilyTitle}
                onChange={(e) => setFormData({ ...formData, groomFamilyTitle: e.target.value })}
                className="w-full px-3 py-1.5 text-xs rounded-md bg-[#fcf9f2] border border-[#e8e1d5] text-[#2d2d2d] focus:border-[#6b1d1d] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-[#7d7063] uppercase tracking-wider mb-1">
                Wedding Date (विवाह दिनांक) *
              </label>
              <input
                type="date"
                required
                value={formData.weddingDate}
                onChange={(e) => setFormData({ ...formData, weddingDate: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs rounded-md bg-[#fcf9f2] border border-[#e8e1d5] text-[#2d2d2d] focus:border-[#6b1d1d] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#7d7063] uppercase tracking-wider mb-1">
                Muhurta Time (शुभ मुहूर्त) *
              </label>
              <input
                type="text"
                required
                placeholder="12:36 PM"
                value={formData.mahuratTime}
                onChange={(e) => setFormData({ ...formData, mahuratTime: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs rounded-md bg-[#fcf9f2] border border-[#e8e1d5] text-[#2d2d2d] focus:border-[#6b1d1d] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[#7d7063] uppercase tracking-wider mb-1">
              Main Mangal Karyalaya / Lawn Address
            </label>
            <input
              type="text"
              value={formData.mainKaryalaya}
              onChange={(e) => setFormData({ ...formData, mainKaryalaya: e.target.value })}
              className="w-full px-3 py-1.5 text-xs rounded-md bg-[#fcf9f2] border border-[#e8e1d5] text-[#2d2d2d] focus:border-[#6b1d1d] focus:outline-none"
            />
          </div>

          <div className="p-3 rounded-lg bg-[#faecd0]/30 border border-[#d4af37]/40 space-y-2.5">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-[#6b1d1d]">
              Budget Constraints & Target
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div>
                <label className="block text-[10px] font-semibold text-[#7d7063] mb-1">
                  Overall Target (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.targetBudget}
                  onChange={(e) => setFormData({ ...formData, targetBudget: parseFloat(e.target.value) || 0 })}
                  className="w-full px-2.5 py-1 text-xs rounded-md bg-white border border-[#e8e1d5] font-bold text-[#2d2d2d] focus:border-[#6b1d1d] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-[#7d7063] mb-1">
                  Groom Cap (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.groomBudgetCap}
                  onChange={(e) => setFormData({ ...formData, groomBudgetCap: parseFloat(e.target.value) || 0 })}
                  className="w-full px-2.5 py-1 text-xs rounded-md bg-white border border-[#e8e1d5] font-bold text-[#2d2d2d] focus:border-[#6b1d1d] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-[#7d7063] mb-1">
                  Bride Cap (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.brideBudgetCap}
                  onChange={(e) => setFormData({ ...formData, brideBudgetCap: parseFloat(e.target.value) || 0 })}
                  className="w-full px-2.5 py-1 text-xs rounded-md bg-white border border-[#e8e1d5] font-bold text-[#2d2d2d] focus:border-[#6b1d1d] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Reset Demo Data Confirmation */}
          <div className="pt-3 border-t border-[#e8e1d5]">
            {showConfirmReset ? (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg space-y-2 text-xs">
                <p className="font-bold text-rose-900 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span>Reset all data to default demo state?</span>
                </p>
                <p className="text-rose-700 text-[11px]">This will reset all guests, rituals, expenses, and menus back to default sample Marathi wedding data.</p>
                <div className="flex items-center gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-3 py-1 bg-rose-600 text-white font-bold text-xs rounded-md hover:bg-rose-700 transition"
                  >
                    Yes, Reset Data
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowConfirmReset(false)}
                    className="px-3 py-1 bg-white text-[#2d2d2d] font-semibold text-xs rounded-md border border-stone-300 hover:bg-stone-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowConfirmReset(true)}
                className="text-xs font-semibold text-[#7d7063] hover:text-rose-700 flex items-center gap-1 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Sample Marathi Wedding Data</span>
              </button>
            )}
          </div>

          <div className="pt-3 border-t border-[#e8e1d5] flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-semibold text-[#7d7063] hover:bg-[#f4ede1] rounded-md transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#6b1d1d] hover:bg-[#521414] text-white font-bold text-xs rounded-md shadow-xs transition flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Configuration</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
