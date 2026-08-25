import React from 'react';
import { useWedding } from '../../context/WeddingContext';
import { formatINR } from '../../utils/calculations';
import { 
  DollarSign, 
  Users, 
  Flame, 
  ArrowRightLeft, 
  Sparkles, 
  Utensils, 
  Clock, 
  MapPin, 
  ChevronRight, 
  PlusCircle,
  ShoppingBag,
  Check
} from 'lucide-react';
import { ActiveTab } from '../Navigation';

interface OverviewDashboardProps {
  setActiveTab: (tab: ActiveTab) => void;
  onOpenAddExpense: () => void;
  onOpenAddGuest: () => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  setActiveTab,
  onOpenAddExpense,
  onOpenAddGuest,
}) => {
  const { profile, rituals, budgetSummary, guestMetrics, toggleRitualItemPurchased } = useWedding();

  const nextUpcomingRitual = rituals.find((r) => r.status === 'in_progress') || rituals.find((r) => r.status === 'upcoming');

  // Calculate items purchased status
  let totalItemsCount = 0;
  let purchasedItemsCount = 0;
  rituals.forEach((r) => {
    totalItemsCount += r.items.length;
    purchasedItemsCount += r.items.filter((it) => it.isPurchased).length;
  });

  const budgetUsedPercent = Math.min(100, Math.round((budgetSummary.totalActual / (budgetSummary.targetBudget || 1)) * 100));

  // Category map for pretty names & colors
  const categoryLabels: { [key: string]: { label: string; marathi: string; color: string } } = {
    hall_venue: { label: 'Karyalaya & Hall', marathi: 'कार्यालय व लॉन्स', color: 'bg-[#8b2626]' },
    catering_pangat: { label: 'Pangat & Catering', marathi: 'पारंपरिक भोजन पंगत', color: 'bg-[#b85a1a]' },
    decor_mandap: { label: 'Mandap & Decor', marathi: 'मंडप व फुलांची सजावट', color: 'bg-[#d4af37]' },
    photography_drone: { label: 'Photo & Cinema', marathi: 'फोटोग्राफी व व्हिडिओ', color: 'bg-[#9c275a]' },
    gifts_paithani_gold: { label: 'Gold, Paithani & Aher', marathi: 'दागिने, पैठणी व आहेर', color: 'bg-[#6b1d1d]' },
    makeup_nauvari_styling: { label: 'Nauvari Styling & Makeup', marathi: 'नऊवारी व मेकअप', color: 'bg-[#be185d]' },
    sound_dhol_tasha: { label: 'Dhol Tasha & Sanai', marathi: 'ढोल ताशा व सनई', color: 'bg-[#991b1b]' },
    transport_hotel: { label: 'Travel & Guest Rooms', marathi: 'प्रवास व हॉटेल रूम्स', color: 'bg-[#1e3a8a]' },
    invitations_patrika: { label: 'Lagna Patrika & Invites', marathi: 'पत्रिका व डिजिटल निमंत्रण', color: 'bg-[#0f766e]' },
    flowers_garlands: { label: 'Flowers & Varmala', marathi: 'वरमाला व फुले', color: 'bg-[#15803d]' },
    puja_samagri: { label: 'Puja Samagri', marathi: 'पूजा व हवन साहित्य', color: 'bg-[#854d0e]' },
    attire_jewelry: { label: 'Attire & Jewelry', marathi: 'पोशाख व अलंकार', color: 'bg-[#6b21a8]' },
    sweets_catering: { label: 'Sweets & Snacks', marathi: 'मिठाई व नाश्ता', color: 'bg-[#c2410c]' },
  };

  return (
    <div className="space-y-4 pb-8">
      
      {/* 1. Main Welcome & Quick Add Bar - High Density */}
      <div className="bg-[#fcf9f2] rounded-lg p-3 sm:p-4 border border-[#e8e1d5] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#6b1d1d] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>शुभमंगल सावधान • प्रत्यक्ष नियोजन केंद्र</span>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-[#2d2d2d] font-serif-marathi mt-0.5">
            {profile.brideName} & {profile.groomName} Wedding Command Center
          </h2>
          <p className="text-xs text-[#63584e] mt-0.5">
            Real-time ritual tracking, Pangat catering preferences, and 50:50 multi-party expense balancing.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={onOpenAddGuest}
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#6b1d1d] hover:bg-[#571616] text-white text-xs font-semibold rounded-md transition shadow-xs"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Guest / RSVP</span>
          </button>
          <button
            onClick={onOpenAddExpense}
            className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white hover:bg-[#faecd0]/50 text-[#6b1d1d] border border-[#d4af37]/60 text-xs font-semibold rounded-md transition shadow-xs"
          >
            <PlusCircle className="w-3.5 h-3.5 text-[#6b1d1d]" />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* 2. Top Metric Cards - High Density 4-Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        
        {/* Metric 1: Total Wedding Budget */}
        <div className="bg-[#ffffff] rounded-lg p-3.5 border border-[#e8e1d5] shadow-xs hover:border-[#d4af37] transition group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#7d7063] uppercase tracking-wider">Total Wedding Spend</span>
            <div className="w-7 h-7 rounded bg-[#faecd0] flex items-center justify-center text-[#6b1d1d]">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold text-[#1f1f1f] tracking-tight font-serif-marathi">
              {formatINR(budgetSummary.totalActual)}
            </div>
            <div className="flex items-center justify-between text-[11px] text-[#63584e] mt-0.5">
              <span>Target: {formatINR(budgetSummary.targetBudget)}</span>
              <span className="font-bold text-[#6b1d1d]">{budgetUsedPercent}%</span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-[#f4ede1] rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  budgetUsedPercent > 95 ? 'bg-rose-600' : 'bg-[#6b1d1d]'
                }`}
                style={{ width: `${budgetUsedPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Metric 2: Guest Attendance & RSVP */}
        <div className="bg-[#ffffff] rounded-lg p-3.5 border border-[#e8e1d5] shadow-xs hover:border-[#d4af37] transition group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#7d7063] uppercase tracking-wider">Guest RSVP Count</span>
            <div className="w-7 h-7 rounded bg-emerald-50 flex items-center justify-center text-emerald-800">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold text-[#1f1f1f] tracking-tight font-serif-marathi">
              {guestMetrics.confirmedGuests} <span className="text-xs font-normal text-[#7d7063]">Confirmed</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-[#63584e] mt-0.5">
              <span>Total Invited: {guestMetrics.totalGuests} Pax</span>
              <span className="font-semibold text-emerald-700">{guestMetrics.tentativeGuests} Tentative</span>
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-[10px] text-[#63584e]">
              <span className="px-1.5 py-0.5 rounded bg-[#fdfaf5] border border-[#e8e1d5]">
                👰 Bride: {guestMetrics.brideSideCount}
              </span>
              <span className="px-1.5 py-0.5 rounded bg-[#fdfaf5] border border-[#e8e1d5]">
                🤵 Groom: {guestMetrics.groomSideCount}
              </span>
            </div>
          </div>
        </div>

        {/* Metric 3: Traditional Catering & Pangat Breakdown */}
        <div className="bg-[#ffffff] rounded-lg p-3.5 border border-[#e8e1d5] shadow-xs hover:border-[#d4af37] transition group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#7d7063] uppercase tracking-wider">Catering Preferences</span>
            <div className="w-7 h-7 rounded bg-[#faecd0] flex items-center justify-center text-[#854d0e]">
              <Utensils className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold text-[#1f1f1f] tracking-tight font-serif-marathi">
              {guestMetrics.pangatPreferenceCount} <span className="text-xs font-normal text-[#7d7063]">Pangat</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-[#63584e] mt-0.5">
              <span>Buffet: {guestMetrics.buffetPreferenceCount} Pax</span>
              <span className="font-semibold text-[#854d0e]">🍃 Upvas: {guestMetrics.fastingCount}</span>
            </div>
            <div className="mt-2 text-[10px] text-[#63584e] flex items-center gap-1">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
              <span className="truncate">{guestMetrics.jainSatvikCount} Jain/Satvik (No onion-garlic)</span>
            </div>
          </div>
        </div>

        {/* Metric 4: Ritual Checklist Items Procurement */}
        <div className="bg-[#ffffff] rounded-lg p-3.5 border border-[#e8e1d5] shadow-xs hover:border-[#d4af37] transition group">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#7d7063] uppercase tracking-wider">Ritual Items Ready</span>
            <div className="w-7 h-7 rounded bg-rose-50 flex items-center justify-center text-[#881337]">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <div className="text-xl font-bold text-[#1f1f1f] tracking-tight font-serif-marathi">
              {purchasedItemsCount} / {totalItemsCount} <span className="text-xs font-normal text-[#7d7063]">Procured</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-[#63584e] mt-0.5">
              <span>{rituals.filter(r => r.status === 'completed').length} of {rituals.length} Rituals</span>
              <span className="font-semibold text-[#881337]">{totalItemsCount - purchasedItemsCount} Items Left</span>
            </div>
            <div className="w-full bg-[#f4ede1] rounded-full h-1.5 mt-2 overflow-hidden">
              <div
                className="h-full bg-[#6b1d1d] rounded-full transition-all duration-300"
                style={{ width: `${totalItemsCount > 0 ? (purchasedItemsCount / totalItemsCount) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>

      </div>

      {/* 3. High-Craft Financial Cost Split & Multi-Party Accounts Card */}
      <div className="bg-gradient-to-br from-[#4a0e0e] via-[#350909] to-[#240606] rounded-xl p-4 sm:p-5 text-white shadow-md border border-[#d4af37]/40 relative overflow-hidden">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3.5 border-b border-[#d4af37]/25">
          <div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#d4af37]">
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span>Multi-Party Expense Split & Settlement Engine</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold font-serif-marathi text-[#faecd0] mt-0.5">
              Groom (Var Paksha) vs Bride (Vadhu Paksha) Account Balance
            </h3>
            <p className="text-xs text-amber-200/80 mt-0.5">
              Tracks upfront payments, individual ritual responsibilities, and balances the 50:50 shared expenses.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('expenses')}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-[#d4af37] hover:bg-[#c29e28] text-[#420d0d] font-bold text-xs transition shadow-xs self-start md:self-auto"
          >
            <span>View Full Ledger</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 3 Split Pillars - High Density Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 py-3.5 border-b border-[#d4af37]/25">
          
          {/* Groom Side Pillar */}
          <div className="bg-black/25 rounded-lg p-3 border border-white/10 relative">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="text-base">🤵</span>
                <div>
                  <h4 className="font-bold text-xs text-white">Groom (Var Paksha)</h4>
                  <p className="text-[10px] text-amber-200/70">{profile.groomFamilyTitle}</p>
                </div>
              </div>
              <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                Groom Side
              </span>
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-stone-300">
                <span className="text-[11px]">Paid Out-of-Pocket:</span>
                <span className="font-bold text-white text-xs">{formatINR(budgetSummary.groomPaidOutPocket)}</span>
              </div>
              <div className="flex justify-between text-stone-300">
                <span className="text-[11px]">Responsible Share:</span>
                <span className="font-semibold text-amber-200 text-xs">{formatINR(budgetSummary.groomResponsibleShare)}</span>
              </div>
              <div className="pt-1.5 border-t border-white/10 flex justify-between items-center">
                <span className="text-stone-300 text-[11px]">Net Groom Balance:</span>
                <span className={`font-bold text-xs ${budgetSummary.groomBalance >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
                  {budgetSummary.groomBalance >= 0 ? `+${formatINR(budgetSummary.groomBalance)} (Overpaid)` : `-${formatINR(Math.abs(budgetSummary.groomBalance))} (Underpaid)`}
                </span>
              </div>
            </div>
          </div>

          {/* Shared 50:50 Account Pillar */}
          <div className="bg-[#d4af37]/15 rounded-lg p-3 border border-[#d4af37]/40 relative">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="text-base">🤝</span>
                <div>
                  <h4 className="font-bold text-xs text-[#faecd0]">Shared Pool Expenses</h4>
                  <p className="text-[10px] text-amber-200/80">50:50 Shared Costs (Hall, Photo, Mandap)</p>
                </div>
              </div>
              <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-[#d4af37]/30 text-[#faecd0] border border-[#d4af37]/50">
                50:50 Split
              </span>
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-amber-100">
                <span className="text-[11px]">Total Shared Cost:</span>
                <span className="font-bold text-[#d4af37] text-xs">{formatINR(budgetSummary.sharedTotalCost)}</span>
              </div>
              <div className="flex justify-between text-amber-100">
                <span className="text-[11px]">Per Family Share (50%):</span>
                <span className="font-semibold text-white text-xs">{formatINR(budgetSummary.sharedTotalCost / 2)}</span>
              </div>
              <div className="pt-1.5 border-t border-[#d4af37]/30 flex justify-between items-center text-[10px] text-amber-200">
                <span>Groom: {formatINR(budgetSummary.sharedPaidByGroom)}</span>
                <span>Bride: {formatINR(budgetSummary.sharedPaidByBride)}</span>
              </div>
            </div>
          </div>

          {/* Bride Side Pillar */}
          <div className="bg-black/25 rounded-lg p-3 border border-white/10 relative">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="text-base">👰</span>
                <div>
                  <h4 className="font-bold text-xs text-white">Bride (Vadhu Paksha)</h4>
                  <p className="text-[10px] text-amber-200/70">{profile.brideFamilyTitle}</p>
                </div>
              </div>
              <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-pink-500/20 text-pink-300 border border-pink-400/30">
                Bride Side
              </span>
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-stone-300">
                <span className="text-[11px]">Paid Out-of-Pocket:</span>
                <span className="font-bold text-white text-xs">{formatINR(budgetSummary.bridePaidOutPocket)}</span>
              </div>
              <div className="flex justify-between text-stone-300">
                <span className="text-[11px]">Responsible Share:</span>
                <span className="font-semibold text-amber-200 text-xs">{formatINR(budgetSummary.brideResponsibleShare)}</span>
              </div>
              <div className="pt-1.5 border-t border-white/10 flex justify-between items-center">
                <span className="text-stone-300 text-[11px]">Net Bride Balance:</span>
                <span className={`font-bold text-xs ${budgetSummary.brideBalance >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
                  {budgetSummary.brideBalance >= 0 ? `+${formatINR(budgetSummary.brideBalance)} (Overpaid)` : `-${formatINR(Math.abs(budgetSummary.brideBalance))} (Underpaid)`}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Settlement Callout Banner */}
        <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg bg-[#240606]/90 border border-[#d4af37]/35">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] shrink-0">
              <ArrowRightLeft className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-[#d4af37] block">
                Official Account Settlement Advice
              </span>
              <p className="text-xs font-semibold text-white mt-0.5">
                {budgetSummary.settlementText}
              </p>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[10px] text-amber-200/80 block">Settlement Amount</span>
            <span className="text-base sm:text-lg font-bold font-serif-marathi text-[#d4af37]">
              {formatINR(budgetSummary.settlementAmount)}
            </span>
          </div>
        </div>

      </div>

      {/* 4. Active / Upcoming Ritual Card & Quick Item Check */}
      {nextUpcomingRitual && (
        <div className="bg-[#ffffff] rounded-lg p-3.5 sm:p-4 border border-[#e8e1d5] shadow-xs relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#e8e1d5]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-[#faecd0] text-[#6b1d1d] flex items-center justify-center font-serif-marathi font-bold text-sm">
                {nextUpcomingRitual.order}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#faecd0] text-[#6b1d1d] border border-[#d4af37]/30">
                    {nextUpcomingRitual.status === 'in_progress' ? '🔥 Active Ritual' : '⏰ Next Ceremony'}
                  </span>
                  <span className="text-xs text-[#7d7063]">{nextUpcomingRitual.date}</span>
                </div>
                <h3 className="text-base font-bold text-[#1f1f1f] font-serif-marathi mt-0.5">
                  {nextUpcomingRitual.name} <span className="text-[#6b1d1d]">({nextUpcomingRitual.marathiName})</span>
                </h3>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('rituals')}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#6b1d1d] hover:text-[#501313]"
            >
              <span>View All 10 Rituals</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-3 text-xs text-[#63584e]">
            <div className="flex items-start gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#6b1d1d] mt-0.5 shrink-0" />
              <div>
                <span className="font-semibold text-[#2d2d2d] block text-[11px]">Ceremony Time</span>
                <span>{nextUpcomingRitual.startTime} – {nextUpcomingRitual.endTime}</span>
              </div>
            </div>
            <div className="flex items-start gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#6b1d1d] mt-0.5 shrink-0" />
              <div>
                <span className="font-semibold text-[#2d2d2d] block text-[11px]">Venue / Hall</span>
                <span className="truncate block max-w-[200px]">{nextUpcomingRitual.venue}</span>
              </div>
            </div>
            <div className="flex items-start gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37] mt-0.5 shrink-0" />
              <div>
                <span className="font-semibold text-[#2d2d2d] block text-[11px]">Traditional Tip</span>
                <span className="text-[#63584e] line-clamp-1">{nextUpcomingRitual.traditionalTip}</span>
              </div>
            </div>
          </div>

          {/* Quick Item procurement checklist for this upcoming ritual */}
          <div className="mt-3 pt-3 border-t border-[#e8e1d5]">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-bold text-xs text-[#2d2d2d] uppercase tracking-wider flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5 text-[#6b1d1d]" />
                <span>Defined Items Needed for this Ceremony ({nextUpcomingRitual.items.length} items)</span>
              </h4>
              <span className="text-[11px] text-[#7d7063]">
                {nextUpcomingRitual.items.filter(it => it.isPurchased).length} / {nextUpcomingRitual.items.length} Ready
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {nextUpcomingRitual.items.slice(0, 6).map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleRitualItemPurchased(nextUpcomingRitual.id, item.id)}
                  className={`p-2 rounded border text-xs cursor-pointer transition flex items-start gap-2 ${
                    item.isPurchased
                      ? 'bg-emerald-50/60 border-emerald-200 text-[#2d2d2d]'
                      : 'bg-[#fcf9f2] border-[#e8e1d5] hover:border-[#d4af37] text-[#2d2d2d]'
                  }`}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded mt-0.5 flex items-center justify-center shrink-0 border ${
                      item.isPurchased
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-[#7d7063] bg-white'
                    }`}
                  >
                    {item.isPurchased && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className={`font-semibold line-clamp-1 text-[11px] ${item.isPurchased ? 'line-through text-[#8f8173]' : 'text-[#1f1f1f]'}`}>
                      {item.name}
                    </p>
                    <div className="flex items-center justify-between mt-0.5 text-[10px] text-[#7d7063]">
                      <span>{item.quantity}</span>
                      <span className="font-semibold text-[#6b1d1d]">{formatINR(item.actualCost || item.estimatedCost)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. Category-wise Spending Distribution Cards */}
      <div className="bg-[#ffffff] rounded-lg p-3.5 sm:p-4 border border-[#e8e1d5] shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm sm:text-base font-bold font-serif-marathi text-[#1f1f1f]">
              Major Expense Categories Breakdown
            </h3>
            <p className="text-[11px] text-[#7d7063]">
              Aggregated from Hall booking, Photography, Pangat Catering, Mandap Decor, and Ritual Samagri.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('expenses')}
            className="text-xs font-semibold text-[#6b1d1d] hover:underline"
          >
            Manage Expenses →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {(Object.entries(budgetSummary.categoryBreakdown) as [string, { estimated: number; actual: number; count: number }][]).map(([catKey, catData]) => {
            const info = categoryLabels[catKey] || { label: catKey, marathi: '', color: 'bg-[#6b1d1d]' };
            const percentOfTotal = Math.round((catData.actual / (budgetSummary.totalActual || 1)) * 100);

            return (
              <div key={catKey} className="p-2.5 rounded bg-[#fcf9f2] border border-[#e8e1d5] hover:border-[#d4af37] transition">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#2d2d2d]">{info.label}</span>
                  <span className="text-[10px] font-semibold text-[#7d7063]">{percentOfTotal}%</span>
                </div>
                {info.marathi && (
                  <span className="text-[10px] text-[#7d7063] block">{info.marathi}</span>
                )}
                <div className="mt-1.5 flex items-baseline justify-between">
                  <span className="text-sm font-bold text-[#1f1f1f] font-serif-marathi">{formatINR(catData.actual)}</span>
                  <span className="text-[10px] text-[#7d7063]">{catData.count} entries</span>
                </div>
                <div className="w-full bg-[#e8e1d5] rounded-full h-1.5 mt-1.5 overflow-hidden">
                  <div className={`h-full ${info.color}`} style={{ width: `${percentOfTotal}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
