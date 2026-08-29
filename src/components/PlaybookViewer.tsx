import React, { useState } from 'react';
import { 
  BookOpen, 
  Clock, 
  Phone, 
  MessageSquare, 
  Mail, 
  AlertTriangle, 
  CheckCircle2, 
  Copy, 
  Check, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  ShieldCheck, 
  HelpCircle,
  Sparkles,
  Users,
  Compass
} from 'lucide-react';
import { CADENCE_STEPS, CALLING_SCRIPTS, WHATSAPP_TEMPLATES, EDGE_CASES } from '../data/playbookData';

export const PlaybookViewer: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'cadence' | 'daily_schedule' | 'edge_cases' | 'templates'>('cadence');
  const [edgeCaseSearch, setEdgeCaseSearch] = useState('');
  const [selectedEdgeCategory, setSelectedEdgeCategory] = useState('All');
  const [expandedEdgeCase, setExpandedEdgeCase] = useState<string | null>(EDGE_CASES[0].id);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredEdgeCases = EDGE_CASES.filter(ec => {
    if (selectedEdgeCategory !== 'All' && ec.category !== selectedEdgeCategory) return false;
    if (edgeCaseSearch.trim()) {
      const q = edgeCaseSearch.toLowerCase();
      return ec.title.toLowerCase().includes(q) || ec.symptom.toLowerCase().includes(q) || ec.rootCause.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-200">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  The Zomato-Grade Operations Playbook
                </h2>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Zero Ambiguity Standard
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Standard Operating Procedure (SOP) designed for college interns Ram & Shyam to execute 500 daily requests flawlessly.
              </p>
            </div>
          </div>

          {/* Sub Navigation */}
          <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1.5 rounded-xl border border-slate-200/80">
            <button
              onClick={() => setActiveSubTab('cadence')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeSubTab === 'cadence'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ⏱️ 24h Cadence
            </button>
            <button
              onClick={() => setActiveSubTab('daily_schedule')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeSubTab === 'daily_schedule'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📅 Daily Schedule
            </button>
            <button
              onClick={() => setActiveSubTab('edge_cases')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeSubTab === 'edge_cases'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              ⚠️ Edge Case Matrix ({EDGE_CASES.length})
            </button>
            <button
              onClick={() => setActiveSubTab('templates')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeSubTab === 'templates'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              💬 Script Library
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: 24-HOUR CADENCE TIMELINE */}
      {activeSubTab === 'cadence' && (
        <div className="space-y-4">
          <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-4 text-xs text-indigo-950 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold">The Core Zomato Principle:</strong> Every lead follows a deterministic state machine. Interns never guess when to call or what to message—each trigger is time-bound and channel-optimized.
            </div>
          </div>

          <div className="space-y-4">
            {CADENCE_STEPS.map((step, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:shadow-md transition-all">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-black text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">{step.title}</h3>
                      <span className="text-xs font-mono font-semibold text-indigo-600">{step.timeframe}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                      Channel: <strong className="capitalize text-slate-900">{step.channel}</strong>
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Conversion: {step.expectedConversion}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 text-xs">
                  <div>
                    <span className="font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      SOP Directive (Intern Instruction)
                    </span>
                    <p className="text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                      {step.sopInstruction}
                    </p>
                  </div>

                  <div>
                    <span className="font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Script / Message Template Snippet
                    </span>
                    <div className="text-slate-800 font-mono bg-slate-900 text-slate-100 p-3 rounded-lg text-[11px] leading-relaxed relative">
                      {step.scriptSnippet}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: DAILY SCHEDULE & WORKLOAD BREAKDOWN */}
      {activeSubTab === 'daily_schedule' && (
        <div className="space-y-5">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Ram's Daily Schedule */}
            <div className="bg-white rounded-2xl border border-blue-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-blue-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-600" />
                  <h3 className="font-bold text-base text-blue-950">Ram's Daily Roster (Cohort A)</h3>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  250 Daily Leads
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-blue-50/50 border border-blue-100 space-y-1">
                  <div className="flex justify-between font-bold text-blue-900">
                    <span>09:30 AM - 10:30 AM (1 Hour)</span>
                    <span className="text-blue-600">Morning Drive</span>
                  </div>
                  <p className="text-slate-700">Review overnight ingested batch. Verify automated T-0 WhatsApps. Call top 30 overnight unresponsive leads.</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>10:30 AM - 01:00 PM (2.5 Hours)</span>
                    <span className="text-indigo-600">Peak Window 1 Calling</span>
                  </div>
                  <p className="text-slate-700">Execute daytime phone call sweeps for T+4h cohort (~50-60 calls). Book live on call via Concierge Mode.</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>02:00 PM - 04:30 PM (2.5 Hours)</span>
                    <span className="text-indigo-600">Slot Escalations & Inflow</span>
                  </div>
                  <p className="text-slate-700">Handle no-slot edge cases with company hiring managers. Dispatch T+2h follow-up WhatsApp cards.</p>
                </div>

                <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1">
                  <div className="flex justify-between font-bold text-amber-950">
                    <span>05:30 PM - 07:00 PM (1.5 Hours)</span>
                    <span className="text-amber-700">Evening Golden Hour Sweep</span>
                  </div>
                  <p className="text-slate-700">Dial remaining unscheduled candidates as they leave work. Close out day at &gt;80% SLA.</p>
                </div>
              </div>
            </div>

            {/* Shyam's Daily Schedule */}
            <div className="bg-white rounded-2xl border border-purple-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-purple-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-600" />
                  <h3 className="font-bold text-base text-purple-950">Shyam's Daily Roster (Cohort B)</h3>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                  250 Daily Leads
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-100 space-y-1">
                  <div className="flex justify-between font-bold text-purple-900">
                    <span>09:30 AM - 10:30 AM (1 Hour)</span>
                    <span className="text-purple-600">Morning Drive</span>
                  </div>
                  <p className="text-slate-700">Verify webhook status of yesterday's evening batch. Trigger T+18h urgent reminder SMS to remaining candidates.</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>10:30 AM - 01:00 PM (2.5 Hours)</span>
                    <span className="text-indigo-600">Peak Window 1 Calling</span>
                  </div>
                  <p className="text-slate-700">Execute daytime phone sweeps for Cohort B. Handle objections and timezone queries.</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>02:00 PM - 04:30 PM (2.5 Hours)</span>
                    <span className="text-indigo-600">Midday Audit & Concierge</span>
                  </div>
                  <p className="text-slate-700">Audit broken Calendly links and escalate 404s. Support high-urgency tickets for Ram if Ram is on call.</p>
                </div>

                <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 space-y-1">
                  <div className="flex justify-between font-bold text-amber-950">
                    <span>05:30 PM - 07:00 PM (1.5 Hours)</span>
                    <span className="text-amber-700">Evening Golden Hour Sweep</span>
                  </div>
                  <p className="text-slate-700">Evening call blitz. Finalize 24-hr scheduling goal and submit daily conversion summary report.</p>
                </div>
              </div>
            </div>

          </div>

          {/* Mathematical Proof of Workload Feasibility Card */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-3">
            <h4 className="font-bold text-sm text-indigo-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span>Mathematical Proof: 500 Daily Requests with 2 College Interns</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-white/10 rounded-xl p-3">
                <div className="text-slate-400">Total Inflow:</div>
                <div className="text-lg font-black text-white">500 Leads/Day</div>
                <div className="text-[11px] text-slate-300">250 per intern</div>
              </div>
              <div className="bg-white/10 rounded-xl p-3">
                <div className="text-slate-400">Auto-Scheduled (T0/T2 WA):</div>
                <div className="text-lg font-black text-emerald-400">~275 Leads (55%)</div>
                <div className="text-[11px] text-slate-300">Zero intern manual time</div>
              </div>
              <div className="bg-white/10 rounded-xl p-3">
                <div className="text-slate-400">Human Call Queue:</div>
                <div className="text-lg font-black text-amber-400">~225 Leads (45%)</div>
                <div className="text-[11px] text-slate-300">~112 calls/intern/day</div>
              </div>
              <div className="bg-white/10 rounded-xl p-3">
                <div className="text-slate-400">Intern Call Time Required:</div>
                <div className="text-lg font-black text-indigo-300">~3.5 Hours/Day</div>
                <div className="text-[11px] text-slate-300">Easily feasible within 7h shift</div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: EDGE CASE DECISION MATRIX */}
      {activeSubTab === 'edge_cases' && (
        <div className="space-y-4">
          
          {/* Edge Case Filter & Search */}
          <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-xl border border-slate-200">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={edgeCaseSearch}
                onChange={(e) => setEdgeCaseSearch(e.target.value)}
                placeholder="Search edge cases (e.g. no slots, ghosting, broken link, timezone)..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-slate-50"
              />
            </div>

            <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              {['All', 'Calendly & Tech', 'Candidate Behavior', 'Logistics & Timezone'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedEdgeCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    selectedEdgeCategory === cat
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Edge Case Accordion */}
          <div className="space-y-3">
            {filteredEdgeCases.map((ec) => {
              const isExpanded = expandedEdgeCase === ec.id;
              return (
                <div key={ec.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
                  
                  {/* Accordion Header */}
                  <button
                    onClick={() => setExpandedEdgeCase(isExpanded ? null : ec.id)}
                    className="w-full p-4 text-left flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                        {ec.id}
                      </span>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900">{ec.title}</h4>
                        <span className="text-[11px] text-slate-500 font-medium">{ec.category}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-slate-400">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </button>

                  {/* Accordion Content */}
                  {isExpanded && (
                    <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-4 text-xs">
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="bg-white p-3 rounded-lg border border-slate-200">
                          <span className="font-bold text-slate-400 uppercase text-[10px]">What Happens (Symptom):</span>
                          <p className="text-slate-800 font-medium mt-0.5">{ec.symptom}</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-slate-200">
                          <span className="font-bold text-slate-400 uppercase text-[10px]">Underlying Root Cause:</span>
                          <p className="text-slate-800 font-medium mt-0.5">{ec.rootCause}</p>
                        </div>
                      </div>

                      {/* Step-by-Step SOP Action */}
                      <div className="bg-indigo-50/80 border border-indigo-100 rounded-xl p-3.5 space-y-1.5">
                        <span className="font-bold text-indigo-950 uppercase tracking-wider text-[10px] block">
                          Intern Exact Action Protocol (Step-by-Step)
                        </span>
                        <ul className="space-y-1 text-slate-800">
                          {ec.internActionSOP.map((step, sIdx) => (
                            <li key={sIdx} className="flex items-start gap-1.5 font-medium">
                              <span className="text-indigo-600 font-bold">•</span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Copyable Template Response */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-slate-500 uppercase text-[10px]">
                            Ready-to-Send Template Response
                          </span>
                          <button
                            onClick={() => copyText(ec.id, ec.templateResponse)}
                            className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-bold"
                          >
                            {copiedId === ec.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedId === ec.id ? 'Copied!' : 'Copy Script'}</span>
                          </button>
                        </div>

                        <div className="p-3 bg-slate-900 text-slate-100 font-mono text-[11px] rounded-lg">
                          {ec.templateResponse}
                        </div>
                      </div>

                      {/* Escalation Rule */}
                      <div className="flex items-center gap-2 text-rose-700 bg-rose-50 border border-rose-200 p-2.5 rounded-lg font-semibold">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        <span>Escalation Rule: {ec.escalationRule}</span>
                      </div>

                    </div>
                  )}

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* TAB 4: SCRIPTS & MESSAGE LIBRARY */}
      {activeSubTab === 'templates' && (
        <div className="space-y-5">
          
          {/* WhatsApp Templates */}
          <div className="space-y-3">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-600" />
              <span>WhatsApp Multi-Touch Templates</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {WHATSAPP_TEMPLATES.map((tmpl) => (
                <div key={tmpl.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="font-bold text-xs text-slate-900">{tmpl.label}</span>
                    <button
                      onClick={() => copyText(tmpl.id, tmpl.text)}
                      className="inline-flex items-center gap-1 text-xs text-emerald-700 hover:text-emerald-800 font-bold"
                    >
                      {copiedId === tmpl.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedId === tmpl.id ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  <pre className="bg-slate-50 text-slate-800 font-sans text-xs p-3 rounded-lg whitespace-pre-wrap leading-relaxed border border-slate-100">
                    {tmpl.text}
                  </pre>
                </div>
              ))}
            </div>
          </div>

          {/* Calling Scripts */}
          <div className="space-y-3 pt-4 border-t border-slate-200">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Phone className="w-5 h-5 text-indigo-600" />
              <span>Phone Call Scripts & Dialogue Trees</span>
            </h3>

            <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-4 text-xs">
              <h4 className="font-bold text-sm text-indigo-900">{CALLING_SCRIPTS.script1_intro.title}</h4>
              <div className="space-y-2">
                {CALLING_SCRIPTS.script1_intro.dialogue.map((d, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
                    <span className="font-bold text-slate-900 text-xs block">{d.speaker}:</span>
                    <p className="text-slate-700 font-medium">{d.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
