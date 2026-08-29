export type RoundType = 'Round1' | 'Round2' | 'Round3' | 'HR Round' | 'Technical Round';

export type TaskStatus = 
  | 'pending_t0'          // Just added, needs initial outreach
  | 'wa_sent'             // WhatsApp sent, awaiting candidate action
  | 'email_sent'          // Email sent
  | 'call_attempt_1'      // Called once (no answer or promised later)
  | 'call_attempt_2'      // Called twice (escalated nudge)
  | 'scheduled'           // Successfully booked on Calendly!
  | 'drop_off'            // Candidate declined / dropped out
  | 'slot_issue_escalated'// No slots on Calendly, escalated to company
  | 'sla_breached';       // Passed 24h without scheduling

export type PriorityLevel = 'urgent' | 'high' | 'normal';

export type InternAssignee = 'Ram' | 'Shyam' | 'Unassigned';

export interface TouchpointLog {
  id: string;
  timestamp: string;
  channel: 'whatsapp' | 'call' | 'email' | 'system' | 'manual';
  performedBy: string;
  outcome: string;
  notes?: string;
}

export interface InterviewRequest {
  id: string;
  company: string;
  interviewer: string;
  interviewerEmail: string;
  candidate: string;
  candidateEmail: string;
  candidatePhone: string;
  schedulingMethod: string;
  calendlyLinks: {
    round: string;
    url: string;
  }[];
  targetRound: string;
  addedOn: string;
  addedTimestamp: number; // ms timestamp for SLA calculations
  slaDeadlineTimestamp: number; // addedTimestamp + 24 hours
  assignedTo: InternAssignee;
  status: TaskStatus;
  priority: PriorityLevel;
  scheduledTime?: string;
  notes?: string;
  callCount: number;
  waCount: number;
  emailCount: number;
  lastContactedAt?: string;
  touchpoints: TouchpointLog[];
  nextActionDue?: string;
  nextActionSummary?: string;
  isEscalated?: boolean;
}

export interface PlaybookStep {
  timeframe: string;
  title: string;
  action: string;
  channel: 'whatsapp' | 'call' | 'email' | 'system';
  targetAudience: string;
  sopInstruction: string;
  scriptSnippet: string;
  expectedConversion: string;
}

export interface EdgeCaseItem {
  id: string;
  title: string;
  category: 'Calendly & Tech' | 'Candidate Behavior' | 'Interviewer & Company' | 'Logistics & Timezone';
  symptom: string;
  rootCause: string;
  internActionSOP: string[];
  templateResponse: string;
  escalationRule: string;
}

export interface SimulatorScenario {
  id: string;
  title: string;
  candidateName: string;
  company: string;
  situation: string;
  options: {
    text: string;
    isCorrect: boolean;
    feedback: string;
    zomatoPrinciple: string;
  }[];
}
