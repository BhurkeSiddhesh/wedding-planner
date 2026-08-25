import React, { useState, useEffect } from 'react';
import { useWedding } from '../../context/WeddingContext';
import { Expense, MainExpenseCategory, SplitRule, PayerType, PaymentStatus } from '../../types/wedding';
import { formatINR } from '../../utils/calculations';
import { X, Save, ArrowRightLeft, CheckCircle2, ShieldCheck, HeartHandshake } from 'lucide-react';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  expenseToEdit?: Expense | null;
  defaultEventId?: string;
}

export const ExpenseModal: React.FC<ExpenseModalProps> = ({
  isOpen,
  onClose,
  expenseToEdit,
  defaultEventId,
}) => {
  const { eventCategories, addExpense, updateExpense } = useWedding();

  const [title, setTitle] = useState('');
  const [eventId, setEventId] = useState(defaultEventId || eventCategories[0]?.id || 'general_venue');
  const [category, setCategory] = useState<MainExpenseCategory>('hall_venue');
  const [amount, setAmount] = useState('');
  
  // Expense Nature: 'shared' | 'groom_exclusive' | 'bride_exclusive'
  const [expenseNature, setExpenseNature] = useState<'shared' | 'groom_exclusive' | 'bride_exclusive'>('shared');
  
  // Who paid upfront for shared expenses: 'groom' | 'bride' | 'shared'
  const [sharedPaidBy, setSharedPaidBy] = useState<'groom' | 'bride' | 'shared'>('groom');
  
  // Split rule & custom percentages
  const [splitRatioType, setSplitRatioType] = useState<'50_50' | 'custom'>('50_50');
  const [groomSharePercent, setGroomSharePercent] = useState<number>(50);
  const [brideSharePercent, setBrideSharePercent] = useState<number>(50);

  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('paid');
  const [vendorName, setVendorName] = useState('');
  const [vendorPhone, setVendorPhone] = useState('');
  const [billNumber, setBillNumber] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (expenseToEdit) {
      setTitle(expenseToEdit.title);
      setEventId(expenseToEdit.eventId || defaultEventId || 'general_venue');
      setCategory(expenseToEdit.category);
      const val = expenseToEdit.actualCost > 0 ? expenseToEdit.actualCost : expenseToEdit.estimatedCost;
      setAmount(val ? val.toString() : '');
      
      if (expenseToEdit.splitRule === '100_groom') {
        setExpenseNature('groom_exclusive');
        setSharedPaidBy('groom');
      } else if (expenseToEdit.splitRule === '100_bride') {
        setExpenseNature('bride_exclusive');
        setSharedPaidBy('bride');
      } else {
        setExpenseNature('shared');
        setSharedPaidBy((expenseToEdit.paidBy as 'groom' | 'bride' | 'shared') || 'groom');
        if (expenseToEdit.splitRule === 'custom_ratio') {
          setSplitRatioType('custom');
          setGroomSharePercent(expenseToEdit.groomSharePercent ?? 50);
          setBrideSharePercent(expenseToEdit.brideSharePercent ?? 50);
        } else {
          setSplitRatioType('50_50');
          setGroomSharePercent(50);
          setBrideSharePercent(50);
        }
      }

      setPaymentStatus(expenseToEdit.paymentStatus);
      setVendorName(expenseToEdit.vendorName || '');
      setVendorPhone(expenseToEdit.vendorPhone || '');
      setBillNumber(expenseToEdit.billNumber || '');
      setNotes(expenseToEdit.notes || '');
    } else {
      setTitle('');
      setEventId(defaultEventId || eventCategories[0]?.id || 'general_venue');
      setCategory('hall_venue');
      setAmount('');
      setExpenseNature('shared');
      setSharedPaidBy('groom');
      setSplitRatioType('50_50');
      setGroomSharePercent(50);
      setBrideSharePercent(50);
      setPaymentStatus('paid');
      setVendorName('');
      setVendorPhone('');
      setBillNumber('');
      setNotes('');
    }
  }, [expenseToEdit, defaultEventId, eventCategories, isOpen]);

  if (!isOpen) return null;

  const costNum = parseFloat(amount) || 0;

  // Derive split outcomes for dynamic preview
  const groomRatio = expenseNature === 'groom_exclusive' ? 1 : expenseNature === 'bride_exclusive' ? 0 : (splitRatioType === '50_50' ? 0.5 : groomSharePercent / 100);
  const brideRatio = 1 - groomRatio;
  const groomShareAmount = costNum * groomRatio;
  const brideShareAmount = costNum * brideRatio;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    let finalPaidBy: PayerType = 'shared';
    let finalSplitRule: SplitRule = '50_50_shared';
    let finalGroomShare = 50;
    let finalBrideShare = 50;

    if (expenseNature === 'groom_exclusive') {
      finalPaidBy = 'groom';
      finalSplitRule = '100_groom';
      finalGroomShare = 100;
      finalBrideShare = 0;
    } else if (expenseNature === 'bride_exclusive') {
      finalPaidBy = 'bride';
      finalSplitRule = '100_bride';
      finalGroomShare = 0;
      finalBrideShare = 100;
    } else {
      // Shared expense
      finalPaidBy = sharedPaidBy;
      if (splitRatioType === 'custom') {
        finalSplitRule = 'custom_ratio';
        finalGroomShare = groomSharePercent;
        finalBrideShare = brideSharePercent;
      } else {
        finalSplitRule = '50_50_shared';
        finalGroomShare = 50;
        finalBrideShare = 50;
      }
    }

    const payload = {
      title: title.trim(),
      eventId,
      category,
      estimatedCost: costNum,
      actualCost: costNum,
      paidBy: finalPaidBy,
      splitRule: finalSplitRule,
      groomSharePercent: finalGroomShare,
      brideSharePercent: finalBrideShare,
      paymentStatus,
      paidAmount: paymentStatus === 'paid' ? costNum : (paymentStatus === 'pending' ? 0 : costNum / 2),
      vendorName: vendorName.trim() || undefined,
      vendorPhone: vendorPhone.trim() || undefined,
      billNumber: billNumber.trim() || undefined,
      notes: notes.trim() || undefined,
    };

    if (expenseToEdit) {
      updateExpense(expenseToEdit.id, payload);
    } else {
      addExpense(payload);
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
              {expenseToEdit ? 'Edit Wedding Expense' : 'Add Wedding Expense'}
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Splitwise settlement equalizer & ceremony expense tracking
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
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-stone-800 mb-1">
              Expense Item Title <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Alankar Mangal Karyalaya Hall Rent & Deposit"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-200 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#7a1c1c]/20 font-medium"
            />
          </div>

          {/* Ceremony & Category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">
                Ceremony Event
              </label>
              <select
                value={eventId}
                onChange={(e) => setEventId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-200 text-stone-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#7a1c1c]/20"
              >
                {eventCategories.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as MainExpenseCategory)}
                className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-200 text-stone-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#7a1c1c]/20"
              >
                <option value="hall_venue">🏛️ Venue & Hall</option>
                <option value="catering_pangat">🍲 Pangat & Catering</option>
                <option value="decor_mandap">🌸 Mandap & Decor</option>
                <option value="photography_drone">📸 Photo & Video</option>
                <option value="gifts_paithani_gold">👑 Gold, Paithani & Aher</option>
                <option value="makeup_nauvari_styling">💄 Nauvari & Styling</option>
                <option value="sound_dhol_tasha">🥁 Dhol Tasha & Sanai</option>
                <option value="transport_hotel">🚌 Bus & Travel</option>
                <option value="invitations_patrika">📜 Patrika & Cards</option>
                <option value="ritual_samagri">🪔 Puja Samagri</option>
                <option value="miscellaneous">📦 Miscellaneous</option>
              </select>
            </div>
          </div>

          {/* Amount & Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">
                Amount (₹) <span className="text-rose-600">*</span>
              </label>
              <input
                type="number"
                required
                min="0"
                placeholder="e.g. 50000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-200 text-stone-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#7a1c1c]/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">
                Payment Status
              </label>
              <select
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
                className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-200 text-stone-900 font-medium focus:outline-none focus:ring-2 focus:ring-[#7a1c1c]/20"
              >
                <option value="paid">✅ Fully Paid</option>
                <option value="partial">⏳ Partially Paid</option>
                <option value="pending">⚠️ Pending Payment</option>
              </select>
            </div>
          </div>

          {/* Step 1: Expense Nature Selector */}
          <div>
            <label className="block text-xs font-semibold text-stone-800 mb-1.5 flex items-center gap-1.5">
              <span>Expense Type & Ownership</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setExpenseNature('shared')}
                className={`py-2 px-2 rounded-lg font-semibold border text-center transition ${
                  expenseNature === 'shared'
                    ? 'bg-amber-100 text-amber-950 border-amber-400 shadow-xs ring-1 ring-amber-400'
                    : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                }`}
              >
                🤝 Shared Expense
                <span className="block text-[10px] font-normal text-amber-800 mt-0.5">Splitwise equalizing</span>
              </button>

              <button
                type="button"
                onClick={() => setExpenseNature('groom_exclusive')}
                className={`py-2 px-2 rounded-lg font-semibold border text-center transition ${
                  expenseNature === 'groom_exclusive'
                    ? 'bg-blue-100 text-blue-950 border-blue-400 shadow-xs ring-1 ring-blue-400'
                    : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                }`}
              >
                🤵 Groom Only
                <span className="block text-[10px] font-normal text-blue-800 mt-0.5">Var Paksha direct</span>
              </button>

              <button
                type="button"
                onClick={() => setExpenseNature('bride_exclusive')}
                className={`py-2 px-2 rounded-lg font-semibold border text-center transition ${
                  expenseNature === 'bride_exclusive'
                    ? 'bg-rose-100 text-rose-950 border-rose-400 shadow-xs ring-1 ring-rose-400'
                    : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                }`}
              >
                👰 Bride Only
                <span className="block text-[10px] font-normal text-rose-800 mt-0.5">Vadhu Paksha direct</span>
              </button>
            </div>
          </div>

          {/* Conditional Splitwise Workflow Section */}
          {expenseNature === 'shared' ? (
            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                <ArrowRightLeft className="w-3.5 h-3.5 text-amber-700" />
                <span>Shared Expense Split Engine (Splitwise)</span>
              </div>

              {/* Who Paid Upfront? */}
              <div>
                <label className="block text-[11px] font-semibold text-stone-700 mb-1">
                  Who paid the money upfront for this shared expense?
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSharedPaidBy('groom')}
                    className={`py-1.5 px-2 rounded-lg font-semibold text-xs border text-center transition ${
                      sharedPaidBy === 'groom'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    🤵 Groom Paid
                  </button>

                  <button
                    type="button"
                    onClick={() => setSharedPaidBy('bride')}
                    className={`py-1.5 px-2 rounded-lg font-semibold text-xs border text-center transition ${
                      sharedPaidBy === 'bride'
                        ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                        : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    👰 Bride Paid
                  </button>

                  <button
                    type="button"
                    onClick={() => setSharedPaidBy('shared')}
                    className={`py-1.5 px-2 rounded-lg font-semibold text-xs border text-center transition ${
                      sharedPaidBy === 'shared'
                        ? 'bg-amber-700 text-white border-amber-700 shadow-xs'
                        : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    🤝 Both Paid 50:50
                  </button>
                </div>
              </div>

              {/* Split Ratio */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-semibold text-stone-700">
                    Split Responsibility
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSplitRatioType('50_50');
                        setGroomSharePercent(50);
                        setBrideSharePercent(50);
                      }}
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded transition ${
                        splitRatioType === '50_50' ? 'bg-amber-200 text-amber-900' : 'text-stone-500 hover:text-stone-800'
                      }`}
                    >
                      50:50 Equal
                    </button>
                    <button
                      type="button"
                      onClick={() => setSplitRatioType('custom')}
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded transition ${
                        splitRatioType === 'custom' ? 'bg-amber-200 text-amber-900' : 'text-stone-500 hover:text-stone-800'
                      }`}
                    >
                      Custom %
                    </button>
                  </div>
                </div>

                {splitRatioType === 'custom' && (
                  <div className="bg-white p-2.5 rounded-lg border border-stone-200 space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold text-stone-800">
                      <span>🤵 Groom: {groomSharePercent}% ({formatINR(groomShareAmount)})</span>
                      <span>👰 Bride: {brideSharePercent}% ({formatINR(brideShareAmount)})</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={groomSharePercent}
                      onChange={(e) => {
                        const g = parseInt(e.target.value) || 0;
                        setGroomSharePercent(g);
                        setBrideSharePercent(100 - g);
                      }}
                      className="w-full accent-amber-600"
                    />
                  </div>
                )}
              </div>

              {/* Interactive Settlement Impact Pill */}
              <div className="bg-white p-2.5 rounded-lg border border-amber-200 text-[11px] text-stone-700">
                <div className="font-semibold text-amber-950 flex items-center gap-1 mb-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Splitwise Debt Calculation:</span>
                </div>
                {sharedPaidBy === 'groom' ? (
                  <span>
                    Groom paid <strong className="text-stone-900">{formatINR(costNum)}</strong> upfront. <strong>Vadhu Paksha (Bride) owes Var Paksha (Groom) {formatINR(brideShareAmount)}</strong> for her share.
                  </span>
                ) : sharedPaidBy === 'bride' ? (
                  <span>
                    Bride paid <strong className="text-stone-900">{formatINR(costNum)}</strong> upfront. <strong>Var Paksha (Groom) owes Vadhu Paksha (Bride) {formatINR(groomShareAmount)}</strong> for his share.
                  </span>
                ) : (
                  <span>
                    Both families paid their respective shares directly ({formatINR(groomShareAmount)} Groom / {formatINR(brideShareAmount)} Bride). <strong>Neither family owes anything.</strong>
                  </span>
                )}
              </div>
            </div>
          ) : expenseNature === 'groom_exclusive' ? (
            <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-950 flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Groom Exclusive Expense (Var Paksha)</span>
                <p className="text-[11px] text-blue-800 mt-0.5">
                  This entire {formatINR(costNum || 0)} is Groom family's sole responsibility. <strong>It is NOT shared and not owed to/by the Bride family.</strong>
                </p>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200 text-xs text-rose-950 flex items-start gap-2">
              <HeartHandshake className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block">Bride Exclusive Expense (Vadhu Paksha)</span>
                <p className="text-[11px] text-rose-800 mt-0.5">
                  This entire {formatINR(costNum || 0)} is Bride family's sole responsibility. <strong>It is NOT shared and not owed to/by the Groom family.</strong>
                </p>
              </div>
            </div>
          )}

          {/* Vendor Details */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">
                Vendor / Shop Name
              </label>
              <input
                type="text"
                placeholder="e.g. Royal Mandap Caterers"
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-200 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#7a1c1c]/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-800 mb-1">
                Vendor Phone
              </label>
              <input
                type="text"
                placeholder="e.g. +91 98220 12345"
                value={vendorPhone}
                onChange={(e) => setVendorPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-200 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#7a1c1c]/20"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-stone-800 mb-1">
              Notes & Bill Details
            </label>
            <textarea
              rows={2}
              placeholder="Advance payment receipt, terms, payment due on muhurta day..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-stone-50 border border-stone-200 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#7a1c1c]/20"
            />
          </div>

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
              <span>{expenseToEdit ? 'Save Changes' : 'Add Expense'}</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
