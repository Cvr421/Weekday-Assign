# Weekday Scheduling Operations & Playbook OS

A **Zomato-grade interview scheduling execution engine, automation system, and interactive operations cockpit** designed for **Weekday**.

This platform provides the end-to-end framework, interactive intern cockpit, automated 24-hour cadence, edge-case resolution SOPs, and system proposal to schedule **500+ daily candidate interviews** across 100+ high-growth partner companies with a strict **≥80% 24-hour SLA** using **2 college interns (Ram & Shyam)**.

---

## 📌 Problem Statement & Core Operational Math

### The Challenge
- **Daily Volume:** 500 interview scheduling requests per day.
- **Team Size:** 2 college interns (Ram & Shyam) &rarr; **250 requests/intern/day**.
- **Working Hours:** 8-hour shift = 480 minutes total.
- **Manual Constraint:** If handled 100% manually by phone calling, each intern would have only **1.92 minutes per candidate** (impossible to research, dial, explain, handle objections, and record notes).
- **Core Mandate:** Achieve **≥80% of all interviews scheduled within 24 hours**.

### The Zomato-Inspired Funnel Solution
Rather than relying purely on manual phone outreach, the system deploys a deterministic **multi-touch, multi-channel automation funnel** combined with **targeted human intervention windows**:

```
[ T + 0 min ]  Instant Automated WhatsApp + Email Dispatch with Calendly Deep Link
               ↳ 35% - 40% candidates self-schedule within 2 hours

[ T + 2 hrs ]  Automated Slot Scarcity Nudge on WhatsApp
               ↳ +15% self-schedule (Cumulative: ~50% - 55%)

[ T + 4-6 h ]  Peak Window 1: First Human Voice Call (Ram/Shyam) + Live Concierge Booking
               ↳ +15% scheduled (Cumulative: ~68% - 72%)

[ T + 12 h  ]  Peak Window 2 (6:00 - 7:30 PM): Evening Re-engagement Dial + SMS Fallback
               ↳ +10% scheduled (Cumulative: ≥80% SLA TARGET ACHIEVED)

[ T + 18-20h]  Critical Morning Recovery: 4-hr Expiration Warning + 3 Custom Slot Capture
               ↳ +5% - 8% scheduled (Cumulative: 85%+)

[ T + 22 h  ]  Automated Escalation: Slack & Email alert to Weekday Account Manager
               ↳ Protects SLA audit trail and flags hiring manager slot bottlenecks
```

By automating T+0 and T+2h outreach, **~275 candidates self-schedule without intern intervention**, reducing the active human call volume to **~112 calls per intern per day** (~3.5 hours of calling), bringing the workload completely within high-quality human capacity.

---

## 🚀 Key Modules & Interactive Features

### 1. 🎛️ Intern ToDo Execution Cockpit (`src/components/InternCockpit.tsx`)
The operational nerve center for Ram and Shyam:
- **Live SLA Countdown Timers:** Real-time color-coded indicators highlighting remaining hours, urgent `<8h SLA At Risk` warnings, and overdue breaches.
- **Next Best Action (NBA) Engine:** Dynamically calculates the exact next action due for each candidate (e.g. "📞 First Call Sweep", "⏳ Awaiting Custom Slots", "✅ Confirmed on Calendly").
- **1-Click Call Modal (`src/components/CallModal.tsx`):**
  - Instant click-to-dial simulation.
  - Interactive call script branches (Script 1: Peak Hours Support, Script 2: Evening Re-engagement, Script 3: Objection Handling).
  - Outcome logging: *Scheduled on Call*, *Promised to Book Later*, *Call Not Answered*, *Declined / Drop-off*, *No Slots on Calendly*.
- **1-Click WhatsApp Modal (`src/components/WhatsAppModal.tsx`):**
  - Pre-filled message templates with dynamic variable interpolation (`{Candidate}`, `{Company}`, `{Interviewer}`, `{Round}`, `{CalendlyLink}`).
  - 4 template tiers: *T-0 Initial Excitement*, *T+2h Scarcity Nudge*, *T+12h Evening VIP*, *T+20h 4-Hour Warning*.
