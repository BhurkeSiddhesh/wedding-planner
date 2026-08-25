import React, { useState, useEffect } from 'react';
import { useWedding } from '../../context/WeddingContext';
import { Expense, MainExpenseCategory, ExpensePayer } from '../../types/wedding';
import { X, Receipt, ArrowRightLeft } from 'lucide-react';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialExpense?: Expense | null;
}

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({
  isOpen,
  onClose,
  initialExpense,
}) => {
  const { rituals, addExpense, updateExpense } = useWedding();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<MainExpenseCategory>('catering_pangat');
  const [ritualId, setRitualId] = useState<string>('');
  const [estimatedCost, setEstimatedCost] = useState<number>(50000);
  const [actualCost, setActualCost] = useState<number>(0);
  const [paidBy, setPaidBy] = useState<ExpensePayer>('shared');
  const [splitRule, setSplitRule] = useState<'50_50_shared' | '100_groom' | '100_bride' | 'custom_ratio'>('50_50_shared');
  const [groomSharePercent, setGroomSharePercent] = useState<number>(50);
  const [brideSharePercent, setBrideSharePercent] = useState<number>(50);
  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'partial' | 'pending'>('paid');
  const [paidAmount, setPaidAmount] = useState<number>(50000);
  const [vendorName, setVendorName] = useState('');
  const [vendorPhone, setVendorPhone] = useState('');
  const [billNumber, setBillNumber] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (initialExpense) {
      setTitle(initialExpense.title);
      setCategory(initialExpense.category);
      setRitualId(initialExpense.ritualId || '');
      setEstimatedCost(initialExpense.estimatedCost);
      setActualCost(initialExpense.actualCost);
      setPaidBy(initialExpense.paidBy);
      setSplitRule(initialExpense.splitRule as any);
      setGroomSharePercent(initialExpense.groomSharePercent || 50);
      setBrideSharePercent(initialExpense.brideSharePercent || 50);
      setPaymentStatus(initialExpense.paymentStatus);
      setPaidAmount(initialExpense.paidAmount || 0);
      setVendorName(initialExpense.vendorName || '');
      setVendorPhone(initialExpense.vendorPhone || '');
      setBillNumber(initialExpense.billNumber || '');
      setNotes(initialExpense.notes || '');
    } else {
      setTitle('');
      setCategory('catering_pangat');
      setRitualId('');
      setEstimatedCost(25000);
      setActualCost(0);
      setPaidBy('shared');
      setSplitRule('50_50_shared');
      setGroomSharePercent(50);
      setBrideSharePercent(50);
      setPaymentStatus('paid');
      setPaidAmount(25000);
      setVendorName('');
      setVendorPhone('');
      setBillNumber('');
      setNotes('');
    }
  }, [initialExpense, isOpen]);

  // Adjust split percentages when splitRule changes
  const handleSplitRuleChange = (rule: '50_50_shared' | '100_groom' | '100_bride' | 'custom_ratio') => {
    setSplitRule(rule);
    if (rule === '50_50_shared') {
      setGroomSharePercent(50);
      setBrideSharePercent(50);
    } else if (rule === '100_groom') {
      setGroomSharePercent(100);
      setBrideSharePercent(0);
      setPaidBy('groom');
    } else if (rule === '100_bride') {
      setGroomSharePercent(0);
      setBrideSharePercent(100);
      setPaidBy('bride');
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const finalActual = actualCost > 0 ? actualCost : estimatedCost;
    const finalPaid = paymentStatus === 'paid' ? finalActual : paidAmount;

    const payload: Omit<Expense, 'id' | 'dateAdded'> = {
      title,
      category,
      eventId: ritualId || 'general_venue',
      ritualId: ritualId || undefined,
      estimatedCost: Number(estimatedCost) || 0,
      actualCost: Number(actualCost) || 0,
      paidBy,
      splitRule,
      groomSharePercent: Number(groomSharePercent) || 50,
      brideSharePercent: Number(brideSharePercent) || 50,
      paymentStatus,
      paidAmount: Number(finalPaid) || 0,
      vendorName: vendorName.trim() || undefined,
      vendorPhone: vendorPhone.trim() || undefined,
      billNumber: billNumber.trim() || undefined,
      notes: notes.trim() || undefined,
    };

    if (initialExpense) {
      updateExpense(initialExpense.id, payload);
    } else {
      addExpense(payload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-[#ffffff] rounded-xl max-w-2xl w-full border border-[#e8e1d5] shadow-2xl overflow-hidden my-6">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#4a0e0e] via-[#3d0b0b] to-[#2b0707] p-3.5 sm:p-4 text-[#faecd0] flex items-center justify-between border-b border-[#d4af37]/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-[#d4af37]/20 text-[#d4af37] flex items-center justify-center">
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold font-serif-marathi text-white">
                {initialExpense ? 'Edit Expense & Cost Split' : 'Add Wedding Expense Entry'}
              </h3>
              <p className="text-[10px] text-amber-200/80">
                खर्च नोंद, जबाबदारी विभागणी व देयक तपशील
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-md bg-white/10 hover:bg-white/20 text-stone-200 flex items-center justify-center transition"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-3.5 max-h-[75vh] overflow-y-auto">
          
          {/* Title & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold text-[#7d7063] uppercase tracking-wider mb-1">
                Expense Title / Description *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Alankar Mangal Karyalaya Hall Advance"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-md bg-[#fcf9f2] border border-[#e8e1d5] text-[#2d2d2d] focus:border-[#6b1d1d] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#7d7063] uppercase tracking-wider mb-1">
                Major Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as MainExpenseCategory)}
                className="w-full px-3 py-1.5 text-xs rounded-md bg-[#fcf9f2] border border-[#e8e1d5] text-[#2d2d2d] focus:border-[#6b1d1d] focus:outline-none"
              >
                <option value="hall_venue">🏛️ Karyalaya / Hall Venue</option>
                <option value="catering_pangat">🍲 Pangat & Catering</option>
                <option value="decor_mandap">🌸 Mandap & Floral Decor</option>
                <option value="photography_drone">📸 Photography & Video Drone</option>
                <option value="gifts_paithani_gold">👑 Gold, Paithani & Aher</option>
                <option value="makeup_nauvari_styling">💄 Nauvari Styling & Makeup</option>
                <option value="sound_dhol_tasha">🥁 Dhol Tasha & Sanai</option>
                <option value="transport_hotel">🚌 Bus Transport & Hotel</option>
                <option value="invitations_patrika">📜 Lagna Patrika & Invites</option>
                <option value="ritual_samagri">🪔 Ritual Direct Samagri</option>
                <option value="miscellaneous">📦 Miscellaneous</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#7d7063] uppercase tracking-wider mb-1">
                Linked Ceremony (Optional)
              </label>
              <select
                value={ritualId}
                onChange={(e) => setRitualId(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-md bg-[#fcf9f2] border border-[#e8e1d5] text-[#2d2d2d] focus:border-[#6b1d1d] focus:outline-none"
              >
                <option value="">General Overhead (Not tied to 1 ritual)</option>
                {rituals.map((r) => (
                  <option key={r.id} value={r.id}>
                    🔥 {r.name.split(' (')[0]} ({r.marathiName})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Amount & Paid Status */}
          <div className="p-3 rounded-lg bg-[#faecd0]/30 border border-[#d4af37]/40 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-[#6b1d1d] uppercase tracking-wider mb-1">
                Estimated Cost (₹) *
              </label>
              <input
                type="number"
                required
                min="0"
                value={estimatedCost}
                onChange={(e) => {
                  const val = parseFloat(e.target.value) || 0;
                  setEstimatedCost(val);
                  if (paymentStatus === 'paid' && actualCost === 0) setPaidAmount(val);
                }}
                className="w-full px-3 py-1.5 text-xs rounded-md bg-white border border-[#e8e1d5] font-bold text-[#2d2d2d] focus:border-[#6b1d1d] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#6b1d1d] uppercase tracking-wider mb-1">
                Actual Cost (₹)
              </label>
              <input
                type="number"
                min="0"
                placeholder="Leave 0 if same as est"
                value={actualCost}
                onChange={(e) => {
                  const val = parseFloat(e.target.value) || 0;
                  setActualCost(val);
                  if (paymentStatus === 'paid') setPaidAmount(val || estimatedCost);
                }}
                className="w-full px-3 py-1.5 text-xs rounded-md bg-white border border-[#e8e1d5] font-bold text-[#2d2d2d] focus:border-[#6b1d1d] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#6b1d1d] uppercase tracking-wider mb-1">
                Payment Status
              </label>
              <select
                value={paymentStatus}
                onChange={(e) => {
                  const st = e.target.value as 'paid' | 'partial' | 'pending';
                  setPaymentStatus(st);
                  if (st === 'paid') {
                    setPaidAmount(actualCost > 0 ? actualCost : estimatedCost);
                  } else if (st === 'pending') {
                    setPaidAmount(0);
                  }
                }}
                className="w-full px-3 py-1.5 text-xs rounded-md bg-white border border-[#e8e1d5] font-semibold text-[#2d2d2d] focus:border-[#6b1d1d] focus:outline-none"
              >
                <option value="paid">Fully Paid</option>
                <option value="partial">Partial Advance Paid</option>
                <option value="pending">Pending Payment</option>
              </select>
            </div>
          </div>

          {/* Paid By & Split Engine */}
          <div className="p-3 rounded-lg bg-[#fcf9f2] border border-[#e8e1d5] space-y-3">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#6b1d1d]">
              <ArrowRightLeft className="w-3.5 h-3.5 text-[#6b1d1d]" />
              <span>Multi-Party Split & Responsibility Allocation</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#2d2d2d] mb-1">
                  Who paid the money upfront?
                </label>
                <select
                  value={paidBy}
                  onChange={(e) => setPaidBy(e.target.value as ExpensePayer)}
                  className="w-full px-3 py-1.5 text-xs rounded-md bg-white border border-[#e8e1d5] text-[#2d2d2d] focus:border-[#6b1d1d] focus:outline-none"
                >
                  <option value="shared">🤝 50:50 Shared Payment</option>
                  <option value="groom">🤵 Groom (Var Paksha)</option>
                  <option value="bride">👰 Bride (Vadhu Paksha)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#2d2d2d] mb-1">
                  Cost Splitting Rule
                </label>
                <select
                  value={splitRule}
                  onChange={(e) => handleSplitRuleChange(e.target.value as any)}
                  className="w-full px-3 py-1.5 text-xs rounded-md bg-white border border-[#e8e1d5] text-[#2d2d2d] focus:border-[#6b1d1d] focus:outline-none"
                >
                  <option value="50_50_shared">50:50 Shared Split (Common)</option>
                  <option value="100_groom">100% Groom Family Responsibility</option>
                  <option value="100_bride">100% Bride Family Responsibility</option>
                  <option value="custom_ratio">Custom Split Ratio (%)</option>
                </select>
              </div>
            </div>

            {/* Custom Ratio Sliders if selected */}
            {splitRule === 'custom_ratio' && (
              <div className="p-2.5 bg-white rounded-md border border-[#e8e1d5] space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-[#2d2d2d]">
                  <span>Groom Share: {groomSharePercent}%</span>
                  <span>Bride Share: {brideSharePercent}%</span>
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
                  className="w-full accent-[#6b1d1d]"
                />
              </div>
            )}
          </div>

          {/* Vendor Details & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-[#2d2d2d] mb-1">
                Vendor / Contractor Name
              </label>
              <input
                type="text"
                placeholder="e.g. Annapurna Caterers"
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-md bg-[#fcf9f2] border border-[#e8e1d5] text-[#2d2d2d] focus:border-[#6b1d1d] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#2d2d2d] mb-1">
                Vendor Phone
              </label>
              <input
                type="text"
                placeholder="+91 98..."
                value={vendorPhone}
                onChange={(e) => setVendorPhone(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-md bg-[#fcf9f2] border border-[#e8e1d5] text-[#2d2d2d] focus:border-[#6b1d1d] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#2d2d2d] mb-1">
                Bill / Receipt Reference
              </label>
              <input
                type="text"
                placeholder="e.g. INV-882"
                value={billNumber}
                onChange={(e) => setBillNumber(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-md bg-[#fcf9f2] border border-[#e8e1d5] text-[#2d2d2d] focus:border-[#6b1d1d] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#2d2d2d] mb-1">
              Notes & Contract Terms
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Includes stage lighting, generator backup, and 12 guest suites."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-md bg-[#fcf9f2] border border-[#e8e1d5] text-[#2d2d2d] focus:border-[#6b1d1d] focus:outline-none"
            />
          </div>

          {/* Submit Actions */}
          <div className="pt-3 border-t border-[#e8e1d5] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-semibold text-[#7d7063] hover:bg-[#f4ede1] rounded-md transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#6b1d1d] hover:bg-[#521414] text-white font-bold text-xs rounded-md shadow-xs transition"
            >
              {initialExpense ? 'Save Expense' : 'Add Expense'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
