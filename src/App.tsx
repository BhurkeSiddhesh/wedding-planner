import React, { useState } from 'react';
import { WeddingProvider } from './context/WeddingContext';
import { Header } from './components/Header';
import { Navigation, ActiveTab } from './components/Navigation';
import { EventTimelineBar } from './components/Timeline/EventTimelineBar';
import { TodoListManager } from './components/TodoList/TodoListManager';
import { ExpenseManager } from './components/Expenses/ExpenseManager';

// Modals
import { TaskModal } from './components/TodoList/TaskModal';
import { ExpenseModal } from './components/Expenses/ExpenseModal';
import { SettingsModal } from './components/Modals/SettingsModal';
import { PrintDossierModal } from './components/Modals/PrintDossierModal';
import { TodoTask, Expense } from './types/wedding';

function WeddingAppContent() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('todo');

  // Task Modal States
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TodoTask | null>(null);
  const [taskDefaultEventId, setTaskDefaultEventId] = useState<string | undefined>(undefined);

  // Expense Modal States
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [expenseDefaultEventId, setExpenseDefaultEventId] = useState<string | undefined>(undefined);

  // Global Tool Modals
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPrintDossierOpen, setIsPrintDossierOpen] = useState(false);

  // Task Modal Handlers
  const handleOpenAddTask = (defaultEventId?: string) => {
    setEditingTask(null);
    setTaskDefaultEventId(defaultEventId);
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task: TodoTask) => {
    setEditingTask(task);
    setTaskDefaultEventId(task.eventId);
    setIsTaskModalOpen(true);
  };

  // Expense Modal Handlers
  const handleOpenAddExpense = (defaultEventId?: string) => {
    setEditingExpense(null);
    setExpenseDefaultEventId(defaultEventId);
    setIsExpenseModalOpen(true);
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setExpenseDefaultEventId(expense.eventId);
    setIsExpenseModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#fdfaf5] text-[#2d2d2d] flex flex-col font-sans selection:bg-[#6b1d1d] selection:text-[#ffffff]">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      {/* Top Header with Couple Info & Quick Actions */}
      <Header
        onOpenSettings={() => setIsSettingsOpen(true)}
        onPrintDossier={() => setIsPrintDossierOpen(true)}
      />

      {/* 3-Page Navigation: Timelines & Schedule, To-Do List & Event Expense Tracker */}
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main id="main-content" tabIndex={-1} className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-6 pt-3.5 pb-12 flex-1 w-full">
        {activeTab === 'timeline' && <EventTimelineBar />}

        {activeTab === 'todo' && (
          <TodoListManager
            onOpenAddTask={handleOpenAddTask}
            onEditTask={handleEditTask}
          />
        )}

        {activeTab === 'expenses' && (
          <ExpenseManager
            onOpenAddExpense={handleOpenAddExpense}
            onEditExpense={handleEditExpense}
          />
        )}
      </main>

      {/* Traditional Footer */}
      <footer className="bg-[#240a0a] text-amber-200/70 py-3.5 border-t border-[#d4af37]/30 text-xs text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-serif-marathi text-[#faecd0]">
            ॥ शुभमंगल सावधान ॥ — Simple Marathi Wedding To-Do & Event Expense Split Planner
          </p>
          <p className="text-amber-300/60 text-[11px]">
            Ceremony-Centric Cost Tracking • Groom (Var Paksha) • Bride (Vadhu Paksha) • 50:50 Shared
          </p>
        </div>
      </footer>

      {/* Modals */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        taskToEdit={editingTask}
        defaultEventId={taskDefaultEventId}
      />

      <ExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => {
          setIsExpenseModalOpen(false);
          setEditingExpense(null);
        }}
        expenseToEdit={editingExpense}
        defaultEventId={expenseDefaultEventId}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <PrintDossierModal
        isOpen={isPrintDossierOpen}
        onClose={() => setIsPrintDossierOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <WeddingProvider>
      <WeddingAppContent />
    </WeddingProvider>
  );
}
