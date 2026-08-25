import React, { useState } from 'react';
import { useWedding } from '../../context/WeddingContext';
import { Ritual } from '../../types/wedding';
import { X, Flame } from 'lucide-react';

interface AddRitualModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddRitualModal: React.FC<AddRitualModalProps> = ({ isOpen, onClose }) => {
  const { rituals, addRitual, profile } = useWedding();

  const [name, setName] = useState('');
  const [marathiName, setMarathiName] = useState('');
  const [date, setDate] = useState(profile.weddingDate || '2026-11-28');
  const [startTime, setStartTime] = useState('11:00 AM');
  const [endTime, setEndTime] = useState('01:00 PM');
  const [venue, setVenue] = useState(profile.mainKaryalaya || 'Alankar Karyalaya, Pune');
  const [description, setDescription] = useState('');
  const [significance, setSignificance] = useState('');
  const [responsibleParty, setResponsibleParty] = useState<'bride_side' | 'groom_side' | 'shared'>('shared');
  const [traditionalTip, setTraditionalTip] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload: Omit<Ritual, 'id' | 'items'> = {
      name,
      marathiName: marathiName.trim() || name,
      order: rituals.length + 1,
      date,
      startTime,
      endTime,
      venue,
      description: description.trim() || 'Traditional ceremony for blessings and family celebration.',
      significance: significance.trim() || 'Auspicious Vedic celebration.',
      status: 'upcoming',
      responsibleParty,
      traditionalTip: traditionalTip.trim() || undefined,
    };

    addRitual(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#ffffff] rounded-xl max-w-lg w-full border border-[#e8e1d5] shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#4a0e0e] via-[#3d0b0b] to-[#2b0707] p-3.5 sm:p-4 text-[#faecd0] flex items-center justify-between border-b border-[#d4af37]/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-[#d4af37]/20 text-[#d4af37] flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold font-serif-marathi text-white">Add Custom Ceremony / Ritual</h3>
              <p className="text-[10px] text-amber-200/80">नवीन विधी अथवा समारंभ समाविष्ट करा</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-md bg-white/10 hover:bg-white/20 text-stone-200 flex items-center justify-center transition"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-3 max-h-[75vh] overflow-y-auto">
          <div>
            <label className="block text-[10px] font-bold text-[#7d7063] uppercase tracking-wider mb-1">
              Ceremony Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Mandap Devta & Kuldevta Pujan"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-md bg-[#fcf9f2] border border-[#e8e1d5] text-[#2d2d2d] focus:border-[#6b1d1d] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-[#7d7063] uppercase tracking-wider mb-1">
                Marathi Name (मराठी नाव)
              </label>
              <input
                type="text"
                placeholder="उदा. कुलदैवत नमन"
                value={marathiName}
                onChange={(e) => setMarathiName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-md bg-[#fcf9f2] border border-[#e8e1d5] text-[#2d2d2d] focus:border-[#6b1d1d] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#7d7063] uppercase tracking-wider mb-1">
                Responsible Party *
              </label>
              <select
                value={responsibleParty}
                onChange={(e) => setResponsibleParty(e.target.value as any)}
                className="w-full px-3 py-1.5 text-xs rounded-md bg-[#fcf9f2] border border-[#e8e1d5] text-[#2d2d2d] focus:border-[#6b1d1d] focus:outline-none"
              >
                <option value="shared">🤝 Shared (Both Families)</option>
                <option value="bride_side">👰 Vadhu Paksha (Bride Side)</option>
                <option value="groom_side">🤵 Var Paksha (Groom Side)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label className="block text-[10px] font-bold text-[#7d7063] uppercase tracking-wider mb-1">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-md bg-[#fcf9f2] border border-[#e8e1d5] text-[#2d2d2d] focus:border-[#6b1d1d] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#7d7063] uppercase tracking-wider mb-1">
                Start Time
              </label>
              <input
                type="text"
                placeholder="10:00 AM"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-md bg-[#fcf9f2] border border-[#e8e1d5] text-[#2d2d2d] focus:border-[#6b1d1d] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#7d7063] uppercase tracking-wider mb-1">
                End Time
              </label>
              <input
                type="text"
                placeholder="01:00 PM"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-md bg-[#fcf9f2] border border-[#e8e1d5] text-[#2d2d2d] focus:border-[#6b1d1d] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[#7d7063] uppercase tracking-wider mb-1">
              Venue / Location
            </label>
            <input
              type="text"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-md bg-[#fcf9f2] border border-[#e8e1d5] text-[#2d2d2d] focus:border-[#6b1d1d] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[#7d7063] uppercase tracking-wider mb-1">
              Description & Vedic Significance
            </label>
            <textarea
              rows={2}
              placeholder="Significance of this ritual..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-md bg-[#fcf9f2] border border-[#e8e1d5] text-[#2d2d2d] focus:border-[#6b1d1d] focus:outline-none"
            />
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
              className="px-4 py-1.5 bg-[#6b1d1d] hover:bg-[#521414] text-white font-bold text-xs rounded-md shadow-xs transition"
            >
              Create Ceremony
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
