import React, { useState, useEffect } from 'react';
import { useWedding } from '../../context/WeddingContext';
import { WeddingEventCategory } from '../../types/wedding';
import { X, Calendar, Clock, MapPin, Sparkles, Check, Trash2 } from 'lucide-react';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventToEdit?: WeddingEventCategory | null;
}

const COMMON_MARATHI_PRESETS = [
  { name: 'Sakharpuda (Engagement)', marathiName: 'साखरपुडा', description: 'Traditional ring & sugar packet exchange between bride and groom' },
  { name: 'Kelvan (Family Feasts)', marathiName: 'केळवण', description: 'Pre-wedding celebratory meals hosted by relatives & close family' },
  { name: 'Halad Chadavane (Turmeric Ceremony)', marathiName: 'हळद समारंभ', description: 'Auspicious turmeric paste application ceremony' },
  { name: 'Mehendi & Sangeet', marathiName: 'मेहंदी व संगीत संध्या', description: 'Henna application, traditional Marathi songs and dance evening' },
  { name: 'Seemant Pujan & Welcome', marathiName: 'सीमंत पूजन', description: 'Welcoming the groom family at the venue doorstep with arti' },
  { name: 'Gauri Harpuja', marathiName: 'गौरी हरपूजा', description: 'Bride worships Goddess Parvati for a prosperous married life' },
  { name: 'Lagna Muhurta (Main Wedding)', marathiName: 'शुभ विवाह मुहूर्त', description: 'Antarpat, Mangalashtaka, Kanyadaan, Saptapadi and Kankan bandhan' },
  { name: 'Karyalaya Pangat & Bhojan', marathiName: 'लग्न पंगत व मिष्टान्न भोजन', description: 'Traditional sit-down banana-leaf feast with jalebi, ukdiche modak, etc.' },
  { name: 'Sunmukh & Varat (Baraat)', marathiName: 'सुनमुख व मिरवणूक (वरात)', description: 'Mother-in-law sees bride face with looking glass, joyous procession' },
  { name: 'Grihapravesh', marathiName: 'गृहप्रवेश', description: 'Bride kicks auspicious rice kalash to enter her new home' },
  { name: 'Satyanarayan Puja & Reception', marathiName: 'सत्यनारायण पूजा व स्वागत समारंभ', description: 'Post-wedding blessing ritual and reception for friends and extended family' },
];

