import React, { useState, useMemo } from 'react';
import { useWedding } from '../../context/WeddingContext';
import { TodoTask, TaskSide, TaskPriority, WeddingEventCategory } from '../../types/wedding';
import { formatINR } from '../../utils/calculations';
import {
  CheckCircle2,
  Circle,
  Plus,
  Clock,
  Calendar,
  User,
  Trash2,
  Edit3,
  Search,
  ChevronDown,
  ChevronUp,
  Receipt,
  Sparkles,
  Layers,
  ArrowRight,
  Settings2,
  CalendarPlus,
  Package
} from 'lucide-react';
import { EventModal } from '../Modals/EventModal';
import { ManageEventsModal } from '../Modals/ManageEventsModal';

interface TodoListManagerProps {
  onOpenAddTask: (defaultEventId?: string) => void;
  onEditTask: (task: TodoTask) => void;
}

export const TodoListManager: React.FC<TodoListManagerProps> = ({
  onOpenAddTask,
  onEditTask,
}) => {
  const {
    tasks,
    eventCategories,
    toggleTaskCompleted,
    deleteTask,
    addTask,
    deleteEventCategory,
    batchToggleTasks,
  } = useWedding();

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedEventFilter, setSelectedEventFilter] = useState<string>('all');
  const [selectedSideFilter, setSelectedSideFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [collapsedEvents, setCollapsedEvents] = useState<{ [key: string]: boolean }>({});

  // Ceremony Modal States
  const [isEventModalOpen, setIsEventModalOpen] = useState<boolean>(false);
  const [isManageEventsModalOpen, setIsManageEventsModalOpen] = useState<boolean>(false);
  const [eventToEdit, setEventToEdit] = useState<WeddingEventCategory | null>(null);

  // Quick inline add state
  const [quickTitle, setQuickTitle] = useState('');
  const [quickEventId, setQuickEventId] = useState(eventCategories[0]?.id || 'lagna_muhurta');
  const [quickSide, setQuickSide] = useState<TaskSide>('shared');
  const [quickCost, setQuickCost] = useState<string>('');

  // Synchronize quickEventId if eventCategories change
  React.useEffect(() => {
    if (eventCategories.length > 0 && !eventCategories.some((e) => e.id === quickEventId)) {
      setQuickEventId(eventCategories[0].id);
    }
  }, [eventCategories, quickEventId]);

  // Metrics
  const totalTasksCount = tasks.length;
  const completedTasksCount = tasks.filter((t) => t.completed).length;
  const pendingTasksCount = totalTasksCount - completedTasksCount;
  const completionPercentage = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

  const totalCost = useMemo(() => {
    return tasks.reduce((sum, t) => sum + (t.actualCost || t.estimatedCost || 0), 0);
  }, [tasks]);

  // Filter tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (task.marathiTitle && task.marathiTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (task.assigneeName && task.assigneeName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (task.notes && task.notes.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesEvent = selectedEventFilter === 'all' || task.eventId === selectedEventFilter;
      const matchesSide = selectedSideFilter === 'all' || task.assignedSide === selectedSideFilter;
      const matchesStatus =
        selectedStatusFilter === 'all' ||
        (selectedStatusFilter === 'completed' && task.completed) ||
        (selectedStatusFilter === 'pending' && !task.completed);

      return matchesSearch && matchesEvent && matchesSide && matchesStatus;
    });
  }, [tasks, searchQuery, selectedEventFilter, selectedSideFilter, selectedStatusFilter]);

  // Group tasks by event
  const tasksByEvent = useMemo(() => {
    const map = new Map<string, TodoTask[]>();

    eventCategories.forEach((event) => {
      map.set(event.id, []);
    });
    map.set('general', []);

    filteredTasks.forEach((task) => {
      const key = map.has(task.eventId) ? task.eventId : 'general';
      map.get(key)!.push(task);
    });

    return map;
  }, [filteredTasks, eventCategories]);

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;

    const event = eventCategories.find((ev) => ev.id === quickEventId);
    const parsedCost = quickCost ? parseFloat(quickCost) : undefined;

    addTask({
      title: quickTitle.trim(),
      eventId: quickEventId,
      eventName: event ? event.name : 'Wedding Task',
      assignedSide: quickSide,
      priority: 'medium',
      completed: false,
      estimatedCost: parsedCost && parsedCost > 0 ? parsedCost : undefined,
    });

    setQuickTitle('');
    setQuickCost('');
  };

  const handleQuickEventChange = (val: string) => {
    if (val === '__ADD_NEW_CEREMONY__') {
      setEventToEdit(null);
      setIsEventModalOpen(true);
    } else if (val === '__MANAGE_CEREMONIES__') {
      setIsManageEventsModalOpen(true);
    } else {
      setQuickEventId(val);
    }
  };

  const handleEditCeremony = (event: WeddingEventCategory, e: React.MouseEvent) => {
    e.stopPropagation();
    setEventToEdit(event);
    setIsEventModalOpen(true);
  };

  const handleDeleteCeremony = (event: WeddingEventCategory, e: React.MouseEvent) => {
    e.stopPropagation();
    const count = tasks.filter((t) => t.eventId === event.id).length;
    let message = `Are you sure you want to remove the ceremony "${event.name}" (${event.marathiName})?`;
    if (count > 0) {
      message += `\n\n${count} task(s) under this ceremony will be preserved and moved to General Tasks.`;
    }
    if (window.confirm(message)) {
      deleteEventCategory(event.id);
    }
  };

  const toggleEventCollapse = (eventId: string) => {
    setCollapsedEvents((prev) => ({
      ...prev,
      [eventId]: !prev[eventId],
    }));
  };

  return (
    <div className="space-y-5 font-sans-google max-w-7xl mx-auto" id="todo-list-page">
      
      {/* 1. Quick Stats & Progress Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl p-3.5 border border-stone-200 shadow-xs">
          <span className="text-[11px] font-medium text-stone-500 block uppercase tracking-wider">Total Tasks</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-bold text-stone-900">{totalTasksCount}</span>
            <span className="text-xs text-stone-500 font-medium">({pendingTasksCount} pending)</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-3.5 border border-stone-200 shadow-xs">
          <span className="text-[11px] font-medium text-stone-500 block uppercase tracking-wider">Progress</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-bold text-emerald-600">{completionPercentage}%</span>
            <span className="text-xs text-stone-500 font-medium">{completedTasksCount} done</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-3.5 border border-stone-200 shadow-xs">
          <span className="text-[11px] font-medium text-stone-500 block uppercase tracking-wider">Budget Linked</span>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl font-bold text-[#7a1c1c]">{formatINR(totalCost)}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-3.5 border border-stone-200 shadow-xs">
          <span className="text-[11px] font-medium text-stone-500 block uppercase tracking-wider">Side Distribution</span>
          <div className="flex items-center gap-2 mt-1.5 text-xs">
            <span className="font-semibold text-blue-700">🤵 {tasks.filter(t => t.assignedSide === 'groom').length}</span>
            <span className="text-stone-300">•</span>
            <span className="font-semibold text-rose-700">👰 {tasks.filter(t => t.assignedSide === 'bride').length}</span>
            <span className="text-stone-300">•</span>
            <span className="font-semibold text-amber-700">🤝 {tasks.filter(t => t.assignedSide === 'shared').length}</span>
          </div>
        </div>
      </div>

      {/* 2. Streamlined Quick Task Adder */}
      <div className="bg-white rounded-xl p-3.5 border border-stone-200 shadow-xs">
        <form onSubmit={handleQuickAdd} className="flex flex-col md:flex-row items-stretch md:items-center gap-2.5">
          <div className="relative flex-1">
            <input
              type="text"
              value={quickTitle}
              onChange={(e) => setQuickTitle(e.target.value)}
              placeholder="Add a new task (e.g. 'Book Mandap Decorator', 'Purchase Paithani Sarees')..."
              className="w-full pl-3.5 pr-3 py-2 text-sm bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7a1c1c]/20 focus:border-[#7a1c1c] text-stone-900 placeholder:text-stone-400"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            {/* Ceremony Selector & Quick Event Manager */}
            <div className="flex items-center gap-1">
              <select
                value={quickEventId}
                onChange={(e) => handleQuickEventChange(e.target.value)}
                className="px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg font-medium text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#7a1c1c]/20 max-w-[200px] truncate"
              >
                {eventCategories.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.name} ({ev.marathiName})
                  </option>
                ))}
                <option disabled>──────────────</option>
                <option value="__ADD_NEW_CEREMONY__">✨ + Add New Ceremony...</option>
                <option value="__MANAGE_CEREMONIES__">⚙️ Manage / Reorder Ceremonies...</option>
              </select>

              <button
                type="button"
                onClick={() => {
                  setEventToEdit(null);
                  setIsEventModalOpen(true);
                }}
                className="p-2 bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-stone-900 rounded-lg transition border border-stone-200"
                title="Add New Ceremony / Event"
              >
                <CalendarPlus className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setIsManageEventsModalOpen(true)}
                className="p-2 bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-stone-900 rounded-lg transition border border-stone-200"
                title="Manage & Remove Ceremonies"
              >
                <Settings2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Side Selector */}
            <select
              value={quickSide}
              onChange={(e) => setQuickSide(e.target.value as TaskSide)}
              className="px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg font-medium text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#7a1c1c]/20"
            >
              <option value="shared">🤝 Shared (50:50)</option>
              <option value="groom">🤵 Groom (Var Paksha)</option>
              <option value="bride">👰 Bride (Vadhu Paksha)</option>
            </select>

            {/* Optional Budget Amount */}
            <div className="relative w-28">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-stone-400">₹</span>
              <input
                type="number"
                value={quickCost}
                onChange={(e) => setQuickCost(e.target.value)}
                placeholder="Cost"
                className="w-full pl-6 pr-2 py-2 text-xs bg-stone-50 border border-stone-200 rounded-lg text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#7a1c1c]/20"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!quickTitle.trim()}
              className="px-4 py-2 bg-[#7a1c1c] hover:bg-[#581212] disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition shadow-xs flex items-center justify-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add Task</span>
            </button>
          </div>
        </form>

        <p className="text-[11px] text-stone-400 mt-2 flex items-center justify-between flex-wrap gap-2">
          <span>💡 If you add a cost amount to any task, an entry will automatically be created and linked in the Expense Tracker.</span>
          <button
            type="button"
            onClick={() => setIsManageEventsModalOpen(true)}
            className="text-[11px] font-semibold text-[#7a1c1c] hover:underline flex items-center gap-1"
          >
            <Calendar className="w-3 h-3" />
            <span>Manage All ({eventCategories.length}) Ceremonies</span>
          </button>
        </p>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks, assignees, or notes..."
            className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7a1c1c]/20 text-stone-900 placeholder:text-stone-400"
          />
        </div>

        {/* Filter Pills & Ceremony Management Trigger */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setSelectedSideFilter('all')}
            className={`px-3 py-1 text-xs font-medium rounded-full transition ${
              selectedSideFilter === 'all'
                ? 'bg-stone-900 text-white'
                : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
          >
            All Sides
          </button>
          <button
            onClick={() => setSelectedSideFilter('groom')}
            className={`px-3 py-1 text-xs font-medium rounded-full transition ${
              selectedSideFilter === 'groom'
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-stone-200 text-blue-700 hover:bg-blue-50'
            }`}
          >
            🤵 Groom
          </button>
          <button
            onClick={() => setSelectedSideFilter('bride')}
            className={`px-3 py-1 text-xs font-medium rounded-full transition ${
              selectedSideFilter === 'bride'
                ? 'bg-rose-600 text-white'
                : 'bg-white border border-stone-200 text-rose-700 hover:bg-rose-50'
            }`}
          >
            👰 Bride
          </button>
          <button
            onClick={() => setSelectedSideFilter('shared')}
            className={`px-3 py-1 text-xs font-medium rounded-full transition ${
              selectedSideFilter === 'shared'
                ? 'bg-amber-700 text-white'
                : 'bg-white border border-stone-200 text-amber-800 hover:bg-amber-50'
            }`}
          >
            🤝 Shared
          </button>

          <span className="text-stone-300 mx-1">|</span>

          <button
            onClick={() => setSelectedStatusFilter(selectedStatusFilter === 'pending' ? 'all' : 'pending')}
            className={`px-3 py-1 text-xs font-medium rounded-full transition ${
              selectedStatusFilter === 'pending'
                ? 'bg-amber-600 text-white'
                : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setSelectedStatusFilter(selectedStatusFilter === 'completed' ? 'all' : 'completed')}
            className={`px-3 py-1 text-xs font-medium rounded-full transition ${
              selectedStatusFilter === 'completed'
                ? 'bg-emerald-600 text-white'
                : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
          >
            Done
          </button>

          <button
            onClick={() => setIsManageEventsModalOpen(true)}
            className="ml-1 px-3 py-1 text-xs font-medium rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-200 transition flex items-center gap-1 shrink-0"
            title="Manage Ceremonies"
          >
            <Calendar className="w-3 h-3 text-[#7a1c1c]" />
            <span>Ceremonies ({eventCategories.length})</span>
          </button>
        </div>
      </div>

      {/* 4. Ceremony Accordion Groups */}
      {tasks.length === 0 ? (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-3">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-stone-800">Your task list is empty</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1">
            Add tasks using the bar above, or click "Load Template" in the header to populate the full traditional Marathi wedding checklist.
          </p>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="bg-white rounded-xl border border-stone-200 p-10 text-center">
          <div className="w-10 h-10 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-2">
            <Search className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-stone-800">No matching tasks found</h3>
          <p className="text-xs text-stone-500 mt-1">
            Try adjusting your search query or filter selections.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {eventCategories.map((event) => {
            const eventTasks = tasksByEvent.get(event.id) || [];
            if (selectedEventFilter !== 'all' && selectedEventFilter !== event.id) return null;
            // Keep UI clean: only render event if it has tasks
            if (eventTasks.length === 0) return null;

            const isCollapsed = collapsedEvents[event.id];
            const eventCompletedCount = eventTasks.filter((t) => t.completed).length;
            const eventTotalCost = eventTasks.reduce((s, t) => s + (t.actualCost || t.estimatedCost || 0), 0);

            return (
              <div
                key={event.id}
                className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden transition"
              >
                {/* Event Section Header */}
                <div
                  onClick={() => toggleEventCollapse(event.id)}
                  className="flex items-center justify-between px-4 py-3 bg-stone-50/60 hover:bg-stone-50 cursor-pointer select-none border-b border-stone-100 gap-3"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <button
                      type="button"
                      aria-label={isCollapsed ? `Expand ${event.name}` : `Collapse ${event.name}`}
                      className="text-stone-400 hover:text-stone-600 p-0.5"
                    >
                      {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                    </button>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2 flex-wrap">
                        <span>{event.name}</span>
                        <span className="text-xs font-normal text-stone-500 font-devanagari">
                          ({event.marathiName})
                        </span>
                      </h3>
                      <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-0.5 flex-wrap">
                        {event.date && <span>📅 {event.date}</span>}
                        {event.time && <span>⏰ {event.time}</span>}
                        {event.venue && <span>📍 {event.venue}</span>}
                        {event.description && (
                          <span className="text-stone-400 hidden sm:inline">• {event.description}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {eventTotalCost > 0 && (
                      <span className="text-xs font-semibold text-[#7a1c1c] bg-stone-100 px-2 py-0.5 rounded-md border border-stone-200">
                        {formatINR(eventTotalCost)}
                      </span>
                    )}

                    <span className="text-xs font-medium text-stone-500 hidden sm:inline">
                      {eventCompletedCount}/{eventTasks.length} Done
                    </span>

                    {/* Add Task */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenAddTask(event.id);
                      }}
                      className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-200 transition"
                      title="Add task to this ceremony"
                    >
                      <Plus className="w-4 h-4" />
                    </button>

                    {/* Edit Ceremony Details */}
                    <button
                      type="button"
                      onClick={(e) => handleEditCeremony(event, e)}
                      className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-200 transition"
                      title="Edit ceremony details (Date, Time, Venue)"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    {/* Remove Ceremony from list */}
                    <button
                      type="button"
                      onClick={(e) => handleDeleteCeremony(event, e)}
                      className="p-1.5 rounded-lg text-rose-400 hover:text-rose-700 hover:bg-rose-50 transition"
                      title="Remove ceremony from list"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Event Task List */}
                {!isCollapsed && (
                  <div className="divide-y divide-stone-100">
                    {eventTasks.length === 0 ? (
                      <div className="py-4 text-center text-xs text-stone-400 italic">
                        No tasks in this ceremony. Click + to add one.
                      </div>
                    ) : (
                      eventTasks.map((task) => {
                        const cost = task.actualCost || task.estimatedCost;

                        return (
                          <div
                            key={task.id}
                            className={`flex items-start justify-between px-4 py-2.5 hover:bg-stone-50/80 transition group ${
                              task.completed ? 'bg-stone-50/40' : ''
                            }`}
                          >
                            {/* Left: Checkbox & Title */}
                            <div className="flex items-start gap-3 flex-1 min-w-0 pr-3">
                              <button
                                type="button"
                                aria-label={`${task.completed ? 'Mark incomplete' : 'Mark complete'}: ${task.title}`}
                                onClick={() => toggleTaskCompleted(task.id)}
                                className="mt-0.5 text-stone-400 hover:text-stone-700 transition shrink-0"
                              >
                                {task.completed ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                                ) : (
                                  <Circle className="w-4 h-4 text-stone-300 hover:text-stone-400" />
                                )}
                              </button>

                              <div className="min-w-0 flex-1">
                                <div className="flex items-baseline flex-wrap gap-x-2 gap-y-0.5">
                                  <span
                                    className={`text-xs sm:text-sm font-medium ${
                                      task.completed
                                        ? 'line-through text-stone-400'
                                        : 'text-stone-800'
                                    }`}
                                  >
                                    {task.title}
                                  </span>

                                  {task.marathiTitle && (
                                    <span className="text-xs text-stone-400 font-devanagari">
                                      ({task.marathiTitle})
                                    </span>
                                  )}
                                </div>

                                {/* Task Metadata Badges */}
                                <div className="flex items-center flex-wrap gap-1.5 mt-1 text-[11px]">
                                  {/* Side Badge */}
                                  <span
                                    className={`px-1.5 py-0.5 rounded font-medium ${
                                      task.assignedSide === 'groom'
                                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                        : task.assignedSide === 'bride'
                                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                                    }`}
                                  >
                                    {task.assignedSide === 'groom' ? '🤵 Groom' : task.assignedSide === 'bride' ? '👰 Bride' : '🤝 Shared'}
                                  </span>

                                  {/* Quantity Badge */}
                                  {task.quantity && (
                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded font-medium bg-amber-50 text-amber-900 border border-amber-200" title="Quantity / Units to purchase or prepare">
                                      <Package className="w-3 h-3 text-amber-700" />
                                      <span>{task.quantity}</span>
                                    </span>
                                  )}

                                  {/* Linked Expense Badge */}
                                  {cost && cost > 0 ? (
                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                      <Receipt className="w-3 h-3 text-emerald-600" />
                                      <span>{formatINR(cost)}</span>
                                      <span className="text-[10px] font-normal text-emerald-600/80">(Synced in Expenses)</span>
                                    </span>
                                  ) : null}

                                  {/* Assignee */}
                                  {task.assigneeName && (
                                    <span className="inline-flex items-center gap-1 text-stone-500">
                                      <User className="w-3 h-3 text-stone-400" />
                                      <span>{task.assigneeName}</span>
                                    </span>
                                  )}

                                  {/* Due Date */}
                                  {task.dueDate && (
                                    <span className="inline-flex items-center gap-1 text-stone-500">
                                      <Calendar className="w-3 h-3 text-stone-400" />
                                      <span>{task.dueDate}</span>
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Right: Actions */}
                            <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition shrink-0">
                              <button
                                type="button"
                                onClick={() => onEditTask(task)}
                                className="p-1 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded transition"
                                title="Edit Task"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteTask(task.id)}
                                className="p-1 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded transition"
                                title="Delete Task & Linked Expense"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* General / Unassigned Tasks Section (if any tasks exist under 'general') */}
          {(tasksByEvent.get('general') || []).length > 0 && (
            <div className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden transition mt-3">
              <div
                onClick={() => toggleEventCollapse('general')}
                className="flex items-center justify-between px-4 py-3 bg-stone-100/70 hover:bg-stone-100 cursor-pointer select-none border-b border-stone-200"
              >
                <div className="flex items-center gap-2.5">
                  <button type="button" aria-label={collapsedEvents['general'] ? 'Expand general tasks' : 'Collapse general tasks'} className="text-stone-400 hover:text-stone-600 p-0.5">
                    {collapsedEvents['general'] ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                  </button>
                  <div>
                    <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                      <span>General & Other Tasks</span>
                      <span className="text-xs font-normal text-stone-500 font-devanagari">(इतर सर्वसाधारण कामे)</span>
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-stone-500">
                    {(tasksByEvent.get('general') || []).filter((t) => t.completed).length}/{(tasksByEvent.get('general') || []).length} Done
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenAddTask('general');
                    }}
                    className="p-1 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-200 transition"
                    title="Add general task"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {!collapsedEvents['general'] && (
                <div className="divide-y divide-stone-100">
                  {(tasksByEvent.get('general') || []).map((task) => {
                    return (
                      <div
                        key={task.id}
                        className={`flex items-start justify-between px-4 py-2.5 hover:bg-stone-50/80 transition group ${
                          task.completed ? 'bg-stone-50/40' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3 flex-1 min-w-0 pr-3">
                          <button
                            type="button"
                            aria-label={`${task.completed ? 'Mark incomplete' : 'Mark complete'}: ${task.title}`}
                            onClick={() => toggleTaskCompleted(task.id)}
                            className="mt-0.5 text-stone-400 hover:text-stone-700 transition shrink-0"
                          >
                            {task.completed ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100" />
                            ) : (
                              <Circle className="w-4 h-4 text-stone-300 hover:text-stone-400" />
                            )}
                          </button>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-baseline flex-wrap gap-x-2 gap-y-0.5">
                              <span className={`text-xs sm:text-sm font-medium ${task.completed ? 'line-through text-stone-400' : 'text-stone-900'}`}>
                                {task.title}
                              </span>
                              {task.marathiTitle && (
                                <span className="text-xs text-stone-400 font-devanagari">
                                  ({task.marathiTitle})
                                </span>
                              )}
                            </div>
                            <div className="flex items-center flex-wrap gap-1.5 mt-1 text-[11px]">
                              <span
                                className={`px-1.5 py-0.5 rounded font-medium ${
                                  task.assignedSide === 'groom'
                                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                    : task.assignedSide === 'bride'
                                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                                }`}
                              >
                                {task.assignedSide === 'groom' ? '🤵 Groom' : task.assignedSide === 'bride' ? '👰 Bride' : '🤝 Shared'}
                              </span>
                              {task.quantity && (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded font-medium bg-amber-50 text-amber-900 border border-amber-200">
                                  <Package className="w-3 h-3 text-amber-700" />
                                  <span>{task.quantity}</span>
                                </span>
                              )}
                              {(task.actualCost || task.estimatedCost) ? (
                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  <Receipt className="w-3 h-3 text-emerald-600" />
                                  <span>{formatINR(task.actualCost || task.estimatedCost || 0)}</span>
                                </span>
                              ) : null}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition shrink-0">
                          <button
                            type="button"
                            aria-label={`Edit task: ${task.title}`}
                            onClick={() => onEditTask(task)}
                            className="p-1 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded transition"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            aria-label={`Delete task: ${task.title}`}
                            onClick={() => deleteTask(task.id)}
                            className="p-1 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Modals for Ceremony Management */}
      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => {
          setIsEventModalOpen(false);
          setEventToEdit(null);
        }}
        eventToEdit={eventToEdit}
      />

      <ManageEventsModal
        isOpen={isManageEventsModalOpen}
        onClose={() => setIsManageEventsModalOpen(false)}
      />

    </div>
  );
};
