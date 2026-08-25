import React, { useState, useEffect } from 'react';
import { useWedding } from '../../context/WeddingContext';
import { TimelineLine, TimelineTheme } from '../../types/wedding';
import { X, Save, Clock, Calendar, MapPin, Sparkles } from 'lucide-react';

interface TimelineLineModalProps {
  isOpen: boolean;
  onClose: () => void;
  lineToEdit?: TimelineLine | null;
}

const THEME_OPTIONS: { id: TimelineTheme; name: string; bg: string; border: string; preview: string }[] = [
  { id: 'maroon', name: 'Royal Maroon (शुभ कुंकू)', bg: 'bg-[#7a1c1c]', border: 'border-[#7a1c1c]', preview: 'from-amber-900/90 to-[#7a1c1c]' },
  { id: 'amber', name: 'Haldi Amber (हळदी पिवळा)', bg: 'bg-amber-600', border: 'border-amber-500', preview: 'from-amber-500 to-amber-700' },
  { id: 'emerald', name: 'Traditional Green (हिरवा चुडा)', bg: 'bg-emerald-700', border: 'border-emerald-600', preview: 'from-emerald-600 to-emerald-800' },
  { id: 'royal', name: 'Royal Blue (शाही निळा)', bg: 'bg-indigo-700', border: 'border-indigo-600', preview: 'from-indigo-600 to-indigo-800' },
  { id: 'gold', name: 'Golden Festive (सोनेरी तेज)', bg: 'bg-amber-500', border: 'border-amber-400', preview: 'from-amber-400 to-yellow-600' },
  { id: 'rose', name: 'Gulabi Rose (गुलाबी उत्साह)', bg: 'bg-rose-700', border: 'border-rose-600', preview: 'from-rose-600 to-rose-800' },
  { id: 'slate', name: 'Classic Slate (अभिजात राखाडी)', bg: 'bg-stone-700', border: 'border-stone-600', preview: 'from-stone-600 to-stone-800' },
];

const PRESET_TIME_RANGES = [
  { label: 'Full Wedding Day (7:00 AM – 5:00 PM)', start: '07:00', end: '17:00' },
  { label: 'Evening Haldi / Sangeet (4:00 PM – 11:00 PM)', start: '16:00', end: '23:00' },
  { label: 'Morning Ceremony (8:00 AM – 1:00 PM)', start: '08:00', end: '13:00' },
  { label: 'Afternoon & Lunch (11:00 AM – 4:00 PM)', start: '11:00', end: '16:00' },
  { label: 'Evening Reception (6:00 PM – 11:00 PM)', start: '18:00', end: '23:00' },
  { label: 'All Day (6:00 AM – 10:00 PM)', start: '06:00', end: '22:00' },
];

