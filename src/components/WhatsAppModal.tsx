import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  Copy, 
  Check, 
  X, 
  ExternalLink,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { InterviewRequest, TaskStatus } from '../types';
import { WHATSAPP_TEMPLATES } from '../data/playbookData';

interface WhatsAppModalProps {
  request: InterviewRequest;
  onClose: () => void;
  onSendWhatsApp: (
    requestId: string, 
    templateId: string, 
    outcome: string, 
    newStatus: TaskStatus
  ) => void;
}

export const WhatsAppModal: React.FC<WhatsAppModalProps> = ({
  request,
  onClose,
  onSendWhatsApp
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState(
    request.status === 'pending_t0' ? 't0_initial' :
    request.status === 'wa_sent' ? 't2_nudge' :
    request.status === 'call_attempt_1' ? 't12_evening' : 't20_final'
  );
  const [copied, setCopied] = useState(false);

  const targetCalendly = request.calendlyLinks.find(l => l.round === request.targetRound)?.url 
    || request.calendlyLinks[0]?.url 
    || 'https://calendly.com';

  const selectedTemplate = WHATSAPP_TEMPLATES.find(t => t.id === selectedTemplateId) || WHATSAPP_TEMPLATES[0];

  const processedText = selectedTemplate.text
    .replace(/\{\{candidate\}\}/g, request.candidate.split(' ')[0])
    .replace(/\{\{company\}\}/g, request.company)
    .replace(/\{\{interviewer\}\}/g, request.interviewer)
    .replace(/\{\{round\}\}/g, request.targetRound)
    .replace(/\{\{calendly_link\}\}/g, targetCalendly)
    .replace(/\{\{intern_name\}\}/g, request.assignedTo);

  const sanitizedPhone = request.candidatePhone.replace(/[^0-9]/g, '');
  const waWebUrl = `https://api.whatsapp.com/send?phone=${sanitizedPhone}&text=${encodeURIComponent(processedText)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(processedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDispatch = () => {
    // Open WhatsApp Web/App
    window.open(waWebUrl, '_blank');
    
    // Log outcome
    const newStatus: TaskStatus = request.status === 'pending_t0' ? 'wa_sent' : request.status;
    onSendWhatsApp(
      request.id,
      selectedTemplateId,
      `WhatsApp Dispatched: ${selectedTemplate.label}`,
      newStatus
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-emerald-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg">{request.candidate}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-900 text-emerald-200 font-mono">
                  {request.candidatePhone}
                </span>
              </div>
              <p className="text-xs text-emerald-200">
                {request.company} • {request.targetRound} ({request.interviewer})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          
          {/* Template Selector Chips */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
              Select WhatsApp Playbook Template
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {WHATSAPP_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => setSelectedTemplateId(tmpl.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    selectedTemplateId === tmpl.id
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-semibold ring-1 ring-emerald-600'
                      : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="text-xs font-bold leading-tight">{tmpl.label.split(':')[0]}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{tmpl.tag}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Live Message Preview Box */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-slate-600">
                Message Preview (Personalized with Candidate & Calendly Link)
              </span>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1 text-xs text-emerald-700 hover:text-emerald-800 font-semibold"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Text'}</span>
              </button>
            </div>

            <div className="bg-emerald-950 text-emerald-100 rounded-xl p-4 font-mono text-xs whitespace-pre-wrap leading-relaxed shadow-inner border border-emerald-900">
              {processedText}
            </div>
          </div>

          {/* Quick Target URL Box */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between text-xs">
            <span className="text-slate-600 truncate max-w-xs sm:max-w-md">
              <strong className="text-slate-800">Target Calendly:</strong> {targetCalendly}
            </span>
            <a
              href={targetCalendly}
              target="_blank"
              rel="noreferrer"
              className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 shrink-0 ml-2"
            >
              <span>Test Link</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Dispatches directly to <strong className="text-slate-800">{request.candidatePhone}</strong>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
            >
              Cancel
            </button>

            <button
              id="dispatch-wa-btn"
              onClick={handleDispatch}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>Launch WhatsApp & Log</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
