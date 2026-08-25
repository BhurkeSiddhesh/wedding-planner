import React from 'react';
import { useWedding } from '../../context/WeddingContext';
import { initialTimelineLines } from '../../data/defaultData';
import { TimelineLine } from '../../types/wedding';
import { X, Sparkles, CheckCircle2, Clock, ArrowRight } from 'lucide-react';

interface TimelinePresetsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface PresetOption {
  id: string;
  title: string;
  marathiTitle: string;
  description: string;
  lines: TimelineLine[];
}

export const TimelinePresetsModal: React.FC<TimelinePresetsModalProps> = ({ isOpen, onClose }) => {
  const { reorderTimelineLines } = useWedding();

  if (!isOpen) return null;

  const PRESETS: PresetOption[] = [
    {
      id: 'marathi_complete_3day',
      title: 'Full Traditional Marathi Wedding Schedule (3 Days)',
      marathiTitle: 'संपूर्ण ३-दिवसीय पारंपरिक विवाह वेळापत्रक',
      description: 'Day 1 Haldi & Sangeet Evening (4 PM-11 PM) + Day 2 Main Wedding Muhurta (7 AM-5 PM) + Reception (6:30 PM-11 PM)',
      lines: initialTimelineLines,
    },
    {
      id: 'wedding_day_only',
      title: 'Standard Auspicious Wedding Day (7:00 AM – 5:00 PM)',
      marathiTitle: 'शुभ विवाह मुख्य दिवस (सकाळी ७ ते सायं ५)',
      description: 'Breakfast, Seemant Pujan, Gauri Harpuja, Antarpat, Shubha Lagna Muhurta (12:36 PM), Pangat Feast, & Varat Vidai.',
      lines: [
        initialTimelineLines[1], // Day 2 7 AM to 5 PM
      ],
    },
    {
      id: 'two_day_package',
      title: '2-Day Haldi, Sangeet & Wedding Day',
      marathiTitle: '२-दिवसीय हळद, संगीत व लग्न दिवस',
      description: 'Day 1: Sanawari Haldi & Sangeet (4 PM - 11 PM), Day 2: Main Wedding Muhurta & Pangat (7 AM - 5 PM)',
      lines: [
        initialTimelineLines[0],
        initialTimelineLines[1],
      ],
    },
  ];

  const handleApplyPreset = (preset: PresetOption) => {
    reorderTimelineLines(preset.lines);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div
        className="bg-white rounded-2xl shadow-2xl border border-stone-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-linear-to-r from-[#2a0808] via-[#4a1212] to-[#2a0808] text-amber-100 border-b border-amber-900/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Timeline Schedule Presets</h2>
              <p className="text-xs text-amber-200/70 font-devanagari">
                पारंपरिक मराठी विवाह वेळापत्रक निवडा
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1 rounded-lg text-amber-200/70 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preset Cards */}
        <div className="p-5 space-y-3.5 max-h-[75vh] overflow-y-auto">
          {PRESETS.map((preset) => (
            <div
              key={preset.id}
              className="p-4 rounded-xl border border-stone-200 bg-stone-50 hover:bg-amber-50/40 hover:border-amber-300 transition group flex flex-col justify-between gap-3"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="text-sm font-bold text-stone-900 group-hover:text-[#7a1c1c] transition flex items-center gap-1.5">
                    <span>{preset.title}</span>
                  </h3>
                  <span className="text-[11px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full shrink-0">
                    {preset.lines.length} Line{preset.lines.length > 1 ? 's' : ''}
                  </span>
                </div>
                <p className="text-xs font-devanagari text-stone-600 mb-1">{preset.marathiTitle}</p>
                <p className="text-xs text-stone-500">{preset.description}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-stone-200/60">
                <div className="flex items-center gap-2 text-[11px] text-stone-500">
                  <Clock className="w-3.5 h-3.5 text-stone-400" />
                  <span>{preset.lines.reduce((acc, l) => acc + l.slots.length, 0)} Total Event Slots</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-[#7a1c1c] hover:bg-[#601414] shadow-xs flex items-center gap-1.5 transition"
                >
                  <span>Apply Schedule</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
