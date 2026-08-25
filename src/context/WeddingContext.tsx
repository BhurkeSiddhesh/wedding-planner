import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  Guest,
  Ritual,
  RitualItem,
  Expense,
  MainExpenseCategory,
  PayerType,
  SplitRule,
  PaymentStatus,
  CateringMenu,
  WeddingProfile,
  RSVPStatus,
  TodoTask,
  WeddingEventCategory,
  TaskPriority,
  TaskSide,
  TimelineLine,
  TimelineSlot,
} from '../types/wedding';
import {
  initialWeddingProfile,
  initialRituals,
  initialGuests,
  initialExpenses,
  initialCateringMenus,
  initialEventCategories,
  initialTodoTasks,
  initialTimelineLines,
} from '../data/defaultData';
import { calculateBudgetSummary, calculateGuestMetrics, BudgetSummary, GuestMetrics } from '../utils/calculations';
import {
  subscribeTasks,
  subscribeExpenses,
  subscribeEvents,
  subscribeProfile,
  subscribeTimelineLines,
  saveTaskToDb,
  deleteTaskFromDb,
  saveExpenseToDb,
  deleteExpenseFromDb,
  saveEventToDb,
  deleteEventFromDb,
  saveProfileToDb,
  saveTimelineLineToDb,
  deleteTimelineLineFromDb,
  wipeAllDataInDb,
  loadTemplateToDb,
} from '../services/weddingFirestore';

interface WeddingContextType {
  profile: WeddingProfile;
  setProfile: (p: WeddingProfile) => void;
  updateProfile: (updates: Partial<WeddingProfile>) => void;

  eventCategories: WeddingEventCategory[];
  addEventCategory: (cat: Omit<WeddingEventCategory, 'id'>) => void;
  updateEventCategory: (id: string, updates: Partial<WeddingEventCategory>) => void;
  deleteEventCategory: (id: string) => void;

  timelineLines: TimelineLine[];
  addTimelineLine: (line: Omit<TimelineLine, 'id'>) => void;
  updateTimelineLine: (id: string, updates: Partial<TimelineLine>) => void;
  deleteTimelineLine: (id: string) => void;
  addTimelineSlot: (lineId: string, slot: Omit<TimelineSlot, 'id' | 'lineId'>) => void;
  updateTimelineSlot: (lineId: string, slotId: string, updates: Partial<TimelineSlot>) => void;
  deleteTimelineSlot: (lineId: string, slotId: string) => void;
  reorderTimelineLines: (newLines: TimelineLine[]) => void;

  tasks: TodoTask[];
  addTask: (task: Omit<TodoTask, 'id'>) => void;
  updateTask: (id: string, updates: Partial<TodoTask>) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompleted: (id: string) => void;
  batchToggleTasks: (ids: string[], completed: boolean) => void;

  rituals: Ritual[];
  addRitual: (r: Omit<Ritual, 'id' | 'items'>) => void;
  updateRitual: (id: string, updates: Partial<Ritual>) => void;
  deleteRitual: (id: string) => void;

  addRitualItem: (ritualId: string, item: Omit<RitualItem, 'id'>) => void;
  updateRitualItem: (ritualId: string, itemId: string, updates: Partial<RitualItem>) => void;
  deleteRitualItem: (ritualId: string, itemId: string) => void;
  toggleRitualItemPurchased: (ritualId: string, itemId: string) => void;

  guests: Guest[];
  addGuest: (g: Omit<Guest, 'id'>) => void;
  updateGuest: (id: string, updates: Partial<Guest>) => void;
  deleteGuest: (id: string) => void;
  batchUpdateRSVP: (guestIds: string[], status: RSVPStatus) => void;

  expenses: Expense[];
  addExpense: (e: Omit<Expense, 'id' | 'dateAdded'>) => void;
  updateExpense: (id: string, updates: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;

  cateringMenus: CateringMenu[];
  updateCateringMenu: (id: string, updates: Partial<CateringMenu>) => void;
  addCateringMenu: (menu: Omit<CateringMenu, 'id'>) => void;

  budgetSummary: BudgetSummary;
  guestMetrics: GuestMetrics;

  isCloudSyncing: boolean;
  isDbConnected: boolean;
  resetAllData: () => Promise<void>;
  loadMarathiTemplate: () => Promise<void>;
  resetToDemoData: () => void;
  exportJSON: () => void;
  importJSON: (jsonStr: string) => boolean;
}

const WeddingContext = createContext<WeddingContextType | undefined>(undefined);

export const WeddingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const hasReset = typeof window !== 'undefined' && localStorage.getItem('wedding_has_reset') === 'true';

