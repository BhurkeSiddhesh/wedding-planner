import React, { useState } from 'react';
import { useWedding } from '../../context/WeddingContext';
import { TimelineLine, TimelineSlot, TimelineTheme } from '../../types/wedding';
import {
  formatTime12h,
  formatDuration,
  calculateSlotPosition,
  generateHourTicks,
  timeToMinutes,
} from '../../utils/timelineUtils';
import { TimelineLineModal } from './TimelineLineModal';
import { TimelineSlotModal } from './TimelineSlotModal';
import { TimelinePresetsModal } from './TimelinePresetsModal';
import {
  Clock,
  Plus,
  Calendar,
  MapPin,
  Flame,
  ChevronDown,
  ChevronUp,
  Edit3,
  Trash2,
  Sparkles,
  User,
  SlidersHorizontal,
  ChevronRight,
  Maximize2,
  Minimize2,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

const THEME_HEADER_STYLES: Record<
  TimelineTheme,
  {
    gradient: string;
    border: string;
    badge: string;
    text: string;
    rulerColor: string;
    slotDefault: string;
  }
> = {
  maroon: {
    gradient: 'from-[#2e0909] via-[#4d1313] to-[#2e0909]',
    border: 'border-[#7a1c1c]/30',
    badge: 'bg-[#7a1c1c] text-white',
    text: 'text-[#faecd0]',
    rulerColor: 'border-[#7a1c1c]/20 text-[#7a1c1c]',
    slotDefault: 'from-[#8b2323] to-[#681818] border-[#a83232] text-white',
  },
  amber: {
    gradient: 'from-[#3a2200] via-[#5c3700] to-[#3a2200]',
    border: 'border-amber-500/30',
    badge: 'bg-amber-600 text-white',
    text: 'text-amber-100',
    rulerColor: 'border-amber-500/20 text-amber-800',
    slotDefault: 'from-amber-600 to-amber-700 border-amber-400 text-white',
  },
  emerald: {
    gradient: 'from-[#052918] via-[#0b4228] to-[#052918]',
    border: 'border-emerald-500/30',
    badge: 'bg-emerald-700 text-white',
    text: 'text-emerald-100',
    rulerColor: 'border-emerald-500/20 text-emerald-800',
    slotDefault: 'from-emerald-700 to-emerald-800 border-emerald-500 text-white',
  },
  royal: {
    gradient: 'from-[#141238] via-[#232059] to-[#141238]',
    border: 'border-indigo-500/30',
    badge: 'bg-indigo-700 text-white',
    text: 'text-indigo-100',
    rulerColor: 'border-indigo-500/20 text-indigo-800',
    slotDefault: 'from-indigo-700 to-indigo-800 border-indigo-500 text-white',
  },
  gold: {
    gradient: 'from-[#382b05] via-[#5c4608] to-[#382b05]',
    border: 'border-amber-400/40',
    badge: 'bg-amber-500 text-amber-950',
    text: 'text-amber-100',
    rulerColor: 'border-amber-400/30 text-amber-900',
    slotDefault: 'from-amber-500 to-yellow-600 border-amber-300 text-stone-950',
  },
  rose: {
    gradient: 'from-[#3d0818] via-[#5e0d26] to-[#3d0818]',
    border: 'border-rose-500/30',
    badge: 'bg-rose-700 text-white',
    text: 'text-rose-100',
    rulerColor: 'border-rose-500/20 text-rose-800',
    slotDefault: 'from-rose-700 to-rose-800 border-rose-500 text-white',
  },
  slate: {
    gradient: 'from-[#1c1917] via-[#292524] to-[#1c1917]',
    border: 'border-stone-500/30',
    badge: 'bg-stone-700 text-white',
    text: 'text-stone-100',
    rulerColor: 'border-stone-400/30 text-stone-700',
    slotDefault: 'from-stone-700 to-stone-800 border-stone-500 text-white',
  },
};

const SLOT_COLOR_TAGS: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  amber: { bg: 'bg-amber-500/90 hover:bg-amber-500', border: 'border-amber-300', text: 'text-amber-950', dot: 'bg-amber-400' },
  maroon: { bg: 'bg-[#7a1c1c]/90 hover:bg-[#7a1c1c]', border: 'border-rose-300', text: 'text-white', dot: 'bg-rose-400' },
  emerald: { bg: 'bg-emerald-600/90 hover:bg-emerald-600', border: 'border-emerald-300', text: 'text-white', dot: 'bg-emerald-400' },
  gold: { bg: 'bg-yellow-500/90 hover:bg-yellow-500', border: 'border-yellow-200', text: 'text-stone-950', dot: 'bg-yellow-300' },
  royal: { bg: 'bg-indigo-600/90 hover:bg-indigo-600', border: 'border-indigo-300', text: 'text-white', dot: 'bg-indigo-400' },
  slate: { bg: 'bg-stone-600/90 hover:bg-stone-600', border: 'border-stone-400', text: 'text-white', dot: 'bg-stone-300' },
};

