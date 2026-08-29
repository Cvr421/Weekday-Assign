import { PlaybookStep, EdgeCaseItem, SimulatorScenario } from '../types';

export const CADENCE_STEPS: PlaybookStep[] = [
  {
    timeframe: "T + 0 min (Immediate Blast)",
    title: "1. Instant Multi-Channel Launch",
    action: "Personalized WhatsApp + Email Dispatch",
    channel: "whatsapp",
    targetAudience: "100% of newly ingested requests",
    sopInstruction: "Within 5 minutes of request ingestion, trigger the personalized WhatsApp message with the exact Round-specific Calendly link. Send an identical confirmation email with the subject line '[Action Required] Select Your Interview Slot with {Company}'.",
    scriptSnippet: "Hi {CandidateName}! 👋 Great news from Weekday! {Company} ({Interviewer}) was thrilled with your profile and is excited to schedule your {Round}. Please pick your preferred 30-min slot here: {CalendlyLink}. Let's lock this in today!",
    expectedConversion: "35% - 40% self-schedule immediately within 2 hours."
  },
  {
    timeframe: "T + 2 Hours",
    title: "2. The Slot Expiration Soft Nudge",
    action: "Automated WhatsApp Follow-up #1",
    channel: "whatsapp",
    targetAudience: "Candidates who haven't clicked/booked",
    sopInstruction: "If Calendly webhook has not fired after 2 hours, send Nudge #1 highlighting that interviewer availability fills up quickly.",
    scriptSnippet: "Hi {CandidateName}, slots for {Interviewer} at {Company} are filling up fast! ⏳ Quick reminder to grab your time slot here: {CalendlyLink}. Need any help picking a time?",
    expectedConversion: "+15% schedule (Cumulative: ~55%)."
  },
  {
    timeframe: "T + 4 to 6 Hours (Peak Call Window A)",
    title: "3. First Direct Human Call + Live Concierge",
    action: "Voice Call (Intern Ram/Shyam)",
    channel: "call",
    targetAudience: "Unscheduled candidates remaining (~225 leads total / ~112 per intern)",
    sopInstruction: "Intern calls candidate using Call Script #1. If candidate picks up: either guide them to click the link right now or offer to book the slot ON CALL directly into Calendly. If no answer, immediately dispatch WhatsApp 'Sorry we missed you' card.",
    scriptSnippet: "'Hey {CandidateName}, this is {InternName} from Weekday! Calling to help you lock in your interview with {Company}. Do you have your calendar open so we can pick a time that works best for you right now?'",
    expectedConversion: "+15% schedule (Cumulative: ~70%)."
  },
  {
    timeframe: "T + 12 Hours (Peak Call Window B: 6:00 - 7:30 PM)",
    title: "4. Evening High-Conversion Phone Outreach",
    action: "Second Voice Call + SMS Fallback",
    channel: "call",
    targetAudience: "Candidates still pending (Evening after-work peak response hour)",
    sopInstruction: "Candidates are now off work / finished classes. Re-dial remaining leads. Use Call Script #2 emphasizing company excitement and closing out tomorrow's roster.",
    scriptSnippet: "'Hi {CandidateName}, {InternName} from Weekday again! Just checking in before we close today's interview calendar with {Company}. Let's finalize your slot in under 30 seconds!'",
    expectedConversion: "+10% schedule (Cumulative: ~80% Goal Achieved!)."
  },
  {
    timeframe: "T + 18 to 20 Hours (Next Morning 9:30 AM)",
    title: "5. Critical SLA Rescue Drive",
    action: "Final Escalation Call + Priority SMS",
    channel: "call",
    targetAudience: "Remaining ~15-20% stubborn / missed cases",
    sopInstruction: "Final morning phone call. If candidate mentions date clashes or busy schedule, intern immediately offers alternate days or collects 3 custom available slots to manually coordinate with the hiring manager.",
    scriptSnippet: "'Hi {CandidateName}, we have 4 hours left before {Company}'s interview window expires for this round. If none of the Calendly times work, tell me 2-3 times you're free, and I will personally get the team to accommodate you!'",
    expectedConversion: "+5% to +8% (Cumulative: 85%+)."
  },
  {
    timeframe: "T + 22 Hours",
    title: "6. Manager & Recruiter Escalation",
    action: "Internal System Escalation Flag",
    channel: "system",
    targetAudience: "Unresolved edge cases & unresponsive candidates",
    sopInstruction: "Flag ticket as 'SLOT_ISSUE_ESCALATED' or 'CANDIDATE_UNRESPONSIVE' to Weekday Account Manager to notify the client company recruiter.",
    scriptSnippet: "Automated alert to Weekday Partner Success Lead: 'Ticket {ReqId}: Candidate {CandidateName} unreachable after 3 calls, 3 WhatsApps, 2 emails for {Company} {Round}. Requesting recruiter intervention.'",
    expectedConversion: "Safeguards client relationship & clears SLA audit."
  }
];