  const [profile, setProfileState] = useState<WeddingProfile>(initialWeddingProfile);
  const [eventCategories, setEventCategoriesState] = useState<WeddingEventCategory[]>(initialEventCategories);
  const [timelineLines, setTimelineLinesState] = useState<TimelineLine[]>(hasReset ? [] : initialTimelineLines);
  const [tasks, setTasksState] = useState<TodoTask[]>(hasReset ? [] : initialTodoTasks);
  const [expenses, setExpensesState] = useState<Expense[]>(hasReset ? [] : initialExpenses);
  const [rituals, setRitualsState] = useState<Ritual[]>(hasReset ? [] : initialRituals);
  const [guests, setGuestsState] = useState<Guest[]>(hasReset ? [] : initialGuests);
  const [cateringMenus, setCateringMenusState] = useState<CateringMenu[]>(hasReset ? [] : initialCateringMenus);

  const [isCloudSyncing, setIsCloudSyncing] = useState<boolean>(false);
  const [isDbConnected, setIsDbConnected] = useState<boolean>(true);

  // Derive Expense Category from Task title & ceremony
  const deriveCategoryFromTask = (eventId: string, title: string): MainExpenseCategory => {
    const lower = `${title} ${eventId}`.toLowerCase();
    if (lower.includes('hall') || lower.includes('karyalaya') || lower.includes('venue') || lower.includes('room') || lower.includes('hotel')) {
      return 'hall_venue';
    }
    if (lower.includes('photo') || lower.includes('video') || lower.includes('drone') || lower.includes('cinemat')) {
      return 'photography_drone';
    }
    if (lower.includes('decor') || lower.includes('mandap') || lower.includes('flower') || lower.includes('arch') || lower.includes('varmala')) {
      return 'decor_mandap';
    }
    if (lower.includes('cater') || lower.includes('pangat') || lower.includes('modak') || lower.includes('pedhe') || lower.includes('sweet') || lower.includes('bhojan') || lower.includes('feast') || lower.includes('lunch') || lower.includes('breakfast')) {
      return 'catering_pangat';
    }
    if (lower.includes('paithani') || lower.includes('saree') || lower.includes('gold') || lower.includes('ring') || lower.includes('chain') || lower.includes('mangalsutra') || lower.includes('saaz') || lower.includes('chuda') || lower.includes('silver') || lower.includes('karanda') || lower.includes('aher')) {
      return 'gifts_paithani_gold';
    }
    if (lower.includes('mehendi') || lower.includes('makeup') || lower.includes('nauvari') || lower.includes('styling') || lower.includes('pheta') || lower.includes('dhoti')) {
      return 'makeup_nauvari_styling';
    }
    if (lower.includes('dhol') || lower.includes('tasha') || lower.includes('dj') || lower.includes('sound') || lower.includes('sanai') || lower.includes('music')) {
      return 'sound_dhol_tasha';
    }
    if (lower.includes('bus') || lower.includes('travel') || lower.includes('car') || lower.includes('transport') || lower.includes('procession')) {
      return 'transport_hotel';
    }
    if (lower.includes('patrika') || lower.includes('card') || lower.includes('invite') || lower.includes('invitation')) {
      return 'invitations_patrika';
    }
    if (lower.includes('puja') || lower.includes('samagri') || lower.includes('guruji') || lower.includes('priest') || lower.includes('akshata') || lower.includes('antarpat') || lower.includes('halad') || lower.includes('homa')) {
      return 'ritual_samagri';
    }
    return 'miscellaneous';
  };

