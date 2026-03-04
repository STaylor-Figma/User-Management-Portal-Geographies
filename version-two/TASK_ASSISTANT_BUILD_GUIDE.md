# Task Assistant — How We Built It and How It Works

*A guide for the team explaining the approach, the data sources, and how the Elasticsearch agent concept was prototyped for the UMP.*

---

## The Idea in One Sentence

Instead of building separate UI for every user type and every task, we use **Elasticsearch's AI Agent Builder** to create persona-aware assistants that guide users through tasks in plain language — using tools we already have.

---

## What We Started With

This wasn't built from scratch with a single prompt. It was built from **layered research and existing data**, combined piece by piece to create the foundation.

### Data Sources We Used

| Source | What It Gave Us |
|--------|-----------------|
| **ORCA tables** (OOUX methodology) | Objects, Relationships, CTAs, and Attributes for every section — Users, Groups, Subscriptions, Geographic Entitlements, Bid Management Roles, Takeoff Roles |
| **Mock data specs** | Realistic user data (names, roles, email domains, license assignments, access levels) so the prototype behaves like a real environment |
| **Elasticsearch agent architecture doc** | How ES agents work, tool definitions, persona-based tool loading, DLS security model |
| **Platform API research** | Which existing REST APIs (`ccs.entitlements`, `ccs.accessmanagement`, `ccs.gcipauthorization`) the agent tools can wrap |
| **KB/knowledge base research** | Support articles, training content, and help resources that agents can surface contextually |
| **Blueprint design system** | Component specs so the UI matches our design standards exactly |
| **Existing prototype** | Previous UMP admin portal prototype with geographic entitlement workflows already built out |

### How The Pieces Came Together

```
ORCA Tables ──────────► Defined WHAT users can do (CTAs)
                              │
Mock Data Specs ──────► Gave us REALISTIC scenarios to demonstrate
                              │
ES Agent Architecture ► Showed us HOW to define tools without custom code
                              │
Platform API Research ► Mapped tools to EXISTING endpoints
                              │
KB Research ──────────► Gave the agent KNOWLEDGE to reference
                              │
                              ▼
                    Task Assistant Prototype
                    (Not just search — a task guide)
```

---

## The Three-Layer Agent Pattern

We didn't design one thing. We designed three layers that work together:

### Layer 1: Watcher (Proactive Alerts)

The agent doesn't wait for the user to ask — it notices things and surfaces them.

**What it watches for:**
- Pending invitations that haven't been accepted
- Unused licenses (seats paid for but not assigned)
- Subscription renewals approaching
- Users inactive for 30+ days

**How it appears in the prototype:**
When a user logs in, the agent immediately shows task cards:

```
┌─────────────────────────────────────────┐
│ ⚠ Pending Invitations                  │
│   3 users haven't accepted yet          │
├─────────────────────────────────────────┤
│ ℹ License Utilization                  │
│   5 OST licenses unused — reassign?     │
├─────────────────────────────────────────┤
│ ℹ Renewal Approaching                  │
│   CCPI renews Mar 15 — 13 days away    │
└─────────────────────────────────────────┘
```

**Why this matters:** Users don't have to hunt for problems. The agent tells them what needs attention the moment they arrive.

### Layer 2: Intelligent Search (ESRE)

The input bar isn't a search box — it's a **command palette**. Users type what they want to do in plain language.

**Examples of what users type:**
- "Add a new estimator"
- "Who hasn't logged in lately?"
- "What am I paying for?"
- "Show me my geographic access"

**How it works with Elasticsearch:**
- ESRE (Elasticsearch Relevance Engine) processes natural language
- Document-Level Security (DLS) ensures users only see data they're authorized for
- Results are filtered by the user's role and organization automatically

### Layer 3: Conversational Agent

When a simple search result isn't enough, the agent engages in a conversation to help the user complete a multi-step task.

**Example flow — "Add a new user":**

