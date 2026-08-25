import React, { useState, useEffect } from 'react';
import { useWedding } from '../../context/WeddingContext';
import { TodoTask, TaskSide, TaskPriority } from '../../types/wedding';
import { X, Check, Plus, Save, CalendarPlus } from 'lucide-react';
import { EventModal } from '../Modals/EventModal';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: TodoTask | null;
  defaultEventId?: string;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  taskToEdit,
  defaultEventId,
}) => {
  const { eventCategories, addTask, updateTask } = useWedding();

  const [title, setTitle] = useState('');
  const [marathiTitle, setMarathiTitle] = useState('');
  const [eventId, setEventId] = useState(defaultEventId || eventCategories[0]?.id || 'lagna_muhurta');
  const [assignedSide, setAssignedSide] = useState<TaskSide>('shared');
  const [assigneeName, setAssigneeName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [estimatedCost, setEstimatedCost] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [completed, setCompleted] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setMarathiTitle(taskToEdit.marathiTitle || '');
      setEventId(taskToEdit.eventId);
      setAssignedSide(taskToEdit.assignedSide);
      setAssigneeName(taskToEdit.assigneeName || '');
      setDueDate(taskToEdit.dueDate || '');
      setPriority(taskToEdit.priority);
      setEstimatedCost(taskToEdit.estimatedCost ? taskToEdit.estimatedCost.toString() : '');
      setNotes(taskToEdit.notes || '');
      setCompleted(taskToEdit.completed);
    } else {
      setTitle('');
      setMarathiTitle('');
      setEventId(defaultEventId || eventCategories[0]?.id || 'lagna_muhurta');
      setAssignedSide('shared');
      setAssigneeName('');
      setDueDate('');
      setPriority('medium');
      setEstimatedCost('');
      setNotes('');
      setCompleted(false);
    }
  }, [taskToEdit, defaultEventId, eventCategories, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const event = eventCategories.find((c) => c.id === eventId);
    const eventName = event ? event.name : 'Wedding Ceremony';
    const costNum = estimatedCost ? parseFloat(estimatedCost) : undefined;

    if (taskToEdit) {
      updateTask(taskToEdit.id, {
        title: title.trim(),
        marathiTitle: marathiTitle.trim() || undefined,
        eventId,
        eventName,
        assignedSide,
        assigneeName: assigneeName.trim() || undefined,
        dueDate: dueDate || undefined,
        priority,
        estimatedCost: isNaN(costNum || 0) ? undefined : costNum,
        notes: notes.trim() || undefined,
        completed,
      });
    } else {
      addTask({
        title: title.trim(),
        marathiTitle: marathiTitle.trim() || undefined,
        eventId,
        eventName,
        assignedSide,
        assigneeName: assigneeName.trim() || undefined,
        dueDate: dueDate || undefined,
        priority,
        estimatedCost: isNaN(costNum || 0) ? undefined : costNum,
        notes: notes.trim() || undefined,
        completed,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/50 backdrop-blur-xs font-sans-google">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-stone-200 flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-4 bg-stone-50 flex items-center justify-between border-b border-stone-200">
          <div>
            <h3 className="font-bold text-base text-stone-900">
              {taskToEdit ? 'Edit Wedding Task' : 'Add New Task'}
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Synced with Cloud Database and Expense Tracker
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Task Title */}
          <div>
            <label className="block text-xs font-semibold text-stone-800 mb-1">
              Task Title <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Order Chitale Sweets for Pangat"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-200 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#7a1c1c]/20"
            />
          </div>

          {/* Marathi Title */}
          <div>
            <label className="block text-xs font-semibold text-stone-800 mb-1">
              Marathi Title (मराठी नाव)
            </label>
            <input
              type="text"
              placeholder="e.g. भोजन पंगतीसाठी चितळे बंधू पेढे ऑर्डर करणे"
              value={marathiTitle}
              onChange={(e) => setMarathiTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-200 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#7a1c1c]/20 font-devanagari"
            />
          </div>

          {/* Ceremony Event Category */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-stone-800">
                Ceremony Event <span className="text-rose-600">*</span>
              </label>
              <button
                type="button"
                onClick={() => setIsEventModalOpen(true)}
                className="text-[11px] font-semibold text-[#7a1c1c] hover:underline flex items-center gap-1"
              >
                <CalendarPlus className="w-3 h-3" />
                <span>+ New Ceremony</span>
              </button>
            </div>
            <select
              value={eventId}
              onChange={(e) => {
                if (e.target.value === '__NEW__') {
                  setIsEventModalOpen(true);
                } else {
                  setEventId(e.target.value);
                }
              }}
              className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-200 text-stone-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#7a1c1c]/20"
            >
              {eventCategories.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.name} ({ev.marathiName})
                </option>
              ))}
              <option disabled>──────────────</option>
              <option value="__NEW__">✨ + Add New Ceremony...</option>
            </select>
          </div>

          {/* Side Assignment */}
          <div>
            <label className="block text-xs font-semibold text-stone-800 mb-1.5">
              Responsible Family Side
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setAssignedSide('shared')}
                className={`py-2 px-2 rounded-lg font-semibold border text-center transition ${
                  assignedSide === 'shared'
                    ? 'bg-amber-100 text-amber-900 border-amber-400 shadow-xs'
                    : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                }`}
              >
                🤝 Shared (50:50)
              </button>

              <button
                type="button"
                onClick={() => setAssignedSide('groom')}
                className={`py-2 px-2 rounded-lg font-semibold border text-center transition ${
                  assignedSide === 'groom'
                    ? 'bg-blue-100 text-blue-900 border-blue-400 shadow-xs'
                    : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                }`}
              >
                🤵 Var (Groom)
              </button>

              <button
                type="button"
                onClick={() => setAssignedSide('bride')}
                className={`py-2 px-2 rounded-lg font-semibold border text-center transition ${
                  assignedSide === 'bride'
                    ? 'bg-rose-100 text-rose-900 border-rose-400 shadow-xs'
                    : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                }`}
              >
                👰 Vadhu (Bride)
              </button>
            </div>
          </div>

          {/* Cost & Due Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">
                Estimated Cost (₹)
              </label>
              <input
                type="number"
                placeholder="e.g. 25000"
                value={estimatedCost}
                onChange={(e) => setEstimatedCost(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-200 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#7a1c1c]/20"
              />
              <p className="text-[10px] text-stone-400 mt-1">
                Auto-syncs in Expense Tracker
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">
                Assignee / Contact
              </label>
              <input
                type="text"
                placeholder="e.g. Mama, Kaka, Florist"
                value={assigneeName}
                onChange={(e) => setAssigneeName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-200 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#7a1c1c]/20"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-stone-800 mb-1">
              Notes & Special Instructions
            </label>
            <textarea
              rows={2}
              placeholder="Vendor phone, items to carry, delivery instructions..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-200 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#7a1c1c]/20"
            />
          </div>

          {/* Completed Checkbox */}
          <label className="flex items-center gap-2 pt-1 cursor-pointer">
            <input
              type="checkbox"
              checked={completed}
              onChange={(e) => setCompleted(e.target.checked)}
              className="w-4 h-4 rounded text-[#7a1c1c] focus:ring-[#7a1c1c]"
            />
            <span className="text-xs font-medium text-stone-700">Mark task as completed</span>
          </label>

          {/* Actions */}
          <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg font-semibold text-white bg-[#7a1c1c] hover:bg-[#581212] transition shadow-xs flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{taskToEdit ? 'Save Changes' : 'Add Task'}</span>
            </button>
          </div>
        </form>

      </div>

      {isEventModalOpen && (
        <EventModal
          isOpen={isEventModalOpen}
          onClose={() => setIsEventModalOpen(false)}
        />
      )}
    </div>
  );
};