export const CALLING_SCRIPTS = {
  script1_intro: {
    title: "Call Script 1: Peak Hours Support Call (T+4h)",
    scenario: "Candidate answered initial call during business hours",
    dialogue: [
      { speaker: "Intern (Ram/Shyam)", text: "Hi [Candidate Name], this is [Ram/Shyam] from the Weekday Talent Scheduling Team! Hope you're having a productive day!" },
      { speaker: "Candidate", text: "Hey, yes, what is this regarding?" },
      { speaker: "Intern", text: "I'm calling regarding your upcoming [Round 1/2/3] interview with [Company Name]. [Interviewer Name] requested to meet you, and we sent the Calendly booking link to your WhatsApp and email. I wanted to check if you had a quick 30 seconds to lock in your preferred slot?" },
      { speaker: "Branch A (Candidate has link)", text: "Candidate: 'Oh yeah, I saw it, I was just busy.' -> Intern: 'Totally understand! How about tomorrow at 4 PM or Thursday at 11 AM? I have the calendar open right here and can reserve it for you instantly!'" },
      { speaker: "Branch B (Candidate hasn't seen link)", text: "Candidate: 'I didn't check WhatsApp yet.' -> Intern: 'No problem at all! I just re-sent it to your WhatsApp ending in [last 4 digits]. Go ahead and tap the link, or let me know what day suits you and I will submit it right now!'" }
    ]
  },
  script2_evening: {
    title: "Call Script 2: Evening Re-engagement (T+12h / 6:30 PM)",
    scenario: "Evening outreach when candidate has finished work",
    dialogue: [
      { speaker: "Intern", text: "Good evening [Candidate Name]! [Ram/Shyam] here from Weekday. Just following up to make sure we don't lose your interview slot with [Company Name]." },
      { speaker: "Intern", text: "The engineering team at [Company Name] is finalizing their interview roster for the week tonight. Is there any difficulty finding a convenient time on the Calendly link?" },
      { speaker: "Resolution", text: "If candidate shares custom time -> Intern enters custom time in ToDo sheet and books via Concierge Mode." }
    ]
  },
  script3_objection_handling: {
    title: "Objection Handling & Common Hesitations",
    items: [
      {
        objection: "Candidate: 'None of the available times on Calendly work with my current work schedule.'",
        rebuttal: "Intern: 'No problem at all! Please tell me 2 or 3 specific time slots between Monday and Friday that suit you best. I will directly coordinate with [Interviewer Name]'s team to add a custom slot for you right away.'"
      },
      {
        objection: "Candidate: 'I am no longer sure if I want to proceed with this company.'",
        rebuttal: "Intern: 'I understand! You previously mentioned high interest in their engineering team. The first round is a mutual conversation to learn about the tech stack with zero commitment. Would you like a 20-min casual slot to explore before making a final call?'"
      },
      {
        objection: "Candidate: 'Can we do Google Meet instead of Zoom / phone call?'",
        rebuttal: "Intern: 'Yes! All Calendly invites automatically generate a Google Meet / Zoom link upon booking. Once you select a time, the link will arrive directly on your Google Calendar.'"
      }
    ]
  }
};

