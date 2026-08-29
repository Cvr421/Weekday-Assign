import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Users, 
  Building2, 
  Layers,
  Award,
  Zap,
  Phone,
  MessageSquare
} from 'lucide-react';
import { InterviewRequest } from '../types';

interface AnalyticsDashboardProps {
  requests: InterviewRequest[];
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ requests }) => {
  const total = requests.length;
  const scheduled = requests.filter(r => r.status === 'scheduled').length;
  const pendingT0 = requests.filter(r => r.status === 'pending_t0').length;
  const inProgress = requests.filter(r => r.status === 'wa_sent' || r.status === 'call_attempt_1' || r.status === 'call_attempt_2').length;
  const escalated = requests.filter(r => r.status === 'slot_issue_escalated').length;
  const dropOff = requests.filter(r => r.status === 'drop_off').length;

  const slaRate = total > 0 ? (scheduled / total) * 100 : 0;
  const isTargetAchieved = slaRate >= 80;

  // Ram vs Shyam metrics
  const ramReqs = requests.filter(r => r.assignedTo === 'Ram');
  const ramScheduled = ramReqs.filter(r => r.status === 'scheduled').length;
  const ramCalls = ramReqs.reduce((acc, r) => acc + r.callCount, 0);
  const ramRate = ramReqs.length > 0 ? (ramScheduled / ramReqs.length) * 100 : 0;

  const shyamReqs = requests.filter(r => r.assignedTo === 'Shyam');
  const shyamScheduled = shyamReqs.filter(r => r.status === 'scheduled').length;
  const shyamCalls = shyamReqs.reduce((acc, r) => acc + r.callCount, 0);
  const shyamRate = shyamReqs.length > 0 ? (shyamScheduled / shyamReqs.length) * 100 : 0;

  // Company breakdown
  const companyCounts: Record<string, { total: number; scheduled: number }> = {};
  requests.forEach(r => {
    if (!companyCounts[r.company]) companyCounts[r.company] = { total: 0, scheduled: 0 };
    companyCounts[r.company].total++;
    if (r.status === 'scheduled') companyCounts[r.company].scheduled++;
  });

  const companyStats = Object.entries(companyCounts).map(([comp, stats]) => ({
    company: comp,
    total: stats.total,
    scheduled: stats.scheduled,
    rate: (stats.scheduled / stats.total) * 100
  })).sort((a, b) => b.total - a.total);

  // Round breakdown
  const roundCounts: Record<string, { total: number; scheduled: number }> = {};
  requests.forEach(r => {
    const round = r.targetRound || 'Round1';
    if (!roundCounts[round]) roundCounts[round] = { total: 0, scheduled: 0 };
    roundCounts[round].total++;
    if (r.status === 'scheduled') roundCounts[round].scheduled++;
  });

  return (
    <div className="space-y-6">
      
      {/* Top SLA Hero Gauge Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase ${
                isTargetAchieved 
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}>
                {isTargetAchieved ? '🎯 80% SLA Target Met!' : '⚠️ 80% SLA in Progress'}
              </span>
              <span className="text-xs text-slate-400 font-medium">Daily Target Threshold</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              24-Hour Scheduling Conversion: <span className={isTargetAchieved ? 'text-emerald-600' : 'text-amber-600'}>{slaRate.toFixed(1)}%</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
              <strong>{scheduled}</strong> of <strong>{total}</strong> interviews confirmed on Calendly within the 24-hour SLA window.
            </p>
          </div>

          {/* Progress Bar & Key Indicators */}
          <div className="w-full lg:w-96 space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex justify-between text-xs font-bold text-slate-700">
              <span>Current: {slaRate.toFixed(1)}%</span>
              <span className="text-indigo-600">Goal: ≥ 80.0%</span>
            </div>

            <div className="w-full bg-slate-200 h-3.5 rounded-full overflow-hidden relative">
              <div 
                className="absolute top-0 bottom-0 left-[80%] w-0.5 bg-slate-900 z-10" 
                title="80% SLA Line"
              />
              <div 
                className={`h-full rounded-full transition-all duration-700 ${
                  isTargetAchieved ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
                style={{ width: `${Math.min(100, (slaRate / 100) * 100)}%` }}
              />
            </div>

            <div className="flex justify-between text-[11px] text-slate-500">
              <span>0% Inflow</span>
              <span className="font-semibold text-slate-700">80% SLA Benchmark</span>
              <span>100% Full</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI 4-Card Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Confirmed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{scheduled}</div>
          <div className="text-xs text-emerald-700 font-semibold">{slaRate.toFixed(1)}% Conversion Rate</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">In Cadence</span>
            <Clock className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{inProgress}</div>
          <div className="text-xs text-slate-500 font-medium">WhatsApp / Call in progress</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Slot Escalations</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{escalated}</div>
          <div className="text-xs text-rose-700 font-medium">Awaiting company extra slots</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Drop-offs</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-black text-slate-900">{dropOff}</div>
          <div className="text-xs text-slate-500 font-medium">Declined / Withdrawn</div>
        </div>

      </div>

      {/* Intern Performance Comparison: Ram vs Shyam */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-base text-slate-900">Intern Performance Leaderboard</h3>
          </div>
          <span className="text-xs font-bold text-slate-500">250 Quota Equal Distribution</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Ram Card */}
          <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-black flex items-center justify-center text-sm">
                  R
                </div>
                <div>
                  <h4 className="font-bold text-sm text-blue-950">Ram (Shift Alpha)</h4>
                  <p className="text-[11px] text-blue-700 font-medium">Google, Tesla, Meta Focus</p>
                </div>
              </div>
              <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-300">
                {ramRate.toFixed(1)}% SLA
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-white p-2 rounded-lg border border-blue-100">
                <span className="text-slate-400 block text-[10px]">Queue</span>
                <span className="font-bold text-slate-900">{ramReqs.length}</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-blue-100">
                <span className="text-slate-400 block text-[10px]">Scheduled</span>
                <span className="font-bold text-emerald-700">{ramScheduled}</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-blue-100">
                <span className="text-slate-400 block text-[10px]">Total Calls</span>
                <span className="font-bold text-indigo-700">{ramCalls}</span>
              </div>
            </div>
          </div>

          {/* Shyam Card */}
          <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-600 text-white font-black flex items-center justify-center text-sm">
                  S
                </div>
                <div>
                  <h4 className="font-bold text-sm text-purple-950">Shyam (Shift Beta)</h4>
                  <p className="text-[11px] text-purple-700 font-medium">Reliance, Enterprise & Evening Blitz</p>
                </div>
              </div>
              <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 border border-purple-300">
                {shyamRate.toFixed(1)}% SLA
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-white p-2 rounded-lg border border-purple-100">
                <span className="text-slate-400 block text-[10px]">Queue</span>
                <span className="font-bold text-slate-900">{shyamReqs.length}</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-purple-100">
                <span className="text-slate-400 block text-[10px]">Scheduled</span>
                <span className="font-bold text-emerald-700">{shyamScheduled}</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-purple-100">
                <span className="text-slate-400 block text-[10px]">Total Calls</span>
                <span className="font-bold text-indigo-700">{shyamCalls}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Company Breakdown & Round Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Company Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-600" />
              <span>Partner Company Conversion</span>
            </h4>
            <span className="text-xs text-slate-400">{companyStats.length} Companies</span>
          </div>

          <div className="space-y-2 text-xs">
            {companyStats.map((item) => (
              <div key={item.company} className="space-y-1">
                <div className="flex justify-between font-semibold text-slate-700">
                  <span>{item.company}</span>
                  <span>{item.scheduled} / {item.total} ({item.rate.toFixed(1)}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-indigo-600 h-full rounded-full transition-all"
                    style={{ width: `${item.rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Round Distribution */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>Interview Round Velocity</span>
            </h4>
            <span className="text-xs text-slate-400">By Target Round</span>
          </div>

          <div className="space-y-3 text-xs">
            {Object.entries(roundCounts).map(([round, stats]) => {
              const rate = (stats.scheduled / stats.total) * 100;
              return (
                <div key={round} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span className="text-indigo-700">{round}</span>
                    <span className="text-emerald-700">{stats.scheduled} / {stats.total} ({rate.toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-emerald-500 h-full rounded-full transition-all"
                      style={{ width: `${rate}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
};