export const TimelineLineModal: React.FC<TimelineLineModalProps> = ({ isOpen, onClose, lineToEdit }) => {
  const { addTimelineLine, updateTimelineLine, timelineLines } = useWedding();

  const [title, setTitle] = useState('');
  const [marathiTitle, setMarathiTitle] = useState('');
  const [date, setDate] = useState('2026-11-28');
  const [startHour, setStartHour] = useState('07:00');
  const [endHour, setEndHour] = useState('17:00');
  const [venue, setVenue] = useState('Alankar Mangal Karyalaya');
  const [colorTheme, setColorTheme] = useState<TimelineTheme>('maroon');

  useEffect(() => {
    if (lineToEdit) {
      setTitle(lineToEdit.title);
      setMarathiTitle(lineToEdit.marathiTitle || '');
      setDate(lineToEdit.date || '2026-11-28');
      setStartHour(lineToEdit.startHour || '07:00');
      setEndHour(lineToEdit.endHour || '17:00');
      setVenue(lineToEdit.venue || '');
      setColorTheme(lineToEdit.colorTheme || 'maroon');
    } else {
      const nextDayNum = timelineLines.length + 1;
      setTitle(`Day ${nextDayNum}: Wedding Event Track`);
      setMarathiTitle(`दिवस ${nextDayNum}: विवाह कार्यक्रम`);
      setDate('2026-11-28');
      setStartHour('07:00');
      setEndHour('17:00');
      setVenue('Alankar Mangal Karyalaya');
      setColorTheme(nextDayNum % 2 === 0 ? 'amber' : 'maroon');
    }
  }, [lineToEdit, isOpen, timelineLines.length]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (lineToEdit) {
      updateTimelineLine(lineToEdit.id, {
        title: title.trim(),
        marathiTitle: marathiTitle.trim() || undefined,
        date,
        startHour,
        endHour,
        venue: venue.trim() || undefined,
        colorTheme,
      });
    } else {
      addTimelineLine({
        title: title.trim(),
        marathiTitle: marathiTitle.trim() || undefined,
        date,
        startHour,
        endHour,
        venue: venue.trim() || undefined,
        colorTheme,
        order: timelineLines.length + 1,
        slots: [],
      });
    }

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
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {lineToEdit ? 'Edit Timeline Day / Line' : 'Add Custom Timeline Day / Line'}
              </h2>
              <p className="text-xs text-amber-200/70 font-devanagari">
                वेळापत्रक रेषा व दिवस टप्पा तयार करा (उदा. सकाळी ७ ते सायं ५)
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Quick preset ranges */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Quick Time Span Presets</span>
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {PRESET_TIME_RANGES.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setStartHour(preset.start);
                    setEndHour(preset.end);
                  }}
                  className={`text-left px-2.5 py-1.5 rounded-lg border text-xs transition ${
                    startHour === preset.start && endHour === preset.end
                      ? 'bg-amber-50 border-amber-300 text-amber-900 font-semibold shadow-xs'
                      : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title & Marathi Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">
                Line / Day Title <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Day 2: Main Wedding Day"
                className="w-full px-3 py-2 text-sm rounded-lg bg-stone-50 border border-stone-200 text-stone-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#7a1c1c]/20"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">
                Marathi Title <span className="text-stone-400">(पर्यायी)</span>
              </label>
              <input
                type="text"
                value={marathiTitle}
                onChange={(e) => setMarathiTitle(e.target.value)}
                placeholder="उदा. दिवस २: शुभ मुहूर्त व पंगत"
                className="w-full px-3 py-2 text-sm rounded-lg bg-stone-50 border border-stone-200 text-stone-900 font-devanagari focus:outline-none focus:ring-2 focus:ring-[#7a1c1c]/20"
              />
            </div>
          </div>

          {/* Date & Time Spans */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-stone-500" />
                <span>Date</span>
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-stone-50 border border-stone-200 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#7a1c1c]/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-stone-500" />
                <span>Day Start Time</span>
              </label>
              <input
                type="time"
                required
                value={startHour}
                onChange={(e) => setStartHour(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-stone-50 border border-stone-200 text-stone-900 font-mono focus:outline-none focus:ring-2 focus:ring-[#7a1c1c]/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-stone-500" />
                <span>Day End Time</span>
              </label>
              <input
                type="time"
                required
                value={endHour}
                onChange={(e) => setEndHour(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg bg-stone-50 border border-stone-200 text-stone-900 font-mono focus:outline-none focus:ring-2 focus:ring-[#7a1c1c]/20"
              />
            </div>
          </div>

          {/* Venue */}
          <div>
            <label className="block text-xs font-semibold text-stone-800 mb-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-stone-500" />
              <span>Venue / Location</span>
            </label>
            <input
              type="text"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              placeholder="e.g. Alankar Mangal Karyalaya, Main Mandap"
              className="w-full px-3 py-2 text-sm rounded-lg bg-stone-50 border border-stone-200 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#7a1c1c]/20"
            />
          </div>

          {/* Color Theme Selector */}
          <div>
            <label className="block text-xs font-semibold text-stone-800 mb-1.5">
              Timeline Line Theme Color
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {THEME_OPTIONS.map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  onClick={() => setColorTheme(theme.id)}
                  className={`flex items-center gap-2 p-2 rounded-lg border text-left text-xs transition ${
                    colorTheme === theme.id
                      ? `${theme.border} bg-stone-100 font-semibold ring-2 ring-stone-900/10`
                      : 'border-stone-200 bg-white hover:bg-stone-50'
                  }`}
                >
                  <span className={`w-3.5 h-3.5 rounded-full ${theme.bg} shrink-0`} />
                  <span className="truncate text-stone-800">{theme.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-bold text-white bg-linear-to-r from-[#7a1c1c] to-[#9c2727] hover:from-[#661515] hover:to-[#851e1e] rounded-lg shadow-sm flex items-center gap-1.5 transition"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{lineToEdit ? 'Update Timeline Line' : 'Create Timeline Line'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
