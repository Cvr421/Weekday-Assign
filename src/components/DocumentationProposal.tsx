import React, { useState } from 'react';
import { 
  FileText, 
  Copy, 
  Check, 
  Download, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Layers, 
  Target, 
  Cpu, 
  ArrowRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

export const DocumentationProposal: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState('exec_summary');

  const copyFullProposal = () => {
    const el = document.getElementById('full-proposal-content');
    if (el) {
      navigator.clipboard.writeText(el.innerText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadMarkdown = () => {
    const el = document.getElementById('full-proposal-content');
    if (!el) return;
    const blob = new Blob([el.innerText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Weekday_Scheduling_Automation_Proposal.md';
    a.click();
  };

  return (
    <div className="space-y-6">
      
      {/* Header Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Official Assignment Submission
            </span>
            <span className="text-xs text-slate-400 font-mono">DOC-WEEKDAY-SOP-2026</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Workflow Automation & Scheduling System Proposal
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Zomato-inspired operations playbook for scaling 500+ daily interview requests with an 80% 24-hr SLA.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={copyFullProposal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl text-xs transition-colors border border-indigo-200"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Full Document!' : 'Copy Proposal'}</span>
          </button>

          <button
            onClick={downloadMarkdown}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .MD</span>
          </button>
        </div>
      </div>

      {/* Main Document Body */}
      <div id="full-proposal-content" className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-8 text-slate-800 text-sm leading-relaxed">
        
        {/* Section 1: Executive Summary */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <Target className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-black text-slate-900 tracking-tight">
              1. Executive Summary & Problem Breakdown
            </h3>
          </div>
          
          <p>
            <strong>Context:</strong> Weekday connects 100+ high-growth partner companies (e.g., Google, Tesla, Meta, Reliance) with pre-vetted top talent. Every single day, over <strong>500 interview scheduling requests</strong> arrive with company-specific Calendly links. The candidates have already agreed in principle to be interviewed. The core mandate is to <strong>guarantee that ≥80% of all interviews are scheduled within 24 hours</strong> using a team of 2 college interns (Ram and Shyam).
          </p>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs">
            <h4 className="font-bold text-slate-900">The Mathematical Reality & Challenge:</h4>
            <ul className="list-disc list-inside space-y-1 text-slate-700">
              <li><strong>Volume:</strong> 500 requests / day ÷ 2 interns = <strong>250 requests per intern per day</strong>.</li>
              <li><strong>Available Working Time:</strong> 8-hour workday = 480 minutes total.</li>
              <li><strong>Manual Budget Constraint:</strong> If handled 100% manually by calling, each intern would have only <strong>1.92 minutes per candidate</strong> (impossible to research, dial, explain, and follow up).</li>
              <li><strong>Solution:</strong> A <em>Zomato-grade deterministic automation funnel</em> where 55%–60% self-schedule via instant automated multi-channel triggers (WhatsApp + Email), reducing the active human calling queue to ~110 calls per intern per day (~3.5 hours of dedicated calling), completely within human capacity.</li>
            </ul>
          </div>
        </section>

        {/* Section 2: Core Assumptions */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-black text-slate-900 tracking-tight">
              2. Core Assumptions & Real-World Environmental Variables
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
              <strong className="text-indigo-900 font-bold">1. Candidate Intent & Channel Behavior:</strong>
              <p className="text-slate-700">Candidates have pre-agreed to interview. Therefore, non-scheduling is caused by friction, busy schedules, or forgetting—not lack of interest. In India/global tech, WhatsApp open rates exceed 85% within 15 minutes, whereas cold email open rates hover around 22%.</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
              <strong className="text-indigo-900 font-bold">2. Calendly Technical Integration:</strong>
              <p className="text-slate-700">Calendly webhooks automatically notify Weekday's system upon booking. When an invite is booked, the task immediately transitions to 'Scheduled' without intern manual data entry.</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
              <strong className="text-indigo-900 font-bold">3. Intern Skill Level & Guardrails:</strong>
              <p className="text-slate-700">Ram and Shyam are college interns. The system MUST NOT require creative ad-hoc decision-making under stress. Every screen provides a <em>"Next Best Action" (NBA)</em> directive and pre-written scripts.</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1.5">
              <strong className="text-indigo-900 font-bold">4. Real-World Constraints:</strong>
              <p className="text-slate-700">Candidates may have switched-off phones during work hours (11 AM–4 PM), full Calendly slots, or timezone confusions. The playbook provides precise fallback paths for all scenarios.</p>
            </div>
          </div>
        </section>

        {/* Section 3: Workload Division */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <Layers className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-black text-slate-900 tracking-tight">
              3. Workload Division & Operational Architecture (Ram vs. Shyam)
            </h3>
          </div>

          <p>
            We deploy a <strong>Hybrid Split: Staged Cohort Ownership + High-Urgency Swarm Protocol</strong>:
          </p>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border-l-4 border-blue-500 pl-3">
                <h5 className="font-bold text-blue-900">Ram: Cohort Alpha (250 Leads)</h5>
                <p className="text-slate-600 mt-1">Focuses on Ingestion Batches 1 & 2 (Google, Tesla, Meta accounts). Manages daytime outreach (T+4h peak window) and active Calendly slot auditing.</p>
              </div>

              <div className="border-l-4 border-purple-500 pl-3">
                <h5 className="font-bold text-purple-900">Shyam: Cohort Beta (250 Leads)</h5>
                <p className="text-slate-600 mt-1">Focuses on Ingestion Batches 3 & 4 (Reliance, Startups, Enterprise accounts). Manages evening golden-hour blitz (T+12h) and next-morning critical recovery sweeps.</p>
              </div>
            </div>

            <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-lg text-indigo-950 font-medium">
              ⚡ <strong>The Swarm Rule:</strong> Whenever any intern's queue has more than 15 tasks entering the Critical SLA Zone (&lt;8h left), the system automatically flags these for both interns to co-call until urgency returns to green.
            </div>
          </div>
        </section>

        {/* Section 4: 24-Hour Cadence Matrix */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-black text-slate-900 tracking-tight">
              4. The Zomato-Style 24-Hour Multi-Touch Cadence Engine
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-3">Timeline</th>
                  <th className="p-3">Channel</th>
                  <th className="p-3">Automated vs Manual</th>
                  <th className="p-3">Action Description</th>
                  <th className="p-3">Expected Cumulative %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="p-3 font-bold text-indigo-600">T + 0 min</td>
                  <td className="p-3">WhatsApp + Email</td>
                  <td className="p-3 font-semibold text-emerald-600">Automated</td>
                  <td className="p-3">Personalized invite with Round-specific Calendly link and company intro.</td>
                  <td className="p-3 font-bold">35% - 40%</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-indigo-600">T + 2 hours</td>
                  <td className="p-3">WhatsApp</td>
                  <td className="p-3 font-semibold text-emerald-600">Automated</td>
                  <td className="p-3">Slot scarcity nudge: "Slots are filling up for this week—grab yours here."</td>
                  <td className="p-3 font-bold">50% - 55%</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-indigo-600">T + 4-6 hours</td>
                  <td className="p-3">Voice Call + WA Card</td>
                  <td className="p-3 font-semibold text-indigo-600">Intern Call</td>
                  <td className="p-3">Peak Window 1 Call: Inquire if free to book right now; offer Concierge Booking.</td>
                  <td className="p-3 font-bold">68% - 72%</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-indigo-600">T + 12 hours</td>
                  <td className="p-3">Voice Call + SMS</td>
                  <td className="p-3 font-semibold text-indigo-600">Intern Call</td>
                  <td className="p-3">Golden Hour (6-7:30 PM): Candidates leave work. Direct dial + SMS hold reminder.</td>
                  <td className="p-3 font-bold">80% (SLA Target Met)</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-indigo-600">T + 18-20 hours</td>
                  <td className="p-3">Voice Call + Priority SMS</td>
                  <td className="p-3 font-semibold text-rose-600">High Urgency Call</td>
                  <td className="p-3">Morning Recovery (9:30 AM): Final 4-hr warning. Collect 3 custom slots if clashes exist.</td>
                  <td className="p-3 font-bold">85% - 88%</td>
                </tr>
                <tr>
                  <td className="p-3 font-bold text-indigo-600">T + 22 hours</td>
                  <td className="p-3">System Slack/Email</td>
                  <td className="p-3 font-semibold text-purple-600">Manager Alert</td>
                  <td className="p-3">Escalate unresponsive or blocked cases to Weekday Account Manager.</td>
                  <td className="p-3 font-bold">Audit Protected</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 5: Innovative Ideas */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-black text-slate-900 tracking-tight">
              5. Innovative Ideas (The Weekday Competitive Advantage)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <h5 className="font-bold text-slate-900">💡 1. Frictionless Concierge "Book-on-Call"</h5>
              <p className="text-slate-600">Instead of telling the candidate to open a link, the intern opens Calendly while on call, asks "Is Thursday 4 PM good?", types candidate's email, and hits submit. Candidate gets the invite with zero effort.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <h5 className="font-bold text-slate-900">💡 2. WhatsApp 1-Click Interactive Buttons</h5>
              <p className="text-slate-600">Deploy WhatsApp Business Cloud API with interactive buttons: [Book in 30s 🔗] [Request Custom Time ⏰] [Need Help 💬]. Interactive messages increase response rates by 3.2x.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <h5 className="font-bold text-slate-900">💡 3. Automated Calendly Slot Scraper & Buffer Alerts</h5>
              <p className="text-slate-600">System pings partner Calendly links every 4 hours. If an interviewer has &lt;2 available slots, system automatically pings the company HR before candidates even encounter a dead end.</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <h5 className="font-bold text-slate-900">💡 4. Zomato "Rider" Gamification for Interns</h5>
              <p className="text-slate-600">Live leaderboard tracking 24-hr completion velocity, fastest first-call response, and zero-breach badges to keep interns motivated and focused on SLA achievements.</p>
            </div>
          </div>
        </section>

        {/* Section 6: Technology Architecture */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <Cpu className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-black text-slate-900 tracking-tight">
              6. Technology & Automation Blueprint
            </h3>
          </div>

          <div className="bg-slate-900 text-white rounded-xl p-5 font-mono text-xs space-y-3">
            <div className="text-indigo-300 font-bold">// Scalable Production Architecture</div>
            <div className="text-slate-300 leading-relaxed">
              1. <strong>Ingestion API / Sheet Sync:</strong> Partner companies submit batch CSV or API webhook &rarr; Auto-generates unique ticket with 24h countdown.<br />
              2. <strong>WhatsApp Cloud API:</strong> Automated webhook triggers initial template + deep link.<br />
              3. <strong>Calendly Webhook Listener:</strong> Listens for 'invitee.created' events &rarr; Matches candidate email &rarr; Instantly marks status 'Scheduled' and clears SLA timer.<br />
              4. <strong>Telephony Integration (Exotel/Twilio/Click-to-Call):</strong> Intern clicks 'Dial', calls connect with zero manual phone dialing and automatic call recording.<br />
              5. <strong>Slack Escalation Bot:</strong> Alerts #ops-escalations when a ticket hits 20 hours unbooked.
            </div>
          </div>
        </section>

        {/* Section 7: Success Metrics */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <CheckCircle2 className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-black text-slate-900 tracking-tight">
              7. Success Metrics & Quality Governance
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl">
              <span className="text-emerald-700 font-bold block">Primary Goal:</span>
              <span className="text-xl font-black text-emerald-950">≥ 80.0%</span>
              <span className="text-[11px] text-emerald-800 block mt-0.5">Scheduled in 24h</span>
            </div>

            <div className="bg-indigo-50 border border-indigo-200 p-3 rounded-xl">
              <span className="text-indigo-700 font-bold block">Target MTTS:</span>
              <span className="text-xl font-black text-indigo-950">&lt; 8.5 Hours</span>
              <span className="text-[11px] text-indigo-800 block mt-0.5">Mean Time to Schedule</span>
            </div>

            <div className="bg-purple-50 border border-purple-200 p-3 rounded-xl">
              <span className="text-purple-700 font-bold block">First Call Resolution:</span>
              <span className="text-xl font-black text-purple-950">≥ 65.0%</span>
              <span className="text-[11px] text-purple-800 block mt-0.5">Booked on Call 1</span>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl">
              <span className="text-amber-700 font-bold block">Zero-Slot Escalation:</span>
              <span className="text-xl font-black text-amber-950">&lt; 15 Mins</span>
              <span className="text-[11px] text-amber-800 block mt-0.5">Company SLA turnaround</span>
            </div>
          </div>
        </section>

      </div>

    </div>
  );
};
