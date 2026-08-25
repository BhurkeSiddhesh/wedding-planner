import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WeddingProvider, useWedding } from './context/WeddingContext';
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
import { OnboardingSetupModal } from './components/Modals/OnboardingSetupModal';
import { InvitePartnerModal } from './components/Modals/InvitePartnerModal';
import { TodoTask, Expense } from './types/wedding';
import { Sparkles, Calendar, Clock, MapPin, Plus, BookOpen, UserPlus, Heart, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

function WeddingAppContent() {
  const { profile, tasks, expenses, loadMarathiTemplate } = useWedding();
  const { currentUser, userRole } = useAuth();
  const [activeTab, setActiveTab] = useState<ActiveTab>('todo');

  // Onboarding modal check
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isInvitePartnerOpen, setIsInvitePartnerOpen] = useState(false);

  useEffect(() => {
    // If not setup yet, prompt onboarding
    const isSetupDone = localStorage.getItem('wedding_setup_done');
    if (!isSetupDone && !profile.isSetupCompleted) {
      setIsOnboardingOpen(true);
    }
  }, [profile.isSetupCompleted]);

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
  const [isLoadingTemplate, setIsLoadingTemplate] = useState(false);

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

  const handleLoadTemplate = async () => {
    setIsLoadingTemplate(true);
    await loadMarathiTemplate();
    setIsLoadingTemplate(false);
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
  };

  const isCleanSlate = tasks.length === 0;

  return (
    <div className="min-h-screen bg-[#fdfaf5] text-[#2d2d2d] flex flex-col font-sans selection:bg-[#6b1d1d] selection:text-[#ffffff]">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      {/* Top Header with Couple Info & Quick Actions */}
      <Header
        onOpenSettings={() => setIsSettingsOpen(true)}
        onPrintDossier={() => setIsPrintDossierOpen(true)}
      />

      {/* Clean Slate Landing Banner (if no tasks created yet) */}
      {isCleanSlate && (
        <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-6 pt-4 w-full">
          <div className="bg-gradient-to-r from-[#4a0e0e] via-[#6b1d1d] to-[#8c2525] text-white rounded-2xl p-5 sm:p-6 shadow-md border border-[#d4af37]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-400/20 text-amber-200 border border-amber-300/30">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Clean Slate Wedding Planner Ready</span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-amber-100 flex items-center gap-2">
                <span>{profile.brideName}</span>
                <Heart className="w-4 h-4 text-rose-400 fill-rose-400 inline" />
                <span>{profile.groomName}</span>
              </h2>
              <div className="flex flex-wrap items-center gap-3 text-xs text-amber-200/90 pt-0.5">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-300" />
                  {profile.weddingDate ? new Date(profile.weddingDate).toLocaleDateString('en-IN', { dateStyle: 'full' }) : 'Date not set'}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-300" />
                  {profile.mahuratTime}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-300" />
                  {profile.mainKaryalaya}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handleOpenAddTask()}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[#6b1d1d] bg-white hover:bg-stone-100 transition shadow-xs flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5 text-[#6b1d1d]" />
                <span>+ Add First Task</span>
              </button>

              <button
                type="button"
                disabled={isLoadingTemplate}
                onClick={handleLoadTemplate}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-amber-100 bg-amber-400/20 hover:bg-amber-400/30 border border-amber-300/40 transition flex items-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-300" />
                <span>{isLoadingTemplate ? 'Loading...' : 'Load Marathi Template'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsInvitePartnerOpen(true)}
                className="px-3 py-2 rounded-xl text-xs font-medium text-white/90 hover:text-white bg-white/10 hover:bg-white/20 transition flex items-center gap-1"
                title="Invite partner"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Invite {userRole === 'groom' ? 'Bride' : 'Groom'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

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
            ॥ शुभमंगल सावधान ॥ — Marathi Wedding To-Do, Quantities & Event Expense Split Planner
          </p>
          <p className="text-amber-300/60 text-[11px]">
            Groom (Var Paksha) & Bride (Vadhu Paksha) Real-time Shared Planner
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

      <OnboardingSetupModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
      />

      <InvitePartnerModal
        isOpen={isInvitePartnerOpen}
        onClose={() => setIsInvitePartnerOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <WeddingProvider>
        <WeddingAppContent />
      </WeddingProvider>
    </AuthProvider>
  );
}