  // 1. Subscribe to Firestore in Real-Time
  useEffect(() => {
    const unsubTasks = subscribeTasks((remoteTasks) => {
      setTasksState(remoteTasks || []);
    });

    const unsubExpenses = subscribeExpenses((remoteExpenses) => {
      setExpensesState(remoteExpenses || []);
    });

    const unsubEvents = subscribeEvents((remoteEvents) => {
      if (remoteEvents && remoteEvents.length > 0) {
        setEventCategoriesState(remoteEvents);
      }
    });

    const unsubTimelines = subscribeTimelineLines((remoteTimelines) => {
      if (remoteTimelines && remoteTimelines.length > 0) {
        setTimelineLinesState(remoteTimelines);
      }
    });

    const unsubProfile = subscribeProfile((remoteProfile) => {
      if (remoteProfile && remoteProfile.brideName) {
        setProfileState(remoteProfile);
      }
    });

    return () => {
      unsubTasks();
      unsubExpenses();
      unsubEvents();
      unsubTimelines();
      unsubProfile();
    };
  }, []);

  // Update Profile
  const updateProfile = (updates: Partial<WeddingProfile>) => {
    setProfileState((prev) => {
      const merged = { ...prev, ...updates };
      saveProfileToDb(merged);
      return merged;
    });
  };

  const setProfile = (p: WeddingProfile) => {
    setProfileState(p);
    saveProfileToDb(p);
  };

  // Event Categories
  const addEventCategory = (cat: Omit<WeddingEventCategory, 'id'> | WeddingEventCategory) => {
    const newCat: WeddingEventCategory = {
      ...cat,
      id: 'id' in cat && cat.id ? cat.id : `evt_${Date.now()}`,
      order: 'order' in cat && typeof cat.order === 'number' ? cat.order : eventCategories.length + 1,
    };
    setEventCategoriesState((prev) => [...prev, newCat]);
    saveEventToDb(newCat);
  };

  const updateEventCategory = (id: string, updates: Partial<WeddingEventCategory>) => {
    setEventCategoriesState((prev) => {
      const updated = prev.map((c) => (c.id === id ? { ...c, ...updates } : c));
      const target = updated.find((c) => c.id === id);
      if (target) saveEventToDb(target);
      return updated;
    });

    if (updates.name) {
      // Update event name on tasks if relevant
      setTasksState((prev) =>
        prev.map((t) => {
          if (t.eventId === id) {
            const updatedTask = { ...t, eventName: updates.name };
            saveTaskToDb(updatedTask);
            return updatedTask;
          }
          return t;
        })
      );
    }
  };

  const deleteEventCategory = (id: string) => {
    setEventCategoriesState((prev) => prev.filter((c) => c.id !== id));
    deleteEventFromDb(id);

    // Reassign any remaining tasks under this event to 'general'
    setTasksState((prev) =>
      prev.map((t) => {
        if (t.eventId === id) {
          const updatedTask: TodoTask = { ...t, eventId: 'general', eventName: 'General Wedding Tasks' };
          saveTaskToDb(updatedTask);
          return updatedTask;
        }
        return t;
      })
    );

    // Reassign any remaining expenses under this event to 'general_venue'
    setExpensesState((prev) =>
      prev.map((e) => {
        if (e.eventId === id) {
          const updatedExpense: Expense = { ...e, eventId: 'general_venue' };
          saveExpenseToDb(updatedExpense);
          return updatedExpense;
        }
        return e;
      })
    );
  };

  // TIMELINE LINES & DAY TRACK MANAGEMENT
  const addTimelineLine = (line: Omit<TimelineLine, 'id'> | TimelineLine) => {
    const newLine: TimelineLine = {
      ...line,
      id: 'id' in line && line.id ? line.id : `line_${Date.now()}`,
      order: 'order' in line && typeof line.order === 'number' ? line.order : timelineLines.length + 1,
      slots: line.slots || [],
    };
    setTimelineLinesState((prev) => [...prev, newLine]);
    saveTimelineLineToDb(newLine);
  };

  const updateTimelineLine = (id: string, updates: Partial<TimelineLine>) => {
    setTimelineLinesState((prev) => {
      const updated = prev.map((l) => (l.id === id ? { ...l, ...updates } : l));
      const target = updated.find((l) => l.id === id);
      if (target) saveTimelineLineToDb(target);
      return updated;
    });
  };

