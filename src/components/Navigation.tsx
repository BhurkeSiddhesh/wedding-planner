import React from 'react';
import { 
  CheckSquare,
  Receipt,
  Clock,
  ArrowRightLeft
} from 'lucide-react';
import { useWedding } from '../context/WeddingContext';
import { formatINR } from '../utils/calculations';

export type ActiveTab = 'todo' | 'expenses' | 'timeline';

interface NavigationProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const { tasks, timelineLines, budgetSummary } = useWedding();

  const totalSlotsCount = timelineLines.reduce((acc, l) => acc + l.slots.length, 0);

  const tabs = [
    {
      id: 'timeline' as ActiveTab,
      label: 'Timelines & Schedule',
      marathiLabel: 'वेळापत्रक',
      icon: Clock,
      badge: `${timelineLines.length} tracks • ${totalSlotsCount} events`,
    },
    {
      id: 'todo' as ActiveTab,
      label: 'To-Do List',
      marathiLabel: 'कार्यसूची',
      icon: CheckSquare,
      badge: `${tasks.length} tasks`,
    },
    {
      id: 'expenses' as ActiveTab,
      label: 'Expense Split Tracker',
      marathiLabel: 'खर्च वाटप',
      icon: Receipt,
      badge: formatINR(budgetSummary.totalActual || budgetSummary.totalEstimated),
    },
  ];

  return (
    <nav aria-label="Wedding planner sections" className="bg-stone-50/95 backdrop-blur-xs border-b border-stone-200 relative z-20 font-sans-google">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between gap-3 py-2">
          
          {/* Clean Segmented Tab Control */}
          <div role="tablist" aria-label="Planner sections" className="flex max-w-full items-center gap-1 overflow-x-auto p-1 bg-stone-200/70 rounded-xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  id={`nav-tab-${tab.id}`}
                  role="tab"
                  aria-selected={isActive}
                  className={`flex shrink-0 items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-150 ${
                    isActive
                      ? 'bg-white text-stone-900 shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#7a1c1c]' : 'text-stone-500'}`} />
                  <span>{tab.label}</span>
                  <span className="hidden md:inline text-[11px] font-normal text-stone-400">
                    ({tab.marathiLabel})
                  </span>

                  <span
                    className={`ml-1 text-[11px] px-2 py-0.5 rounded-full font-medium ${
                      isActive
                        ? 'bg-[#7a1c1c]/10 text-[#7a1c1c]'
                        : 'bg-stone-300/50 text-stone-600'
                    }`}
                  >
                    {tab.badge}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Balance Preview on the Right */}
          <div className="hidden sm:flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-stone-700">
              <ArrowRightLeft className="w-3.5 h-3.5 text-amber-600" />
              <span className="text-stone-500">Settlement:</span>
              <span className="font-semibold text-stone-900">
                {budgetSummary.settlementPayer === 'settled'
                  ? 'All Settled'
                  : budgetSummary.settlementPayer === 'bride'
                  ? `Bride owes ${formatINR(budgetSummary.settlementAmount)}`
                  : `Groom owes ${formatINR(budgetSummary.settlementAmount)}`}
              </span>
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
};
