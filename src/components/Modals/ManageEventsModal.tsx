import React, { useState } from 'react';
import { useWedding } from '../../context/WeddingContext';
import { WeddingEventCategory } from '../../types/wedding';
import { X, Calendar, Plus, Trash2, Edit3, ArrowUp, ArrowDown, Sparkles, CheckCircle2 } from 'lucide-react';
import { EventModal } from './EventModal';

interface ManageEventsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ManageEventsModal: React.FC<ManageEventsModalProps> = ({ isOpen, onClose }) => {
  const { eventCategories, updateEventCategory, deleteEventCategory, tasks, expenses } = useWedding();
  const [editingEvent, setEditingEvent] = useState<WeddingEventCategory | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  if (!isOpen) return null;

  const sortedEvents = [...eventCategories].sort((a, b) => (a.order || 0) - (b.order || 0));

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const current = sortedEvents[index];
    const prev = sortedEvents[index - 1];
    const currentOrder = current.order || index + 1;
    const prevOrder = prev.order || index;

    updateEventCategory(current.id, { order: prevOrder });
    updateEventCategory(prev.id, { order: currentOrder });
  };

  const handleMoveDown = (index: number) => {
    if (index >= sortedEvents.length - 1) return;
    const current = sortedEvents[index];
    const next = sortedEvents[index + 1];
    const currentOrder = current.order || index + 1;
    const nextOrder = next.order || index + 2;

    updateEventCategory(current.id, { order: nextOrder });
    updateEventCategory(next.id, { order: currentOrder });
  };

  const handleDelete = (event: WeddingEventCategory) => {
    deleteEventCategory(event.id);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs font-sans-google animate-in fade-in duration-150">
        <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[85vh]">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-stone-50/60">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#7a1c1c]/10 text-[#7a1c1c] flex items-center justify-center font-bold">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-stone-900">Manage Wedding Ceremonies & Events</h2>
                <p className="text-xs text-stone-500">
                  Add, edit, reorder, or remove events from your wedding schedule
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditingEvent(null);
                  setIsAddModalOpen(true);
                }}
                className="px-3 py-1.5 bg-[#7a1c1c] hover:bg-[#581212] text-white text-xs font-semibold rounded-lg shadow-xs transition flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Ceremony</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* List Content */}
          <div className="p-6 overflow-y-auto flex-1 divide-y divide-stone-100 space-y-3">
            {sortedEvents.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-sm font-medium text-stone-600">No ceremonies configured</p>
                <p className="text-xs text-stone-400 mt-1">Click "Add Ceremony" to create your first event.</p>
                <button
                  type="button"
                  onClick={() => {
                    setEditingEvent(null);
                    setIsAddModalOpen(true);
                  }}
                  className="mt-4 px-4 py-2 bg-[#7a1c1c] text-white text-xs font-semibold rounded-lg"
                >
                  + Add Ceremony
                </button>
              </div>
            ) : (
              sortedEvents.map((event, idx) => {
                const eventTasks = tasks.filter((t) => t.eventId === event.id);
                const eventExpenses = expenses.filter((e) => e.eventId === event.id);
                const completedTasks = eventTasks.filter((t) => t.completed).length;

                return (
                  <div
                    key={event.id}
                    className="pt-3 first:pt-0 flex items-center justify-between gap-3 group hover:bg-stone-50/70 p-2.5 rounded-xl transition"
                  >
                    {/* Left: Reorder arrows & Title */}
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="flex flex-col gap-0.5 text-stone-400">
                        <button
                          type="button"
                          onClick={() => handleMoveUp(idx)}
                          disabled={idx === 0}
                          className="hover:text-stone-700 disabled:opacity-20 p-0.5"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveDown(idx)}
                          disabled={idx === sortedEvents.length - 1}
                          className="hover:text-stone-700 disabled:opacity-20 p-0.5"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="w-6 text-center text-xs font-bold text-stone-400">
                        #{idx + 1}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-bold text-stone-900 truncate">{event.name}</h4>
                          <span className="text-xs text-stone-600 font-devanagari bg-stone-100 px-2 py-0.5 rounded-md">
                            {event.marathiName}
                          </span>
                        </div>

                        <div className="flex items-center gap-3 text-[11px] text-stone-500 mt-1 flex-wrap">
                          {event.date && <span>📅 {event.date}</span>}
                          {event.time && <span>⏰ {event.time}</span>}
                          {event.venue && <span>📍 {event.venue}</span>}
                          <span className="text-stone-400">•</span>
                          <span className="font-medium text-stone-600">
                            {eventTasks.length} tasks ({completedTasks} done)
                          </span>
                          {eventExpenses.length > 0 && (
                            <>
                              <span className="text-stone-400">•</span>
                              <span className="font-medium text-[#7a1c1c]">
                                {eventExpenses.length} expenses
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingEvent(event);
                          setIsAddModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-200 transition"
                        title="Edit ceremony details"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(event)}
                        className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition"
                        title="Remove ceremony"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-3.5 border-t border-stone-100 bg-stone-50/50 flex items-center justify-between">
            <span className="text-xs text-stone-500">
              Total <strong>{sortedEvents.length}</strong> ceremonies planned
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditingEvent(null);
                  setIsAddModalOpen(true);
                }}
                className="px-3.5 py-1.5 bg-[#7a1c1c] hover:bg-[#581212] text-white text-xs font-semibold rounded-lg shadow-xs transition flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Ceremony</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-medium rounded-lg transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Event Modal for Add/Edit */}
      {isAddModalOpen && (
        <EventModal
          isOpen={isAddModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingEvent(null);
          }}
          eventToEdit={editingEvent}
        />
      )}
    </>
  );
};
