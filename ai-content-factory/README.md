# AI Content Factory - Enterprise Content Operating System

An enterprise-grade, multi-agent automated content discovery, scriptwriting, voiceover synthesis, image creation, video rendering, quality checking, and auto-publishing platform.

---

## Technical Stack

* **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Recharts
* **Backend**: Node.js Express Server, TypeScript
* **Database**: Supabase (PostgreSQL) + Row Level Security (RLS)
* **Automation**: n8n Workflow Orchestration Engine
* **Media Compiler**: FFmpeg
* **Deployment**: Docker Compose

---

## Repository Structure

```text
ai-content-factory/
├── docker-compose.yml        # Multi-container launcher (Next.js, Express, n8n)
├── .env.example              # Variables template file
├── README.md                 # System Manual (This file)
├── backend/
│   ├── Dockerfile            # Bullseye Node + FFmpeg environment setup
│   ├── package.json
│   ├── tsconfig.json
│   ├── database/
│   │   └── schema.sql        # Database schema & Seed SQL data
│   └── src/
│       ├── server.ts         # Server entry point
│       ├── routes/
│       │   └── api.ts        # Agent routes, rendering routers & crypt controllers
│       ├── agents/
│       │   └── agentFramework.ts # Agent class definitions (Research, Script, QA)
│       └── services/
│           ├── videoService.ts   # FFmpeg compiler
│           └── qualityControl.ts # QC gates and automated retry logic
└── frontend/
    ├── package.json
    ├── tailwind.config.js
    └── src/
        ├── app/
        │   ├── layout.tsx
        │   ├── globals.css   # Glassmorphic card styling, theme parameters
        │   ├── page.tsx      # Main redirect script
        │   ├── dashboard/    # Metrics and queue tracking pages
        │   ├── planner/      # Content schedule planner calendar page
        │   ├── generators/   # Studio pipeline testing console
        │   ├── library/      # Assets and Prompts manager grids
        │   ├── analytics/    # Performance visualizations using Recharts
        │   └── settings/     # Admin configurations and secure key encrypter
        └── components/
            ├── Sidebar.tsx
            ├── MetricCard.tsx
            └── Calendar.tsx  # Calendar grid mapping scheduled releases
```

---

## Database Seeding (Supabase)

Copy the contents of `backend/database/schema.sql` into the SQL Editor of your Supabase Project console and click "Run". This creates all tables (users, workspaces, projects, assets, analytics, credentials_settings, logging) and seeds initial mock metrics, channels, and pipelines.

---

## n8n Workflow Configuration

The orchestration between agents relies on n8n workflows.

### Workflow Blueprint Setup
1. **Trigger (Webhook / Cron)**: Start the pipeline on a scheduled cron timer or trigger manual hook.
2. **Retrieve Brand Kit**: Select credentials and branding guidelines from `/api/status`.
3. **Trend Research Node**: Post to `/api/agents/research` with `topic` parameter.
4. **Draft Script Node**: Post to `/api/agents/script` with the keywords and suggested titles.
5. **Parallel Assets Generator**:
   * *A. Voice Node*: Post to `/api/agents/voice` (Kokoro / Elevenlabs parameters).
   * *B. Prompt Node*: Post to `/api/agents/prompts` to expand visual prompts.
6. **Stitch Video Node**: Send parameters to `/api/video/render` (combining voiceover + image inputs using local FFmpeg process).
7. **Quality Control Check Node**: Post metrics output to `/api/qc/validate`.
   * **If QC fails (Score < 80)**: Increment attempt count. n8n triggers the auto-repair loop. If failure persists, status updates to `review`, and an alert routes to the frontend Review Queue.
   * **If QC passes**: Schedule publication via social webhooks.

---

## Running Locally

To build and run all services (Next.js, Node.js Backend, n8n instance) locally:

```bash
# 1. Clone the project folder
# 2. Copy the environment parameters
cp .env.example .env

# 3. Spin up the containers using Docker Compose
docker-compose up --build -d
```

### URLs
* **Next.js Frontend Client**: `http://localhost:3000`
* **Express Backend Service API**: `http://localhost:4000`
* **n8n Orchestration Console**: `http://localhost:5678`

---

## Cryptographic Security Guidelines

To prevent database access leaks from compromising private API keys, do not upload plain-text keys. Always configure your API keys through the **Admin API Settings Dashboard** (`/settings`). 

The page encrypts your raw tokens using authenticated **AES-256-GCM** key derivation, displaying the safe payload string format `iv:authTag:ciphertext` to store in Supabase configuration settings.