  const deleteTimelineLine = (id: string) => {
    setTimelineLinesState((prev) => prev.filter((l) => l.id !== id));
    deleteTimelineLineFromDb(id);
  };

  const addTimelineSlot = (lineId: string, slot: Omit<TimelineSlot, 'id' | 'lineId'>) => {
    const newSlot: TimelineSlot = {
      ...slot,
      id: `slot_${Date.now()}`,
      lineId,
    };

    setTimelineLinesState((prev) => {
      const targetLine = prev.find((l) => l.id === lineId);
      if (!targetLine) return prev;

      const newSlots = [...targetLine.slots, newSlot].sort((a, b) => a.startTime.localeCompare(b.startTime));
      const updatedLine: TimelineLine = { ...targetLine, slots: newSlots };
      saveTimelineLineToDb(updatedLine);

      return prev.map((l) => (l.id === lineId ? updatedLine : l));
    });
  };

  const updateTimelineSlot = (lineId: string, slotId: string, updates: Partial<TimelineSlot>) => {
    setTimelineLinesState((prev) => {
      const targetLine = prev.find((l) => l.id === lineId);
      if (!targetLine) return prev;

      const newSlots = targetLine.slots
        .map((s) => (s.id === slotId ? { ...s, ...updates } : s))
        .sort((a, b) => a.startTime.localeCompare(b.startTime));

      const updatedLine: TimelineLine = { ...targetLine, slots: newSlots };
      saveTimelineLineToDb(updatedLine);

      return prev.map((l) => (l.id === lineId ? updatedLine : l));
    });
  };

  const deleteTimelineSlot = (lineId: string, slotId: string) => {
    setTimelineLinesState((prev) => {
      const targetLine = prev.find((l) => l.id === lineId);
      if (!targetLine) return prev;

      const newSlots = targetLine.slots.filter((s) => s.id !== slotId);
      const updatedLine: TimelineLine = { ...targetLine, slots: newSlots };
      saveTimelineLineToDb(updatedLine);

      return prev.map((l) => (l.id === lineId ? updatedLine : l));
    });
  };

  const reorderTimelineLines = (newLines: TimelineLine[]) => {
    const ordered = newLines.map((line, idx) => ({ ...line, order: idx + 1 }));
    setTimelineLinesState(ordered);
    ordered.forEach((line) => saveTimelineLineToDb(line));
  };

  // TASK ACTIONS WITH TWO-WAY EXPENSE SYNCHRONIZATION
  const addTask = (task: Omit<TodoTask, 'id'>) => {
    const taskId = `tsk_${Date.now()}`;
    const cost = task.estimatedCost && Number(task.estimatedCost) > 0 ? Number(task.estimatedCost) : undefined;
    const actCost = task.actualCost && Number(task.actualCost) > 0 ? Number(task.actualCost) : cost;

    let linkedExpId: string | undefined = undefined;

    // If task has a cost, automatically create and link an Expense document
    if (cost && cost > 0) {
      linkedExpId = `exp_tsk_${Date.now()}`;
      const payerSide: PayerType = task.assignedSide === 'groom' ? 'groom' : task.assignedSide === 'bride' ? 'bride' : 'shared';
      const splitRule: SplitRule = payerSide === 'groom' ? '100_groom' : payerSide === 'bride' ? '100_bride' : '50_50_shared';
      const groomShare = payerSide === 'groom' ? 100 : payerSide === 'bride' ? 0 : 50;
      const brideShare = payerSide === 'bride' ? 100 : payerSide === 'groom' ? 0 : 50;
      const paymentStatus: PaymentStatus = task.completed ? 'paid' : 'pending';

      const newExpense: Expense = {
        id: linkedExpId,
        title: task.title,
        category: deriveCategoryFromTask(task.eventId, task.title),
        eventId: task.eventId,
        estimatedCost: cost,
        actualCost: actCost || cost,
        paidBy: payerSide,
        splitRule: splitRule,
        groomSharePercent: groomShare,
        brideSharePercent: brideShare,
        paymentStatus: paymentStatus,
        paidAmount: task.completed ? (actCost || cost) : 0,
        notes: task.notes ? `Linked from To-Do: ${task.notes}` : 'Created from To-Do Task',
        dateAdded: new Date().toISOString().split('T')[0],
        linkedTaskId: taskId,
      };

      setExpensesState((prev) => [newExpense, ...prev]);
      saveExpenseToDb(newExpense);
    }

    const newTask: TodoTask = {
      ...task,
      id: taskId,
      estimatedCost: cost,
      actualCost: actCost,
      linkedExpenseId: linkedExpId,
    };

    setTasksState((prev) => [newTask, ...prev]);
    saveTaskToDb(newTask);
  };

