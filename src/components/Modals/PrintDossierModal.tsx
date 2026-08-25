import React from 'react';
import { useWedding } from '../../context/WeddingContext';
import { formatINR } from '../../utils/calculations';
import { X, Printer, FileText } from 'lucide-react';

interface PrintDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrintDossierModal: React.FC<PrintDossierModalProps> = ({ isOpen, onClose }) => {
  const { profile, rituals, cateringMenus, budgetSummary, guestMetrics } = useWedding();

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#ffffff] rounded-xl max-w-4xl w-full border border-[#e8e1d5] shadow-2xl overflow-hidden my-6 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#4a0e0e] via-[#3d0b0b] to-[#2b0707] p-3.5 sm:p-4 text-[#faecd0] flex items-center justify-between shrink-0 border-b border-[#d4af37]/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-[#d4af37]/20 text-[#d4af37] flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold font-serif-marathi text-white">
                Wedding Dossier & Guru / Coordinator Summary
              </h3>
              <p className="text-[10px] text-amber-200/80">
                गुरुजी, व्यवस्थापक व कुटुंब प्रमुखांसाठी संपूर्ण विवाह अहवाल
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-[#d4af37] hover:bg-[#c49f27] text-[#3d0b0b] font-bold text-xs rounded-md transition flex items-center gap-1.5 shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Dossier</span>
            </button>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-md bg-white/10 hover:bg-white/20 text-stone-200 flex items-center justify-center transition"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div id="printable-dossier" className="p-4 sm:p-6 space-y-5 overflow-y-auto print:p-0 print:m-0">
          
          {/* Cover / Title */}
          <div className="text-center pb-4 border-b border-[#d4af37]/40">
            <span className="text-[#6b1d1d] font-serif-marathi font-bold text-xs tracking-widest uppercase">
              ॥ श्री गणेशाय नमः ॥
            </span>
            <h1 className="text-lg sm:text-xl font-bold font-serif-marathi text-[#2d2d2d] mt-1">
              {profile.brideName} वधू आणि {profile.groomName} वर विवाहसोहळा
            </h1>
            <p className="text-xs text-[#7d7063] mt-0.5">
              {profile.brideFamilyTitle} व {profile.groomFamilyTitle}
            </p>
            <div className="mt-2.5 inline-flex flex-wrap items-center justify-center gap-2.5 bg-[#faecd0]/40 px-3.5 py-1.5 rounded-lg border border-[#d4af37]/40 text-[11px] font-semibold text-[#6b1d1d]">
              <span>📅 दिनांक: {profile.weddingDate}</span>
              <span>•</span>
              <span>⏰ शुभ मुहूर्त: {profile.mahuratTime}</span>
              <span>•</span>
              <span>🏛️ स्थळ: {profile.mainKaryalaya}</span>
            </div>
          </div>

          {/* 1. Rituals & Samagri Requirements for Guruji */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold font-serif-marathi text-[#6b1d1d] border-b border-[#e8e1d5] pb-1.5 flex items-center justify-between">
              <span>१. विधी पत्रिका व पूजा साहित्य यादी (Ceremony Items & Samagri)</span>
              <span className="text-[10px] text-[#7d7063] font-normal">{rituals.length} विधी</span>
            </h2>

            <div className="space-y-2.5">
              {rituals.map((r, idx) => (
                <div key={r.id} className="bg-[#fcf9f2] p-3 rounded-lg border border-[#e8e1d5] text-xs">
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-1.5 border-b border-[#e8e1d5] font-serif-marathi">
                    <span className="font-bold text-[#2d2d2d] text-xs">
                      {idx + 1}. {r.name} ({r.marathiName})
                    </span>
                    <span className="text-[#6b1d1d] font-semibold text-[11px]">
                      {r.startTime} - {r.endTime} @ {r.venue}
                    </span>
                  </div>

                  <div className="mt-2">
                    <span className="font-semibold text-[#7d7063] block mb-1 text-[11px]">साहित्य व पूर्वतयारी:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {r.items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between bg-white p-1.5 rounded border border-[#e8e1d5]">
                          <span className="text-[#2d2d2d] text-[11px]">
                            • {item.name} ({item.quantity})
                          </span>
                          <span className="text-[#7d7063] text-[10px]">
                            {item.assignedTo} {item.isPurchased ? '✓' : ''}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Catering & Pangat Headcount Breakdown */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold font-serif-marathi text-[#6b1d1d] border-b border-[#e8e1d5] pb-1.5">
              २. भोजन व्यवस्था व पंगत अंदाज (Catering & Headcount Specifications)
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-[#faecd0]/30 border border-[#d4af37]/40">
                <span className="text-[#7d7063] text-[10px] block">Total Confirmed</span>
                <span className="text-sm font-bold text-[#2d2d2d]">{guestMetrics.confirmedGuests} Pax</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#faecd0]/30 border border-[#d4af37]/40">
                <span className="text-[#7d7063] text-[10px] block">Pangat Preference</span>
                <span className="text-sm font-bold text-[#6b1d1d]">{guestMetrics.pangatPreferenceCount} Meals</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#faecd0]/30 border border-[#d4af37]/40">
                <span className="text-[#7d7063] text-[10px] block">Upvas / Fasting</span>
                <span className="text-sm font-bold text-amber-900">{guestMetrics.fastingCount} Guests</span>
              </div>
              <div className="p-2.5 rounded-lg bg-[#faecd0]/30 border border-[#d4af37]/40">
                <span className="text-[#7d7063] text-[10px] block">Satvik / Jain</span>
                <span className="text-sm font-bold text-emerald-800">{guestMetrics.jainSatvikCount} Guests</span>
              </div>
            </div>

            <div className="space-y-1.5">
              {cateringMenus.map((menu) => (
                <div key={menu.id} className="p-2.5 rounded-lg bg-[#fcf9f2] border border-[#e8e1d5] text-xs flex justify-between items-center">
                  <div>
                    <strong className="text-[#2d2d2d] text-xs">{menu.mealTitle}</strong>
                    <p className="text-[#7d7063] text-[10px]">Caterer: {menu.catererName} ({menu.catererPhone})</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-[#2d2d2d] text-xs">{menu.expectedHeadcount} Plates</span>
                    <span className="text-[#7d7063] text-[10px] block">@ {formatINR(menu.costPerPlate)}/plate</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Budget Settlement Summary */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold font-serif-marathi text-[#6b1d1d] border-b border-[#e8e1d5] pb-1.5">
              ३. खर्च वाटप व कुटुंब हिशोब (Expense Settlement Ledger)
            </h2>

            <div className="p-3 rounded-lg bg-[#faecd0]/30 border border-[#d4af37]/40 text-xs space-y-1.5">
              <div className="flex justify-between font-bold text-[#2d2d2d]">
                <span>Total Wedding Expense Incurred:</span>
                <span>{formatINR(budgetSummary.totalActual)}</span>
              </div>
              <div className="flex justify-between text-[#7d7063] text-[11px]">
                <span>Groom Side Paid Out-of-Pocket:</span>
                <span>{formatINR(budgetSummary.groomPaidOutPocket)} (Share: {formatINR(budgetSummary.groomResponsibleShare)})</span>
              </div>
              <div className="flex justify-between text-[#7d7063] text-[11px]">
                <span>Bride Side Paid Out-of-Pocket:</span>
                <span>{formatINR(budgetSummary.bridePaidOutPocket)} (Share: {formatINR(budgetSummary.brideResponsibleShare)})</span>
              </div>
              <div className="pt-1.5 border-t border-[#d4af37]/30 flex justify-between font-bold text-xs text-[#6b1d1d]">
                <span>Settlement Conclusion:</span>
                <span>{budgetSummary.settlementText}</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