export const EventTimelineBar: React.FC = () => {
  const { timelineLines, deleteTimelineLine, deleteTimelineSlot, reorderTimelineLines } = useWedding();

  // Modals state
  const [isLineModalOpen, setIsLineModalOpen] = useState(false);
  const [lineToEdit, setLineToEdit] = useState<TimelineLine | null>(null);

  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
  const [targetLineId, setTargetLineId] = useState<string>('');
  const [slotToEdit, setSlotToEdit] = useState<TimelineSlot | null>(null);
  const [slotDefaultStart, setSlotDefaultStart] = useState<string | undefined>(undefined);
  const [slotDefaultEnd, setSlotDefaultEnd] = useState<string | undefined>(undefined);

  const [isPresetsModalOpen, setIsPresetsModalOpen] = useState(false);

  // UI state
  const [expandedLines, setExpandedLines] = useState<Record<string, boolean>>({});
  const [hoveredSlot, setHoveredSlot] = useState<{ slot: TimelineSlot; line: TimelineLine } | null>(null);

  const totalSlotsCount = timelineLines.reduce((acc, l) => acc + l.slots.length, 0);
  const muhurtaCount = timelineLines.reduce(
    (acc, l) => acc + l.slots.filter((s) => s.isMuhurta).length,
    0
  );

  const toggleLineDetails = (lineId: string) => {
    setExpandedLines((prev) => ({
      ...prev,
      [lineId]: !prev[lineId],
    }));
  };

  const handleExpandAll = (expand: boolean) => {
    const next: Record<string, boolean> = {};
    timelineLines.forEach((l) => {
      next[l.id] = expand;
    });
    setExpandedLines(next);
  };

  const areAllExpanded =
    timelineLines.length > 0 && timelineLines.every((l) => expandedLines[l.id]);

  const handleOpenAddLine = () => {
    setLineToEdit(null);
    setIsLineModalOpen(true);
  };

  const handleEditLine = (line: TimelineLine) => {
    setLineToEdit(line);
    setIsLineModalOpen(true);
  };

  const handleOpenAddSlot = (lineId: string, defaultStart?: string, defaultEnd?: string) => {
    setTargetLineId(lineId);
    setSlotToEdit(null);
    setSlotDefaultStart(defaultStart);
    setSlotDefaultEnd(defaultEnd);
    setIsSlotModalOpen(true);
  };

  const handleEditSlot = (slot: TimelineSlot) => {
    setTargetLineId(slot.lineId);
    setSlotToEdit(slot);
    setIsSlotModalOpen(true);
  };

  const handleMoveLine = (idx: number, direction: 'up' | 'down') => {
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === timelineLines.length - 1) return;

    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    const reordered = [...timelineLines];
    const temp = reordered[idx];
    reordered[idx] = reordered[targetIdx];
    reordered[targetIdx] = temp;
    reorderTimelineLines(reordered);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner & Statistics Ribbon */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        {/* Banner Header */}
        <div className="px-4 sm:px-6 py-4 bg-linear-to-r from-[#2e0909] via-[#4d1313] to-[#2e0909] text-amber-100 flex flex-wrap items-center justify-between gap-4 border-b border-amber-900/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  Wedding Timelines & Split-Clock Schedule
                </h2>
                <span className="text-xs font-semibold text-amber-300 bg-amber-950/60 border border-amber-500/30 px-2.5 py-0.5 rounded-full">
                  {timelineLines.length} Tracks • {totalSlotsCount} Rituals
                </span>
              </div>
              <p className="text-xs text-amber-200/80 font-devanagari mt-0.5">
                लग्न दिनचर्या व मुहूर्त वेळ पत्रक — सणावारी हळद, संगीत, सीमांतपूजन, मुख्य मुहूर्त (सकाळी ७ ते सायं ५)
              </p>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex items-center flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleExpandAll(!areAllExpanded)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-amber-100 bg-white/10 hover:bg-white/20 border border-amber-400/30 flex items-center gap-1.5 transition"
            >
              {areAllExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              <span>{areAllExpanded ? 'Collapse Cards' : 'Expand Cards'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsPresetsModalOpen(true)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-200 bg-white/10 hover:bg-white/20 border border-amber-400/30 flex items-center gap-1.5 transition"
              title="Load Traditional Marathi Presets"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Presets</span>
            </button>

            <button
              type="button"
              onClick={handleOpenAddLine}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-amber-950 bg-linear-to-r from-amber-300 to-amber-400 hover:from-amber-200 hover:to-amber-300 shadow-xs flex items-center gap-1.5 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Day / Track</span>
            </button>
          </div>
        </div>

        {/* Quick Highlights Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-stone-200 border-b border-stone-200 bg-stone-50/70 text-xs">
          <div className="p-3 text-center sm:text-left">
            <span className="text-stone-500 block text-[11px]">Schedule Tracks</span>
            <span className="text-sm font-bold text-stone-900">{timelineLines.length} Days / Blocks</span>
          </div>
          <div className="p-3 text-center sm:text-left">
            <span className="text-stone-500 block text-[11px]">Ceremonies & Rituals</span>
            <span className="text-sm font-bold text-stone-900">{totalSlotsCount} Events</span>
          </div>
          <div className="p-3 text-center sm:text-left">
            <span className="text-stone-500 block text-[11px]">Sacred Muhurtas</span>
            <span className="text-sm font-bold text-amber-700 flex items-center justify-center sm:justify-start gap-1">
              <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
              {muhurtaCount} Auspicious Slots
            </span>
          </div>
          <div className="p-3 text-center sm:text-left">
            <span className="text-stone-500 block text-[11px]">Timeline Mode</span>
            <span className="text-sm font-bold text-emerald-700">Split-Clock 12h Ruler</span>
          </div>
        </div>
      </div>

      {/* Main Content Area (Timeline Lines Stacked One Below the Other) */}
      <div className="space-y-4">
          {timelineLines.length === 0 ? (
            <div className="text-center py-8 px-4 bg-white rounded-xl border border-dashed border-stone-300">
              <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mx-auto mb-2">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-stone-900 mb-1">No Timeline Lines Defined</h3>
              <p className="text-xs text-stone-500 max-w-md mx-auto mb-3">
                Create a split clock timeline for your wedding day (e.g. 7:00 AM to 5:00 PM) or load our curated traditional Marathi wedding schedule presets.
              </p>
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPresetsModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 transition"
                >
                  Load Presets
                </button>
                <button
                  type="button"
                  onClick={handleOpenAddLine}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-[#7a1c1c] hover:bg-[#601414] transition"
                >
                  + Add Custom Line
                </button>
              </div>
            </div>
          ) : (
            timelineLines.map((line, lineIndex) => {
              const themeStyle = THEME_HEADER_STYLES[line.colorTheme || 'maroon'] || THEME_HEADER_STYLES.maroon;
              const hourTicks = generateHourTicks(line.startHour, line.endHour);
              const duration = formatDuration(line.startHour, line.endHour);
              const isDetailsExpanded = expandedLines[line.id];

              return (
                <div
                  key={line.id}
                  className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden transition hover:border-stone-300"
                >
                  {/* Line Header Row */}
                  <div className="px-3.5 py-2.5 bg-stone-100/70 border-b border-stone-200 flex flex-wrap items-center justify-between gap-2.5">
                    {/* Left: Title, Marathi Title & Date */}
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${themeStyle.badge} shrink-0`}>
                        {formatTime12h(line.startHour)} – {formatTime12h(line.endHour)}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-xs sm:text-sm font-bold text-stone-900 truncate">
                            {line.title}
                          </h3>
                          {line.marathiTitle && (
                            <span className="text-xs font-devanagari text-stone-600 hidden md:inline truncate">
                              ({line.marathiTitle})
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-stone-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-stone-400" />
                            {line.date}
                          </span>
                          <span>•</span>
                          <span>{duration} span</span>
                          {line.venue && (
                            <>
                              <span>•</span>
                              <span className="flex items-center gap-1 truncate max-w-[200px]">
                                <MapPin className="w-3 h-3 text-stone-400" />
                                {line.venue}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-1.5">
                      {/* Move up / down */}
                      <button
                        type="button"
                        onClick={() => handleMoveLine(lineIndex, 'up')}
                        disabled={lineIndex === 0}
                        className="p-1 rounded text-stone-400 hover:text-stone-700 hover:bg-stone-200 disabled:opacity-30 transition"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveLine(lineIndex, 'down')}
                        disabled={lineIndex === timelineLines.length - 1}
                        className="p-1 rounded text-stone-400 hover:text-stone-700 hover:bg-stone-200 disabled:opacity-30 transition"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>

                      {/* Add Slot Button */}
                      <button
                        type="button"
                        onClick={() => handleOpenAddSlot(line.id)}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold text-[#7a1c1c] bg-[#7a1c1c]/10 hover:bg-[#7a1c1c]/20 flex items-center gap-1 transition"
                        title="Add event into this line"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span className="hidden xs:inline">+ Add Slot</span>
                      </button>

                      {/* Edit Line */}
                      <button
                        type="button"
                        onClick={() => handleEditLine(line)}
                        className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-200 transition"
                        title="Edit Timeline Line"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete Line */}
                      <button
                        type="button"
                        aria-label={`Delete timeline line: ${line.title}`}
                        onClick={() => deleteTimelineLine(line.id)}
                        className="p-1.5 rounded-lg text-stone-500 hover:text-rose-600 hover:bg-rose-50 transition"
                        title="Delete Timeline Line"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      {/* Toggle Details Dropdown */}
                      <button
                        type="button"
                        onClick={() => toggleLineDetails(line.id)}
                        className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-200 transition flex items-center gap-0.5 text-xs font-medium"
                        title="Toggle Detailed Slot Cards"
                      >
                        <span className="text-[11px] text-stone-500 font-semibold">{line.slots.length}</span>
                        {isDetailsExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* VISUAL SPLIT-CLOCK HORIZONTAL TIMELINE BAR */}
                  <div className="p-3 bg-white">
                    {/* Time Ruler (Hour Markers along top) */}
                    <div className="relative w-full h-6 mb-1 text-[10px] text-stone-400 select-none">
                      {hourTicks.map((tick, idx) => {
                        // Clamp translation near edges so first and last labels aren't clipped
                        const isFirst = idx === 0 || tick.percent <= 2;
                        const isLast = idx === hourTicks.length - 1 || tick.percent >= 98;
                        const transformClass = isFirst
                          ? 'translate-x-0 items-start'
                          : isLast
                          ? '-translate-x-full items-end'
                          : '-translate-x-1/2 items-center';

                        return (
                          <div
                            key={idx}
                            className={`absolute flex flex-col pointer-events-none transition-opacity ${transformClass}`}
                            style={{ left: `${tick.percent}%` }}
                          >
                            <span className="font-mono text-[9px] sm:text-[10px] text-stone-600 font-semibold tracking-tight whitespace-nowrap bg-white/80 px-0.5 rounded">
                              {tick.label}
                            </span>
                            <div className="w-px h-2 bg-stone-300 mt-0.5"></div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Proportional Split Bar Container */}
                    <div className="relative w-full h-14 bg-stone-100 rounded-xl p-1 border border-stone-200 shadow-inner flex items-center overflow-x-auto overflow-y-hidden">
                      {/* Background hour grid lines */}
                      {hourTicks.map((tick, idx) => (
                        <div
                          key={idx}
                          className="absolute top-0 bottom-0 w-px bg-stone-200/80 pointer-events-none"
                          style={{ left: `${tick.percent}%` }}
                        />
                      ))}

                      {/* Render Each Slot Block */}
                      {line.slots.length === 0 ? (
                        <div
                          onClick={() => handleOpenAddSlot(line.id)}
                          className="w-full h-full flex items-center justify-center text-xs font-medium text-stone-400 hover:text-stone-700 hover:bg-amber-50/50 cursor-pointer rounded-lg border border-dashed border-stone-300 transition gap-1.5"
                        >
                          <Plus className="w-4 h-4 text-stone-400" />
                          <span>Click to split clock and add events to this line ({formatTime12h(line.startHour)} – {formatTime12h(line.endHour)})</span>
                        </div>
                      ) : (
                        line.slots.map((slot) => {
                          const { leftPercent, widthPercent } = calculateSlotPosition(
                            line.startHour,
                            line.endHour,
                            slot.startTime,
                            slot.endTime
                          );
                          const slotColor = SLOT_COLOR_TAGS[slot.colorTag || 'maroon'] || SLOT_COLOR_TAGS.maroon;

                          return (
                            <div
                              key={slot.id}
                              style={{
                                left: `${leftPercent}%`,
                                width: `${widthPercent}%`,
                              }}
                              onClick={() => handleEditSlot(slot)}
                              onMouseEnter={() => setHoveredSlot({ slot, line })}
                              onMouseLeave={() => setHoveredSlot(null)}
                              className={`absolute top-1 bottom-1 px-2 py-1 rounded-lg cursor-pointer transition-all duration-150 shadow-xs select-none flex flex-col justify-center border group ${
                                slot.isMuhurta
                                  ? 'bg-linear-to-r from-amber-600 via-amber-500 to-yellow-600 border-amber-300 text-stone-950 ring-2 ring-amber-400/50 animate-pulse'
                                  : `${slotColor.bg} ${slotColor.border} ${slotColor.text}`
                              }`}
                              title={`${slot.title} (${formatTime12h(slot.startTime)} - ${formatTime12h(slot.endTime)}) - Click to edit`}
                            >
                              <div className="flex items-center justify-between gap-1 overflow-hidden">
                                <div className="flex items-center gap-1 min-w-0">
                                  {slot.isMuhurta && (
                                    <Flame className="w-3 h-3 text-yellow-200 fill-yellow-300 shrink-0" />
                                  )}
                                  <span className="text-[11px] font-bold truncate leading-tight">
                                    {slot.title}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center justify-between text-[9px] opacity-90 truncate mt-0.5">
                                <span className="font-mono font-medium">
                                  {formatTime12h(slot.startTime)} – {formatTime12h(slot.endTime)}
                                </span>
                                {slot.leadPerson && (
                                  <span className="hidden sm:inline truncate max-w-[80px]">
                                    👤 {slot.leadPerson}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Quick Add Split Hint & Fast Insert */}
                    <div className="flex items-center justify-between pt-2 px-1 text-[11px] text-stone-500">
                      <div className="flex items-center gap-2">
                        <span className="text-stone-400">Events in sequence:</span>
                        <div className="flex items-center flex-wrap gap-1">
                          {line.slots.map((s, sIdx) => (
                            <button
                              key={s.id}
                              type="button"
                              onClick={() => handleEditSlot(s)}
                              className="px-1.5 py-0.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium text-[10px] flex items-center gap-1 transition"
                            >
                              {s.isMuhurta && <Flame className="w-2.5 h-2.5 text-amber-600" />}
                              <span>{sIdx + 1}. {s.title}</span>
                              <span className="text-stone-400 font-mono">({formatTime12h(s.startTime)})</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleOpenAddSlot(line.id)}
                        className="text-[11px] font-semibold text-[#7a1c1c] hover:underline flex items-center gap-1 shrink-0"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Event Slot</span>
                      </button>
                    </div>
                  </div>

                  {/* EXPANDABLE DETAILED SLOTS VIEW (CARDS LIST) */}
                  {isDetailsExpanded && (
                    <div className="p-3.5 bg-stone-50 border-t border-stone-200 space-y-2.5 animate-in fade-in duration-150">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">
                          Detailed Event Timeline Cards ({line.slots.length} Rituals / Segments)
                        </h4>
                        <button
                          type="button"
                          onClick={() => handleOpenAddSlot(line.id)}
                          className="text-xs font-bold text-[#7a1c1c] hover:underline flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add New Segment</span>
                        </button>
                      </div>

                      {line.slots.length === 0 ? (
                        <p className="text-xs text-stone-500 py-3 text-center">
                          No events added yet. Click "+ Add Slot" to start defining the timeline.
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                          {line.slots.map((slot, sIdx) => {
                            const durationStr = formatDuration(slot.startTime, slot.endTime);
                            const slotColor = SLOT_COLOR_TAGS[slot.colorTag || 'maroon'] || SLOT_COLOR_TAGS.maroon;

                            return (
                              <div
                                key={slot.id}
                                className={`p-3 rounded-xl border transition group flex flex-col justify-between ${
                                  slot.isMuhurta
                                    ? 'bg-amber-50/80 border-amber-300 shadow-xs'
                                    : 'bg-white border-stone-200 hover:border-stone-300 hover:shadow-xs'
                                }`}
                              >
                                <div>
                                  {/* Slot Top Row */}
                                  <div className="flex items-start justify-between gap-2 mb-1">
                                    <div className="flex items-center gap-1.5">
                                      <span className="w-5 h-5 rounded-full bg-stone-100 text-stone-700 text-[10px] font-bold flex items-center justify-center">
                                        {sIdx + 1}
                                      </span>
                                      <h5 className="text-xs sm:text-sm font-bold text-stone-900">
                                        {slot.title}
                                      </h5>
                                      {slot.isMuhurta && (
                                        <span className="px-1.5 py-0.5 rounded bg-amber-200 text-amber-900 text-[9px] font-bold flex items-center gap-0.5">
                                          <Flame className="w-2.5 h-2.5 text-amber-700" />
                                          Muhurta
                                        </span>
                                      )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                                      <button
                                        type="button"
                                        onClick={() => handleEditSlot(slot)}
                                        className="p-1 rounded text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
                                        title="Edit Slot"
                                      >
                                        <Edit3 className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        type="button"
                                        aria-label={`Delete event slot: ${slot.title}`}
                                        onClick={() => deleteTimelineSlot(line.id, slot.id)}
                                        className="p-1 rounded text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition"
                                        title="Delete Slot"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  </div>

                                  {slot.marathiTitle && (
                                    <p className="text-xs font-devanagari text-stone-600 mb-1.5 ml-6.5">
                                      {slot.marathiTitle}
                                    </p>
                                  )}

                                  {/* Badges: Time, Duration, Location, Coordinator */}
                                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-stone-600 mb-2 ml-6.5">
                                    <span className="px-2 py-0.5 rounded-md bg-stone-100 font-mono font-semibold text-stone-800 flex items-center gap-1">
                                      <Clock className="w-3 h-3 text-stone-500" />
                                      {formatTime12h(slot.startTime)} – {formatTime12h(slot.endTime)} ({durationStr})
                                    </span>

                                    {slot.location && (
                                      <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 flex items-center gap-1">
                                        <MapPin className="w-3 h-3 text-stone-400" />
                                        {slot.location}
                                      </span>
                                    )}

                                    {slot.leadPerson && (
                                      <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200/50 flex items-center gap-1 font-medium">
                                        <User className="w-3 h-3 text-amber-700" />
                                        {slot.leadPerson}
                                      </span>
                                    )}
                                  </div>

                                  {/* Notes */}
                                  {slot.notes && (
                                    <p className="text-xs text-stone-600 bg-stone-100/70 p-2 rounded-lg ml-6.5 border border-stone-200/50">
                                      {slot.notes}
                                    </p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

      {/* Hover Info Tooltip (if active) */}
      {hoveredSlot && (
        <div className="fixed bottom-4 right-4 z-40 bg-stone-900/95 text-white p-3.5 rounded-xl shadow-2xl border border-stone-700 max-w-xs animate-in fade-in duration-100 pointer-events-none">
          <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold mb-1">
            <Clock className="w-3.5 h-3.5" />
            <span>
              {formatTime12h(hoveredSlot.slot.startTime)} – {formatTime12h(hoveredSlot.slot.endTime)} (
              {formatDuration(hoveredSlot.slot.startTime, hoveredSlot.slot.endTime)})
            </span>
          </div>
          <h4 className="text-sm font-bold text-white mb-0.5">{hoveredSlot.slot.title}</h4>
          {hoveredSlot.slot.marathiTitle && (
            <p className="text-xs font-devanagari text-amber-200/80 mb-1.5">{hoveredSlot.slot.marathiTitle}</p>
          )}
          {hoveredSlot.slot.location && (
            <p className="text-[11px] text-stone-300 flex items-center gap-1 mb-1">
              <MapPin className="w-3 h-3 text-stone-400" />
              {hoveredSlot.slot.location}
            </p>
          )}
          {hoveredSlot.slot.leadPerson && (
            <p className="text-[11px] text-amber-300/90 flex items-center gap-1 mb-1">
              <User className="w-3 h-3 text-amber-400" />
              Incharge: {hoveredSlot.slot.leadPerson}
            </p>
          )}
          {hoveredSlot.slot.notes && (
            <p className="text-[10px] text-stone-400 border-t border-stone-800 pt-1 mt-1">
              {hoveredSlot.slot.notes}
            </p>
          )}
        </div>
      )}

      {/* Modals */}
      <TimelineLineModal
        isOpen={isLineModalOpen}
        onClose={() => {
          setIsLineModalOpen(false);
          setLineToEdit(null);
        }}
        lineToEdit={lineToEdit}
      />

      <TimelineSlotModal
        isOpen={isSlotModalOpen}
        onClose={() => {
          setIsSlotModalOpen(false);
          setSlotToEdit(null);
          setSlotDefaultStart(undefined);
          setSlotDefaultEnd(undefined);
        }}
        targetLineId={targetLineId}
        slotToEdit={slotToEdit}
        defaultStartTime={slotDefaultStart}
        defaultEndTime={slotDefaultEnd}
      />

      <TimelinePresetsModal
        isOpen={isPresetsModalOpen}
        onClose={() => setIsPresetsModalOpen(false)}
      />
    </div>
  );
};
