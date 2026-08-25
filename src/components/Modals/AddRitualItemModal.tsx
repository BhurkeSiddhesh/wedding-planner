import React, { useState } from 'react';
import { useWedding } from '../../context/WeddingContext';
import { ItemCategory, ExpensePayer, RitualItem } from '../../types/wedding';
import { X, ShoppingBag } from 'lucide-react';

interface AddRitualItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  ritualId: string;
}

export const AddRitualItemModal: React.FC<AddRitualItemModalProps> = ({
  isOpen,
  onClose,
  ritualId,
}) => {
  const { rituals, addRitualItem } = useWedding();
  const ritual = rituals.find((r) => r.id === ritualId);

  const [name, setName] = useState('');
  const [marathiName, setMarathiName] = useState('');
  const [category, setCategory] = useState<ItemCategory>('flowers_garlands');
  const [quantity, setQuantity] = useState('1 Set');
  const [estimatedCost, setEstimatedCost] = useState<number>(3000);
  const [actualCost, setActualCost] = useState<number>(0);
  const [paidBy, setPaidBy] = useState<ExpensePayer>('shared');
  const [assignedTo, setAssignedTo] = useState('');
  const [vendorOrShop, setVendorOrShop] = useState('');

  if (!isOpen || !ritual) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const payload: Omit<RitualItem, 'id'> = {
      name,
      marathiName: marathiName.trim() || name,
      category,
      quantity: quantity.trim() || '1 No',
      estimatedCost: Number(estimatedCost) || 0,
      actualCost: Number(actualCost) || 0,
      paidBy,
      isPurchased: false,
      assignedTo: assignedTo.trim() || 'Family Member',
      vendorOrShop: vendorOrShop.trim() || undefined,
    };

    addRitualItem(ritualId, payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs">
      <div className="bg-[#ffffff] rounded-xl max-w-lg w-full border border-[#e8e1d5] shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#4a0e0e] via-[#3d0b0b] to-[#2b0707] p-3.5 sm:p-4 text-[#faecd0] flex items-center justify-between border-b border-[#d4af37]/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-[#d4af37]/20 text-[#d4af37] flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold font-serif-marathi text-white">
                Add Item to {ritual.name.split(' (')[0]}
              </h3>
              <p className="text-[10px] text-amber-200/80">
                विधीसाठी लागणारे साहित्य व खर्च नोंदणी
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

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-3">
          <div>
            <label className="block text-[10px] font-bold text-[#7d7063] uppercase tracking-wider mb-1">
              Item Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Traditional Fresh Rose Garlands"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-md bg-[#fcf9f2] border border-[#e8e1d5] text-[#2d2d2d] focus:border-[#6b1d1d] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-[#7d7063] uppercase tracking-wider mb-1">
                Marathi Name (मराठी नाव)
              </label>
              <input
                type="text"
                placeholder="उदा. गुलाबाचे हार व वेणी"
                value={marathiName}
                onChange={(e) => setMarathiName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-md bg-[#fcf9f2] border border-[#e8e1d5] text-[#2d2d2d] focus:border-[#6b1d1d] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#7d7063] uppercase tracking-wider mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ItemCategory)}
                className="w-full px-3 py-1.5 text-xs rounded-md bg-[#fcf9f2] border border-[#e8e1d5] text-[#2d2d2d] focus:border-[#6b1d1d] focus:outline-none"
              >
                <option value="flowers_garlands">🌸 Flowers & Garlands</option>
                <option value="puja_samagri">🪔 Puja & Vedic Samagri</option>
                <option value="sweets_catering">🍬 Sweets & Catering</option>
                <option value="gifts_aher">🎁 Gifts & Aher</option>
                <option value="attire_jewelry">👑 Attire & Jewelry</option>
                <option value="music_decor">🎶 Music & Decor</option>
                <option value="transport">🚗 Transport</option>
                <option value="other">📦 Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label className="block text-[10px] font-bold text-[#7d7063] uppercase tracking-wider mb-1">
                Quantity
              </label>
              <input
                type="text"
                placeholder="e.g. 4 Garlands"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs rounded-md bg-[#fcf9f2] border border-[#e8e1d5] text-[#2d2d2d] focus:border-[#6b1d1d] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#7d7063] uppercase tracking-wider mb-1">
                Est. Cost (₹)
              </label>
              <input
                type="number"
                min="0"
                value={estimatedCost}
                onChange={(e) => setEstimatedCost(parseFloat(e.target.value) || 0)}
                className="w-full px-2.5 py-1.5 text-xs rounded-md bg-[#fcf9f2] border border-[#e8e1d5] font-bold text-[#2d2d2d] focus:border-[#6b1d1d] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#7d7063] uppercase tracking-wider mb-1">
                Expense Paid By
              </label>
              <select
                value={paidBy}
                onChange={(e) => setPaidBy(e.target.value as ExpensePayer)}
                className="w-full px-2 py-1.5 text-xs rounded-md bg-[#fcf9f2] border border-[#e8e1d5] font-semibold text-[#2d2d2d] focus:border-[#6b1d1d] focus:outline-none"
              >
                <option value="shared">🤝 Shared 50:50</option>
                <option value="groom">🤵 Groom Side</option>
                <option value="bride">👰 Bride Side</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-[#7d7063] uppercase tracking-wider mb-1">
                Assigned Lead
              </label>
              <input
                type="text"
                placeholder="e.g. Mangesh Kaka, Pooja"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-md bg-[#fcf9f2] border border-[#e8e1d5] text-[#2d2d2d] focus:border-[#6b1d1d] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[#7d7063] uppercase tracking-wider mb-1">
                Shop / Vendor Name
              </label>
              <input
                type="text"
                placeholder="e.g. Mandai Flower Market"
                value={vendorOrShop}
                onChange={(e) => setVendorOrShop(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-md bg-[#fcf9f2] border border-[#e8e1d5] text-[#2d2d2d] focus:border-[#6b1d1d] focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-[#e8e1d5] flex justify-end gap-2.5">
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
              Add Item
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
