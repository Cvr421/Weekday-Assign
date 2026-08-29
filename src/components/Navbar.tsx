import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  FileText, 
  Users, 
  BarChart3, 
  BookOpen, 
  Sparkles,
  Layers,
  AlertCircle
} from 'lucide-react';

export type NavTab = 'cockpit' | 'playbook' | 'proposal' | 'analytics' | 'simulator';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  totalRequests: number;
  scheduledCount: number;
  slaRate: number;
  urgentCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  totalRequests,
  scheduledCount,
  slaRate,
  urgentCount
}) => {
  const isTargetAchieved = slaRate >= 80;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand & Context */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-sm shadow-indigo-200">
              W
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 tracking-tight text-base sm:text-lg">Weekday</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                  Operations OS
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Zomato-Grade Scheduling Engine for Ram & Shyam</p>
            </div>
          </div>

          {/* SLA Live KPI Pill */}
          <div className="hidden md:flex items-center gap-4 bg-slate-50 px-3.5 py-1.5 rounded-xl border border-slate-200/80 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-medium">24h SLA Target:</span>
              <div className="flex items-center gap-1.5">
                <span className={`font-bold ${isTargetAchieved ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {slaRate.toFixed(1)}%
                </span>
                <span className="text-slate-400">/ 80.0%</span>
              </div>
              <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${isTargetAchieved ? 'bg-emerald-500' : 'bg-amber-500'}`}
                  style={{ width: `${Math.min(100, (slaRate / 80) * 100)}%` }}
                />
              </div>
            </div>

            <div className="h-3 w-px bg-slate-300" />

            <div className="flex items-center gap-1.5 text-slate-600">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span className="font-semibold text-slate-800">{scheduledCount}</span>
              <span className="text-slate-400">/ {totalRequests} Scheduled</span>
            </div>

            {urgentCount > 0 && (
              <>
                <div className="h-3 w-px bg-slate-300" />
                <div className="flex items-center gap-1 text-rose-600 font-semibold animate-pulse">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{urgentCount} SLA At Risk</span>
                </div>
              </>
            )}
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-1.5">
            <button
              id="nav-cockpit-btn"
              onClick={() => setActiveTab('cockpit')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'cockpit'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Intern ToDo Sheet</span>
            </button>

            <button
              id="nav-playbook-btn"
              onClick={() => setActiveTab('playbook')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'playbook'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Zomato SOP</span>
            </button>

            <button
              id="nav-proposal-btn"
              onClick={() => setActiveTab('proposal')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'proposal'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Proposal</span>
              <span className="sm:hidden">Doc</span>
            </button>

            <button
              id="nav-analytics-btn"
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'analytics'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden md:inline">SLA Metrics</span>
            </button>

            <button
              id="nav-simulator-btn"
              onClick={() => setActiveTab('simulator')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'simulator'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-purple-700 bg-purple-50 hover:bg-purple-100'
              }`}
              title="Intern Training Simulator"
            >
              <Sparkles className="w-4 h-4 text-purple-200" />
              <span className="hidden lg:inline">Intern Simulator</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