```
User:  "Add a new estimator"

Agent: "I can help you invite a new user. Here's what's available:
        • 2 CCPI seats available
        • 1 Bid Management seat available  
        • 2 OST seats available
        
        [Start Invitation]  [View Current Users First]"
```

The agent knows the seat counts, suggests next steps, and can walk the user through the entire workflow.

---

## How Personas Change the Agent

The key insight: **the same agent framework, loaded with different tools, creates completely different experiences.** We don't build three separate UIs — we define three tool sets.

### Owner Assistant

**Tools loaded:** User management, license management, billing, geographic entitlements, subscription management, reporting

**What they can ask:**
- "Add a new user" → full invitation flow
- "Show license usage" → utilization across all subscriptions
- "Review billing" → subscription costs, renewal dates, payment info
- "Who's inactive?" → users who haven't logged in

**Proactive alerts:** Pending invitations, license utilization, renewal dates

### Admin Assistant

**Tools loaded:** User management, license management, geographic entitlements, reporting (NO billing)

**What they can ask:**
- Same user and license management as Owner
- Billing questions → **"Billing is managed by your Organization Owner. I can help with licenses and user management instead."**

**What changes:** The billing tool simply isn't loaded. The agent can't access billing data, so it redirects naturally.

### Team Member (Account Assistant)

**Tools loaded:** Profile management, access viewing, support/training lookup (NO user management, NO billing)

**What they can ask:**
- "View my access" → shows their licenses and geographic coverage
- "Update my profile" → inline edit buttons for phone, job title, department
- "Request new access" → request forms for analytics, geographic areas, categories
- "Add a user" → **"Your admin Zoe Washburne (zoe.washburne@serenity.com) can help add or manage users."**

**What changes:** User management and billing tools aren't loaded. The agent knows who the admin is and redirects the user to the right person.

---

## The Tool Model — Why This Requires Minimal Custom Code

This is the critical point for developers: **we're defining tools, not building features.**

### What a Tool Definition Looks Like

```yaml
tool: assign_license
description: "Assign a product license to a user in the organization"
parameters:
  - userId (required)
  - organizationModuleId (required)
api_call:
  method: POST
  url: "{entitlements_base}/users/{userId}/licenses"
  headers:
    Authorization: "Bearer {token}"
    Content-Type: "application/json"
```

### What We Already Have

| Tool | Existing API | Status |
|------|-------------|--------|
| List users | `ccs.accessmanagement` | Exists |
| Assign license | `ccs.entitlements` | Exists |
| Remove license | `ccs.entitlements` | Exists |
| Invite user | `ccs.accessmanagement` | Exists |
| View geographic access | `ccs.gcipauthorization` | Exists |
| Modify geographic access | `ccs.gcipauthorization` | Exists |
| View subscriptions | `ccs.entitlements` | Exists |
| View billing | Zuora integration | Links out (not in-portal) |

### What Developers Need to Build

1. **Tool definitions** — YAML/JSON files describing each API call (the agent framework handles orchestration)
2. **Persona tool sets** — Which tools load for which role (configuration, not code)
3. **Agent UI component** — The chat panel (one component, reused everywhere)
4. **Watcher rules** — Conditions that trigger proactive alerts (Elasticsearch watcher API)

### What Developers Do NOT Need to Build

- Separate dashboards per role
- Custom conditional UI logic for every permission
- Natural language processing (Elasticsearch handles this)
- Role-based data filtering (DLS handles this at the Lucene level)
- A search engine (ESRE is already there)

---

## How Security Works

### Document-Level Security (DLS)

Every query the agent makes goes through Elasticsearch with DLS applied:

- **Tenant isolation:** Organization A cannot see Organization B's data
- **Role filtering:** Team Members only see their own data; Admins see org data; Owners see everything
- **Tool-level security:** If a tool isn't loaded for a persona, the agent literally cannot call that API

### Why This Is Better Than UI-Level Security

Traditional approach: Build the UI, then hide things with `if (user.role !== 'owner') { hide(billingSection); }`

