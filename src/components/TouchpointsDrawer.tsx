import React, { useState } from 'react';
import { 
  History, 
  X, 
  MessageSquare, 
  Phone, 
  Mail, 
  Cpu, 
  Edit3, 
  Plus, 
  CheckCircle2, 
  Clock,
  User
} from 'lucide-react';
import { InterviewRequest, TouchpointLog } from '../types';

interface TouchpointsDrawerProps {
  request: InterviewRequest;
  onClose: () => void;
  onAddNote: (requestId: string, note: string) => void;
}

export const TouchpointsDrawer: React.FC<TouchpointsDrawerProps> = ({
  request,
  onClose,
  onAddNote
}) => {
  const [newNote, setNewNote] = useState('');

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    onAddNote(request.id, newNote.trim());
    setNewNote('');
  };

  const getChannelIcon = (channel: TouchpointLog['channel']) => {
    switch (channel) {
      case 'whatsapp':
        return <MessageSquare className="w-4 h-4 text-emerald-600" />;
      case 'call':
        return <Phone className="w-4 h-4 text-indigo-600" />;
      case 'email':
        return <Mail className="w-4 h-4 text-sky-600" />;
      case 'system':
        return <Cpu className="w-4 h-4 text-purple-600" />;
      default:
        return <Edit3 className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md h-full shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">{request.candidate}</h3>
              <p className="text-xs text-slate-500">{request.company} • {request.targetRound}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lead Overview Card */}
        <div className="p-4 bg-indigo-50/50 border-b border-indigo-100 text-xs space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-slate-500">Phone:</span>
              <div className="font-mono font-semibold text-slate-900">{request.candidatePhone}</div>
            </div>
            <div>
              <span className="text-slate-500">Assigned To:</span>
              <div className="font-semibold text-slate-900">{request.assignedTo}</div>
            </div>
            <div>
              <span className="text-slate-500">Calls / WhatsApps:</span>
              <div className="font-semibold text-slate-900">{request.callCount} calls • {request.waCount} WA</div>
            </div>
            <div>
              <span className="text-slate-500">Current Status:</span>
              <div className="font-bold text-indigo-700 uppercase">{request.status.replace(/_/g, ' ')}</div>
            </div>
          </div>
        </div>

        {/* Timeline Log */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Chronological Audit Trail ({request.touchpoints.length} Events)
          </h4>

          <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {request.touchpoints.map((tp, idx) => (
              <div key={tp.id || idx} className="relative group">
                <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-white border-2 border-slate-300 group-hover:border-indigo-500 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-indigo-600" />
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1 group-hover:border-indigo-200 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                      {getChannelIcon(tp.channel)}
                      <span className="capitalize">{tp.channel}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">{tp.timestamp}</span>
                  </div>

                  <p className="text-slate-700 font-medium">{tp.outcome}</p>

                  {tp.notes && (
                    <div className="text-[11px] text-slate-500 bg-white p-2 rounded border border-slate-100 mt-1">
                      {tp.notes}
                    </div>
                  )}

                  <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-1">
                    <User className="w-3 h-3" />
                    <span>By: {tp.performedBy}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Manual Note Form */}
        <form onSubmit={handleAddNote} className="p-3 border-t border-slate-200 bg-slate-50">
          <div className="flex gap-2">
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Add internal note or update..."
              className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
            />
            <button
              type="submit"
              disabled={!newNote.trim()}
              className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