- **⚡ Frictionless Concierge Booking Modal (`src/components/ConciergeBookingModal.tsx`):**
  - **Direct Book-on-Call:** Intern books the candidate into Calendly during the call with 1 click.
  - **Custom Slot Escalation:** If no Calendly slots work for the candidate, intern captures 3 preferred slots and escalates to the company hiring manager within 60 seconds.
- **📜 Live Touchpoint Audit Drawer (`src/components/TouchpointsDrawer.tsx`):**
  - Chronological history of every WhatsApp sent, call attempted, notes taken, and system status update.
- **Bulk Batch Blast & Filtering:**
  - 1-Click "Batch Blast Pending Leads" to trigger T-0 messages for all uncontacted candidates.
  - Quick filters by Intern (Ram / Shyam / Unassigned), Status, Company, Urgent `<8h`, and full-text search.

---

### 2. 📖 Zomato SOP & Playbook Viewer (`src/components/PlaybookViewer.tsx`)
A comprehensive operational handbook for training and reference:
- **Cadence Timeline:** Detailed walkthrough of each stage from T+0 to T+22h with script snippets, SOP directives, and conversion benchmarks.
- **Calling Scripts & Objection Handling:** Word-for-word scripts for busy candidates, date clashes, platform preference (Google Meet vs Zoom), and company hesitation.
- **Edge Case SOP Matrix (EC-01 to EC-07):**
  - `EC-01`: No Available Slots on Calendly (Calendar Full / 0 Slots).
  - `EC-02`: Candidate Phone Switched Off / Continuous Unreachable.
  - `EC-03`: Wrong Calendly Link / 404 Error / Wrong Round Provided.
  - `EC-04`: Candidate Ghosting / Seen WhatsApp Messages But No Booking.
  - `EC-05`: Candidate Claims "I Already Booked" But Sheet Unupdated.
  - `EC-06`: Candidate Cold Feet / Competing Offers.
  - `EC-07`: Multi-Timezone Discrepancies (US PST vs India IST).

---

### 3. 📄 Automation Proposal & System Architecture (`src/components/DocumentationProposal.tsx`)
The official executive proposal document with 1-click clipboard copy and `.md` file export:
- **Mathematical Modeling:** Time-per-candidate breakdown and throughput economics.
- **Hybrid Workload Division:**
  - **Ram (Cohort Alpha):** Ingestion Batches 1 & 2 (Google, Tesla, Meta) + Daytime Peak Outreach (11:00 AM – 3:00 PM).
  - **Shyam (Cohort Beta):** Ingestion Batches 3 & 4 (Enterprise, Startups) + Evening Golden Hour Blitz (6:00 PM – 7:30 PM).
  - **The Swarm Protocol:** Co-calling trigger when either intern's queue has &gt;15 urgent tasks.
- **Tech Stack Architecture:** Ingestion APIs, WhatsApp Cloud API webhooks, Calendly webhook listeners (`invitee.created`), click-to-call telephony (Exotel/Twilio), and Slack escalation bots.
- **Target Quality Governance KPIs:** Mean Time to Schedule (&lt;8.5h), First Call Resolution (≥65%), Zero-Slot Escalation Turnaround (&lt;15 min).

---

### 4. 📊 Real-Time SLA & Performance Analytics (`src/components/AnalyticsDashboard.tsx`)
Live visual dashboard displaying operational health:
- **24-Hour SLA Progress:** Live tracking against the 80.0% benchmark.
- **Intern Head-to-Head Comparison:** Ram vs. Shyam performance cards (Conversion Rate, Calls Made, Scheduled Tasks, Active Leads).
- **Company-by-Company Breakdown:** Conversion rates across Google, Tesla, Meta, Reliance, Uber, Microsoft, Stripe, and others.
- **Round-by-Round Breakdown:** Performance across Round 1, Round 2, Round 3, HR Round, and Technical Round.
- **Funnel Drop-off Analysis:** Visibility into bottlenecks and escalation counts.

