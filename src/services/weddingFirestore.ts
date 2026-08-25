import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  updateDoc,
  onSnapshot,
  writeBatch,
  query,
  orderBy,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from '../firebase';
import { TodoTask, Expense, WeddingEventCategory, WeddingProfile, TimelineLine } from '../types/wedding';

// Collection references
const TASKS_COLLECTION = 'wedding_tasks';
const EXPENSES_COLLECTION = 'wedding_expenses';
const EVENTS_COLLECTION = 'wedding_events';
const SETTINGS_COLLECTION = 'wedding_settings';
const TIMELINE_COLLECTION = 'wedding_timelines';
const PROFILE_DOC_ID = 'profile';

/**
 * Real-time listener for timeline lines
 */
export function subscribeTimelineLines(onUpdate: (lines: TimelineLine[]) => void): Unsubscribe {
  try {
    const q = query(collection(db, TIMELINE_COLLECTION));
    return onSnapshot(
      q,
      (snapshot) => {
        const lines: TimelineLine[] = [];
        snapshot.forEach((docSnap) => {
          lines.push({ ...(docSnap.data() as TimelineLine), id: docSnap.id });
        });
        lines.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        onUpdate(lines);
      },
      (error) => {
        console.warn('Firestore timeline subscription error:', error);
      }
    );
  } catch (err) {
    console.warn('Failed to subscribe timeline lines:', err);
    return () => {};
  }
}

/**
 * Save / Update Timeline Line in Firestore
 */
export async function saveTimelineLineToDb(line: TimelineLine): Promise<void> {
  try {
    const docRef = doc(db, TIMELINE_COLLECTION, line.id);
    await setDoc(docRef, line, { merge: true });
  } catch (err) {
    console.warn('Error saving timeline line to Firestore:', err);
  }
}

/**
 * Delete Timeline Line in Firestore
 */
export async function deleteTimelineLineFromDb(lineId: string): Promise<void> {
  try {
    const docRef = doc(db, TIMELINE_COLLECTION, lineId);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('Error deleting timeline line from Firestore:', err);
  }
}


/**
 * Real-time listener for tasks
 */
export function subscribeTasks(onUpdate: (tasks: TodoTask[]) => void): Unsubscribe {
  try {
    const q = query(collection(db, TASKS_COLLECTION));
    return onSnapshot(
      q,
      (snapshot) => {
        const tasks: TodoTask[] = [];
        snapshot.forEach((docSnap) => {
          tasks.push({ ...(docSnap.data() as TodoTask), id: docSnap.id });
        });
        onUpdate(tasks);
      },
      (error) => {
        console.warn('Firestore tasks subscription error:', error);
      }
    );
  } catch (err) {
    console.warn('Failed to subscribe tasks:', err);
    return () => {};
  }
}

/**
 * Real-time listener for expenses
 */
export function subscribeExpenses(onUpdate: (expenses: Expense[]) => void): Unsubscribe {
  try {
    const q = query(collection(db, EXPENSES_COLLECTION));
    return onSnapshot(
      q,
      (snapshot) => {
        const expenses: Expense[] = [];
        snapshot.forEach((docSnap) => {
          expenses.push({ ...(docSnap.data() as Expense), id: docSnap.id });
        });
        onUpdate(expenses);
      },
      (error) => {
        console.warn('Firestore expenses subscription error:', error);
      }
    );
  } catch (err) {
    console.warn('Failed to subscribe expenses:', err);
    return () => {};
  }
}

/**
 * Real-time listener for events
 */
export function subscribeEvents(onUpdate: (events: WeddingEventCategory[]) => void): Unsubscribe {
  try {
    const q = query(collection(db, EVENTS_COLLECTION));
    return onSnapshot(
      q,
      (snapshot) => {
        const events: WeddingEventCategory[] = [];
        snapshot.forEach((docSnap) => {
          events.push({ ...(docSnap.data() as WeddingEventCategory), id: docSnap.id });
        });
        events.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        onUpdate(events);
      },
      (error) => {
        console.warn('Firestore events subscription error:', error);
      }
    );
  } catch (err) {
    console.warn('Failed to subscribe events:', err);
    return () => {};
  }
}

/**
 * Real-time listener for wedding profile
 */
export function subscribeProfile(onUpdate: (profile: WeddingProfile) => void): Unsubscribe {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, PROFILE_DOC_ID);
    return onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          onUpdate(docSnap.data() as WeddingProfile);
        }
      },
      (error) => {
        console.warn('Firestore profile subscription error:', error);
      }
    );
  } catch (err) {
    console.warn('Failed to subscribe profile:', err);
    return () => {};
  }
}