Agent approach: The billing tool isn't loaded. The agent has no way to access billing data. There's nothing to hide because there's nothing to call.

---

## What the Prototype Demonstrates

### Live at: [platform-services-portals.vercel.app](https://platform-services-portals.vercel.app/version-two/v2-landing.html)

The prototype shows three personas with a toggle to switch between them:

| Persona | Agent Name | Key Interactions |
|---------|-----------|------------------|
| **Owner** | Owner Assistant | Add users, license usage, billing review, inactive users |
| **Admin** | Admin Assistant | Add users, license usage, inactive users (billing redirected) |
| **Team Member** | My Account Assistant | View access, update profile, request access (user mgmt redirected) |

### What to Notice in the Demo

1. **Same UI, different capabilities** — The chat panel is identical; the agent's behavior changes based on persona
2. **Proactive task cards** — The agent surfaces issues without being asked
3. **Graceful boundaries** — When a user asks for something outside their role, the agent doesn't show an error — it redirects them to the right person by name
4. **Suggested actions** — Clickable buttons in agent responses guide users to common tasks
5. **Contextual awareness** — The agent knows seat counts, subscription details, and user data

---

## How to Reproduce This for Other Sections

The same pattern works for any part of the portal:

### Step 1: Define the Objects (ORCA)
Use OOUX to identify Objects, Relationships, CTAs, and Attributes for the section.

### Step 2: Create Mock Data
Build realistic data that covers the scenarios users will encounter.

### Step 3: Map to Existing APIs
Identify which existing REST endpoints handle each CTA.

### Step 4: Write Tool Definitions
Create YAML/JSON tool definitions that wrap those APIs.

### Step 5: Assign Tools to Personas
Decide which tools each persona gets access to.

### Step 6: Define Watcher Rules
Identify conditions that should trigger proactive alerts.

### Step 7: Prototype
Build the chat UI and mock the agent responses to validate the concept.

---

## What This Proves

1. **We can use what we already have.** The APIs exist. Elasticsearch exists. We're not building from scratch.
2. **Minimal custom code.** Tool definitions are configuration, not application code. The agent framework handles orchestration.
3. **Role-based experiences without role-based UI.** One chat component adapts to any persona based on which tools are loaded.
4. **Better than search.** This isn't a search bar — it's a task assistant that knows who you are, what you can do, and what needs your attention.
5. **Scalable.** Adding a new capability means adding a tool definition, not building a new page.

---

## Files in the Prototype

| File | Purpose |
|------|---------|
| `v2-landing.html` | Main landing page with full 3-persona agent implementation |
| `v2-team-member.html` | Dedicated Team Member page with agent chat and quick actions |
| `v2-my-profile.html` | Profile page with inline agent bar |
| `ELASTICSEARCH_AGENT_PROPOSAL.md` | Technical proposal for developers |
| `TASK_ASSISTANT_BUILD_GUIDE.md` | This document |
| `PI_GEOGRAPHIES_WORKFLOW_MAP.md` | Workflow map for PI/Geographies section |

---

## Key Talking Points for the Presentation

1. **"We're not proposing a chatbot."** This is a task assistant backed by real APIs and real data. It doesn't hallucinate — it calls tools.

2. **"The agent can only do what its tools allow."** No custom permissions logic needed. If the billing tool isn't loaded, the agent can't access billing. Period.

3. **"We built this from our own data."** The ORCA tables, the mock data specs, the API research, the KB articles — all of that informed what the agent says and does. This isn't a generic AI — it's trained on our domain.

4. **"One UI component, three experiences."** The chat panel is the same component everywhere. The persona determines what the agent can do, not what the UI shows or hides.

5. **"This reduces development time."** Instead of building conditional dashboards for each role, we define tool sets. Adding a new role means adding a new tool configuration, not a new codebase.

---

*Built for the ConstructConnect UMP prototype. Data sourced from OOUX ORCA analysis, platform API research, Elasticsearch agent architecture documentation, and KB/knowledge base content.*
