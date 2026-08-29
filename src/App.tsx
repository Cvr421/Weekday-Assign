import React, { useState, useEffect } from 'react';
import { Navbar, NavTab } from './components/Navbar';
import { InternCockpit } from './components/InternCockpit';
import { PlaybookViewer } from './components/PlaybookViewer';
import { DocumentationProposal } from './components/DocumentationProposal';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { EdgeCaseSimulator } from './components/EdgeCaseSimulator';
import { CallModal } from './components/CallModal';
import { WhatsAppModal } from './components/WhatsAppModal';
import { ConciergeBookingModal } from './components/ConciergeBookingModal';
import { TouchpointsDrawer } from './components/TouchpointsDrawer';
import { generateInitialRequests } from './data/mockRequests';
import { InterviewRequest, TaskStatus } from './types';
import confetti from 'canvas-confetti';

const STORAGE_KEY = 'weekday_scheduling_requests_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('cockpit');
  
  // Persistent requests state
  const [requests, setRequests] = useState<InterviewRequest[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse cached requests', e);
      }
    }
    return generateInitialRequests();
  });

  // Active Modals
  const [callModalReq, setCallModalReq] = useState<InterviewRequest | null>(null);
  const [whatsAppModalReq, setWhatsAppModalReq] = useState<InterviewRequest | null>(null);
  const [conciergeModalReq, setConciergeModalReq] = useState<InterviewRequest | null>(null);
  const [touchpointsDrawerReq, setTouchpointsDrawerReq] = useState<InterviewRequest | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  }, [requests]);

  // Derived metrics
  const totalRequests = requests.length;
  const scheduledCount = requests.filter(r => r.status === 'scheduled').length;
  const slaRate = totalRequests > 0 ? (scheduledCount / totalRequests) * 100 : 0;
  
  const now = Date.now();
  const urgentCount = requests.filter(r => {
    const hoursLeft = (r.slaDeadlineTimestamp - now) / 3600000;
    return hoursLeft < 8 && r.status !== 'scheduled';
  }).length;

  // Handle Call Outcome
  const handleLogCallOutcome = (
    requestId: string, 
    outcome: string, 
    newStatus: TaskStatus, 
    notes?: string
  ) => {
    setRequests(prev => prev.map(req => {
      if (req.id !== requestId) return req;
      
      const newCallCount = req.callCount + 1;
      const updatedTouchpoints = [
        ...req.touchpoints,
        {
          id: `tp-call-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          channel: 'call' as const,
          performedBy: req.assignedTo,
          outcome,
          notes
        }
      ];

      let nextActionDue = 'In 4 hours';
      let nextActionSummary = '📞 Next Follow-up Call Sweep';
      if (newStatus === 'scheduled') {
        nextActionDue = 'None';
        nextActionSummary = '✅ Confirmed on Calendly';
      } else if (newStatus === 'slot_issue_escalated') {
        nextActionDue = 'Pending Company';
        nextActionSummary = '⏳ Awaiting Hiring Manager extra slots';
      }

      return {
        ...req,
        status: newStatus,
        callCount: newCallCount,
        lastContactedAt: new Date().toISOString(),
        touchpoints: updatedTouchpoints,
        nextActionDue,
        nextActionSummary
      };
    }));

    setCallModalReq(null);
  };

  // Handle WhatsApp Sent
  const handleSendWhatsApp = (
    requestId: string, 
    templateId: string, 
    outcome: string, 
    newStatus: TaskStatus
  ) => {
    setRequests(prev => prev.map(req => {
      if (req.id !== requestId) return req;
      
      const updatedTouchpoints = [
        ...req.touchpoints,
        {
          id: `tp-wa-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          channel: 'whatsapp' as const,
          performedBy: req.assignedTo,
          outcome,
          notes: `Template used: ${templateId}`
        }
      ];

      return {
        ...req,
        status: newStatus,
        waCount: req.waCount + 1,
        lastContactedAt: new Date().toISOString(),
        touchpoints: updatedTouchpoints,
        nextActionDue: 'In 2 hours',
        nextActionSummary: '📞 First Call Sweep if not booked by T+2h'
      };
    }));

    setWhatsAppModalReq(null);
  };

  // Handle Concierge Booking
  const handleConfirmBooking = (requestId: string, confirmedTime: string, notes: string) => {
    setRequests(prev => prev.map(req => {
      if (req.id !== requestId) return req;
      
      return {
        ...req,
        status: 'scheduled',
        scheduledTime: confirmedTime,
        touchpoints: [
          ...req.touchpoints,
          {
            id: `tp-concierge-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            channel: 'system' as const,
            performedBy: `${req.assignedTo} (Concierge)`,
            outcome: `Slot booked successfully for ${confirmedTime}`,
            notes
          }
        ],
        nextActionDue: 'None',
        nextActionSummary: '✅ Confirmed on Calendly'
      };
    }));

    confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
    setConciergeModalReq(null);
  };

  // Handle Escalating Custom Slots
  const handleEscalateCustomSlots = (requestId: string, slots: string, notes: string) => {
    setRequests(prev => prev.map(req => {
      if (req.id !== requestId) return req;
      
      return {
        ...req,
        status: 'slot_issue_escalated',
        isEscalated: true,
        touchpoints: [
          ...req.touchpoints,
          {
            id: `tp-custom-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            channel: 'system' as const,
            performedBy: req.assignedTo,
            outcome: 'Collected 3 Custom Slots & Escalated to Company Account Manager',
            notes: `${slots}\n${notes}`
          }
        ],
        nextActionDue: 'Pending Company',
        nextActionSummary: '⏳ Awaiting Hiring Manager custom slot confirmation'
      };
    }));

    setConciergeModalReq(null);
  };

  // Quick Status Update
  const handleQuickUpdateStatus = (reqId: string, newStatus: TaskStatus) => {
    setRequests(prev => prev.map(req => {
      if (req.id !== reqId) return req;
      return {
        ...req,
        status: newStatus,
        touchpoints: [
          ...req.touchpoints,
          {
            id: `tp-quick-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            channel: 'manual' as const,
            performedBy: req.assignedTo,
            outcome: `Status changed to ${newStatus.replace(/_/g, ' ')}`
          }
        ],
        nextActionSummary: newStatus === 'scheduled' ? '✅ Confirmed' : req.nextActionSummary
      };
    }));
  };

  // Batch Blast T-0 Pending
  const handleBatchBlastPending = () => {
    setRequests(prev => prev.map(req => {
      if (req.status !== 'pending_t0') return req;
      return {
        ...req,
        status: 'wa_sent',
        waCount: req.waCount + 1,
        touchpoints: [
          ...req.touchpoints,
          {
            id: `tp-batch-${Date.now()}-${req.id}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            channel: 'whatsapp' as const,
            performedBy: 'Weekday Auto-Blast',
            outcome: 'Automated Initial Calendly Invite WhatsApp Dispatched'
          }
        ],
        nextActionDue: 'In 2 hours',
        nextActionSummary: '📞 First Call Sweep if not booked by T+2h'
      };
    }));

    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
  };

  // Add note to touchpoints
  const handleAddNote = (requestId: string, note: string) => {
    setRequests(prev => prev.map(req => {
      if (req.id !== requestId) return req;
      return {
        ...req,
        touchpoints: [
          ...req.touchpoints,
          {
            id: `tp-note-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            channel: 'manual' as const,
            performedBy: req.assignedTo,
            outcome: 'Note Added',
            notes: note
          }
        ]
      };
    }));
  };

  // Reset Data
  const handleResetData = () => {
    if (window.confirm('Reset all task statuses to the initial 500 requests state?')) {
      const fresh = generateInitialRequests();
      setRequests(fresh);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Top App Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        totalRequests={totalRequests}
        scheduledCount={scheduledCount}
        slaRate={slaRate}
        urgentCount={urgentCount}
      />

      {/* Main Container View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {activeTab === 'cockpit' && (
          <InternCockpit
            requests={requests}
            onOpenCallModal={(req) => setCallModalReq(req)}
            onOpenWhatsAppModal={(req) => setWhatsAppModalReq(req)}
            onOpenConciergeModal={(req) => setConciergeModalReq(req)}
            onOpenTouchpointsDrawer={(req) => setTouchpointsDrawerReq(req)}
            onQuickUpdateStatus={handleQuickUpdateStatus}
            onBatchBlastPending={handleBatchBlastPending}
            onResetData={handleResetData}
          />
        )}

        {activeTab === 'playbook' && (
          <PlaybookViewer />
        )}

        {activeTab === 'proposal' && (
          <DocumentationProposal />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard requests={requests} />
        )}

        {activeTab === 'simulator' && (
          <EdgeCaseSimulator />
        )}

      </main>

      {/* Modals & Drawers */}
      {callModalReq && (
        <CallModal
          request={callModalReq}
          onClose={() => setCallModalReq(null)}
          onLogCallOutcome={handleLogCallOutcome}
        />
      )}

      {whatsAppModalReq && (
        <WhatsAppModal
          request={whatsAppModalReq}
          onClose={() => setWhatsAppModalReq(null)}
          onSendWhatsApp={handleSendWhatsApp}
        />
      )}

      {conciergeModalReq && (
        <ConciergeBookingModal
          request={conciergeModalReq}
          onClose={() => setConciergeModalReq(null)}
          onConfirmBooking={handleConfirmBooking}
          onEscalateCustomSlots={handleEscalateCustomSlots}
        />
      )}

      {touchpointsDrawerReq && (
        <TouchpointsDrawer
          request={touchpointsDrawerReq}
          onClose={() => setTouchpointsDrawerReq(null)}
          onAddNote={handleAddNote}
        />
      )}

    </div>
  );
}
