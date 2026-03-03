# Proposal: Elasticsearch Agents for the External User Management Portal

**Author:** Sharon Taylor, UX Professional — Blueprint Design System  
**Date:** March 2026  
**Prototype:** [platform-services-portals.vercel.app/version-two/v2-landing.html](https://platform-services-portals.vercel.app/version-two/v2-landing.html)  
**Status:** Proof of Concept / Proposal

---

## TL;DR

Instead of building dozens of role-specific UI components, conditional buttons, and per-persona views, we can use **Elasticsearch's AI Agent Builder** to create specialized agents that guide each user through the portal based on their role and context. The page structure stays the same. The agents handle the intelligence. This dramatically reduces custom UI code and ongoing maintenance.

---

## The Problem We're Solving

The UMP serves three fundamentally different user types:

| Role | What They Need | Current Approach |
|------|---------------|-----------------|
| **Owner** (Mark) | Full access including billing, simple guided flows for a 5-person team | Build owner-specific views, billing widgets, cost displays |
| **Admin** (Eric/Dana) | User and license management, NO billing, bulk operations for 50-100+ users | Build admin-specific views, hide billing, build bulk workflows |
| **Team Member** (Blake) | Own profile and product access only, self-service | Build stripped-down view, hide everything except personal data |

Without agents, making the portal useful for all three means building:
- 4 different "Add User" workflows (simple for Mark, bulk for Dana, none for Blake)
- 3 different license views (with costs for Owner, without for Admin, own-only for Member)
- Conditional buttons that appear/disappear by role across every page
- Separate onboarding experiences per persona
- Product-specific pages that show/hide based on subscription mix
- Mobile-optimized versions of all of the above

**That is a combinatorial explosion of custom UI development.** Every new product or role means updating every conditional path. It doesn't scale and it becomes a maintenance nightmare.

---

## The Proposal: Agents Absorb Complexity, UI Stays Clean

### The core idea

Keep the existing page structure (Users, Licenses, Subscriptions, Roles, Settings). Build **specialized Elasticsearch agents** — one per organizational role — that know each user's context. The agents handle task guidance, conditional logic, and personalization so the UI doesn't have to.

### What changes

| Without Agents | With Agents |
|---------------|-------------|
| Build role-specific dashboard views | One clean page, agent surfaces role-appropriate content |
| Build separate bulk vs single-user workflows | One workflow, agent adapts (single for Mark, bulk for Dana) |
| Build conditional buttons (show/hide per role) | Clean pages, agent guides to appropriate actions |
| Build onboarding wizards per persona | Agent walks each persona through setup conversationally |
| Build training into tooltips and help modals | Agent surfaces training contextually |
| Build mobile-optimized separate views | Agent chat IS the mobile experience |
| Maintain all of the above across releases | Maintain page structure + update agent configs |

### What does NOT change

- The page structure and navigation
- The data models and APIs
- The authentication system (GCIP)
- The entitlement enforcement
- The existing React SPA architecture

---

## Why Elasticsearch — And What We Already Have

### We already run Elasticsearch in production

| Environment | Version | Infrastructure |
|-------------|---------|---------------|
| **Production** | 9.2.2 | 3 Hot nodes: 128 GB RAM, 64 vCPU, 5.63 TB each |
| **Staging** | 9.2.2 | 2 Hot + 2 Warm + 2 Cold |
| **Dev** | **9.3.0** | 2 Hot + 2 Warm + 2 Cold |

- Elastic Cloud Platinum tier with Enhanced support on GCP
- All environments upgraded December 2025 (8.17.2 → 9.2.x)
- Dev cluster already at 9.3.0 for a semantic search POC
- Production recently doubled capacity; search latency dropped from 640ms to 39ms

### What Elasticsearch 9.2+ gives us natively

These are built-in capabilities — not third-party plugins or custom code:

| Capability | What It Does | How We Use It |
|-----------|-------------|---------------|
| **AI Agent Builder** | Create agents with instructions, tools, and persona definitions using a UI or API. GA in 9.2+. | Define one agent config per role (Owner, Admin, Member) with role-specific tools and behavior |
| **ES\|QL Tools** | Define tools the agent can call — these are queries or API calls the agent invokes when a user asks something | Connect agents to our existing REST APIs (`ccs.entitlements`, `ccs.accessmanagement`, `ccs.gcipauthorization`) |
| **MCP Server Support** | Native Model Context Protocol support for tool orchestration | Standard protocol for connecting agents to external data sources |
| **Inference API** | Integrates OpenAI, Anthropic, Cohere, Google Gemini, AWS Bedrock | Use whichever LLM we prefer (we already use Gemini 1.5 Pro for AskService) |
| **Document-Level Security (DLS)** | Filters search results at the Lucene level — cannot be bypassed by queries, agents, or LLMs | Enforce tenant isolation and role-based visibility at the data layer |
| **ESRE (Relevance Engine)** | BM25f + vector search + hybrid retrieval | Power intelligent search within the portal |
| **Watcher** | Scheduled queries with condition-based actions | Proactively detect and surface tasks (unused licenses, pending invitations, upcoming renewals) |
| **LangChain Partner Package** | Official integration with LangChain for tool orchestration | `ElasticsearchStore` for building agent tool chains |

### What does NOT exist today

To be clear about what's greenfield:

- **No Elasticsearch agents** have been created at ConstructConnect
- **No ES|QL tools** exist — all current queries use Query DSL
- **No DLS configurations** for user/entitlement data (DLS is only used for project search geographic filtering via query-time market zone injection)
- **User, subscription, and entitlement data lives in SQL Server** (EntitlementDB), not in Elasticsearch indices

**This is not a blocker.** The agent's tools call our existing REST APIs — they don't need the data to live in Elasticsearch indices. The agent is an orchestration layer on top of what already exists.

---

## How It Works: The Agent-Per-Role Architecture

### Session initialization

When a user logs in, the portal determines which agent to load based on the JWT claims the Permission Service already provides:

```
User authenticates via GCIP
    ↓
Permission Service enriches JWT with:
  - user_id, org_id
  - role (2 = Company Admin), roleName ("Company Admin")
  - modules ["ProjectIntelligence", "BidManagement"]
  - features [...]
    ↓
Portal loads agent configuration for that role:
    ↓
  role = Owner?   → Owner Agent   (all tools including billing)
  role = Admin?   → Admin Agent   (management tools, NO billing)
  role = Member?  → Member Agent  (self-service tools only)
    ↓
Agent further adapts based on:
  - Organization size (5 users vs 100+)
  - Product subscriptions (CCPI? CCBM? Takeoff?)
  - User's product-level roles
```

### The critical security model: tools that don't load can't be called

The agent-per-role model doesn't just change what the agent *says* — it changes what the agent *can do*. Tools the user cannot access are **never loaded into the agent**. The LLM cannot call what it doesn't know exists.

```
OWNER AGENT tools:
  ✅ user_management (add, remove, modify, bulk)
  ✅ license_management (assign, unassign, view WITH costs)
  ✅ billing (invoices, payment history, costs)
  ✅ subscription_management (view WITH costs, renewals)
  ✅ org_settings
  ✅ self_service

ADMIN AGENT tools:
  ✅ user_management (add, remove, modify, bulk)
  ✅ license_management (assign, unassign, view WITHOUT costs)
  ❌ billing — NOT LOADED
  ✅ subscription_management (view WITHOUT costs)
  ✅ org_settings
  ✅ self_service

MEMBER AGENT tools:
  ❌ user_management — NOT LOADED
  ❌ license_management — NOT LOADED
  ❌ billing — NOT LOADED
  ❌ subscription_management — NOT LOADED
  ✅ self_service (own profile, preferences)
  ✅ my_access (view own licenses, territories)
  ✅ help (search help articles, submit support request)
  ✅ access_requests (request license, request role change)
```

**When an Admin asks about billing:** the agent has no billing tool. It recognizes the intent but gracefully redirects: *"Billing details are managed by your Organization Owner, Mark Thompson. I can show you subscription details and license counts — just not the pricing."*

The agent knows WHO to redirect to because it has access to the org's user directory through the EntitlementDB API — it knows the Owner's name and email.

---

## The Three Layers — What Each One Does

### Layer 1: Proactive Task Surfacing (Watcher)

Elasticsearch Watcher runs scheduled queries and creates tasks when conditions are met. No custom cron jobs or background services needed.

**Example Watchers:**

| Watcher | Runs | Detects | Creates Task For |
|---------|------|---------|-----------------|
| Unused License Scanner | Daily | Users with assigned licenses who haven't logged in for 30+ days | Owner + Admin |
| Pending Invitation Monitor | Daily | Invitations older than 7 days that haven't been accepted | Owner + Admin |
| Renewal Approaching | Weekly | Subscriptions renewing within 60 days | Owner (with cost) + Admin (without cost) |
| Profile Incomplete | Daily | Users with missing phone, job title, or department | The user themselves |
| Access Request Pending | Hourly | Team member access requests awaiting admin approval | Owner + Admin |

These tasks are stored in a `ump-tasks` Elasticsearch index with `visibility_roles` metadata. DLS ensures each user only sees tasks appropriate to their role.

**What the user sees:** When Mark opens the portal, the agent greets him with *"Good morning, Mark. You have 2 items that need attention: 3 invitations pending for 7+ days, and your CCPI subscription renews March 15."* This isn't a custom dashboard widget — it's the agent reading from the task index.

### Layer 2: Intelligent Search with Action Routing (ESRE)

The portal search bar becomes a command palette. When a user types a query, ESRE handles both informational lookups AND action routing — and DLS filters results by role:

| User Types | Owner Sees | Admin Sees | Member Sees |
|-----------|-----------|------------|-------------|
| "licenses" | CCPI: 45/60 seats [Assign] [View Cost] | CCPI: 45/60 seats [Assign] | Your licenses: CCPI Pro (active) [View Details] |
| "add user" | Start add user wizard | Start add user wizard | "Contact your admin, Dana Martinez" |
| "billing" | Link to billing section | "Billing is managed by your Owner" | "Billing is managed by your Owner" |
| "Jake Morrison" | Full user profile + all actions | Full user profile + admin actions | Not found (can only see own data) |

**Same query, same index, different results** — enforced at the Lucene level by DLS. No conditional rendering logic in the frontend.

### Layer 3: Conversational Agent (AI Agent Builder)

The conversational agent is where the real power is. Instead of building specialized UI for every workflow, the agent walks users through tasks conversationally:

**Mark (Owner, 5 employees):** *"I need to add my new estimator, Jake"*  
**Agent:** *"I'll help you add Jake. What's his email address?"*  
**Mark:** *"jake@marksconstruction.com"*  
**Agent:** *"Based on your team, I'd suggest the Estimator role with a CCPI Pro license. You have 2 available seats. Set Jake up with that?"*  
**Mark:** *"Yes"*  
**Agent:** *"Done. Invitation sent to jake@marksconstruction.com with Estimator role and CCPI Pro license."*

**Dana (Enterprise Admin, 100+ users):** *"I need to onboard 12 new reps across three regions"*  
**Agent:** *"I'll use your regional templates. How many per region — Southeast, Northeast, West Coast?"*  
**Dana:** *"5 Southeast, 4 Northeast, 3 West Coast"*  
**Agent:** *"Got it. 5 Southeast Reps: CCPI Pro + Southeast geo. 4 Northeast Reps: CCPI Pro + Northeast geo. 3 West Coast Reps: CCPI Pro + West Coast geo. I need email addresses — paste them or upload a CSV?"*

**Same capability** (adding users), **radically different experience** — driven by the agent knowing Mark has 5 employees vs Dana having 100+. No separate UI built for each.

---

## What the Agent Tools Actually Call

The agent tools are wrappers around our **existing REST APIs**. No new backend services needed.

### Existing APIs the agent tools would call

| API | Endpoints Used | What Agent Does With It |
|-----|---------------|------------------------|
| **ccs.entitlements v2** | `GET /organizations/{orgId}/users` | List org users with licenses, roles, status |
| | `POST /users/{userId}/licenses` | Assign a license to a user |
| | `PATCH /users/{userId}/licenses/{orgModuleId}` | Unassign a license (set status inactive) |
| | `GET /organizations/{orgId}/organizationmodules` | List subscriptions with seat counts |
| | `GET /organizationmodules/{id}/licenses/usage` | Get license utilization |
| | `GET /users/{userId}/licenses/zones` | Get user's geographic access |
| **ccs.accessmanagement** | Role assignment endpoints | Assign/change user roles |
| **ccs.gcipauthorization** | Permission Service | Get real-time auth data, user context |
| **GCIP** | User management | Profile updates, invitation management |
| **New Geography API (PS-66)** | `POST /users/{userId}/geography/assign` | Assign county-level geographic access |
| | `POST /users/bulk/geography/assign` | Bulk geographic assignment |

### How an agent tool is defined

An agent tool is essentially: a name, a description (so the LLM knows when to use it), and an API call pattern. Here's a simplified example:

```yaml
tool: assign_license
description: "Assign a product license to a user. Use when the user asks to give someone access to a product."
parameters:
  - userId (required): "The user to assign the license to"
  - organizationModuleId (required): "The subscription/product to assign"
api_call:
  method: POST
  url: "{entitlements_base}/users/{userId}/licenses"
  body:
    organizationModuleId: "{organizationModuleId}"
  headers:
    Authorization: "Bearer {session_token}"
```

The agent decides WHEN to call this tool based on the conversation. The tool defines HOW to call the API. **No custom endpoint code is written** — the tool wraps the existing API.

---

## Security: How Permissions Are Guaranteed

### The non-negotiable principle

**LLMs interpret intent — they do not enforce policy.** Permissions are enforced at the Elasticsearch/Lucene level (DLS), below the API, below the agent, below the LLM.

### How DLS works in this architecture

```
1. User authenticates via GCIP
2. Portal backend creates Elasticsearch API key with DLS query:
   {
     "bool": {
       "must": [
         { "term": { "tenant_id": "org_12345" } },
         { "terms": { "visibility_roles": ["admin"] } }
       ]
     }
   }
3. ALL Elasticsearch queries from this session use this API key
4. Lucene applies the DLS filter BEFORE any query processing
5. The agent literally cannot see data outside its DLS scope
```

### What DLS prevents

| Scenario | What Happens |
|----------|-------------|
| Admin tries to see billing data | Billing documents have `visibility_roles: ["owner"]` — invisible to admin's API key |
| Member tries to see other users | User documents have `visibility_roles: ["owner", "admin"]` — invisible to member's API key |
| User from Org A tries to see Org B | All documents filtered by `tenant_id` — cross-org data is physically invisible |
| LLM hallucinates a billing query | Query executes against DLS-filtered index — returns zero results |
| Prompt injection attempts | Even if the LLM is tricked, DLS filter is applied at Lucene level — cannot be bypassed |

**This is architecturally the same pattern we already use** for geographic filtering in CCPI project search (market zone injection at query time). We're extending it to the portal domain.

---

## What the Prototype Demonstrates

The deployed prototype at [platform-services-portals.vercel.app](https://platform-services-portals.vercel.app/version-two/v2-landing.html) shows:

1. **Persona-aware landing page** with a conversational agent panel that adapts its greeting, proactive tasks, and available actions based on whether you're viewing as Owner, Admin, or Team Member (toggle in the bottom-right corner)

2. **Agent-driven task surfacing** — the agent highlights pending invitations, license utilization, and renewal dates without building separate dashboard widgets

3. **Graceful persona boundaries** — the Admin agent has no billing tools and redirects billing questions to the Owner by name. The Team Member agent focuses on self-service and routes admin requests to the appropriate person.

4. **Consistent page structure** — Users & Groups, User Roles, Subscription Overview, and other management pages share the same layout. The agent adds intelligence within each section rather than requiring separate views.

5. **The agent as navigation** — users can ask the agent to take them where they need to go instead of hunting through menus, which is especially powerful for infrequent users

---

## Development Effort: What's Required

### What devs need to build

| Task | Effort | Description |
|------|--------|-------------|
| **Agent configurations** | Low | Define 3 agent configs (Owner, Admin, Member) in AI Agent Builder with instructions, persona, and tool lists |
| **Tool definitions** | Medium | ~15-20 tool definitions wrapping existing REST API endpoints — no new backend code, just API call patterns |
| **Task index + Watchers** | Low | Create `ump-tasks` index schema + 5-8 Watcher definitions for proactive task detection |
| **Search index** | Medium | Create `ump-search` index with entity data, DLS queries, and action metadata |
| **Agent panel UI** | Medium | Persistent chat panel component (sidebar on desktop, bottom sheet on mobile) — one component, works across all pages |
| **DLS configuration** | Low | Define DLS queries per role for task and search indices |
| **Session context passing** | Low | Pass current page/section to agent so it can adapt suggestions |

### What devs do NOT need to build

| Avoided Work | Why |
|-------------|-----|
| Role-specific dashboard views | Agent surfaces role-appropriate content dynamically |
| Multiple "Add User" workflows | Agent adapts the flow based on org size and role |
| Conditional button rendering per role | Agent guides to appropriate actions conversationally |
| Separate mobile-optimized views | Agent chat IS the mobile experience |
| Training/tooltip systems | Agent surfaces indexed training content contextually |
| Billing visibility logic | Billing tools simply aren't loaded for non-Owner agents |
| Per-persona onboarding wizards | Agent walks each persona through setup |
| Content management for announcements/tips | New content = new document in search index, agent surfaces it automatically |

### The key insight for developers

**Adding new content or features does not require UI changes.** Want to announce a new CCPI feature? Index a document with `visibility_roles: ["owner", "admin", "member"]` and `product_filter: "ccpi"`. The agent surfaces it to everyone with CCPI access. Want admin-only training content? Index with `visibility_roles: ["owner", "admin"]`. No code changes, no deployment.

---

## The Mobile Advantage

Admin portals are notoriously painful on mobile. Complex tables, multi-step wizards, and nested menus don't translate to small screens. The typical response is building a separate "mobile-optimized" view — expensive and always a compromise.

With the agent, the conversational interface becomes the **primary mobile interaction**:

- **Mark on mobile:** Instead of navigating 4+ screens to add a user, he types *"Add Jake jake@marks.com same setup as Eddie"* — done in one interaction
- **Eric on mobile:** Instead of scrolling a 120-user table, he asks *"Who hasn't logged in this month?"* — focused list with actions
- **Blake on mobile:** Entire experience works through the agent — *"What do I have access to?"* → instant summary

Desktop keeps the full page layouts. Mobile gets the agent. Same backend, same tools, no separate build.

---

## Comparison: Build It All vs Agent-Driven

| Dimension | Build Custom UI Per Role | Agent-Driven |
|-----------|------------------------|-------------|
| **Initial dev effort** | High — dozens of conditional components | Medium — agent configs + tool definitions + chat panel |
| **Ongoing maintenance** | Every new feature/role/product requires updating conditional paths across all pages | Update agent config or index new content |
| **Mobile** | Build separate mobile views | Agent chat works natively on mobile |
| **Personalization depth** | Limited to what you build conditional logic for | Agent adapts dynamically to org size, product mix, user history |
| **Adding new content** | Build new UI component + display logic + deploy | Index a document → agent surfaces it automatically |
| **Security model** | Frontend conditional rendering (bypassable) | DLS at Lucene level (cannot be bypassed) |
| **Scalability** | Each new persona/product = multiplicative UI work | Each new persona/product = new agent config or tool |
| **User experience** | Static, same for everyone with the same role | Dynamic, adapts to individual context |

---

## What We Already Have vs What's Needed

### Already in place

- ✅ Elastic Cloud 9.2.2 production / 9.3.0 dev (AI Agent Builder capable)
- ✅ `ccs.entitlements` REST API with user, license, subscription, and geography endpoints
- ✅ `ccs.accessmanagement` for role/permission management
- ✅ GCIP authentication with Permission Service JWT enrichment
- ✅ Gemini 1.5 Pro as the LLM (already used in AskService)
- ✅ Prototype demonstrating the UX pattern and persona-aware agent behavior

### Needs to be created

- 🔨 Elasticsearch agent configurations in AI Agent Builder (3 role-based agents)
- 🔨 ES|QL tool definitions wrapping existing REST APIs (~15-20 tools)
- 🔨 `ump-tasks` and `ump-search` Elasticsearch indices with DLS
- 🔨 Watcher definitions for proactive task detection (5-8 watchers)
- 🔨 Agent chat panel React component (one component, persistent across pages)
- 🔨 Session context passing (current page → agent)

---

## Recommended Next Steps

1. **Review the prototype** — Toggle between Owner, Admin, and Team Member personas at [the deployed prototype](https://platform-services-portals.vercel.app/version-two/v2-landing.html) to see how the agent adapts

2. **Validate on the dev cluster** — Create a minimal agent in AI Agent Builder on the 9.3.0 dev cluster with 2-3 tools calling the dev entitlements API to prove the tool-calling pattern works

3. **Define the first 5 tools** — Start with the highest-value operations:
   - `list_users` (calls `GET /organizations/{orgId}/users`)
   - `get_license_usage` (calls `GET /organizationmodules/{id}/licenses/usage`)
   - `assign_license` (calls `POST /users/{userId}/licenses`)
   - `get_user_geography` (calls `GET /users/{userId}/licenses/zones`)
   - `list_subscriptions` (calls `GET /organizations/{orgId}/organizationmodules`)

4. **Build the chat panel component** — One React component that renders in the sidebar (desktop) or bottom sheet (mobile), maintains conversation state, and passes page context to the agent

5. **Index mock task data** — Create the `ump-tasks` index on dev with sample tasks (pending invitations, unused licenses) and configure 1-2 Watchers to prove proactive surfacing works

---

## Open Questions for Discussion

1. **LLM choice:** Continue with Gemini 1.5 Pro (consistent with AskService) or evaluate alternatives through the Inference API?
2. **Agent panel persistence:** Should the conversation persist across page navigation within a session? Across sessions?
3. **Cross-device continuity:** Start on mobile, continue on desktop — how important is this for our users?
4. **Bulk operation boundaries:** At what point should the agent suggest switching to the full table UI instead of handling something conversationally? (Our recommendation: 10+ items)
5. **Content indexing pipeline:** Who maintains the training/help content in the search index? Can we pull from the existing knowledge base?

---

*This proposal is based on the research documented in `External_UMP_Elasticsearch_Agent_Architecture.md`, `Elasticsearch_Infrastructure_Assessment.md`, and `Agent_Architecture_and_API_Research.md`. The prototype demonstrates the UX pattern — the next step is validating the technical pattern on our dev Elasticsearch cluster.*
