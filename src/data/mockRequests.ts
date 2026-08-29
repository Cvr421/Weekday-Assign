import { InterviewRequest, TouchpointLog } from '../types';

const BASE_CSV_RAW = [
  { company: "Google", interviewer: "Sundar Pichai", interviewerEmail: "sundar@google.com", candidate: "Chetan Sharma", candidateEmail: "chetan@weekday.works", candidatePhone: "+91 9920264452", round: "Round1", addedOn: "2 Nov 19:51", status: "pending_t0" as const },
  { company: "Google", interviewer: "Eric Schmidt", interviewerEmail: "eric@google.com", candidate: "Aarav Patel", candidateEmail: "aarav.p@gmail.com", candidatePhone: "+91 9820154321", round: "Round1", addedOn: "2 Nov 14:51", status: "wa_sent" as const },
  { company: "Tesla", interviewer: "Elon Musk", interviewerEmail: "elon@tesla.com", candidate: "Rohan Verma", candidateEmail: "rohan.v@outlook.com", candidatePhone: "+91 9811234567", round: "Round2", addedOn: "2 Nov 16:43", status: "scheduled" as const },
  { company: "Google", interviewer: "Sergey Brin", interviewerEmail: "sergey@google.com", candidate: "Priya Nair", candidateEmail: "priya.nair@techmail.com", candidatePhone: "+91 9711987654", round: "Round1", addedOn: "2 Nov 18:57", status: "wa_sent" as const },
  { company: "Meta", interviewer: "Mark Zuckerberg", interviewerEmail: "mark@meta.com", candidate: "Ananya Iyer", candidateEmail: "ananya.iyer@gmail.com", candidatePhone: "+91 9940123456", round: "Round1", addedOn: "2 Nov 16:51", status: "call_attempt_1" as const },
  { company: "Meta", interviewer: "Sheryl Sandberg", interviewerEmail: "sheryl@meta.com", candidate: "Vikram Malhotra", candidateEmail: "vikram.m@domain.co", candidatePhone: "+91 9876543210", round: "Round2", addedOn: "2 Nov 19:11", status: "pending_t0" as const },
  { company: "Tesla", interviewer: "Elon Musk", interviewerEmail: "elon@tesla.com", candidate: "Kavita Rao", candidateEmail: "kavita.rao@live.com", candidatePhone: "+91 9845012345", round: "Round3", addedOn: "2 Nov 11:51", status: "scheduled" as const },
  { company: "Meta", interviewer: "Mark Zuckerberg", interviewerEmail: "mark@meta.com", candidate: "Aditya Deshmukh", candidateEmail: "aditya.d@yahoo.com", candidatePhone: "+91 9822098765", round: "Round2", addedOn: "2 Nov 10:51", status: "scheduled" as const },
  { company: "Meta", interviewer: "Kevin Weil", interviewerEmail: "kevin@meta.com", candidate: "Sneha Sen", candidateEmail: "sneha.sen@gmail.com", candidatePhone: "+91 9830112233", round: "Round1", addedOn: "2 Nov 19:21", status: "wa_sent" as const },
  { company: "Tesla", interviewer: "Parag Agrawal", interviewerEmail: "parag@tesla.com", candidate: "Rahul Kapoor", candidateEmail: "rahul.k@startup.in", candidatePhone: "+91 9810099887", round: "Round2", addedOn: "2 Nov 19:51", status: "call_attempt_1" as const },
  { company: "Reliance", interviewer: "Mukesh Ambani", interviewerEmail: "mukesh@reliance.com", candidate: "Tanvi Gupta", candidateEmail: "tanvi.g@iitb.ac.in", candidatePhone: "+91 9988776655", round: "Round1", addedOn: "2 Nov 19:51", status: "wa_sent" as const },
  { company: "Reliance", interviewer: "Mukesh Ambani", interviewerEmail: "mukesh@reliance.com", candidate: "Deepak Mehra", candidateEmail: "deepak.m@rediff.com", candidatePhone: "+91 9765432109", round: "Round2", addedOn: "2 Nov 19:51", status: "scheduled" as const },
  { company: "Reliance", interviewer: "Mukesh Ambani", interviewerEmail: "mukesh@reliance.com", candidate: "Shreya Joshi", candidateEmail: "shreya.j@gmail.com", candidatePhone: "+91 9911223344", round: "Round3", addedOn: "2 Nov 19:51", status: "pending_t0" as const },
  { company: "Google", interviewer: "Sundar Pichai", interviewerEmail: "sundar@google.com", candidate: "Arjun Bhatia", candidateEmail: "arjun.b@gmail.com", candidatePhone: "+91 9899112233", round: "Round1", addedOn: "2 Nov 19:51", status: "scheduled" as const },
  { company: "Google", interviewer: "Sundar Pichai", interviewerEmail: "sundar@google.com", candidate: "Meera Menon", candidateEmail: "meera.m@gmail.com", candidatePhone: "+91 9744112233", round: "Round3", addedOn: "2 Nov 19:51", status: "slot_issue_escalated" as const },
  { company: "Tesla", interviewer: "Elon Musk", interviewerEmail: "elon@tesla.com", candidate: "Siddharth Jain", candidateEmail: "sid.jain@gmail.com", candidatePhone: "+91 9820011223", round: "Round1", addedOn: "2 Nov 19:51", status: "scheduled" as const },
  { company: "Google", interviewer: "Sundar Pichai", interviewerEmail: "sundar@google.com", candidate: "Harshil Parekh", candidateEmail: "harshil.p@gmail.com", candidatePhone: "+91 9825012345", round: "Round2", addedOn: "2 Nov 19:51", status: "call_attempt_2" as const },
  { company: "Meta", interviewer: "Sheryl Sandberg", interviewerEmail: "sheryl@meta.com", candidate: "Divya Krishnan", candidateEmail: "divya.k@gmail.com", candidatePhone: "+91 9444012345", round: "Round2", addedOn: "2 Nov 19:51", status: "scheduled" as const },
  { company: "Reliance", interviewer: "Mukesh Ambani", interviewerEmail: "mukesh@reliance.com", candidate: "Gaurav Singhal", candidateEmail: "gaurav.s@gmail.com", candidatePhone: "+91 9811098765", round: "Round1", addedOn: "2 Nov 19:51", status: "pending_t0" as const },
  { company: "Google", interviewer: "Sundar Pichai", interviewerEmail: "sundar@google.com", candidate: "Neha Kulkarni", candidateEmail: "neha.k@gmail.com", candidatePhone: "+91 9823012345", round: "Round1", addedOn: "2 Nov 19:51", status: "scheduled" as const },
];

