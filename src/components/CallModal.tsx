import React, { useState } from 'react';
import { 
  Phone, 
  PhoneCall, 
  PhoneOff, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  X, 
  Calendar, 
  ExternalLink,
  ChevronRight,
  MessageSquare,
  HelpCircle,
  Copy,
  Check
} from 'lucide-react';
import { InterviewRequest, TaskStatus } from '../types';
import { CALLING_SCRIPTS } from '../data/playbookData';

interface CallModalProps {
  request: InterviewRequest;
  onClose: () => void;
  onLogCallOutcome: (
    requestId: string, 
    outcome: string, 
    newStatus: TaskStatus, 
    notes?: string
  ) => void;
}

export const CallModal: React.FC<CallModalProps> = ({
  request,
  onClose,
  onLogCallOutcome
}) => {
  const [selectedScript, setSelectedScript] = useState<'script1' | 'script2' | 'objections'>('script1');
  const [customNote, setCustomNote] = useState('');
  const [copied, setCopied] = useState(false);

  const targetCalendly = request.calendlyLinks.find(l => l.round === request.targetRound)?.url 
    || request.calendlyLinks[0]?.url 
    || 'https://calendly.com';

  const copyPhone = () => {
    navigator.clipboard.writeText(request.candidatePhone);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-indigo-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-700 flex items-center justify-center text-indigo-100">
              <PhoneCall className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg">{request.candidate}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-800 text-indigo-200 font-mono">
                  {request.id}
                </span>
              </div>
              <p className="text-xs text-indigo-200">
                {request.company} • {request.targetRound} ({request.interviewer})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-indigo-200 hover:text-white hover:bg-indigo-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          
          {/* Quick Info & Telephony Card */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs text-slate-500 font-medium">Candidate Contact</div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-base font-bold text-slate-900 font-mono">
                  {request.candidatePhone}
                </span>
                <button
                  onClick={copyPhone}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded"
                  title="Copy Phone Number"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`tel:${request.candidatePhone}`}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Dial from Device</span>
              </a>
              <a
                href={targetCalendly}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-semibold shadow-xs transition-colors"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Open Calendly</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </div>
          </div>

          {/* Script Guidance Tabs */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Intern Script Playbook (Follow Blindly)
              </span>
              <div className="flex gap-1">
                <button
                  onClick={() => setSelectedScript('script1')}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                    selectedScript === 'script1' 
                      ? 'bg-indigo-100 text-indigo-800' 
                      : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  Daytime Script (T+4h)
                </button>
                <button
                  onClick={() => setSelectedScript('script2')}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                    selectedScript === 'script2' 
                      ? 'bg-indigo-100 text-indigo-800' 
                      : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  Evening Script (T+12h)
                </button>
                <button
                  onClick={() => setSelectedScript('objections')}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors ${
                    selectedScript === 'objections' 
                      ? 'bg-indigo-100 text-indigo-800' 
                      : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  Objections
                </button>
              </div>
            </div>

            {/* Script Display */}
            {selectedScript === 'script1' && (
              <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-4 space-y-2.5 text-xs text-slate-800">
                <p className="font-semibold text-indigo-900">
                  🗣️ "Hi <strong className="text-indigo-950">{request.candidate.split(' ')[0]}</strong>, this is <strong className="text-indigo-950">{request.assignedTo}</strong> from the Weekday Scheduling Team! Calling regarding your upcoming <strong className="text-indigo-950">{request.targetRound}</strong> interview with <strong className="text-indigo-950">{request.company}</strong>."
                </p>
                <p className="text-slate-700">
                  👉 "The hiring manager, {request.interviewer}, is eager to connect. We sent your Calendly invite on WhatsApp—can we quickly pick the 30-min slot together right now so you don't lose the slot?"
                </p>
                <div className="mt-2 pt-2 border-t border-indigo-200/60 flex items-center justify-between text-[11px] text-indigo-700 font-medium">
                  <span>💡 Tip: If candidate is on the move, offer to book for them right now!</span>
                </div>
              </div>
            )}

            {selectedScript === 'script2' && (
              <div className="bg-amber-50/70 border border-amber-100 rounded-xl p-4 space-y-2.5 text-xs text-slate-800">
                <p className="font-semibold text-amber-950">
                  🗣️ "Good evening <strong className="text-amber-950">{request.candidate.split(' ')[0]}</strong>! <strong className="text-amber-950">{request.assignedTo}</strong> from Weekday here. Following up before the {request.company} scheduling window wraps up tonight."
                </p>
                <p className="text-slate-700">
                  👉 "We want to make sure you get your top choice time before slots get booked by other candidates. Would tomorrow afternoon or Thursday morning work better for you?"
                </p>
              </div>
            )}

            {selectedScript === 'objections' && (
              <div className="space-y-2 text-xs">
                {CALLING_SCRIPTS.script3_objection_handling.items.map((item, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1">
                    <div className="font-semibold text-rose-700">{item.objection}</div>
                    <div className="text-slate-700 font-medium">{item.rebuttal}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Call Outcome Logging Action Grid */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Select Call Outcome (Instant Auto-Update)
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              
              {/* Option 1: Booked on Call */}
              <button
                id="outcome-booked-btn"
                onClick={() => onLogCallOutcome(
                  request.id, 
                  'Booked on call via Concierge mode', 
                  'scheduled',
                  customNote || 'Candidate chose slot live on phone call'
                )}
                className="flex items-center gap-2.5 p-3 rounded-xl border border-emerald-300 bg-emerald-50/70 hover:bg-emerald-100/80 text-emerald-950 text-left transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-emerald-900 group-hover:text-emerald-950">
                    Booked Live on Call
                  </div>
                  <div className="text-[11px] text-emerald-700 truncate">
                    Mark as Scheduled (100% Win)
                  </div>
                </div>
              </button>

              {/* Option 2: Promised within 1 Hour */}
              <button
                onClick={() => onLogCallOutcome(
                  request.id, 
                  'Spoke with candidate - Promised to book within 1h', 
                  request.status === 'pending_t0' ? 'call_attempt_1' : 'call_attempt_2',
                  customNote || 'Candidate agreed to click link before end of day'
                )}
                className="flex items-center gap-2.5 p-3 rounded-xl border border-indigo-200 bg-indigo-50/70 hover:bg-indigo-100/80 text-indigo-950 text-left transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-500 text-white flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-indigo-900 group-hover:text-indigo-950">
                    Promised to Book
                  </div>
                  <div className="text-[11px] text-indigo-700 truncate">
                    Will click within 1 hour
                  </div>
                </div>
              </button>

              {/* Option 3: No Answer / Unreachable */}
              <button
                onClick={() => onLogCallOutcome(
                  request.id, 
                  'Call Unanswered / Voicemail - Triggered WhatsApp nudge', 
                  request.callCount >= 1 ? 'call_attempt_2' : 'call_attempt_1',
                  customNote || 'No pickup. Sent automated missed call card.'
                )}
                className="flex items-center gap-2.5 p-3 rounded-xl border border-amber-200 bg-amber-50/70 hover:bg-amber-100/80 text-amber-950 text-left transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0">
                  <PhoneOff className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-amber-900 group-hover:text-amber-950">
                    Unanswered / Busy
                  </div>
                  <div className="text-[11px] text-amber-700 truncate">
                    Log attempt #{request.callCount + 1} & WhatsApp Nudge
                  </div>
                </div>
              </button>

              {/* Option 4: Slot Issue on Calendly */}
              <button
                onClick={() => onLogCallOutcome(
                  request.id, 
                  'Slot issue: Candidate reported 0 available slots on Calendly', 
                  'slot_issue_escalated',
                  customNote || 'Requested candidate for 3 free slots to give to company'
                )}
                className="flex items-center gap-2.5 p-3 rounded-xl border border-rose-200 bg-rose-50/70 hover:bg-rose-100/80 text-rose-950 text-left transition-all group"
              >
                <div className="w-8 h-8 rounded-lg bg-rose-500 text-white flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-rose-900 group-hover:text-rose-950">
                    No Slots on Link (Escalate)
                  </div>
                  <div className="text-[11px] text-rose-700 truncate">
                    Auto-alert Company Recruiter
                  </div>
                </div>
              </button>

            </div>
          </div>

          {/* Optional Note Box */}
          <div>
            <label className="text-xs font-medium text-slate-600 block mb-1">
              Custom Call Note (Optional)
            </label>
            <input
              type="text"
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
              placeholder="e.g. Free Thursday after 3 PM, requested Zoom link"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden"
            />
          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-between text-xs text-slate-500">
          <span>Intern: <strong className="text-slate-800">{request.assignedTo}</strong> • SLA Deadline: in {Math.max(0, Math.round((request.slaDeadlineTimestamp - Date.now()) / 3600000))} hrs</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-semibold transition-colors"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
};
