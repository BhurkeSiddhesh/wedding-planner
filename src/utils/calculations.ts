import { Guest, Ritual, Expense, WeddingProfile } from '../types/wedding';

export function formatINR(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export interface BudgetSummary {
  targetBudget: number;
  totalEstimated: number;
  totalActual: number;
  totalPaid: number;
  totalPending: number;
  
  // Exclusive breakdown (Not owed to one another)
  groomExclusiveCost: number;
  brideExclusiveCost: number;
  
  // Shared expenses pool (Splitwise style)
  sharedTotalCost: number;
  sharedPaidByGroom: number;
  sharedPaidByBride: number;
  sharedPaid5050: number;
  sharedBrideOwesGroom: number; // Bride's share paid upfront by Groom
  sharedGroomOwesBride: number; // Groom's share paid upfront by Bride
  
  // Overall Groom Breakdown
  groomPaidOutPocket: number;
  groomResponsibleShare: number;
  groomBalance: number; // Positive means overpaid (owed money), Negative means underpaid (owes money)
  
  // Overall Bride Breakdown
  bridePaidOutPocket: number;
  brideResponsibleShare: number;
  brideBalance: number; // Positive means overpaid (owed money), Negative means underpaid (owes money)
  
  // Settlement Statement (Derived solely from shared expense splits)
  settlementText: string;
  settlementAmount: number;
  settlementPayer: 'groom' | 'bride' | 'settled';
  
  // Category-wise actual breakdown
  categoryBreakdown: { [category: string]: { estimated: number; actual: number; count: number } };
}

export function calculateBudgetSummary(
  expenses: Expense[],
  rituals: Ritual[],
  profile: WeddingProfile
): BudgetSummary {
  let totalEstimated = 0;
  let totalActual = 0;
  let totalPaid = 0;
  
  let groomExclusiveCost = 0;
  let brideExclusiveCost = 0;
  
  let sharedTotalCost = 0;
  let sharedPaidByGroom = 0;
  let sharedPaidByBride = 0;
  let sharedPaid5050 = 0;
  let sharedBrideOwesGroom = 0;
  let sharedGroomOwesBride = 0;

  let groomPaidOutPocket = 0;
  let groomResponsibleShare = 0;
  let bridePaidOutPocket = 0;
  let brideResponsibleShare = 0;
  
  const categoryBreakdown: { [category: string]: { estimated: number; actual: number; count: number } } = {};

  // Helper to add category metrics
  const addCategory = (cat: string, est: number, act: number) => {
    if (!categoryBreakdown[cat]) {
      categoryBreakdown[cat] = { estimated: 0, actual: 0, count: 0 };
    }
    categoryBreakdown[cat].estimated += est;
    categoryBreakdown[cat].actual += act;
    categoryBreakdown[cat].count += 1;
  };

  // 1. Process Main Expenses
  expenses.forEach((exp) => {
    const cost = exp.actualCost > 0 ? exp.actualCost : exp.estimatedCost;
    totalEstimated += exp.estimatedCost;
    totalActual += cost;
    totalPaid += exp.paidAmount || (exp.paymentStatus === 'paid' ? cost : 0);

    addCategory(exp.category, exp.estimatedCost, cost);

    // Check if this is an exclusive expense vs a shared expense
    const isGroomExclusive = exp.splitRule === '100_groom';
    const isBrideExclusive = exp.splitRule === '100_bride';

    if (isGroomExclusive) {
      // 100% Groom's own expense - never owed by Bride
      groomExclusiveCost += cost;
      groomResponsibleShare += cost;
      groomPaidOutPocket += exp.paidAmount || (exp.paymentStatus === 'paid' ? cost : 0);
    } else if (isBrideExclusive) {
      // 100% Bride's own expense - never owed by Groom
      brideExclusiveCost += cost;
      brideResponsibleShare += cost;
      bridePaidOutPocket += exp.paidAmount || (exp.paymentStatus === 'paid' ? cost : 0);
    } else {
      // Shared Expense (50:50 or Custom Ratio)
      sharedTotalCost += cost;
      
      const groomRatio = exp.splitRule === 'custom_ratio' 
        ? ((exp.groomSharePercent ?? 50) / 100)
        : (exp.splitRule === '60_40_groom_heavy' ? 0.6 : (exp.splitRule === '40_60_bride_heavy' ? 0.4 : 0.5));
      const brideRatio = 1 - groomRatio;

      const groomShareCost = cost * groomRatio;
      const brideShareCost = cost * brideRatio;

      groomResponsibleShare += groomShareCost;
      brideResponsibleShare += brideShareCost;

      // Check who paid upfront for this shared item (Splitwise logic)
      if (exp.paidBy === 'groom') {
        // Groom paid the whole bill upfront
        const actualPaid = exp.paidAmount || (exp.paymentStatus === 'paid' ? cost : 0);
        groomPaidOutPocket += actualPaid;
        sharedPaidByGroom += cost;
        // Bride owes Groom her share of this item
        sharedBrideOwesGroom += brideShareCost;
      } else if (exp.paidBy === 'bride') {
        // Bride paid the whole bill upfront
        const actualPaid = exp.paidAmount || (exp.paymentStatus === 'paid' ? cost : 0);
        bridePaidOutPocket += actualPaid;
        sharedPaidByBride += cost;
        // Groom owes Bride his share of this item
        sharedGroomOwesBride += groomShareCost;
      } else {
        // Shared 50:50 / Both paid their respective parts
        const actualPaid = exp.paidAmount || (exp.paymentStatus === 'paid' ? cost : 0);
        groomPaidOutPocket += actualPaid * groomRatio;
        bridePaidOutPocket += actualPaid * brideRatio;
        sharedPaid5050 += cost;
      }
    }
  });

  const totalPending = Math.max(0, totalActual - totalPaid);
  
  // Calculate Net Splitwise Debt from Shared Expenses
  const netGroomCredit = sharedBrideOwesGroom - sharedGroomOwesBride;
  const groomBalance = netGroomCredit;
  const brideBalance = -netGroomCredit;

  let settlementText = 'All shared expenses are evenly balanced.';
  let settlementAmount = 0;
  let settlementPayer: 'groom' | 'bride' | 'settled' = 'settled';

  if (Math.abs(netGroomCredit) > 1) {
    if (netGroomCredit > 0) {
      // Groom paid for Bride on shared items => Bride owes Groom
      settlementAmount = Math.round(netGroomCredit);
      settlementPayer = 'bride';
      settlementText = `Vadhu Paksha (Bride) owes Var Paksha (Groom) ${formatINR(settlementAmount)}`;
    } else {
      // Bride paid for Groom on shared items => Groom owes Bride
      settlementAmount = Math.round(Math.abs(netGroomCredit));
      settlementPayer = 'groom';
      settlementText = `Var Paksha (Groom) owes Vadhu Paksha (Bride) ${formatINR(settlementAmount)}`;
    }
  }

  return {
    targetBudget: profile.targetBudget || 1500000,
    totalEstimated,
    totalActual,
    totalPaid,
    totalPending,
    groomExclusiveCost,
    brideExclusiveCost,
    sharedTotalCost,
    sharedPaidByGroom,
    sharedPaidByBride,
    sharedPaid5050,
    sharedBrideOwesGroom,
    sharedGroomOwesBride,
    groomPaidOutPocket,
    groomResponsibleShare,
    groomBalance,
    bridePaidOutPocket,
    brideResponsibleShare,
    brideBalance,
    settlementText,
    settlementAmount,
    settlementPayer,
    categoryBreakdown,
  };
}

export interface GuestMetrics {
  totalGuests: number;
  totalAdults: number;
  totalKids: number;
  confirmedGuests: number;
  tentativeGuests: number;
  declinedGuests: number;
  pendingGuests: number;
  groomSideCount: number;
  brideSideCount: number;
  mutualSideCount: number;
  accommodationNeededCount: number;
  fastingCount: number;
  pangatPreferenceCount: number;
  buffetPreferenceCount: number;
  jainSatvikCount: number;
}

export function calculateGuestMetrics(guests: Guest[]): GuestMetrics {
  let totalAdults = 0;
  let totalKids = 0;
  let confirmedGuests = 0;
  let tentativeGuests = 0;
  let declinedGuests = 0;
  let pendingGuests = 0;
  let groomSideCount = 0;
  let brideSideCount = 0;
  let mutualSideCount = 0;
  let accommodationNeededCount = 0;
  let fastingCount = 0;
  let pangatPreferenceCount = 0;
  let buffetPreferenceCount = 0;
  let jainSatvikCount = 0;

  guests.forEach((g) => {
    const headcount = (g.adultsCount || 0) + (g.kidsCount || 0);
    totalAdults += g.adultsCount || 0;
    totalKids += g.kidsCount || 0;

    if (g.rsvpStatus === 'confirmed') confirmedGuests += headcount;
    else if (g.rsvpStatus === 'tentative') tentativeGuests += headcount;
    else if (g.rsvpStatus === 'declined') declinedGuests += headcount;
    else pendingGuests += headcount;

    if (g.side === 'groom_side') groomSideCount += headcount;
    else if (g.side === 'bride_side') brideSideCount += headcount;
    else mutualSideCount += headcount;

    if (g.accommodationNeeded) accommodationNeededCount += headcount;

    if (g.cateringPreference?.hasFastingGuests) {
      fastingCount += g.cateringPreference.fastingCount || 1;
    }

    if (g.cateringPreference?.primaryMeal === 'traditional_pangat') pangatPreferenceCount += headcount;
    else if (g.cateringPreference?.primaryMeal === 'buffet') buffetPreferenceCount += headcount;
    else if (g.cateringPreference?.primaryMeal === 'jain_satvik') jainSatvikCount += headcount;
  });

  return {
    totalGuests: totalAdults + totalKids,
    totalAdults,
    totalKids,
    confirmedGuests,
    tentativeGuests,
    declinedGuests,
    pendingGuests,
    groomSideCount,
    brideSideCount,
    mutualSideCount,
    accommodationNeededCount,
    fastingCount,
    pangatPreferenceCount,
    buffetPreferenceCount,
    jainSatvikCount,
  };
}