  const updateTask = (id: string, updates: Partial<TodoTask>) => {
    setTasksState((prevTasks) => {
      const existingTask = prevTasks.find((t) => t.id === id);
      if (!existingTask) return prevTasks;

      const mergedTask: TodoTask = { ...existingTask, ...updates };
      const cost = mergedTask.estimatedCost && Number(mergedTask.estimatedCost) > 0 ? Number(mergedTask.estimatedCost) : undefined;
      const actCost = mergedTask.actualCost && Number(mergedTask.actualCost) > 0 ? Number(mergedTask.actualCost) : cost;

      // Update linked expense in state & Firestore
      setExpensesState((prevExpenses) => {
        const existingExp = prevExpenses.find(
          (e) => e.linkedTaskId === id || (mergedTask.linkedExpenseId && e.id === mergedTask.linkedExpenseId)
        );

        if (cost && cost > 0) {
          const payerSide: PayerType = mergedTask.assignedSide === 'groom' ? 'groom' : mergedTask.assignedSide === 'bride' ? 'bride' : 'shared';
          const splitRule: SplitRule = payerSide === 'groom' ? '100_groom' : payerSide === 'bride' ? '100_bride' : '50_50_shared';
          const groomShare = payerSide === 'groom' ? 100 : payerSide === 'bride' ? 0 : 50;
          const brideShare = payerSide === 'bride' ? 100 : payerSide === 'groom' ? 0 : 50;

          if (existingExp) {
            const updatedExp: Expense = {
              ...existingExp,
              title: mergedTask.title,
              eventId: mergedTask.eventId,
              category: deriveCategoryFromTask(mergedTask.eventId, mergedTask.title),
              estimatedCost: cost,
              actualCost: actCost || cost,
              paidBy: payerSide,
              splitRule: splitRule,
              groomSharePercent: groomShare,
              brideSharePercent: brideShare,
              paymentStatus: mergedTask.completed ? 'paid' : existingExp.paymentStatus,
              paidAmount: mergedTask.completed ? (actCost || cost) : existingExp.paidAmount,
              notes: mergedTask.notes || existingExp.notes,
              linkedTaskId: id,
            };
            saveExpenseToDb(updatedExp);
            return prevExpenses.map((e) => (e.id === existingExp.id ? updatedExp : e));
          } else {
            const newExpId = `exp_tsk_${Date.now()}`;
            mergedTask.linkedExpenseId = newExpId;
            const newExpense: Expense = {
              id: newExpId,
              title: mergedTask.title,
              category: deriveCategoryFromTask(mergedTask.eventId, mergedTask.title),
              eventId: mergedTask.eventId,
              estimatedCost: cost,
              actualCost: actCost || cost,
              paidBy: payerSide,
              splitRule: splitRule,
              groomSharePercent: groomShare,
              brideSharePercent: brideShare,
              paymentStatus: mergedTask.completed ? 'paid' : 'pending',
              paidAmount: mergedTask.completed ? (actCost || cost) : 0,
              notes: mergedTask.notes ? `Linked from To-Do: ${mergedTask.notes}` : 'Created from To-Do Task',
              dateAdded: new Date().toISOString().split('T')[0],
              linkedTaskId: id,
            };
            saveExpenseToDb(newExpense);
            return [newExpense, ...prevExpenses];
          }
        } else {
          // If task cost removed, delete the linked expense
          if (existingExp) {
            deleteExpenseFromDb(existingExp.id);
            return prevExpenses.filter((e) => e.id !== existingExp.id);
          }
          return prevExpenses;
        }
      });

      saveTaskToDb(mergedTask);
      return prevTasks.map((t) => (t.id === id ? mergedTask : t));
    });
  };

