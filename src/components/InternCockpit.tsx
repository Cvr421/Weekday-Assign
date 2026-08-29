import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Phone, 
  MessageSquare, 
  CalendarCheck, 
  History, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  ChevronRight, 
  Sparkles, 
  Send, 
  ExternalLink,
  Users,
  Download,
  RotateCcw,
  ArrowUpDown,
  Zap,
  ShieldCheck,
  Check
} from 'lucide-react';
import { InterviewRequest, TaskStatus, InternAssignee } from '../types';
import confetti from 'canvas-confetti';

interface InternCockpitProps {
  requests: InterviewRequest[];
  onOpenCallModal: (req: InterviewRequest) => void;
  onOpenWhatsAppModal: (req: InterviewRequest) => void;
  onOpenConciergeModal: (req: InterviewRequest) => void;
  onOpenTouchpointsDrawer: (req: InterviewRequest) => void;
  onQuickUpdateStatus: (reqId: string, newStatus: TaskStatus) => void;
  onBatchBlastPending: () => void;
  onResetData: () => void;
}

export const InternCockpit: React.FC<InternCockpitProps> = ({
  requests,
  onOpenCallModal,
  onOpenWhatsAppModal,
  onOpenConciergeModal,
  onOpenTouchpointsDrawer,
  onQuickUpdateStatus,
  onBatchBlastPending,
  onResetData
}) => {
  const [selectedAssignee, setSelectedAssignee] = useState<InternAssignee | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlyUrgent, setOnlyUrgent] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState('All');
  const [sortBy, setSortBy] = useState<'sla_asc' | 'added_desc' | 'company'>('sla_asc');

  // Derive companies list
  const companyList = useMemo(() => {
    const set = new Set(requests.map(r => r.company));
    return ['All', ...Array.from(set)];
  }, [requests]);

  // Filtered requests
  const filteredRequests = useMemo(() => {
    const now = Date.now();
    return requests.filter(req => {
      // Assignee filter
      if (selectedAssignee !== 'All' && req.assignedTo !== selectedAssignee) return false;

      // Status filter
      if (statusFilter !== 'All' && req.status !== statusFilter) return false;

      // Urgent filter (< 8 hrs remaining)
      if (onlyUrgent) {
        const hoursLeft = (req.slaDeadlineTimestamp - now) / 3600000;
        if (hoursLeft >= 8 || req.status === 'scheduled') return false;
      }

      // Company filter
      if (selectedCompany !== 'All' && req.company !== selectedCompany) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = req.candidate.toLowerCase().includes(q);
        const matchComp = req.company.toLowerCase().includes(q);
        const matchInterviewer = req.interviewer.toLowerCase().includes(q);
        const matchPhone = req.candidatePhone.includes(q);
        const matchId = req.id.toLowerCase().includes(q);
        if (!matchName && !matchComp && !matchInterviewer && !matchPhone && !matchId) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'sla_asc') {
        // Scheduled items go to the bottom
        if (a.status === 'scheduled' && b.status !== 'scheduled') return 1;
        if (b.status === 'scheduled' && a.status !== 'scheduled') return -1;
        return a.slaDeadlineTimestamp - b.slaDeadlineTimestamp;
      }
      if (sortBy === 'added_desc') return b.addedTimestamp - a.addedTimestamp;
      if (sortBy === 'company') return a.company.localeCompare(b.company);
      return 0;
    });
  }, [requests, selectedAssignee, statusFilter, onlyUrgent, selectedCompany, searchQuery, sortBy]);

  // Counts for tabs
  const ramCount = requests.filter(r => r.assignedTo === 'Ram').length;
  const ramScheduled = requests.filter(r => r.assignedTo === 'Ram' && r.status === 'scheduled').length;
  const shyamCount = requests.filter(r => r.assignedTo === 'Shyam').length;
  const shyamScheduled = requests.filter(r => r.assignedTo === 'Shyam' && r.status === 'scheduled').length;

  const pendingT0Count = requests.filter(r => r.status === 'pending_t0').length;

  const exportCSV = () => {
    const headers = "ID,Company,Interviewer,Candidate,Candidate Email,Candidate Phone,Round,Assigned To,Status,Calls,WhatsApps,SLA Hours Left\n";
    const rows = filteredRequests.map(r => {
      const hoursLeft = Math.max(0, ((r.slaDeadlineTimestamp - Date.now()) / 3600000)).toFixed(1);
      return `"${r.id}","${r.company}","${r.interviewer}","${r.candidate}","${r.candidateEmail}","${r.candidatePhone}","${r.targetRound}","${r.assignedTo}","${r.status}",${r.callCount},${r.waCount},${hoursLeft}`;
    }).join("\n");

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `weekday_scheduling_tasks_${selectedAssignee}.csv`;
    a.click();
  };

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case 'scheduled':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Scheduled</span>
          </span>
        );
      case 'pending_t0':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-300 animate-pulse">
            <Zap className="w-3.5 h-3.5" />
            <span>New (Send WA)</span>
          </span>
        );
      case 'wa_sent':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-100 text-sky-800 border border-sky-300">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WA Sent (Waiting)</span>
          </span>
        );
      case 'call_attempt_1':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300">
            <Phone className="w-3.5 h-3.5" />
            <span>Call #1 Logged</span>
          </span>
        );
      case 'call_attempt_2':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-900 border border-orange-300">
            <Phone className="w-3.5 h-3.5" />
            <span>Call #2 (Urgent)</span>
          </span>
        );
      case 'slot_issue_escalated':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>No Slots on Calendly</span>
          </span>
        );
      case 'drop_off':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-200 text-slate-700">
            <span>Declined / Dropped</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
            {status}
          </span>
        );
    }
  };

  const getSlaTimerBadge = (deadlineMs: number, status: TaskStatus) => {
    if (status === 'scheduled') {
      return (
        <div className="flex items-center gap-1 text-emerald-700 font-bold text-xs">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>SLA Met</span>
        </div>
      );
    }

    const msLeft = deadlineMs - Date.now();
    const hoursLeft = Math.floor(msLeft / 3600000);
    const minsLeft = Math.floor((msLeft % 3600000) / 60000);

    if (msLeft <= 0) {
      return (
        <div className="flex items-center gap-1 text-rose-700 font-extrabold text-xs bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
          <span>SLA Breached ({Math.abs(hoursLeft)}h ago)</span>
        </div>
      );
    }

    if (hoursLeft < 6) {
      return (
        <div className="flex items-center gap-1 text-rose-700 font-bold text-xs bg-rose-50 px-2 py-0.5 rounded border border-rose-200 animate-pulse">
          <Clock className="w-3.5 h-3.5 text-rose-600" />
          <span>{hoursLeft}h {minsLeft}m left</span>
        </div>
      );
    }

    if (hoursLeft < 12) {
      return (
        <div className="flex items-center gap-1 text-amber-700 font-semibold text-xs bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          <span>{hoursLeft}h {minsLeft}m left</span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-1 text-slate-600 text-xs">
        <Clock className="w-3.5 h-3.5 text-slate-400" />
        <span>{hoursLeft}h {minsLeft}m left</span>
      </div>
    );
  };

  return (
    <div className="space-y-5">
      
      {/* Top Banner: Workload Allocation & Automation Trigger */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white rounded-2xl p-5 shadow-lg border border-indigo-700/50">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-indigo-500/30 text-indigo-200 border border-indigo-400/40 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Zomato-Grade Zero-Ambiguity Queue
              </span>
              <span className="text-xs text-indigo-300">500 Total Requests / Day</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Ram & Shyam's 24-Hour Scheduling Control Cockpit
            </h2>
            <p className="text-xs sm:text-sm text-indigo-200 mt-1 max-w-2xl">
              Every request is assigned a strict 24-hour SLA timer and a prescriptive <strong>Next Best Action</strong>. Interns simply follow the playbook step-by-step.
            </p>
          </div>

          {/* Quick Automation Actions */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {pendingT0Count > 0 && (
              <button
                id="batch-blast-btn"
                onClick={onBatchBlastPending}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold rounded-xl text-xs shadow-md transition-all active:scale-95"
                title="Simulate automated instant WhatsApp dispatch to all newly ingested requests"
              >
                <Zap className="w-4 h-4 text-slate-950" />
                <span>1-Click Auto Blast {pendingT0Count} New WhatsApps</span>
              </button>
            )}

            <button
              onClick={exportCSV}
              className="inline-flex items-center gap-1 px-3 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={onResetData}
              className="inline-flex items-center gap-1 px-3 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl text-xs transition-colors"
              title="Reset to initial 500 requests state"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* Intern Assignee Switcher Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        
        {/* All Leads */}
        <button
          onClick={() => setSelectedAssignee('All')}
          className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden ${
            selectedAssignee === 'All'
              ? 'bg-white border-indigo-600 shadow-md ring-2 ring-indigo-600/20'
              : 'bg-white/80 border-slate-200 hover:bg-white hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Operations Queue</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{requests.length}</span>
            <span className="text-xs text-slate-500 font-semibold">
              ({requests.filter(r => r.status === 'scheduled').length} Scheduled • {((requests.filter(r => r.status === 'scheduled').length / requests.length) * 100).toFixed(1)}%)
            </span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
            <div 
              className="bg-indigo-600 h-full rounded-full transition-all"
              style={{ width: `${(requests.filter(r => r.status === 'scheduled').length / requests.length) * 100}%` }}
            />
          </div>
        </button>

        {/* Ram's Workstation */}
        <button
          id="tab-ram-btn"
          onClick={() => setSelectedAssignee('Ram')}
          className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden ${
            selectedAssignee === 'Ram'
              ? 'bg-white border-blue-600 shadow-md ring-2 ring-blue-600/20'
              : 'bg-white/80 border-slate-200 hover:bg-white hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">Ram's Workstation</span>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              Shift A • 250 Daily Quota
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-blue-950">{ramScheduled}</span>
            <span className="text-xs text-slate-500 font-semibold">/ {ramCount} Scheduled ({((ramScheduled / ramCount) * 100).toFixed(1)}%)</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
            <div 
              className="bg-blue-600 h-full rounded-full transition-all"
              style={{ width: `${(ramScheduled / ramCount) * 100}%` }}
            />
          </div>
        </button>

        {/* Shyam's Workstation */}
        <button
          id="tab-shyam-btn"
          onClick={() => setSelectedAssignee('Shyam')}
          className={`p-4 rounded-xl border text-left transition-all relative overflow-hidden ${
            selectedAssignee === 'Shyam'
              ? 'bg-white border-purple-600 shadow-md ring-2 ring-purple-600/20'
              : 'bg-white/80 border-slate-200 hover:bg-white hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-purple-600" />
              <span className="text-xs font-bold text-purple-900 uppercase tracking-wider">Shyam's Workstation</span>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
              Shift B • 250 Daily Quota
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-purple-950">{shyamScheduled}</span>
            <span className="text-xs text-slate-500 font-semibold">/ {shyamCount} Scheduled ({((shyamScheduled / shyamCount) * 100).toFixed(1)}%)</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
            <div 
              className="bg-purple-600 h-full rounded-full transition-all"
              style={{ width: `${(shyamScheduled / shyamCount) * 100}%` }}
            />
          </div>
        </button>

      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          
          {/* Search Input */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search candidate name, company, interviewer, or phone..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-slate-50 focus:bg-white"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-slate-50 font-medium text-slate-700"
            >
              <option value="All">All Statuses</option>
              <option value="pending_t0">Pending T-0 (Needs WhatsApp)</option>
              <option value="wa_sent">WhatsApp Sent (Awaiting)</option>
              <option value="call_attempt_1">Call Attempt 1</option>
              <option value="call_attempt_2">Call Attempt 2 (Urgent)</option>
              <option value="scheduled">Scheduled ✅</option>
              <option value="slot_issue_escalated">No Slots on Calendly ⚠️</option>
              <option value="drop_off">Declined / Dropped</option>
            </select>
          </div>

          {/* Company Filter */}
          <div>
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-slate-50 font-medium text-slate-700"
            >
              {companyList.map(c => (
                <option key={c} value={c}>{c === 'All' ? 'All Companies' : c}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Quick Filter Toggles */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setOnlyUrgent(!onlyUrgent)}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-colors ${
                onlyUrgent
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Critical SLA Only (&lt;8h left)</span>
            </button>

            <span className="text-slate-400">|</span>

            <span className="text-slate-500">
              Showing <strong className="text-slate-800">{filteredRequests.length}</strong> tasks
            </span>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-2 text-slate-600">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs bg-transparent border-0 font-semibold text-indigo-700 cursor-pointer focus:ring-0"
            >
              <option value="sla_asc">SLA Urgency (Shortest Time First)</option>
              <option value="added_desc">Recently Added</option>
              <option value="company">Company Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* Task List / Table */}
      <div className="space-y-3">
        {filteredRequests.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">Queue is Clear!</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No tasks match your current filter settings. Try adjusting the search query or status filter.
            </p>
          </div>
        ) : (
          filteredRequests.map((request) => {
            const targetCalendly = request.calendlyLinks.find(l => l.round === request.targetRound)?.url 
              || request.calendlyLinks[0]?.url 
              || 'https://calendly.com';

            return (
              <div
                key={request.id}
                className={`bg-white rounded-xl border p-4 shadow-2xs hover:shadow-md transition-all space-y-3 ${
                  request.status === 'scheduled'
                    ? 'border-emerald-200/80 bg-emerald-50/10'
                    : request.priority === 'urgent'
                    ? 'border-rose-200 bg-rose-50/20'
                    : 'border-slate-200'
                }`}
              >
                {/* Row Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      {request.id}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900">{request.candidate}</h4>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs font-mono font-medium text-slate-600">{request.candidatePhone}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {getStatusBadge(request.status)}
                    {getSlaTimerBadge(request.slaDeadlineTimestamp, request.status)}
                  </div>
                </div>

                {/* Company & Round Context */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs bg-slate-50 rounded-lg p-2.5 border border-slate-100">
                  <div>
                    <span className="text-slate-400">Target Company:</span>
                    <div className="font-bold text-slate-900 mt-0.5">{request.company}</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Interviewer & Round:</span>
                    <div className="font-semibold text-slate-800 mt-0.5">
                      {request.interviewer} • <span className="text-indigo-600 font-bold">{request.targetRound}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-slate-400">Owner & Touchpoints:</span>
                    <div className="font-medium text-slate-700 mt-0.5">
                      Assigned to <strong>{request.assignedTo}</strong> ({request.callCount} calls, {request.waCount} WA)
                    </div>
                  </div>
                </div>

                {/* Next Best Action (NBA) Guidance Box */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-indigo-50/50 border border-indigo-100 rounded-lg p-2.5 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-md bg-indigo-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                      NBA
                    </div>
                    <div>
                      <span className="text-slate-500 font-medium">Next Action Due: </span>
                      <strong className="text-indigo-950 font-bold">{request.nextActionSummary}</strong>
                    </div>
                  </div>

                  {/* 1-Click Action Hub */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    
                    {/* Send WhatsApp */}
                    <button
                      onClick={() => onOpenWhatsAppModal(request)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-2xs transition-colors"
                      title="Open WhatsApp Dispatcher"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </button>

                    {/* Make Call */}
                    <button
                      onClick={() => onOpenCallModal(request)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-2xs transition-colors"
                      title="Open Telephony & Script Guide"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Script</span>
                    </button>

                    {/* Concierge Direct Book */}
                    <button
                      onClick={() => onOpenConciergeModal(request)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold shadow-2xs transition-colors"
                      title="Book live on candidate's behalf or collect 3 slots"
                    >
                      <CalendarCheck className="w-3.5 h-3.5" />
                      <span>Concierge Book</span>
                    </button>

                    {/* Audit History */}
                    <button
                      onClick={() => onOpenTouchpointsDrawer(request)}
                      className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                      title="View Touchpoints Audit Trail"
                    >
                      <History className="w-3.5 h-3.5 text-slate-500" />
                      <span>Logs ({request.touchpoints.length})</span>
                    </button>

                    {/* Quick Mark Scheduled */}
                    {request.status !== 'scheduled' && (
                      <button
                        onClick={() => {
                          onQuickUpdateStatus(request.id, 'scheduled');
                          confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold transition-colors"
                        title="Mark as Scheduled"
                      >
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Done</span>
                      </button>
                    )}

                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
