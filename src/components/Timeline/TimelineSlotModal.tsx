import React, { useState, useEffect } from 'react';
import { useWedding } from '../../context/WeddingContext';
import { TimelineSlot, TimelineLine } from '../../types/wedding';
import { formatDuration, formatTime12h } from '../../utils/timelineUtils';
import { X, Save, Clock, MapPin, User, FileText, Sparkles, Flame } from 'lucide-react';

interface TimelineSlotModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetLineId?: string;
  slotToEdit?: TimelineSlot | null;
  defaultStartTime?: string;
  defaultEndTime?: string;
}

const COLOR_TAGS = [
  { id: 'amber', label: 'Haldi Amber', class: 'bg-amber-100 text-amber-800 border-amber-300' },
  { id: 'maroon', label: 'Royal Maroon', class: 'bg-rose-100 text-rose-900 border-rose-300' },
  { id: 'emerald', label: 'Vedic Green', class: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  { id: 'gold', label: 'Golden Muhurta', class: 'bg-yellow-100 text-yellow-900 border-yellow-300' },
  { id: 'royal', label: 'Sangeet Royal', class: 'bg-indigo-100 text-indigo-900 border-indigo-300' },
  { id: 'slate', label: 'Neutral Slate', class: 'bg-stone-100 text-stone-800 border-stone-300' },
];

export const TimelineSlotModal: React.FC<TimelineSlotModalProps> = ({
  isOpen,
  onClose,
  targetLineId,
  slotToEdit,
  defaultStartTime,
  defaultEndTime,
}) => {
  const { timelineLines, eventCategories, addTimelineSlot, updateTimelineSlot } = useWedding();

  const [lineId, setLineId] = useState<string>(targetLineId || timelineLines[0]?.id || '');
  const [title, setTitle] = useState('');
  const [marathiTitle, setMarathiTitle] = useState('');
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:30');
  const [eventId, setEventId] = useState<string>('lagna_muhurta');
  const [location, setLocation] = useState('Main Mandap Stage');
  const [leadPerson, setLeadPerson] = useState('');
  const [notes, setNotes] = useState('');
  const [isMuhurta, setIsMuhurta] = useState(false);
  const [colorTag, setColorTag] = useState('maroon');

  useEffect(() => {
    if (slotToEdit) {
      setLineId(slotToEdit.lineId);
      setTitle(slotToEdit.title);
      setMarathiTitle(slotToEdit.marathiTitle || '');
      setStartTime(slotToEdit.startTime);
      setEndTime(slotToEdit.endTime);
      setEventId(slotToEdit.eventId || 'general_venue');
      setLocation(slotToEdit.location || '');
      setLeadPerson(slotToEdit.leadPerson || '');
      setNotes(slotToEdit.notes || '');
      setIsMuhurta(!!slotToEdit.isMuhurta);
      setColorTag(slotToEdit.colorTag || 'maroon');
    } else {
      const selectedLine = timelineLines.find((l) => l.id === (targetLineId || lineId)) || timelineLines[0];
      setLineId(selectedLine?.id || '');

      // Calculate smart next start time if there are existing slots
      if (defaultStartTime && defaultEndTime) {
        setStartTime(defaultStartTime);
        setEndTime(defaultEndTime);
      } else if (selectedLine && selectedLine.slots.length > 0) {
        const lastSlot = selectedLine.slots[selectedLine.slots.length - 1];
        setStartTime(lastSlot.endTime);
        // Add 1 hour or stop at endHour
        const [h, m] = lastSlot.endTime.split(':').map((v) => parseInt(v, 10));
        const endH = Math.min(23, h + 1);
        setEndTime(`${endH.toString().padStart(2, '0')}:${(m || 0).toString().padStart(2, '0')}`);
      } else if (selectedLine) {
        setStartTime(selectedLine.startHour || '07:00');
        setEndTime('08:30');
      } else {
        setStartTime('09:00');
        setEndTime('10:30');
      }

      setTitle('');
      setMarathiTitle('');
      setEventId('lagna_muhurta');
      setLocation('Main Mandap Stage');
      setLeadPerson('');
      setNotes('');
      setIsMuhurta(false);
      setColorTag('maroon');
    }
  }, [slotToEdit, isOpen, targetLineId, defaultStartTime, defaultEndTime]);

  if (!isOpen) return null;

  const duration = formatDuration(startTime, endTime);

  const handleCeremonySelect = (eId: string) => {
    setEventId(eId);
    const cat = eventCategories.find((c) => c.id === eId);
    if (cat && !title) {
      setTitle(cat.name);
      setMarathiTitle(cat.marathiName || '');
      if (cat.venue && !location) {
        setLocation(cat.venue);
      }
      if (eId === 'lagna_muhurta') {
        setIsMuhurta(true);
        setColorTag('maroon');
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !lineId) return;

    if (slotToEdit) {
      updateTimelineSlot(slotToEdit.lineId, slotToEdit.id, {
        title: title.trim(),
        marathiTitle: marathiTitle.trim() || undefined,
        startTime,
        endTime,
        eventId: eventId || undefined,
        location: location.trim() || undefined,
        leadPerson: leadPerson.trim() || undefined,
        notes: notes.trim() || undefined,
        isMuhurta,
        colorTag,
      });
    } else {
      addTimelineSlot(lineId, {
        title: title.trim(),
        marathiTitle: marathiTitle.trim() || undefined,
        startTime,
        endTime,
        eventId: eventId || undefined,
        location: location.trim() || undefined,
        leadPerson: leadPerson.trim() || undefined,
        notes: notes.trim() || undefined,
        isMuhurta,
        colorTag,
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
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {slotToEdit ? 'Edit Event Time Slot' : 'Add Event Time Slot'}
              </h2>
              <p className="text-xs text-amber-200/70 font-devanagari">
                वेळापत्रक रेषेत नवीन विधी किंवा कार्यक्रम जोडा
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
          {/* Target Timeline Line Selection */}
          <div>
            <label className="block text-xs font-semibold text-stone-800 mb-1">
              Target Day / Timeline Line <span className="text-rose-600">*</span>
            </label>
            <select
              required
              value={lineId}
              onChange={(e) => setLineId(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg bg-stone-50 border border-stone-200 text-stone-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#7a1c1c]/20"
            >
              {timelineLines.map((line) => (
                <option key={line.id} value={line.id}>
                  {line.title} ({line.date} • {line.startHour} - {line.endHour})
                </option>
              ))}
            </select>
          </div>

          {/* Quick Ceremony Category preset */}
          <div>
            <label className="block text-xs font-semibold text-stone-800 mb-1">
              Linked Ceremony / Ritual Category
            </label>
            <select
              value={eventId}
              onChange={(e) => handleCeremonySelect(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg bg-stone-50 border border-stone-200 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#7a1c1c]/20"
            >
              {eventCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon || '✨'} {cat.name} ({cat.marathiName})
                </option>
              ))}
              <option value="general_venue">General / Other Event</option>
            </select>
          </div>

          {/* Event Title & Marathi Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">
                Slot Title <span className="text-rose-600">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Gauri Harpuja & Parvati Archana"
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
                placeholder="उदा. गौरीहर पूजा व देवी पार्वती आराधना"
                className="w-full px-3 py-2 text-sm rounded-lg bg-stone-50 border border-stone-200 text-stone-900 font-devanagari focus:outline-none focus:ring-2 focus:ring-[#7a1c1c]/20"
              />
            </div>
          </div>

          {/* Time Slot Inputs with Duration indicator */}
          <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs text-stone-600 font-semibold mb-1">
              <span>Time Slot & Duration</span>
              <span className="text-[#7a1c1c] font-bold bg-[#7a1c1c]/10 px-2 py-0.5 rounded-md">
                Duration: {duration} ({formatTime12h(startTime)} - {formatTime12h(endTime)})
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-stone-500" />
                  <span>Start Time</span>
                </label>
                <input
                  type="time"
                  required
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-white border border-stone-200 text-stone-900 font-mono focus:outline-none focus:ring-2 focus:ring-[#7a1c1c]/20"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-stone-500" />
                  <span>End Time</span>
                </label>
                <input
                  type="time"
                  required
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-white border border-stone-200 text-stone-900 font-mono focus:outline-none focus:ring-2 focus:ring-[#7a1c1c]/20"
                />
              </div>
            </div>
          </div>

          {/* Location & Coordinator */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1 flex items-center gap-1">
                <MapPin className="w-3 h-3 text-stone-500" />
                <span>Mandap Room / Location</span>
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Main Mandap Stage / Dining Court"
                className="w-full px-3 py-2 text-sm rounded-lg bg-stone-50 border border-stone-200 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#7a1c1c]/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1 flex items-center gap-1">
                <User className="w-3 h-3 text-stone-500" />
                <span>Lead Coordinator / Contact</span>
              </label>
              <input
                type="text"
                value={leadPerson}
                onChange={(e) => setLeadPerson(e.target.value)}
                placeholder="e.g. Guruji, Mama, Bride's Sister"
                className="w-full px-3 py-2 text-sm rounded-lg bg-stone-50 border border-stone-200 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#7a1c1c]/20"
              />
            </div>
          </div>

          {/* Sacred Muhurta Highlight Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50/70 border border-amber-200">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-700 flex items-center justify-center">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-amber-950">Auspicious Muhurta (शुभ मुहूर्त)</p>
                <p className="text-[11px] text-amber-800/80">Highlight with gold flame badge on timeline ruler</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isMuhurta}
                onChange={(e) => setIsMuhurta(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
            </label>
          </div>

          {/* Color Badge Tag */}
          <div>
            <label className="block text-xs font-semibold text-stone-800 mb-1.5">
              Event Badge Color
            </label>
            <div className="grid grid-cols-3 gap-2">
              {COLOR_TAGS.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => setColorTag(tag.id)}
                  className={`px-2.5 py-1.5 rounded-lg border text-xs text-center transition ${
                    colorTag === tag.id
                      ? `${tag.class} font-bold ring-2 ring-stone-900/10 shadow-xs`
                      : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-stone-800 mb-1 flex items-center gap-1">
              <FileText className="w-3 h-3 text-stone-500" />
              <span>Samagri & Key Instructions</span>
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Antarpat ready by 10:15 AM, Akshata distributed to all guests, Dhol Tasha troupe alerted."
              className="w-full px-3 py-2 text-xs rounded-lg bg-stone-50 border border-stone-200 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#7a1c1c]/20"
            />
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
              <span>{slotToEdit ? 'Update Slot' : 'Add Slot to Timeline'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