const CANDIDATE_NAMES_POOL = [
  "Abhishek Sharma", "Aditi Rao", "Akash Verma", "Alok Pandey", "Ananya Banerjee",
  "Ankit Saxena", "Archana Nair", "Ashwin Kumar", "Bhavya Trivedi", "Chirag Joshi",
  "Deepika Reddy", "Dhruv Chawla", "Farhan Akhtar", "Gayatri Deshmukh", "Hemant Chauhan",
  "Ishaan Gupta", "Jaya Srinivasan", "Karan Singhania", "Lavanya Sundaram", "Manish Malhotra",
  "Naveen Patnaik", "Pooja Hegde", "Pranav Anand", "Radhika Apte", "Raghav Chadha",
  "Ritu Varma", "Sachin Bansal", "Sameer Nigam", "Sanya Mirza", "Shashank Kumar",
  "Shruti Haasan", "Sourav Ganguly", "Supriya Sule", "Tanmay Bhat", "Tarun Tahiliani",
  "Umesh Yadav", "Vaibhav Sisinty", "Varun Grover", "Vidya Balan", "Yashwant Sinha",
  "Zoya Akhtar", "Ajay Devgn", "Bipasha Basu", "Chetan Bhagat", "Disha Patani",
  "Farah Khan", "Gulzar Singh", "Hardik Pandya", "Ileana DCruz", "Javed Akhtar",
  "Kapil Sharma", "Lara Dutta", "Mithali Raj", "Nawazuddin Siddiqui", "Om Puri"
];