---

### 5. 💡 Interactive Intern Simulator (`src/components/EdgeCaseSimulator.tsx`)
A gamified training simulator for new interns:
- Realistic edge-case scenarios (The Busy Candidate at Work, The 0-Slot Calendar, The Ghosting Candidate).
- Immediate feedback based on core Zomato operational tenets.
- Interactive scoring and confetti rewards for perfect adherence to SOPs.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend Framework** | React 19, TypeScript |
| **Build Tool & Bundler** | Vite 6 |
| **Styling & Design System** | Tailwind CSS v4, Plus Jakarta Sans, JetBrains Mono |
| **Icons & UI Assets** | Lucide React |
| **Animations & Effects** | Motion (`motion/react`), Canvas Confetti |
| **State & Data Layer** | Reactive LocalStorage persistence, Mock Data Generator |

---

## 📂 Project Structure

```
.
├── index.html                           # Main HTML entry point & typography
├── metadata.json                        # Applet metadata & capabilities
├── package.json                         # Project dependencies & scripts
├── tsconfig.json                        # TypeScript configuration
├── vite.config.ts                       # Vite & Tailwind configuration
├── src/
│   ├── main.tsx                         # React entry point
│   ├── App.tsx                          # App container, navigation & state persistence
│   ├── index.css                        # Tailwind CSS imports
│   ├── types.ts                         # Global TypeScript interfaces & data contracts
│   ├── data/
│   │   ├── mockRequests.ts              # 25 realistic initial scheduling requests
│   │   └── playbookData.ts              # Cadence steps, scripts, edge cases & simulator
│   └── components/
│       ├── Navbar.tsx                   # Navigation bar with live SLA target indicator
│       ├── InternCockpit.tsx            # Main ToDo sheet, filtering & batch actions
│       ├── CallModal.tsx                # Interactive phone call execution modal
│       ├── WhatsAppModal.tsx            # WhatsApp template dispatcher modal
│       ├── ConciergeBookingModal.tsx    # Frictionless concierge booking & custom slot modal
│       ├── TouchpointsDrawer.tsx        # Multi-channel touchpoint audit drawer
│       ├── PlaybookViewer.tsx           # Interactive Zomato SOP & Script Playbook
│       ├── DocumentationProposal.tsx    # Executive System Proposal & Architecture
│       ├── AnalyticsDashboard.tsx       # SLA metrics, Ram vs Shyam & company breakdown
│       └── EdgeCaseSimulator.tsx        # Interactive onboarding training simulator
```

---

## ⚡ Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repo-url>

# Navigate to project directory
cd weekday-scheduling-os

# Install dependencies
npm install
```

### Running Locally
```bash
# Start development server on port 3000
npm run dev
```

The app will be available at `http://localhost:3000`.

### Building for Production
```bash
# Compile and build production bundle
npm run build

# Preview production build
npm run preview
```

### Type Checking & Linting
```bash
# Run TypeScript compilation check
npm run lint
```

---

## 🧠 The 4 Zomato Operational Principles Applied

1. **"Never Leave the Next Action on the Customer's Memory"**  
   Candidates are busy engineers and leaders. Relying on them to remember an email link yields high drop-off. We actively trigger structured nudges at critical transition windows.
2. **"Eliminate Cognitive Friction via Concierge Booking"**  
   If a candidate hesitates, interns book the slot on their behalf live during the call.
3. **"Time-Window Matching"**  
   Voice outreach is prioritized during high-conversion windows (11:00 AM – 1:00 PM and 6:00 PM – 7:30 PM) rather than random cold calling.
4. **"Turn Blockers into Structured Data in Under 60 Seconds"**  
   When Calendly slots are full, interns immediately collect 3 specific alternative times and escalate directly to the hiring manager.

---

## 📄 License
Internal Operations Framework developed for **Weekday**. All rights reserved.