export const WHATSAPP_TEMPLATES = [
  {
    id: "t0_initial",
    label: "T-0: Initial Excitement Invite",
    tag: "High Conversion",
    text: `Hi {{candidate}}! 👋 

Great news from Weekday! 🚀 *{{company}}* and {{interviewer}} are excited to move forward with your profile for the *{{round}}* interview!

Please pick a 30-minute time slot that works best for your schedule here:
🔗 {{calendly_link}}

_(Note: Slots are filled on a rolling basis. Please book within today to lock in your preferred time)._

Let me know once done or if you have any questions!
Best,
{{intern_name}} | Weekday Scheduling Team`
  },
  {
    id: "t2_nudge",
    label: "T+2h: Slot Scarcity Reminder",
    tag: "Follow-up",
    text: `Hi {{candidate}}, quick follow-up from Weekday! ⏰

Slots for {{interviewer}} at *{{company}}* are filling up for this week. 

👉 Grab your preferred interview time here: {{calendly_link}}

Takes under 30 seconds to confirm! Let me know if you need help picking a slot.`
  },
  {
    id: "t12_evening",
    label: "T+12h: Evening VIP Priority Note",
    tag: "Urgent",
    text: `Good evening {{candidate}}! 🌙

We are locking in tomorrow's interview calendar with the team at *{{company}}*. We really don't want you to miss out on this round!

Please pick your slot tonight:
🔗 {{calendly_link}}

If none of the timings work, simply reply with 2 slots you are free and I will personally book it for you! 🙌`
  },
  {
    id: "t20_final",
    label: "T+20h: Final 4-Hour Expiration Warning",
    tag: "Final Call",
    text: `⚠️ *URGENT: Interview Slot Expiration Alert*

Hi {{candidate}}, we have only *4 hours left* on our 24-hour scheduling window for your *{{company}}* interview with {{interviewer}}.

Please book now before the request is archived:
👉 {{calendly_link}}

Or reply *'BOOK NOW [Your Available Time]'* and I'll do it right away!`
  }
];