const COMPANIES_POOL = [
  { name: "Google", interviewer: "Sundar Pichai", email: "sundar@google.com" },
  { name: "Tesla", interviewer: "Elon Musk", email: "elon@tesla.com" },
  { name: "Meta", interviewer: "Mark Zuckerberg", email: "mark@meta.com" },
  { name: "Reliance", interviewer: "Mukesh Ambani", email: "mukesh@reliance.com" },
  { name: "Microsoft", interviewer: "Satya Nadella", email: "satya@microsoft.com" },
  { name: "Amazon", interviewer: "Andy Jassy", email: "andy@amazon.com" },
  { name: "Stripe", interviewer: "Patrick Collison", email: "patrick@stripe.com" },
  { name: "Uber", interviewer: "Dara Khosrowshahi", email: "dara@uber.com" },
  { name: "Zomato", interviewer: "Deepinder Goyal", email: "deepinder@zomato.com" },
  { name: "Flipkart", interviewer: "Kalyan Krishnamurthy", email: "kalyan@flipkart.com" }
];

export function generateInitialRequests(): InterviewRequest[] {
  const requests: InterviewRequest[] = [];
  const now = Date.now();

  // Create 500 structured requests to mirror the exact scale of Weekday daily volume
  const totalCount = 500;
  
  for (let i = 0; i < totalCount; i++) {
    let baseData;
    if (i < BASE_CSV_RAW.length) {
      baseData = BASE_CSV_RAW[i];
    } else {
      const comp = COMPANIES_POOL[i % COMPANIES_POOL.length];
      const candName = CANDIDATE_NAMES_POOL[i % CANDIDATE_NAMES_POOL.length] + ` #${Math.floor(i / CANDIDATE_NAMES_POOL.length) + 1}`;
      const roundNum = (i % 3) + 1;
      baseData = {
        company: comp.name,
        interviewer: comp.interviewer,
        interviewerEmail: comp.email,
        candidate: candName,
        candidateEmail: `${candName.toLowerCase().replace(/[^a-z0-9]/g, '.')}@candidate.org`,
        candidatePhone: `+91 ${9800000000 + ((i * 137) % 199999999)}`,
        round: `Round${roundNum}`,
        addedOn: "2 Nov 19:51",
        status: (i % 5 === 0 ? "scheduled" : (i % 4 === 0 ? "wa_sent" : (i % 3 === 0 ? "call_attempt_1" : "pending_t0"))) as any
      };
    }

    // Assign alternatingly between Ram and Shyam for perfect 250 / 250 load balancing
    const assignedTo: 'Ram' | 'Shyam' = i % 2 === 0 ? 'Ram' : 'Shyam';

    // Simulate elapsed hours from 0 to 22 hours so SLA timers are realistic & dynamic
    const elapsedHours = (i * 0.45) % 23;
    const addedTimeMs = now - (elapsedHours * 60 * 60 * 1000);
    const slaDeadlineMs = addedTimeMs + (24 * 60 * 60 * 1000);

    const compSlug = baseData.company.toLowerCase();
    const calendlyUrl = `https://calendly.com/${compSlug}-interviews/${baseData.round.toLowerCase()}-30min`;

    // Realistic touchpoints based on status
    const touchpoints: TouchpointLog[] = [
      {
        id: `tp-sys-${i}`,
        timestamp: new Date(addedTimeMs).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        channel: 'system',
        performedBy: 'Weekday Auto-Router',
        outcome: `Request ingested from ${baseData.company}. Auto-assigned to ${assignedTo}.`
      }
    ];

    let callCount = 0;
    let waCount = 0;
    let emailCount = 0;
    let status = baseData.status;

    if (status === 'wa_sent' || status === 'call_attempt_1' || status === 'call_attempt_2' || status === 'scheduled') {
      waCount = 1;
      touchpoints.push({
        id: `tp-wa-${i}`,
        timestamp: new Date(addedTimeMs + 2 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        channel: 'whatsapp',
        performedBy: assignedTo,
        outcome: 'Initial Calendly Invite WhatsApp sent.',
        notes: 'Template: T0_INITIAL_INVITE'
      });
    }

    if (status === 'call_attempt_1' || status === 'call_attempt_2') {
      callCount = 1;
      touchpoints.push({
        id: `tp-call1-${i}`,
        timestamp: new Date(addedTimeMs + 4 * 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        channel: 'call',
        performedBy: assignedTo,
        outcome: 'Call Attempt 1: Busy / No Answer. Triggered follow-up WhatsApp nudge.',
      });
    }

    if (status === 'call_attempt_2') {
      callCount = 2;
      touchpoints.push({
        id: `tp-call2-${i}`,
        timestamp: new Date(addedTimeMs + 12 * 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        channel: 'call',
        performedBy: assignedTo,
        outcome: 'Call Attempt 2: Spoke with candidate, agreed to book before 9 PM tonight.',
      });
    }

    if (status === 'scheduled') {
      touchpoints.push({
        id: `tp-sched-${i}`,
        timestamp: new Date(addedTimeMs + 6 * 3600000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        channel: 'system',
        performedBy: 'Calendly Webhook',
        outcome: 'Interview Confirmed & Calendar Invite Dispatched!',
        notes: 'Slot chosen: Tomorrow 4:00 PM IST'
      });
    }

    // Determine next action guidance
    let nextActionDue = 'Immediate';
    let nextActionSummary = '⚡ Step 1: Send initial WhatsApp invite';

    if (status === 'wa_sent') {
      nextActionDue = 'In 2 hours';
      nextActionSummary = '📞 Step 2: Make First Phone Call if not booked by T+2h';
    } else if (status === 'call_attempt_1') {
      nextActionDue = 'In 4 hours';
      nextActionSummary = '📞 Step 3: Evening Slot Reminder Call (Peak Window)';
    } else if (status === 'call_attempt_2') {
      nextActionDue = 'Urgent';
      nextActionSummary = '🚨 Step 4: Final Morning Call + Concierge Booking on Call';
    } else if (status === 'scheduled') {
      nextActionDue = 'None';
      nextActionSummary = '✅ Completed: Calendly Confirmed';
    } else if (status === 'slot_issue_escalated') {
      nextActionDue = 'Pending Company';
      nextActionSummary = '⏳ Awaiting Hiring Manager extra slots on Calendly';
    }

    const hoursLeft = (slaDeadlineMs - now) / 3600000;
    const priority = hoursLeft < 6 ? 'urgent' : hoursLeft < 14 ? 'high' : 'normal';

    requests.push({
      id: `REQ-${String(i + 1).padStart(4, '0')}`,
      company: baseData.company,
      interviewer: baseData.interviewer,
      interviewerEmail: baseData.interviewerEmail,
      candidate: baseData.candidate,
      candidateEmail: baseData.candidateEmail,
      candidatePhone: baseData.candidatePhone,
      schedulingMethod: `Round1: https://calendly.com/${compSlug}/r1\nRound2: https://calendly.com/${compSlug}/r2\nRound3: https://calendly.com/${compSlug}/r3`,
      calendlyLinks: [
        { round: "Round1", url: `https://calendly.com/${compSlug}/round-1-tech` },
        { round: "Round2", url: `https://calendly.com/${compSlug}/round-2-system-design` },
        { round: "Round3", url: `https://calendly.com/${compSlug}/round-3-culture-fit` }
      ],
      targetRound: baseData.round,
      addedOn: baseData.addedOn,
      addedTimestamp: addedTimeMs,
      slaDeadlineTimestamp: slaDeadlineMs,
      assignedTo,
      status,
      priority,
      callCount,
      waCount,
      emailCount,
      touchpoints,
      nextActionDue,
      nextActionSummary,
      isEscalated: status === 'slot_issue_escalated'
    });
  }

  return requests;
}
