import React, { useState } from 'react';
import { 
  CalendarCheck, 
  X, 
  ExternalLink, 
  Send, 
  Clock, 
  CheckCircle2, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { InterviewRequest, TaskStatus } from '../types';

interface ConciergeBookingModalProps {
  request: InterviewRequest;
  onClose: () => void;
  onConfirmBooking: (
    requestId: string, 
    confirmedTime: string, 
    notes: string
  ) => void;
  onEscalateCustomSlots: (
    requestId: string, 
    slots: string, 
    notes: string
  ) => void;
}

export const ConciergeBookingModal: React.FC<ConciergeBookingModalProps> = ({
  request,
  onClose,
  onConfirmBooking,
  onEscalateCustomSlots
}) => {
  const [mode, setMode] = useState<'instant_book' | 'custom_slots'>('instant_book');
  const [confirmedDate, setConfirmedDate] = useState('');
  const [confirmedTime, setConfirmedTime] = useState('16:00');
  const [slot1, setSlot1] = useState('Tomorrow 4:00 PM - 5:00 PM IST');
  const [slot2, setSlot2] = useState('Thursday 11:00 AM - 12:00 PM IST');
  const [slot3, setSlot3] = useState('Friday 3:30 PM - 4:30 PM IST');
  const [notes, setNotes] = useState('');

  const targetCalendly = request.calendlyLinks.find(l => l.round === request.targetRound)?.url 
    || request.calendlyLinks[0]?.url 
    || 'https://calendly.com';

  const handleInstantConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    const timeStr = `${confirmedDate || 'Confirmed Date'} at ${confirmedTime}`;
    onConfirmBooking(request.id, timeStr, notes || 'Booked live via Concierge Mode');
  };

  const handleCustomEscalate = (e: React.FormEvent) => {
    e.preventDefault();
    const slotsCombined = `Slot 1: ${slot1}\nSlot 2: ${slot2}\nSlot 3: ${slot3}`;
    onEscalateCustomSlots(request.id, slotsCombined, notes || 'Candidate requested custom availability');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Concierge Booking Hub</h3>
              <p className="text-xs text-slate-300">
                {request.candidate} • {request.company} ({request.targetRound})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex border-b border-slate-200 bg-slate-50 p-2 gap-2">
          <button
            onClick={() => setMode('instant_book')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
              mode === 'instant_book'
                ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ⚡ Direct Slot Confirmation
          </button>
          <button
            onClick={() => setMode('custom_slots')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
              mode === 'custom_slots'
                ? 'bg-white text-indigo-700 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📋 Collect 3 Custom Slots
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          
          {mode === 'instant_book' ? (
            <form onSubmit={handleInstantConfirm} className="space-y-4">
              
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3.5 text-xs text-indigo-900 space-y-1.5">
                <div className="font-bold flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>How Concierge Booking Works</span>
                </div>
                <p className="text-indigo-800">
                  Open the Calendly link below while on call with {request.candidate}. Choose the slot they prefer, fill their email, submit it, and mark as Scheduled here!
                </p>
                <div className="pt-2">
                  <a
                    href={targetCalendly}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
                  >
                    <span>Open {request.company}'s Calendly</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Confirmed Date
                  </label>
                  <input
                    type="date"
                    required
                    value={confirmedDate}
                    onChange={(e) => setConfirmedDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Confirmed Time Slot
                  </label>
                  <input
                    type="time"
                    required
                    value={confirmedTime}
                    onChange={(e) => setConfirmedTime(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Confirmation Details / Notes
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Candidate confirmed Google Meet invite received"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm & Mark as Scheduled (SLA Achieved)</span>
              </button>

            </form>
          ) : (
            <form onSubmit={handleCustomEscalate} className="space-y-4">
              
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-950 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-amber-900">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>No Free Slots on Calendly?</span>
                </div>
                <p className="text-amber-800">
                  Collect 3 time slots when {request.candidate} is available. This will immediately trigger an escalation ticket to {request.company}'s Account Manager.
                </p>
              </div>

              <div className="space-y-2.5">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Preferred Option 1
                  </label>
                  <input
                    type="text"
                    required
                    value={slot1}
                    onChange={(e) => setSlot1(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Preferred Option 2
                  </label>
                  <input
                    type="text"
                    required
                    value={slot2}
                    onChange={(e) => setSlot2(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Preferred Option 3
                  </label>
                  <input
                    type="text"
                    value={slot3}
                    onChange={(e) => setSlot3(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>Submit 3 Slots & Alert {request.company} Manager</span>
              </button>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