export const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, eventToEdit }) => {
  const { addEventCategory, updateEventCategory, deleteEventCategory, eventCategories } = useWedding();

  const [name, setName] = useState('');
  const [marathiName, setMarathiName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [venue, setVenue] = useState('');
  const [description, setDescription] = useState('');
  const [order, setOrder] = useState<number>(eventCategories.length + 1);

  useEffect(() => {
    if (eventToEdit) {
      setName(eventToEdit.name || '');
      setMarathiName(eventToEdit.marathiName || '');
      setDate(eventToEdit.date || '');
      setTime(eventToEdit.time || '');
      setVenue(eventToEdit.venue || '');
      setDescription(eventToEdit.description || '');
      setOrder(eventToEdit.order || 1);
    } else {
      setName('');
      setMarathiName('');
      setDate('');
      setTime('');
      setVenue('');
      setDescription('');
      setOrder(eventCategories.length + 1);
    }
  }, [eventToEdit, isOpen, eventCategories.length]);

  if (!isOpen) return null;

  const handleSelectPreset = (preset: typeof COMMON_MARATHI_PRESETS[0]) => {
    setName(preset.name);
    setMarathiName(preset.marathiName);
    setDescription(preset.description);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (eventToEdit) {
      updateEventCategory(eventToEdit.id, {
        name: name.trim(),
        marathiName: marathiName.trim() || name.trim(),
        date: date || undefined,
        time: time || undefined,
        venue: venue.trim() || undefined,
        description: description.trim() || undefined,
        order: Number(order) || 1,
      });
    } else {
      // Auto generate a clean ID from name
      const cleanSlug = name.toLowerCase().replace(/[^a-z0-9]/g, '_').slice(0, 20);
      const uniqueId = `evt_${cleanSlug}_${Date.now().toString().slice(-4)}`;

      addEventCategory({
        id: uniqueId,
        name: name.trim(),
        marathiName: marathiName.trim() || name.trim(),
        date: date || undefined,
        time: time || undefined,
        venue: venue.trim() || undefined,
        description: description.trim() || undefined,
        order: Number(order) || eventCategories.length + 1,
      });
    }

    onClose();
  };

  const handleDelete = () => {
    if (!eventToEdit) return;
    if (window.confirm(`Are you sure you want to remove the ceremony "${eventToEdit.name}"? Tasks associated with it will be preserved under General tasks.`)) {
      deleteEventCategory(eventToEdit.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs font-sans-google animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-stone-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#7a1c1c]/10 text-[#7a1c1c] flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900">
                {eventToEdit ? 'Edit Wedding Ceremony' : 'Add New Wedding Ceremony'}
              </h2>
              <p className="text-xs text-stone-500">
                {eventToEdit ? 'Update ceremony schedule, venue, or name' : 'Add a custom ritual, event, or function to your wedding timeline'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          
          {/* Quick Marathi Presets (Only when adding new) */}
          {!eventToEdit && (
            <div>
              <label className="block text-[11px] font-semibold text-stone-600 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Quick Traditional Marathi Presets</span>
              </label>
              <div className="flex gap-1.5 overflow-x-auto pb-1.5 text-stone-700 no-scrollbar">
                {COMMON_MARATHI_PRESETS.slice(0, 6).map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className="px-2.5 py-1 text-[11px] bg-stone-100 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-900 border border-stone-200 rounded-lg whitespace-nowrap transition"
                  >
                    {preset.marathiName} ({preset.name.split(' ')[0]})
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Ceremony Name */}
          <div>
            <label className="block text-xs font-semibold text-stone-800 mb-1">
              Ceremony / Event Name (English) <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Sangeet & Mehendi Night, Halad, Kelvan"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg bg-stone-50 border border-stone-200 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#7a1c1c]/20 focus:border-[#7a1c1c]"
            />
          </div>

          {/* Marathi Name */}
          <div>
            <label className="block text-xs font-semibold text-stone-800 mb-1">
              Marathi Title (मराठी नाव)
            </label>
            <input
              type="text"
              placeholder="e.g. संगीत व मेहंदी संध्या, हळद, केळवण"
              value={marathiName}
              onChange={(e) => setMarathiName(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg bg-stone-50 border border-stone-200 text-stone-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#7a1c1c]/20 font-devanagari"
            />
          </div>

          {/* Date and Time Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                <span>Date (तारीख)</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-200 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#7a1c1c]/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-stone-400" />
                <span>Time / Muhurta (वेळ / मुहूर्त)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 10:30 AM, 12:35 PM Muhurta"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-200 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#7a1c1c]/20"
              />
            </div>
          </div>

          {/* Venue */}
          <div>
            <label className="block text-xs font-semibold text-stone-800 mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-stone-400" />
              <span>Venue / Location (स्थळ)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Alankar Lawns, Pune or Main Karyalaya Mandap"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg bg-stone-50 border border-stone-200 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#7a1c1c]/20"
            />
          </div>

          {/* Description / Significance */}
          <div>
            <label className="block text-xs font-semibold text-stone-800 mb-1">
              Ceremony Notes / Traditional Details
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Puja samagri items needed, dhol-tasha troupe timing, seating arrangements"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg bg-stone-50 border border-stone-200 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#7a1c1c]/20"
            />
          </div>

          {/* Sequence Order */}
          <div>
            <label className="block text-xs font-semibold text-stone-800 mb-1">
              Timeline Sequence Order
            </label>
            <input
              type="number"
              min={1}
              value={order}
              onChange={(e) => setOrder(parseInt(e.target.value) || 1)}
              className="w-28 px-3 py-1.5 rounded-lg bg-stone-50 border border-stone-200 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#7a1c1c]/20"
            />
            <span className="text-[11px] text-stone-400 ml-2">Controls display order in list</span>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-3">
            {eventToEdit ? (
              <button
                type="button"
                onClick={handleDelete}
                className="px-3 py-2 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg font-medium transition flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Ceremony</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium rounded-lg transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#7a1c1c] hover:bg-[#581212] text-white font-medium rounded-lg shadow-xs transition flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>{eventToEdit ? 'Save Changes' : 'Add Ceremony'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