  const deleteTask = (id: string) => {
    // 1. Delete from tasks
    setTasksState((prev) => prev.filter((t) => t.id !== id));
    deleteTaskFromDb(id);

    // 2. Automatically delete linked expense
    setExpensesState((prev) => {
      const linked = prev.find((e) => e.linkedTaskId === id);
      if (linked) {
        deleteExpenseFromDb(linked.id);
      }
      return prev.filter((e) => e.linkedTaskId !== id);
    });
  };

  const toggleTaskCompleted = (id: string) => {
    setTasksState((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextCompleted = !t.completed;
          const cost = t.actualCost || t.estimatedCost || 0;
          const updatedTask: TodoTask = {
            ...t,
            completed: nextCompleted,
            completedAt: nextCompleted ? new Date().toISOString() : undefined,
          };
          saveTaskToDb(updatedTask);

          // Sync payment status with linked expense
          setExpensesState((prevExp) =>
            prevExp.map((e) => {
              if (e.linkedTaskId === id || (t.linkedExpenseId && e.id === t.linkedExpenseId)) {
                const updatedExp: Expense = {
                  ...e,
                  paymentStatus: nextCompleted ? 'paid' : 'pending',
                  paidAmount: nextCompleted ? (e.actualCost || e.estimatedCost || cost) : 0,
                };
                saveExpenseToDb(updatedExp);
                return updatedExp;
              }
              return e;
            })
          );

          return updatedTask;
        }
        return t;
      })
    );
  };

  const batchToggleTasks = (ids: string[], completed: boolean) => {
    setTasksState((prev) =>
      prev.map((t) => {
        if (ids.includes(t.id)) {
          const updatedTask: TodoTask = {
            ...t,
            completed,
            completedAt: completed ? new Date().toISOString() : undefined,
          };
          saveTaskToDb(updatedTask);
          return updatedTask;
        }
        return t;
      })
    );

    // Sync linked expenses
    setExpensesState((prevExp) =>
      prevExp.map((e) => {
        if (e.linkedTaskId && ids.includes(e.linkedTaskId)) {
          const updatedExp: Expense = {
            ...e,
            paymentStatus: completed ? 'paid' : 'pending',
            paidAmount: completed ? (e.actualCost || e.estimatedCost) : 0,
          };
          saveExpenseToDb(updatedExp);
          return updatedExp;
        }
        return e;
      })
    );
  };

  // EXPENSE ACTIONS WITH TWO-WAY TASK SYNCHRONIZATION
  const addExpense = (e: Omit<Expense, 'id' | 'dateAdded'>) => {
    const newExpense: Expense = {
      ...e,
      id: `exp_${Date.now()}`,
      dateAdded: new Date().toISOString().split('T')[0],
    };
    setExpensesState((prev) => [newExpense, ...prev]);
    saveExpenseToDb(newExpense);
  };

  const updateExpense = (id: string, updates: Partial<Expense>) => {
    setExpensesState((prevExpenses) => {
      const existingExpense = prevExpenses.find((e) => e.id === id);
      const mergedExpense: Expense = existingExpense ? { ...existingExpense, ...updates } : (updates as Expense);

      // If linked to a To-Do task, sync updates back to the task
      if (mergedExpense.linkedTaskId) {
        const taskId = mergedExpense.linkedTaskId;
        setTasksState((prevTasks) =>
          prevTasks.map((t) => {
            if (t.id === taskId) {
              const assignedSide: TaskSide =
                mergedExpense.paidBy === 'groom'
                  ? 'groom'
                  : mergedExpense.paidBy === 'bride'
                  ? 'bride'
                  : 'shared';

              const updatedTask: TodoTask = {
                ...t,
                title: mergedExpense.title,
                eventId: mergedExpense.eventId,
                estimatedCost: mergedExpense.estimatedCost,
                actualCost: mergedExpense.actualCost,
                assignedSide: assignedSide,
                completed: mergedExpense.paymentStatus === 'paid' ? true : t.completed,
              };
              saveTaskToDb(updatedTask);
              return updatedTask;
            }
            return t;
          })
        );
      }

      saveExpenseToDb(mergedExpense);
      return prevExpenses.map((e) => (e.id === id ? mergedExpense : e));
    });
  };

  const deleteExpense = (id: string) => {
    setExpensesState((prevExpenses) => {
      const expenseToDelete = prevExpenses.find((e) => e.id === id);

      // If linked to a task, clear cost from task
      if (expenseToDelete?.linkedTaskId) {
        const taskId = expenseToDelete.linkedTaskId;
        setTasksState((prevTasks) =>
          prevTasks.map((t) => {
            if (t.id === taskId) {
              const updatedTask: TodoTask = {
                ...t,
                estimatedCost: undefined,
                actualCost: undefined,
                linkedExpenseId: undefined,
              };
              saveTaskToDb(updatedTask);
              return updatedTask;
            }
            return t;
          })
        );
      }

      deleteExpenseFromDb(id);
      return prevExpenses.filter((e) => e.id !== id);
    });
  };

  // Ritual actions
  const addRitual = (r: Omit<Ritual, 'id' | 'items'>) => {
    const newRitual: Ritual = { ...r, id: `rit_${Date.now()}`, items: [] };
    setRitualsState((prev) => [...prev, newRitual]);
  };

  const updateRitual = (id: string, updates: Partial<Ritual>) => {
    setRitualsState((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
  };

  const deleteRitual = (id: string) => {
    setRitualsState((prev) => prev.filter((r) => r.id !== id));
  };

  const addRitualItem = (ritualId: string, item: Omit<RitualItem, 'id'>) => {
    const newItem: RitualItem = { ...item, id: `item_${Date.now()}` };
    setRitualsState((prev) =>
      prev.map((r) => (r.id === ritualId ? { ...r, items: [...r.items, newItem] } : r))
    );
  };

  const updateRitualItem = (ritualId: string, itemId: string, updates: Partial<RitualItem>) => {
    setRitualsState((prev) =>
      prev.map((r) => {
        if (r.id === ritualId) {
          return {
            ...r,
            items: r.items.map((it) => (it.id === itemId ? { ...it, ...updates } : it)),
          };
        }
        return r;
      })
    );
  };

  const deleteRitualItem = (ritualId: string, itemId: string) => {
    setRitualsState((prev) =>
      prev.map((r) => {
        if (r.id === ritualId) {
          return { ...r, items: r.items.filter((it) => it.id !== itemId) };
        }
        return r;
      })
    );
  };

  const toggleRitualItemPurchased = (ritualId: string, itemId: string) => {
    setRitualsState((prev) =>
      prev.map((r) => {
        if (r.id === ritualId) {
          return {
            ...r,
            items: r.items.map((it) =>
              it.id === itemId
                ? {
                    ...it,
                    isPurchased: !it.isPurchased,
                    actualCost: !it.isPurchased && it.actualCost === 0 ? it.estimatedCost : it.actualCost,
                  }
                : it
            ),
          };
        }
        return r;
      })
    );
  };

  // Guest actions
  const addGuest = (g: Omit<Guest, 'id'>) => {
    const newGuest: Guest = { ...g, id: `gst_${Date.now()}` };
    setGuestsState((prev) => [newGuest, ...prev]);
  };

  const updateGuest = (id: string, updates: Partial<Guest>) => {
    setGuestsState((prev) => prev.map((g) => (g.id === id ? { ...g, ...updates } : g)));
  };

  const deleteGuest = (id: string) => {
    setGuestsState((prev) => prev.filter((g) => g.id !== id));
  };

  const batchUpdateRSVP = (guestIds: string[], status: RSVPStatus) => {
    setGuestsState((prev) =>
      prev.map((g) => (guestIds.includes(g.id) ? { ...g, rsvpStatus: status } : g))
    );
  };

  // Catering actions
  const updateCateringMenu = (id: string, updates: Partial<CateringMenu>) => {
    setCateringMenusState((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));
  };

  const addCateringMenu = (menu: Omit<CateringMenu, 'id'>) => {
    const newMenu: CateringMenu = { ...menu, id: `menu_${Date.now()}` };
    setCateringMenusState((prev) => [...prev, newMenu]);
  };

  // Budget calculations
  const budgetSummary = useMemo(() => {
    return calculateBudgetSummary(expenses, rituals, profile);
  }, [expenses, rituals, profile]);

  const guestMetrics = useMemo(() => {
    return calculateGuestMetrics(guests);
  }, [guests]);

  // RESET ALL DATA TO BLANK SLATE
  const resetAllData = async () => {
    setIsCloudSyncing(true);
    try {
      if (typeof window !== 'undefined') {
        localStorage.clear();
        localStorage.setItem('wedding_has_reset', 'true');
      }
      await wipeAllDataInDb();
      setTasksState([]);
      setExpensesState([]);
      setTimelineLinesState([]);
      setRitualsState([]);
      setGuestsState([]);
      setCateringMenusState([]);
    } catch (err) {
      console.error('Error resetting database:', err);
    } finally {
      setIsCloudSyncing(false);
    }
  };

  // LOAD FULL MARATHI WEDDING TEMPLATE
  const loadMarathiTemplate = async () => {
    setIsCloudSyncing(true);
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('wedding_has_reset');
      }
      await loadTemplateToDb(initialTodoTasks, initialExpenses, initialEventCategories, initialWeddingProfile, initialTimelineLines);
      setTasksState(initialTodoTasks);
      setExpensesState(initialExpenses);
      setEventCategoriesState(initialEventCategories);
      setTimelineLinesState(initialTimelineLines);
      setProfileState(initialWeddingProfile);
      setRitualsState(initialRituals);
    } catch (err) {
      console.error('Error loading template:', err);
    } finally {
      setIsCloudSyncing(false);
    }
  };

  const resetToDemoData = () => {
    loadMarathiTemplate();
  };

  const exportJSON = () => {
    const data = {
      profile,
      eventCategories,
      timelineLines,
      tasks,
      rituals,
      guests,
      expenses,
      cateringMenus,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Marathi_Wedding_${profile.brideName}_${profile.groomName}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importJSON = (jsonStr: string): boolean => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.profile) {
        setProfileState(parsed.profile);
        saveProfileToDb(parsed.profile);
      }
      if (parsed.eventCategories) {
        setEventCategoriesState(parsed.eventCategories);
        parsed.eventCategories.forEach((ev: WeddingEventCategory) => saveEventToDb(ev));
      }
      if (parsed.timelineLines) {
        setTimelineLinesState(parsed.timelineLines);
        parsed.timelineLines.forEach((tl: TimelineLine) => saveTimelineLineToDb(tl));
      }
      if (parsed.tasks) {
        setTasksState(parsed.tasks);
        parsed.tasks.forEach((t: TodoTask) => saveTaskToDb(t));
      }
      if (parsed.expenses) {
        setExpensesState(parsed.expenses);
        parsed.expenses.forEach((e: Expense) => saveExpenseToDb(e));
      }
      return true;
    } catch (err) {
      console.error('Failed to import JSON', err);
      return false;
    }
  };

  return (
    <WeddingContext.Provider
      value={{
        profile,
        setProfile,
        updateProfile,
        eventCategories,
        addEventCategory,
        updateEventCategory,
        deleteEventCategory,
        timelineLines,
        addTimelineLine,
        updateTimelineLine,
        deleteTimelineLine,
        addTimelineSlot,
        updateTimelineSlot,
        deleteTimelineSlot,
        reorderTimelineLines,
        tasks,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskCompleted,
        batchToggleTasks,
        rituals,
        addRitual,
        updateRitual,
        deleteRitual,
        addRitualItem,
        updateRitualItem,
        deleteRitualItem,
        toggleRitualItemPurchased,
        guests,
        addGuest,
        updateGuest,
        deleteGuest,
        batchUpdateRSVP,
        expenses,
        addExpense,
        updateExpense,
        deleteExpense,
        cateringMenus,
        updateCateringMenu,
        addCateringMenu,
        budgetSummary,
        guestMetrics,
        isCloudSyncing,
        isDbConnected,
        resetAllData,
        loadMarathiTemplate,
        resetToDemoData,
        exportJSON,
        importJSON,
      }}
    >
      {children}
    </WeddingContext.Provider>
  );
};

export const useWedding = () => {
  const context = useContext(WeddingContext);
  if (!context) {
    throw new Error('useWedding must be used within a WeddingProvider');
  }
  return context;
};