/**
 * Save / Update Task in Firestore
 */
export async function saveTaskToDb(task: TodoTask): Promise<void> {
  try {
    const docRef = doc(db, TASKS_COLLECTION, task.id);
    await setDoc(docRef, task, { merge: true });
  } catch (err) {
    console.warn('Error saving task to Firestore:', err);
  }
}

/**
 * Delete Task in Firestore
 */
export async function deleteTaskFromDb(taskId: string): Promise<void> {
  try {
    const docRef = doc(db, TASKS_COLLECTION, taskId);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('Error deleting task from Firestore:', err);
  }
}

/**
 * Save / Update Expense in Firestore
 */
export async function saveExpenseToDb(expense: Expense): Promise<void> {
  try {
    const docRef = doc(db, EXPENSES_COLLECTION, expense.id);
    await setDoc(docRef, expense, { merge: true });
  } catch (err) {
    console.warn('Error saving expense to Firestore:', err);
  }
}

/**
 * Delete Expense in Firestore
 */
export async function deleteExpenseFromDb(expenseId: string): Promise<void> {
  try {
    const docRef = doc(db, EXPENSES_COLLECTION, expenseId);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('Error deleting expense from Firestore:', err);
  }
}

/**
 * Save / Update Event in Firestore
 */
export async function saveEventToDb(event: WeddingEventCategory): Promise<void> {
  try {
    const docRef = doc(db, EVENTS_COLLECTION, event.id);
    await setDoc(docRef, event, { merge: true });
  } catch (err) {
    console.warn('Error saving event to Firestore:', err);
  }
}

/**
 * Delete Event in Firestore
 */
export async function deleteEventFromDb(eventId: string): Promise<void> {
  try {
    const docRef = doc(db, EVENTS_COLLECTION, eventId);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('Error deleting event from Firestore:', err);
  }
}

/**
 * Save Profile to Firestore
 */
export async function saveProfileToDb(profile: WeddingProfile): Promise<void> {
  try {
    const docRef = doc(db, SETTINGS_COLLECTION, PROFILE_DOC_ID);
    await setDoc(docRef, profile, { merge: true });
  } catch (err) {
    console.warn('Error saving profile to Firestore:', err);
  }
}

/**
 * Batch reset / wipe all tasks, expenses, events, and timelines in Firestore
 */
export async function wipeAllDataInDb(): Promise<void> {
  try {
    const batch = writeBatch(db);

    // Get all tasks
    const tasksSnap = await getDocs(collection(db, TASKS_COLLECTION));
    tasksSnap.forEach((d) => batch.delete(d.ref));

    // Get all expenses
    const expensesSnap = await getDocs(collection(db, EXPENSES_COLLECTION));
    expensesSnap.forEach((d) => batch.delete(d.ref));

    // Get all timelines
    const timelineSnap = await getDocs(collection(db, TIMELINE_COLLECTION));
    timelineSnap.forEach((d) => batch.delete(d.ref));

    await batch.commit();
  } catch (err) {
    console.warn('Error wiping data in Firestore:', err);
  }
}

/**
 * Batch load template data into Firestore
 */
export async function loadTemplateToDb(
  tasks: TodoTask[],
  expenses: Expense[],
  events: WeddingEventCategory[],
  profile: WeddingProfile,
  timelines?: TimelineLine[]
): Promise<void> {
  try {
    // 1. Wipe existing
    await wipeAllDataInDb();

    // 2. Batch write new items
    const batch = writeBatch(db);

    events.forEach((ev) => {
      batch.set(doc(db, EVENTS_COLLECTION, ev.id), ev);
    });

    tasks.forEach((tsk) => {
      batch.set(doc(db, TASKS_COLLECTION, tsk.id), tsk);
    });

    expenses.forEach((exp) => {
      batch.set(doc(db, EXPENSES_COLLECTION, exp.id), exp);
    });

    if (timelines) {
      timelines.forEach((tl) => {
        batch.set(doc(db, TIMELINE_COLLECTION, tl.id), tl);
      });
    }

    batch.set(doc(db, SETTINGS_COLLECTION, PROFILE_DOC_ID), profile);

    await batch.commit();
  } catch (err) {
    console.warn('Error loading template to Firestore:', err);
  }
}
