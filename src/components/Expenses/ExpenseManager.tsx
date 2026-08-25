import React, { useState, useMemo } from 'react';
import { useWedding } from '../../context/WeddingContext';
import { Expense, MainExpenseCategory, PayerType, WeddingEventCategory } from '../../types/wedding';
import { formatINR } from '../../utils/calculations';
import {
  Receipt,
  Plus,
  ArrowRightLeft,
  Phone,
  Trash2,
  Edit3,
  Search,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
  CalendarPlus,
  ShieldCheck,
  HeartHandshake
} from 'lucide-react';
import { EventModal } from '../Modals/EventModal';
import { ManageEventsModal } from '../Modals/ManageEventsModal';

interface ExpenseManagerProps {
  onOpenAddExpense: (defaultEventId?: string) => void;
  onEditExpense: (expense: Expense) => void;
}

export const ExpenseManager: React.FC<ExpenseManagerProps> = ({
  onOpenAddExpense,
  onEditExpense,
}) => {
  const {
    expenses,
    eventCategories,
    budgetSummary,
    deleteExpense,
    updateExpense,
  } = useWedding();

  const [filterPayer, setFilterPayer] = useState<string>('all');
  const [filterEvent, setFilterEvent] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [collapsedEvents, setCollapsedEvents] = useState<{ [key: string]: boolean }>({});

  // Ceremony Modal States
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isManageEventsModalOpen, setIsManageEventsModalOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<WeddingEventCategory | null>(null);

  const categoryLabels: { [key in MainExpenseCategory]: { name: string; icon: string } } = {
    hall_venue: { name: 'Venue & Hall', icon: '🏛️' },
    catering_pangat: { name: 'Pangat & Catering', icon: '🍲' },
    decor_mandap: { name: 'Mandap & Decor', icon: '🌸' },
    photography_drone: { name: 'Photo & Video', icon: '📸' },
    gifts_paithani_gold: { name: 'Gold, Paithani & Aher', icon: '👑' },
    makeup_nauvari_styling: { name: 'Nauvari & Styling', icon: '💄' },
    sound_dhol_tasha: { name: 'Dhol Tasha & Sanai', icon: '🥁' },
    transport_hotel: { name: 'Bus & Travel', icon: '🚌' },
    invitations_patrika: { name: 'Patrika & Cards', icon: '📜' },
    ritual_samagri: { name: 'Puja Samagri', icon: '🪔' },
    miscellaneous: { name: 'Miscellaneous', icon: '📦' },
  };

  // Filtered Expenses
  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      const matchesSearch =
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (e.vendorName && e.vendorName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (e.billNumber && e.billNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (e.notes && e.notes.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesPayer = filterPayer === 'all' || e.paidBy === filterPayer;
      const matchesEvent = filterEvent === 'all' || (e.eventId || 'general_venue') === filterEvent;
      const matchesStatus = filterStatus === 'all' || e.paymentStatus === filterStatus;

      return matchesSearch && matchesPayer && matchesEvent && matchesStatus;
    });
  }, [expenses, searchQuery, filterPayer, filterEvent, filterStatus]);

  // Group expenses by Event ID
  const expensesByEvent = useMemo(() => {
    const map = new Map<string, Expense[]>();

    eventCategories.forEach((event) => {
      map.set(event.id, []);
    });
    map.set('general_venue', []);

    filteredExpenses.forEach((exp) => {
      const eId = exp.eventId || 'general_venue';
      if (!map.has(eId)) {
        map.set(eId, []);
      }
      map.get(eId)!.push(exp);
    });

    return map;
  }, [filteredExpenses, eventCategories]);

  const handleMarkFullyPaid = (expense: Expense) => {
    const total = expense.actualCost > 0 ? expense.actualCost : expense.estimatedCost;
    updateExpense(expense.id, {
      paymentStatus: 'paid',
      paidAmount: total,
    });
  };

  const toggleEventCollapse = (eventId: string) => {
    setCollapsedEvents((prev) => ({
      ...prev,
      [eventId]: !prev[eventId],
    }));
  };

  return (
    <div className="space-y-5 font-sans-google max-w-7xl mx-auto" id="expense-tracker-page">
      
      {/* 1. Master Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl p-4 border border-stone-200 shadow-xs">
          <span className="text-[11px] font-medium text-stone-500 block uppercase tracking-wider">Total Wedding Spend</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-stone-900">{formatINR(budgetSummary.totalActual)}</span>
          </div>
          <span className="text-xs text-stone-400 mt-0.5 block">Estimated: {formatINR(budgetSummary.totalEstimated)}</span>
        </div>

        <div className="bg-white rounded-xl p-4 border border-stone-200 shadow-xs">
          <span className="text-[11px] font-medium text-blue-700 block uppercase tracking-wider">🤵 Groom (Var Paksha)</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-blue-900">{formatINR(budgetSummary.groomPaidOutPocket)}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-stone-500 mt-0.5">
            <span>Own: {formatINR(budgetSummary.groomExclusiveCost)}</span>
            <span>Share: {formatINR(budgetSummary.groomResponsibleShare)}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-stone-200 shadow-xs">
          <span className="text-[11px] font-medium text-rose-700 block uppercase tracking-wider">👰 Bride (Vadhu Paksha)</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-rose-900">{formatINR(budgetSummary.bridePaidOutPocket)}</span>
          </div>
          <div className="flex items-center justify-between text-xs text-stone-500 mt-0.5">
            <span>Own: {formatINR(budgetSummary.brideExclusiveCost)}</span>
            <span>Share: {formatINR(budgetSummary.brideResponsibleShare)}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-stone-200 shadow-xs">
          <span className="text-[11px] font-medium text-amber-700 block uppercase tracking-wider">🤝 Shared Pool</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-amber-900">{formatINR(budgetSummary.sharedTotalCost)}</span>
          </div>
          <span className="text-xs text-stone-500 mt-0.5 block">Split between families via Splitwise</span>
        </div>
      </div>

      {/* 2. Clean Settlement Equalizer Banner */}
      <div className="bg-stone-900 text-white rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
            <ArrowRightLeft className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <span className="text-[10px] font-bold tracking-widest text-amber-400 uppercase">Splitwise Equalizer</span>
            <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
              {budgetSummary.settlementAmount === 0
                ? 'All shared accounts are perfectly balanced (₹0 owed).'
                : budgetSummary.settlementPayer === 'bride'
                ? `Vadhu Paksha (Bride) owes Var Paksha (Groom) ${formatINR(budgetSummary.settlementAmount)}`
                : `Var Paksha (Groom) owes Vadhu Paksha (Bride) ${formatINR(budgetSummary.settlementAmount)}`}
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              Only shared wedding expenses are split. Respective groom and bride personal expenses are borne directly by each family and not owed to one another.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setEventToEdit(null);
              setIsEventModalOpen(true);
            }}
            className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg transition border border-white/20 flex items-center gap-1.5 shrink-0"
          >
            <CalendarPlus className="w-3.5 h-3.5 text-amber-400" />
            <span>+ Add Ceremony / Day</span>
          </button>

          <button
            onClick={() => onOpenAddExpense()}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold rounded-lg transition shadow-xs flex items-center justify-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Expense</span>
          </button>
        </div>
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
            placeholder="Search expenses, vendors, bills, notes..."
            className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-white border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7a1c1c]/20 text-stone-900 placeholder:text-stone-400"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setFilterPayer('all')}
            className={`px-3 py-1 text-xs font-medium rounded-full transition ${
              filterPayer === 'all'
                ? 'bg-stone-900 text-white'
                : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
          >
            All Payers
          </button>
          <button
            onClick={() => setFilterPayer('groom')}
            className={`px-3 py-1 text-xs font-medium rounded-full transition ${
              filterPayer === 'groom'
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-stone-200 text-blue-700 hover:bg-blue-50'
            }`}
          >
            🤵 Groom Paid
          </button>
          <button
            onClick={() => setFilterPayer('bride')}
            className={`px-3 py-1 text-xs font-medium rounded-full transition ${
              filterPayer === 'bride'
                ? 'bg-rose-600 text-white'
                : 'bg-white border border-stone-200 text-rose-700 hover:bg-rose-50'
            }`}
          >
            👰 Bride Paid
          </button>
          <button
            onClick={() => setFilterPayer('shared')}
            className={`px-3 py-1 text-xs font-medium rounded-full transition ${
              filterPayer === 'shared'
                ? 'bg-amber-700 text-white'
                : 'bg-white border border-stone-200 text-amber-800 hover:bg-amber-50'
            }`}
          >
            🤝 Shared Paid
          </button>

          <span className="text-stone-300 mx-1">|</span>

          <button
            onClick={() => setFilterStatus(filterStatus === 'pending' ? 'all' : 'pending')}
            className={`px-3 py-1 text-xs font-medium rounded-full transition ${
              filterStatus === 'pending'
                ? 'bg-amber-600 text-white'
                : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilterStatus(filterStatus === 'paid' ? 'all' : 'paid')}
            className={`px-3 py-1 text-xs font-medium rounded-full transition ${
              filterStatus === 'paid'
                ? 'bg-emerald-600 text-white'
                : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
          >
            Paid
          </button>
        </div>
      </div>

      {/* 4. Ceremony Expense Groups */}
      {expenses.length === 0 ? (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-3">
            <Layers className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-stone-800">No expenses recorded</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1">
            Expenses added with costs in the To-Do List appear here automatically, or click "Add Expense" above.
          </p>
        </div>
      ) : filteredExpenses.length === 0 ? (
        <div className="bg-white rounded-xl border border-stone-200 p-10 text-center">
          <div className="w-10 h-10 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-2">
            <Search className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-semibold text-stone-800">No matching expenses found</h3>
          <p className="text-xs text-stone-500 mt-1">
            Try adjusting your search query or filter selections.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {eventCategories.map((event) => {
            const eventExpenses = expensesByEvent.get(event.id) || [];
            if (filterEvent !== 'all' && filterEvent !== event.id) return null;
            // Keep UI clean: only render event if it has expenses
            if (eventExpenses.length === 0) return null;

            const isCollapsed = collapsedEvents[event.id];
            const eventTotal = eventExpenses.reduce((s, e) => s + (e.actualCost > 0 ? e.actualCost : e.estimatedCost), 0);
            const eventPaid = eventExpenses.reduce((s, e) => s + (e.paidAmount || 0), 0);

            return (
              <div
                key={event.id}
                className="bg-white rounded-xl border border-stone-200 shadow-xs overflow-hidden transition"
              >
                {/* Ceremony Section Header */}
                <div
                  onClick={() => toggleEventCollapse(event.id)}
                  className="flex items-center justify-between px-4 py-3 bg-stone-50/60 hover:bg-stone-50 cursor-pointer select-none border-b border-stone-100"
                >
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      className="text-stone-400 hover:text-stone-600 p-0.5"
                    >
                      {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                    </button>
                    <div>
                      <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                        <span>{event.name}</span>
                        <span className="text-xs font-normal text-stone-500 font-devanagari">
                          ({event.marathiName})
                        </span>
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-stone-900 bg-stone-100 px-2 py-0.5 rounded-md border border-stone-200">
                      Total: {formatINR(eventTotal)}
                    </span>

                    <span className="text-xs font-medium text-stone-500 hidden sm:inline">
                      Paid: {formatINR(eventPaid)}
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenAddExpense(event.id);
                      }}
                      className="p-1 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-200 transition"
                      title="Add expense to this ceremony"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Expense Items List */}
                {!isCollapsed && (
                  <div className="divide-y divide-stone-100">
                    {eventExpenses.length === 0 ? (
                      <div className="py-4 text-center text-xs text-stone-400 italic">
                        No expenses in this ceremony. Click + to add one.
                      </div>
                    ) : (
                      eventExpenses.map((expense) => {
                        const cost = expense.actualCost > 0 ? expense.actualCost : expense.estimatedCost;
                        const categoryInfo = categoryLabels[expense.category] || { name: 'Expense', icon: '📦' };

                        return (
                          <div
                            key={expense.id}
                            className="flex items-start justify-between px-4 py-3 hover:bg-stone-50/80 transition group"
                          >
                            {/* Left: Info */}
                            <div className="flex items-start gap-3 flex-1 min-w-0 pr-3">
                              <span className="text-lg shrink-0 mt-0.5">{categoryInfo.icon}</span>

                              <div className="min-w-0 flex-1">
                                <div className="flex items-baseline flex-wrap gap-x-2 gap-y-0.5">
                                  <span className="text-xs sm:text-sm font-semibold text-stone-900">
                                    {expense.title}
                                  </span>
                                  <span className="text-xs text-stone-500">
                                    • {categoryInfo.name}
                                  </span>
                                </div>

                                {/* Metadata tags */}
                                <div className="flex items-center flex-wrap gap-1.5 mt-1 text-[11px]">
                                  {/* Respective vs Shared Tag */}
                                  {expense.splitRule === '100_groom' ? (
                                    <span className="px-2 py-0.5 rounded font-semibold bg-blue-50 text-blue-800 border border-blue-200 flex items-center gap-1">
                                      <ShieldCheck className="w-3 h-3 text-blue-600" />
                                      <span>🤵 Groom Only (Var Paksha) • Not Owed</span>
                                    </span>
                                  ) : expense.splitRule === '100_bride' ? (
                                    <span className="px-2 py-0.5 rounded font-semibold bg-rose-50 text-rose-800 border border-rose-200 flex items-center gap-1">
                                      <HeartHandshake className="w-3 h-3 text-rose-600" />
                                      <span>👰 Bride Only (Vadhu Paksha) • Not Owed</span>
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 rounded font-semibold bg-amber-50 text-amber-900 border border-amber-200 flex items-center gap-1">
                                      <ArrowRightLeft className="w-3 h-3 text-amber-700" />
                                      <span>
                                        🤝 Shared • Paid by {expense.paidBy === 'groom' ? '🤵 Groom' : expense.paidBy === 'bride' ? '👰 Bride' : '50:50'}
                                      </span>
                                    </span>
                                  )}

                                  {/* Split Rule description if custom ratio */}
                                  {expense.splitRule === 'custom_ratio' && (
                                    <span className="px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 border border-stone-200">
                                      Ratio: {expense.groomSharePercent}% Groom / {expense.brideSharePercent}% Bride
                                    </span>
                                  )}

                                  {/* Payment status badge */}
                                  <button
                                    type="button"
                                    onClick={() => handleMarkFullyPaid(expense)}
                                    className={`px-1.5 py-0.5 rounded font-medium flex items-center gap-1 transition ${
                                      expense.paymentStatus === 'paid'
                                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                        : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                                    }`}
                                  >
                                    {expense.paymentStatus === 'paid' ? (
                                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                    ) : (
                                      <Clock className="w-3 h-3 text-amber-600" />
                                    )}
                                    <span className="capitalize">{expense.paymentStatus}</span>
                                  </button>

                                  {/* Linked to To-Do task tag */}
                                  {expense.linkedTaskId && (
                                    <span className="text-[10px] text-stone-400 italic">
                                      (Linked with To-Do)
                                    </span>
                                  )}

                                  {/* Vendor details */}
                                  {expense.vendorName && (
                                    <span className="text-stone-500">
                                      Vendor: {expense.vendorName}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Right: Cost & Actions */}
                            <div className="flex items-center gap-3 shrink-0">
                              <div className="text-right">
                                <span className="text-xs sm:text-sm font-bold text-stone-900 block">
                                  {formatINR(cost)}
                                </span>
                                {expense.paymentStatus !== 'paid' && expense.paidAmount > 0 && (
                                  <span className="text-[10px] text-stone-500 block">
                                    Paid: {formatINR(expense.paidAmount)}
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                                <button
                                  type="button"
                                  onClick={() => onEditExpense(expense)}
                                  className="p-1 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded transition"
                                  title="Edit Expense"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => deleteExpense(expense.id)}
                                  className="p-1 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded transition"
                                  title="Delete Expense & Unlink To-Do"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
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