export const EDGE_CASES: EdgeCaseItem[] = [
  {
    id: "EC-01",
    title: "No Available Slots on Calendly (Calendar Full / 0 Slots)",
    category: "Calendly & Tech",
    symptom: "Candidate opens link and sees 'No times in this month' or 'All slots booked'.",
    rootCause: "Interviewer's Google Calendar is blocked, calendar sync expired, or slots were taken.",
    internActionSOP: [
      "1. Do NOT ask candidate to wait indefinitely.",
      "2. Ask candidate on WhatsApp/Call: 'Please reply with 3 preferred time slots over the next 3 days.'",
      "3. Mark status in ToDo Sheet as 'Slot Issue Escalated'.",
      "4. Trigger 1-Click Slack/Email alert to Company Account Manager with candidate's 3 slots so they request interviewer to open extra slots."
    ],
    templateResponse: "Hi {Candidate}! Apologies for that—looks like {Interviewer}'s public slots just filled up. Please reply with 2-3 times you're free this week (e.g., Wed 3 PM or Thu 11 AM) and I'll have the hiring manager open a dedicated slot for you right away!",
    escalationRule: "Escalate to Account Manager within 15 minutes of report."
  },
  {
    id: "EC-02",
    title: "Candidate Phone Switched Off / Continuous Unreachable",
    category: "Candidate Behavior",
    symptom: "Intern calls at T+4h and T+12h; phone goes directly to voicemail or switched off.",
    rootCause: "Candidate in office, bad network coverage, or silent mode.",
    internActionSOP: [
      "1. Do NOT spam 10 calls. Limit to maximum 2 calls per day.",
      "2. Send high-priority SMS (SMS has 98% delivery rate even when mobile data is off).",
      "3. Send high-priority WhatsApp with clear headline.",
      "4. Send calendar hold invite via email with a proposed default slot: 'We have provisionally held Wed 4 PM for you; click here to confirm or change'."
    ],
    templateResponse: "SMS: [Weekday] Hi {Candidate}, tried calling regarding your {Company} interview. Please lock your slot here: {CalendlyLink} or reply with your available time.",
    escalationRule: "Flag for Recruiter check at T+20h if zero delivery."
  },
  {
    id: "EC-03",
    title: "Wrong Calendly Link / 404 Page / Wrong Round Provided",
    category: "Calendly & Tech",
    symptom: "Company sent Round 1 link for a candidate eligible for Round 2, or URL is broken.",
    rootCause: "Company HR pasted wrong URL in batch upload sheet.",
    internActionSOP: [
      "1. Check the request details: verify if alternate round links (R1, R2, R3) exist in the sheet.",
      "2. If alternate link exists, replace and dispatch to candidate immediately with apology.",
      "3. If link is dead (404), notify Weekday Operations Manager instantly to ping HR for new link."
    ],
    templateResponse: "Hi {Candidate}, please use this updated direct link for your {Round}: {CorrectLink}. Apologies for the technical glitch!",
    escalationRule: "Immediate 10-minute turnaround with Company Account Executive."
  },
  {
    id: "EC-04",
    title: "Candidate Ghosting / Seen WhatsApp Messages But No Reply",
    category: "Candidate Behavior",
    symptom: "Blue ticks on WhatsApp at T+2h, but no booking after 6 hours.",
    rootCause: "Candidate procrastinating, at work, or feeling nervous about interview.",
    internActionSOP: [
      "1. Apply 'Frictionless Concierge Booking': Call candidate and say 'I know you're busy! Tell me any 30-min window between 9 AM - 8 PM and I will enter your details into Calendly for you right now!'",
      "2. Once candidate says 'Thursday 5 PM', intern opens Calendly link in browser, fills candidate name & email, and hits Submit.",
      "3. Candidate immediately receives Google Calendar invite without opening a single link!"
    ],
    templateResponse: "Hey {Candidate}! Super busy day? ☕ No worries at all—just reply with a time (like 'Tomorrow 4 PM') and I'll book it for you right now!",
    escalationRule: "None needed; concierge mode solves 80% of ghosting."
  },
  {
    id: "EC-05",
    title: "Candidate Claims 'I Already Booked' but Sheet Not Updated",
    category: "Calendly & Tech",
    symptom: "Candidate says they booked yesterday, but status is still pending in system.",
    rootCause: "Candidate used different email ID, booked on old link, or webhook delayed.",
    internActionSOP: [
      "1. Politely ask: 'Awesome! Did you receive the Google Meet / calendar invite?'",
      "2. Ask for the confirmed Date & Time of the interview.",
      "3. Intern manually verifies Calendly dashboard / interviewer calendar and updates status to 'Scheduled' with note: 'Confirmed manually via candidate confirmation'."
    ],
    templateResponse: "That's fantastic {Candidate}! Could you confirm what date & time your invite is set for so I can update our team's dashboard? Thanks a ton!",
    escalationRule: "Mark resolved immediately."
  },
  {
    id: "EC-06",
    title: "Candidate Reluctant / Cold Feet ('I have another offer / Need time')",
    category: "Candidate Behavior",
    symptom: "Candidate expresses hesitation to schedule round.",
    rootCause: "Competing offers, interview fatigue, or anxiety.",
    internActionSOP: [
      "1. Reassure candidate: 'This interview is purely exploratory. You can schedule for next week if you need prep time.'",
      "2. Remind them of {Company}'s unique advantages (fast process, competitive compensation).",
      "3. If candidate strictly declines, mark status as 'Drop Off' with specific reason logged in touchpoints."
    ],
    templateResponse: "Totally hear you {Candidate}. You don't have to interview this week—you can pick a slot 7-10 days out so you have plenty of time. Would next Tuesday or Wednesday suit you better?",
    escalationRule: "Log reason for analytics; notify talent partner."
  },
  {
    id: "EC-07",
    title: "Interviewer in Different Timezone (e.g. US/PST vs India/IST)",
    category: "Logistics & Timezone",
    symptom: "Candidate confused by Calendly displaying AM slots that are midnight IST.",
    rootCause: "Calendly timezone selector defaulting to interviewer's timezone.",
    internActionSOP: [
      "1. Guide candidate to the top right of the Calendly page: 'Change Timezone to Asia/Kolkata (IST)'.",
      "2. Or intern calculates the conversion and books on candidate's behalf in IST."
    ],
    templateResponse: "Hi {Candidate}, note that the interviewer is based in US PST. On the Calendly page, please ensure the dropdown at the top is set to 'India Standard Time (IST)' to see your local hours!",
    escalationRule: "Zero escalation; standard intern guidance."
  }
];

