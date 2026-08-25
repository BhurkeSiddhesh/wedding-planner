import React, { useState } from 'react';
import { useWedding } from '../../context/WeddingContext';
import { Ritual, ItemCategory } from '../../types/wedding';
import { formatINR } from '../../utils/calculations';
import { 
  Flame, 
  MapPin, 
  Sparkles, 
  PlusCircle, 
  Trash2, 
  ShoppingBag, 
  User, 
  Store, 
  ChevronDown, 
  ChevronUp, 
  Filter,
  Check,
  Music
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface RitualsManagerProps {
  onOpenAddRitual: () => void;
  onOpenAddItem: (ritualId: string) => void;
}

export const RitualsManager: React.FC<RitualsManagerProps> = ({
  onOpenAddRitual,
  onOpenAddItem,
}) => {
  const { rituals, updateRitual, deleteRitualItem, toggleRitualItemPurchased } = useWedding();
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [expandedRitualId, setExpandedRitualId] = useState<string | null>(rituals[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const toggleExpand = (id: string) => {
    setExpandedRitualId(expandedRitualId === id ? null : id);
  };

  const handleStatusChange = (ritual: Ritual, newStatus: 'upcoming' | 'in_progress' | 'completed') => {
    updateRitual(ritual.id, { status: newStatus });
    if (newStatus === 'completed') {
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    }
  };

  const itemCategoriesMap: { [key in ItemCategory]: { name: string; icon: string } } = {
    flowers_garlands: { name: 'Flowers & Garlands (हार व फुले)', icon: '🌸' },
    puja_samagri: { name: 'Puja Samagri (पूजा साहित्य)', icon: '🪔' },
    sweets_catering: { name: 'Sweets & Catering (मिठाई व अल्पोपहार)', icon: '🍬' },
    gifts_aher: { name: 'Gifts & Aher (आहेर व भेटवस्तू)', icon: '🎁' },
    attire_jewelry: { name: 'Attire & Jewelry (पोशाख व दागिने)', icon: '👑' },
    music_decor: { name: 'Music & Decor (संगीत व सजावट)', icon: '🎶' },
    hall_venue: { name: 'Hall & Stage (मंडप व हॉल)', icon: '🏛️' },
    photography: { name: 'Photo & Video (छायाचित्रण)', icon: '📸' },
    transport: { name: 'Transport (वाहतूक)', icon: '🚗' },
    other: { name: 'Other Items (इतर साहित्य)', icon: '📦' },
  };

  // Filtered rituals
  const filteredRituals = rituals.filter((r) => {
    const matchesSearch = 
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.marathiName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.venue.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Calculate totals across rituals
  let totalRitualBudget = 0;
  let totalRitualItems = 0;
  let totalPurchasedItems = 0;

  rituals.forEach((r) => {
    r.items.forEach((it) => {
      totalRitualBudget += it.actualCost > 0 ? it.actualCost : it.estimatedCost;
      totalRitualItems += 1;
      if (it.isPurchased) totalPurchasedItems += 1;
    });
  });

  return (
    <div className="space-y-4 pb-8">
      
      {/* Header & Quick Summary Banner - High Density */}
      <div className="bg-gradient-to-r from-[#4a0e0e] via-[#3d0b0b] to-[#2b0707] rounded-xl p-4 sm:p-5 text-[#faecd0] shadow-md border border-[#d4af37]/35">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#d4af37]">
              <Flame className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>पारंपरिक विधी, साहित्य यादी व स्वतंत्र खर्च व्यवस्थापन</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold font-serif-marathi text-white mt-0.5">
              Marathi Ceremony Rituals & Expense Checklists
            </h2>
            <p className="text-xs text-amber-200/80 mt-0.5 max-w-2xl">
              10 Traditional wedding ceremonies featuring dedicated item procurement checklists with direct cost tracking and party responsibility allocation.
            </p>
          </div>

          <button
            onClick={onOpenAddRitual}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-md bg-[#d4af37] hover:bg-[#c29e28] text-[#420d0d] font-bold text-xs transition shadow-xs shrink-0 self-start md:self-auto"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Custom Ceremony</span>
          </button>
        </div>

        {/* Rituals Summary Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3.5 pt-3 border-t border-[#d4af37]/20 text-xs">
          <div className="bg-black/25 rounded-md p-2.5 border border-white/10">
            <span className="text-amber-200/70 block text-[10px] uppercase font-bold">Total Rituals</span>
            <span className="text-base font-bold text-white font-serif-marathi">{rituals.length} Ceremonies</span>
          </div>
          <div className="bg-black/25 rounded-md p-2.5 border border-white/10">
            <span className="text-amber-200/70 block text-[10px] uppercase font-bold">Completed</span>
            <span className="text-base font-bold text-emerald-300 font-serif-marathi">
              {rituals.filter(r => r.status === 'completed').length} / {rituals.length}
            </span>
          </div>
          <div className="bg-black/25 rounded-md p-2.5 border border-white/10">
            <span className="text-amber-200/70 block text-[10px] uppercase font-bold">Items Procured</span>
            <span className="text-base font-bold text-[#d4af37] font-serif-marathi">
              {totalPurchasedItems} / {totalRitualItems} Ready
            </span>
          </div>
          <div className="bg-black/25 rounded-md p-2.5 border border-white/10">
            <span className="text-amber-200/70 block text-[10px] uppercase font-bold">Direct Ritual Budget</span>
            <span className="text-base font-bold text-[#faecd0] font-serif-marathi">{formatINR(totalRitualBudget)}</span>
          </div>
        </div>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 bg-[#ffffff] p-3 rounded-lg border border-[#e8e1d5] shadow-xs">
        <div className="w-full sm:w-72">
          <input
            type="text"
            placeholder="Search ritual name, Marathi name, or venue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-1.5 text-xs rounded-md bg-[#fdfaf5] border border-[#e8e1d5] focus:outline-none focus:ring-1 focus:ring-[#6b1d1d] text-[#2d2d2d] placeholder:text-[#8f8173]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar pb-1 sm:pb-0">
          <span className="text-[11px] font-bold text-[#7d7063] whitespace-nowrap flex items-center gap-1">
            <Filter className="w-3 h-3" /> Filter:
          </span>
          {['all', 'flowers_garlands', 'puja_samagri', 'sweets_catering', 'gifts_aher', 'attire_jewelry', 'music_decor'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategoryFilter(cat)}
              className={`px-2.5 py-1 rounded text-xs font-semibold whitespace-nowrap transition ${
                selectedCategoryFilter === cat
                  ? 'bg-[#6b1d1d] text-white shadow-xs'
                  : 'bg-[#f4ede1] text-[#63584e] hover:bg-[#e8e1d5]'
              }`}
            >
              {cat === 'all' ? 'All Items' : itemCategoriesMap[cat as ItemCategory]?.name.split(' (')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Rituals Accordion Cards */}
      <div className="space-y-2.5">
        {filteredRituals.map((ritual) => {
          const isExpanded = expandedRitualId === ritual.id;
          
          // Calculate subtotal for this ritual
          let ritualEst = 0;
          let ritualAct = 0;
          let ritualPurchasedCount = 0;
          
          ritual.items.forEach((it) => {
            ritualEst += it.estimatedCost;
            ritualAct += it.actualCost > 0 ? it.actualCost : it.estimatedCost;
            if (it.isPurchased) ritualPurchasedCount += 1;
          });

          // Filter items by category if selected
          const displayItems = selectedCategoryFilter === 'all'
            ? ritual.items
            : ritual.items.filter((it) => it.category === selectedCategoryFilter);

          return (
            <div
              key={ritual.id}
              className={`bg-[#ffffff] rounded-lg border transition-all duration-150 overflow-hidden ${
                isExpanded
                  ? 'border-[#d4af37] shadow-xs'
                  : 'border-[#e8e1d5] hover:border-[#d4af37]/60 shadow-xs'
              }`}
            >
              {/* Ritual Card Header */}
              <div
                onClick={() => toggleExpand(ritual.id)}
                className="p-3 sm:p-3.5 cursor-pointer select-none hover:bg-[#faecd0]/20 transition flex flex-col md:flex-row md:items-center justify-between gap-3"
              >
                <div className="flex items-start sm:items-center gap-2.5">
                  <div className={`w-8 h-8 rounded-md flex items-center justify-center font-serif-marathi font-bold text-xs shrink-0 ${
                    ritual.status === 'completed'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : ritual.status === 'in_progress'
                      ? 'bg-[#faecd0] text-[#6b1d1d] border border-[#d4af37] animate-pulse'
                      : 'bg-[#f4ede1] text-[#63584e] border border-[#e8e1d5]'
                  }`}>
                    {ritual.status === 'completed' ? <Check className="w-4 h-4 stroke-[3]" /> : ritual.order}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                        ritual.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ritual.status === 'in_progress'
                          ? 'bg-[#faecd0] text-[#6b1d1d] border border-[#d4af37]/40'
                          : 'bg-[#f4ede1] text-[#63584e]'
                      }`}>
                        {ritual.status === 'completed' ? '✓ Done' : ritual.status === 'in_progress' ? '🔥 Active' : 'Upcoming'}
                      </span>

                      <span className="text-[11px] font-semibold text-[#7d7063]">
                        {ritual.date} • {ritual.startTime}
                      </span>

                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                        ritual.responsibleParty === 'groom_side'
                          ? 'bg-blue-50 text-blue-800 border border-blue-200'
                          : ritual.responsibleParty === 'bride_side'
                          ? 'bg-pink-50 text-pink-800 border border-pink-200'
                          : 'bg-purple-50 text-purple-800 border border-purple-200'
                      }`}>
                        {ritual.responsibleParty === 'groom_side' ? '🤵 Var Paksha' : ritual.responsibleParty === 'bride_side' ? '👰 Vadhu Paksha' : '🤝 Shared'}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-[#1f1f1f] font-serif-marathi mt-0.5">
                      {ritual.name} <span className="text-[#6b1d1d] font-semibold">({ritual.marathiName})</span>
                    </h3>
                  </div>
                </div>

                {/* Right side stats & status toggle */}
                <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-1.5 md:pt-0 border-t md:border-t-0 border-[#e8e1d5]">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] text-[#7d7063] block">Ceremony Spend</span>
                    <span className="text-sm font-bold text-[#1f1f1f] font-serif-marathi">{formatINR(ritualAct)}</span>
                    <span className="text-[10px] text-[#7d7063] block">
                      {ritualPurchasedCount} / {ritual.items.length} items ready
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        const next = ritual.status === 'upcoming' ? 'in_progress' : ritual.status === 'in_progress' ? 'completed' : 'upcoming';
                        handleStatusChange(ritual, next);
                      }}
                      className="px-2.5 py-1 rounded text-xs font-bold bg-[#f4ede1] hover:bg-[#e8e1d5] text-[#2d2d2d] transition"
                      title="Cycle Status"
                    >
                      {ritual.status === 'completed' ? 'Reopen' : ritual.status === 'in_progress' ? 'Mark Done' : 'Start'}
                    </button>

                    <div className="w-7 h-7 rounded bg-[#fdfaf5] border border-[#e8e1d5] flex items-center justify-center text-[#63584e]">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>
              </div>

              {/* Expanded Ritual Details & Item Procurement Table */}
              {isExpanded && (
                <div className="border-t border-[#e8e1d5] bg-[#fcf9f2] p-3 sm:p-4 space-y-3">
                  
                  {/* Significance & Venue Strip */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 bg-white p-3 rounded-md border border-[#e8e1d5] text-xs">
                    <div>
                      <span className="font-bold text-[#2d2d2d] block flex items-center gap-1 mb-0.5 text-[11px]">
                        <MapPin className="w-3.5 h-3.5 text-[#6b1d1d]" /> Venue & Timing:
                      </span>
                      <p className="text-[#63584e]">{ritual.venue}</p>
                      <p className="text-[#7d7063] mt-0.5 font-medium text-[11px]">{ritual.startTime} to {ritual.endTime}</p>
                    </div>

                    <div>
                      <span className="font-bold text-[#2d2d2d] block flex items-center gap-1 mb-0.5 text-[11px]">
                        <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" /> Significance:
                      </span>
                      <p className="text-[#63584e] leading-snug">{ritual.significance}</p>
                    </div>

                    <div>
                      <span className="font-bold text-[#2d2d2d] block flex items-center gap-1 mb-0.5 text-[11px]">
                        <Music className="w-3.5 h-3.5 text-[#6b1d1d]" /> Custom Tip:
                      </span>
                      <p className="text-[#6b1d1d] font-medium leading-snug">{ritual.traditionalTip || 'Seek blessings of kuldevta and elders.'}</p>
                      {ritual.recommendedSongsOrChants && (
                        <p className="text-[#7d7063] text-[10px] mt-0.5 italic">Chant: {ritual.recommendedSongsOrChants}</p>
                      )}
                    </div>
                  </div>

                  {/* Items Checklist & Expense Table */}
                  <div className="bg-white rounded-md border border-[#e8e1d5] overflow-hidden shadow-xs">
                    <div className="p-3 border-b border-[#e8e1d5] flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#fdfaf5]">
                      <div>
                        <h4 className="font-bold text-xs sm:text-sm text-[#2d2d2d] font-serif-marathi flex items-center gap-1.5">
                          <ShoppingBag className="w-3.5 h-3.5 text-[#6b1d1d]" />
                          <span>Defined Items & Expenses Checklist ({displayItems.length} items)</span>
                        </h4>
                        <p className="text-[11px] text-[#7d7063]">
                          Flowers, puja samagri, sweets, attire, and gifts for {ritual.name}
                        </p>
                      </div>

                      <button
                        onClick={() => onOpenAddItem(ritual.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#6b1d1d] hover:bg-[#521515] text-white text-xs font-semibold rounded transition shadow-xs self-start sm:self-auto"
                      >
                        <PlusCircle className="w-3 h-3" />
                        <span>Add Item</span>
                      </button>
                    </div>

                    {/* Items List */}
                    {displayItems.length === 0 ? (
                      <div className="p-6 text-center text-xs text-[#7d7063]">
                        No items matching the selected filter for this ritual.
                      </div>
                    ) : (
                      <div className="divide-y divide-[#f4ede1]">
                        {displayItems.map((item) => {
                          const catInfo = itemCategoriesMap[item.category] || { name: item.category, icon: '📦' };

                          return (
                            <div
                              key={item.id}
                              className={`p-2.5 transition flex flex-col md:flex-row md:items-center justify-between gap-2.5 ${
                                item.isPurchased ? 'bg-emerald-50/40' : 'hover:bg-[#faecd0]/15'
                              }`}
                            >
                              {/* Left: Checkbox & Item Details */}
                              <div className="flex items-start gap-2 flex-1 min-w-0">
                                <button
                                  onClick={() => toggleRitualItemPurchased(ritual.id, item.id)}
                                  className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 border transition ${
                                    item.isPurchased
                                      ? 'bg-emerald-600 border-emerald-600 text-white'
                                      : 'border-[#7d7063] bg-white hover:border-[#6b1d1d]'
                                  }`}
                                >
                                  {item.isPurchased && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                                </button>

                                <div className="min-w-0">
                                  <div className="flex flex-wrap items-center gap-1.5">
                                    <span className={`text-xs font-bold ${item.isPurchased ? 'line-through text-[#8f8173]' : 'text-[#1f1f1f]'}`}>
                                      {item.name}
                                    </span>
                                    {item.marathiName && (
                                      <span className="text-[11px] text-[#6b1d1d] font-medium">({item.marathiName})</span>
                                    )}
                                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#f4ede1] text-[#63584e]">
                                      {catInfo.icon} {catInfo.name.split(' (')[0]}
                                    </span>
                                    <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-[#faecd0] text-[#6b1d1d]">
                                      Qty: {item.quantity}
                                    </span>
                                  </div>

                                  <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-[#7d7063] mt-0.5">
                                    {item.assignedTo && (
                                      <span className="flex items-center gap-0.5">
                                        <User className="w-2.5 h-2.5 text-[#8f8173]" />
                                        Assigned: <strong className="text-[#2d2d2d]">{item.assignedTo}</strong>
                                      </span>
                                    )}
                                    {item.vendorOrShop && (
                                      <span className="flex items-center gap-0.5">
                                        <Store className="w-2.5 h-2.5 text-[#8f8173]" />
                                        Vendor: <span className="text-[#2d2d2d]">{item.vendorOrShop}</span>
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Right: Cost & Payer Allocation */}
                              <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pl-6 md:pl-0">
                                <div className="text-left md:text-right">
                                  <span className="text-[10px] text-[#7d7063] block">Actual Cost</span>
                                  <span className="text-xs sm:text-sm font-bold text-[#1f1f1f] font-serif-marathi">
                                    {formatINR(item.actualCost || item.estimatedCost)}
                                  </span>
                                  <span className="text-[9px] text-[#7d7063] block">
                                    Est: {formatINR(item.estimatedCost)}
                                  </span>
                                </div>

                                <div className="text-left md:text-right">
                                  <span className="text-[10px] text-[#7d7063] block">Paid By</span>
                                  <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                                    item.paidBy === 'groom'
                                      ? 'bg-blue-50 text-blue-800 border border-blue-200'
                                      : item.paidBy === 'bride'
                                      ? 'bg-pink-50 text-pink-800 border border-pink-200'
                                      : 'bg-purple-50 text-purple-800 border border-purple-200'
                                  }`}>
                                    {item.paidBy === 'groom' ? '🤵 Groom' : item.paidBy === 'bride' ? '👰 Bride' : '🤝 Shared'}
                                  </span>
                                </div>

                                <button
                                  onClick={() => deleteRitualItem(ritual.id, item.id)}
                                  className="text-[#8f8173] hover:text-rose-600 p-1 transition"
                                  title="Delete Item"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Ritual Budget Subtotal Footer */}
                    <div className="p-2.5 bg-[#fdfaf5] border-t border-[#e8e1d5] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-semibold text-[#63584e]">
                      <span>Ritual Subtotal ({ritual.items.length} items):</span>
                      <div className="flex items-center gap-3">
                        <span className="text-[11px]">Estimated: {formatINR(ritualEst)}</span>
                        <span className="text-xs sm:text-sm font-bold text-[#6b1d1d] font-serif-marathi">
                          Actual Spend: {formatINR(ritualAct)}
                        </span>
                      </div>
                    </div>

                  </div>

                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