export const SIMULATOR_SCENARIOS: SimulatorScenario[] = [
  {
    id: "SIM-01",
    title: "The Overwhelmed Candidate at Work",
    candidateName: "Rohan Gupta",
    company: "Google (Sundar Pichai)",
    situation: "You sent the initial WhatsApp at 10:00 AM. It's now 2:30 PM (T+4.5h) and Rohan hasn't booked. You call him. He answers whisperingly: 'Hey, I'm stuck in an all-hands office meeting, can't talk right now!'",
    options: [
      {
        text: "Tell him: 'Okay sir, please open your email whenever free and book the Calendly link.'",
        isCorrect: false,
        feedback: "Incorrect! Passive advice leads to high drop-off. Rohan will likely forget by evening.",
        zomatoPrinciple: "Zomato Rule: Never leave the next step purely on the user's memory."
      },
      {
        text: "Quickly reply: 'Understood Rohan! Just reply to my WhatsApp with any time you're free tomorrow (e.g. 5 PM) and I will book it for you instantly!'",
        isCorrect: true,
        feedback: "Spot on! This removes all friction and enables 1-tap Concierge Booking without requiring him to browse a calendar.",
        zomatoPrinciple: "Zomato Rule #1: Eliminate customer cognitive load. Offer 1-tap concierge resolution."
      },
      {
        text: "Keep calling him every 30 minutes until he answers at his desk.",
        isCorrect: false,
        feedback: "Incorrect! Spam calling annoys candidates and leads to number blocking.",
        zomatoPrinciple: "Zomato Rule: Respect communication caps (Max 2 calls/day)."
      }
    ]
  },
  {
    id: "SIM-02",
    title: "The Completely Full Calendly Link",
    candidateName: "Sneha Reddy",
    company: "Tesla (Elon Musk)",
    situation: "Sneha messages you on WhatsApp: 'Hey Ram, I opened the Calendly link for Round 2 but every single day shows No Times Available! What should I do?'",
    options: [
      {
        text: "Tell Sneha: 'Please wait until Elon opens new slots next week, I will message you when ready.'",
        isCorrect: false,
        feedback: "Incorrect! The 24-hour SLA will breach and Sneha will lose momentum.",
        zomatoPrinciple: "Zomato Rule: Always take ownership and capture alternative inputs immediately."
      },
      {
        text: "Ask Sneha for 2-3 preferred slots right now, mark ticket 'Slot Issue Escalated', and immediately alert the Account Manager.",
        isCorrect: true,
        feedback: "Excellent! You capture the candidate's exact availability on the spot so the hiring manager can open targeted slots within 1 hour.",
        zomatoPrinciple: "Zomato Rule #2: Turn a blocker into structured input within 60 seconds."
      },
      {
        text: "Send her the Round 1 Calendly link instead to see if that has free slots.",
        isCorrect: false,
        feedback: "Danger! Sending the wrong round link creates interviewer chaos and candidate embarrassment.",
        zomatoPrinciple: "Zomato Rule: Strict protocol validation on URLs and interview rounds."
      }
    ]
  },
  {
    id: "SIM-03",
    title: "The Ghosting Candidate (T+18h SLA Critical)",
    candidateName: "Aditya Verma",
    company: "Meta (Mark Zuckerberg)",
    situation: "It's 10:00 AM the next day (T+18h). Aditya has seen 2 WhatsApps, received 1 email, and didn't answer yesterday's 5:00 PM call. 6 hours left before 24-hr SLA breach.",
    options: [
      {
        text: "Mark Aditya as 'Declined / Dropped Out' and close the ticket.",
        isCorrect: false,
        feedback: "Incorrect! You cannot drop candidates without explicit confirmation or SLA expiry.",
        zomatoPrinciple: "Zomato Rule: Pursue until final SLA threshold with structured escalation."
      },
      {
        text: "Make a high-priority morning call. If unanswered, send the 'T+20h Expiration & VIP Hold' WhatsApp & SMS giving him a direct 'Reply with 1 number' quick action.",
        isCorrect: true,
        feedback: "Perfect! Morning 9:30 - 10:30 AM is the highest-conversion window for reaching busy professionals.",
        zomatoPrinciple: "Zomato Rule #3: Time-window matching. Catch users during transition periods."
      },
      {
        text: "Email Mark Zuckerberg directly saying the candidate is refusing to book.",
        isCorrect: false,
        feedback: "Incorrect! Never escalate candidate ghosting directly to C-suite hiring managers without internal review.",
        zomatoPrinciple: "Zomato Rule: Respect hierarchy and escalation matrices."
      }
    ]
  }
];
