-- AI Content Factory Database Schema (Supabase SQL / PostgreSQL)

-- Enums
CREATE TYPE rbac_role AS ENUM ('admin', 'editor', 'viewer');
CREATE TYPE pipeline_status AS ENUM ('idle', 'running', 'failed', 'completed');
CREATE TYPE content_status AS ENUM ('draft', 'generating', 'review', 'scheduled', 'published', 'failed');
CREATE TYPE asset_type AS ENUM ('image', 'audio', 'video', 'text', 'caption', 'music', 'other');
CREATE TYPE platform_type AS ENUM (
    'youtube', 'instagram', 'facebook', 'linkedin', 'twitter', 'pinterest', 
    'tiktok', 'wordpress', 'medium', 'ghost', 'substack'
);

-- Users
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Workspaces
CREATE TABLE IF NOT EXISTS workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    logo_url TEXT,
    brand_voice TEXT, -- Description of voice guidelines
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL
);

-- Workspace Members (RBAC)
CREATE TABLE IF NOT EXISTS workspace_members (
    workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role rbac_role NOT NULL DEFAULT 'viewer',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (workspace_id, user_id)
);

-- Projects
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    publishing_schedule JSONB DEFAULT '{}'::jsonb, -- Scheduled publishing times/days
    brand_assets JSONB DEFAULT '{}'::jsonb,        -- Project-specific assets (logos, intros)
    prompt_templates JSONB DEFAULT '{}'::jsonb,    -- Overridden prompts for project
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Pipelines
CREATE TABLE IF NOT EXISTS pipelines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    status pipeline_status NOT NULL DEFAULT 'idle',
    steps JSONB NOT NULL DEFAULT '[]'::jsonb,        -- Array of tasks (e.g., Research -> Script -> Video)
    current_step INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Content Items (Individual published pieces or scripts)
CREATE TABLE IF NOT EXISTS content_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    status content_status NOT NULL DEFAULT 'draft',
    content_type TEXT NOT NULL,                     -- e.g., 'YouTube Shorts', 'LinkedIn Post'
    data JSONB DEFAULT '{}'::jsonb,                 -- Dynamic data (script text, captions, image prompts, voice selection)
    scheduled_publish_time TIMESTAMP WITH TIME ZONE,
    actual_publish_time TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Assets (Files stored in Supabase Storage or externally)
CREATE TABLE IF NOT EXISTS assets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    content_item_id UUID REFERENCES content_items(id) ON DELETE SET NULL,
    file_name TEXT NOT NULL,
    file_type asset_type NOT NULL DEFAULT 'other',
    file_url TEXT NOT NULL,
    size_bytes BIGINT,
    tags TEXT[] DEFAULT '{}',
    folder_path TEXT DEFAULT '/',
    version INT NOT NULL DEFAULT 1,
    parent_asset_id UUID REFERENCES assets(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Prompts Library
CREATE TABLE IF NOT EXISTS prompts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    category TEXT NOT NULL,                         -- 'research', 'script', 'image', 'voice', etc.
    content TEXT NOT NULL,
    variables TEXT[] DEFAULT '{}',                  -- list of variable names, e.g. ['brand_name', 'topic']
    version INT NOT NULL DEFAULT 1,
    parent_prompt_id UUID REFERENCES prompts(id) ON DELETE SET NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL
);

-- Prompt History and Testing logs
CREATE TABLE IF NOT EXISTS prompt_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prompt_id UUID NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
    run_input JSONB DEFAULT '{}'::jsonb,
    run_output TEXT,
    model_used TEXT,
    parameters JSONB DEFAULT '{}'::jsonb,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    duration_ms INT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Social Platform Analytics Records
CREATE TABLE IF NOT EXISTS analytics_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_item_id UUID REFERENCES content_items(id) ON DELETE CASCADE,
    platform platform_type NOT NULL,
    views INT DEFAULT 0,
    ctr NUMERIC DEFAULT 0.0,
    watch_time_seconds NUMERIC DEFAULT 0.0,
    audience_retention JSONB DEFAULT '[]'::jsonb,
    subscribers INT DEFAULT 0,
    comments INT DEFAULT 0,
    likes INT DEFAULT 0,
    shares INT DEFAULT 0,
    revenue NUMERIC DEFAULT 0.0,
    record_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- n8n Automation and Execution logs
CREATE TABLE IF NOT EXISTS workflow_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pipeline_id UUID REFERENCES pipelines(id) ON DELETE SET NULL,
    workflow_id TEXT,                              -- n8n execution id
    step_name TEXT NOT NULL,
    status TEXT NOT NULL,                           -- 'success', 'failed', 'running'
    log_message TEXT,
    error_details TEXT,
    start_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP WITH TIME ZONE
);

-- Secure Admin Credentials and Service Keys settings (AES encrypted payload)
CREATE TABLE IF NOT EXISTS credentials_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    provider_name TEXT NOT NULL,                   -- e.g. 'openai', 'gemini', 'elevenlabs', 'wordpress'
    api_key_encrypted TEXT NOT NULL,               -- Encryption key string
    settings JSONB DEFAULT '{}'::jsonb,            -- Other configurations (e.g. endpoint, defaults)
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_workspace_provider UNIQUE (workspace_id, provider_name)
);

-- System Logs
CREATE TABLE IF NOT EXISTS system_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    level TEXT NOT NULL,                           -- 'info', 'warn', 'error'
    source TEXT NOT NULL,                          -- service name
    message TEXT NOT NULL,
    stack_trace TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed Initial Mock Data for Local Testing
INSERT INTO users (id, email, full_name, avatar_url) VALUES
('b8c5e0de-dc33-4ca2-8db8-cb48b266d6c3', 'admin@ai-contentfactory.com', 'SaaS Administrator', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100');

INSERT INTO workspaces (id, name, logo_url, brand_voice, created_by) VALUES
('a260840b-70c8-4ea7-9a80-e223c21b96a9', 'Kids Education Channel', 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=100', 'Enthusiastic, clear, vocabulary-appropriate for children aged 5-10, slow pacing, friendly tone.', 'b8c5e0de-dc33-4ca2-8db8-cb48b266d6c3'),
('e3b1c678-bbca-4672-888e-73cb11b439c2', 'Corporate Tech Marketing', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100', 'Professional, authoritative, data-driven, highlighting ROI, using industry terms and clear summaries.', 'b8c5e0de-dc33-4ca2-8db8-cb48b266d6c3');

INSERT INTO workspace_members (workspace_id, user_id, role) VALUES
('a260840b-70c8-4ea7-9a80-e223c21b96a9', 'b8c5e0de-dc33-4ca2-8db8-cb48b266d6c3', 'admin'),
('e3b1c678-bbca-4672-888e-73cb11b439c2', 'b8c5e0de-dc33-4ca2-8db8-cb48b266d6c3', 'admin');

INSERT INTO projects (id, workspace_id, name, description, publishing_schedule) VALUES
('d119e078-43d9-48fb-9762-ee27e2837bc5', 'a260840b-70c8-4ea7-9a80-e223c21b96a9', 'English Rhymes & Phonics', 'Creating short animation-backed children rhymes and letter sounds guides.', '{"days": ["Monday", "Thursday"], "time": "14:00"}'::jsonb),
('d222e078-43d9-48fb-9762-ee27e2837bc5', 'a260840b-70c8-4ea7-9a80-e223c21b96a9', 'Simple Science Experiments', 'Simple science explanations with voiceover and step-by-step cartoon visuals.', '{"days": ["Saturday"], "time": "09:00"}'::jsonb);

INSERT INTO prompts (id, workspace_id, name, category, content, variables, version, is_active) VALUES
('c777d0de-dc33-4ca2-8db8-cb48b266d6c3', 'a260840b-70c8-4ea7-9a80-e223c21b96a9', 'Youtube Kids Script Generator', 'script', 'You are a Kids Content Director. Write a fun, engaging YouTube video script about {topic}. The tone should be {tone}. Use repetitive learning points.', ARRAY['topic', 'tone'], 1, TRUE),
('c888d0de-dc33-4ca2-8db8-cb48b266d6c3', 'a260840b-70c8-4ea7-9a80-e223c21b96a9', 'Midjourney Cartoon Prompt Builder', 'image', 'Generate a high-quality 2D cartoon style vector illustration of {scene_description}, vibrant pastel colors, kids storybook background, clean lines, no text --ar 16:9', ARRAY['scene_description'], 1, TRUE);

INSERT INTO content_items (id, project_id, title, status, content_type, data, scheduled_publish_time) VALUES
('fa11a8b9-8c9d-4cfb-a7e8-b7c11a681b99', 'd119e078-43d9-48fb-9762-ee27e2837bc5', 'The Phonics Alphabet Song', 'published', 'YouTube Shorts', '{"script": "A is for Apple, a-a-apple! B is for Ball, b-b-ball!", "audio_url": "/mock/vocals/phonics.mp3", "video_url": "/mock/renders/phonics.mp4"}'::jsonb, CURRENT_TIMESTAMP - INTERVAL '2 days'),
('fa22a8b9-8c9d-4cfb-a7e8-b7c11a681b99', 'd119e078-43d9-48fb-9762-ee27e2837bc5', 'Learning Colors with Fruits', 'scheduled', 'YouTube Shorts', '{"script": "Red strawberry, yellow banana, blue blueberry!", "audio_url": "/mock/vocals/colors.mp3"}'::jsonb, CURRENT_TIMESTAMP + INTERVAL '1 day');

INSERT INTO assets (workspace_id, content_item_id, file_name, file_type, file_url, size_bytes, tags, folder_path) VALUES
('a260840b-70c8-4ea7-9a80-e223c21b96a9', 'fa11a8b9-8c9d-4cfb-a7e8-b7c11a681b99', 'phonics_script.txt', 'text', '/assets/phonics_script.txt', 2048, ARRAY['phonics', 'script', 'text'], '/scripts'),
('a260840b-70c8-4ea7-9a80-e223c21b96a9', 'fa11a8b9-8c9d-4cfb-a7e8-b7c11a681b99', 'phonics_voiceover.wav', 'audio', '/assets/phonics_voiceover.wav', 14500000, ARRAY['phonics', 'voiceover', 'kokoro'], '/vocals'),
('a260840b-70c8-4ea7-9a80-e223c21b96a9', 'fa11a8b9-8c9d-4cfb-a7e8-b7c11a681b99', 'phonics_final.mp4', 'video', '/assets/phonics_final.mp4', 85000000, ARRAY['phonics', 'video', 'export'], '/renders');

INSERT INTO analytics_records (content_item_id, platform, views, ctr, watch_time_seconds, subscribers, comments, likes, shares, revenue, record_date) VALUES
('fa11a8b9-8c9d-4cfb-a7e8-b7c11a681b99', 'youtube', 12450, 8.4, 37350, 48, 12, 620, 84, 12.45, CURRENT_DATE - INTERVAL '1 day'),
('fa11a8b9-8c9d-4cfb-a7e8-b7c11a681b99', 'youtube', 15120, 8.8, 48380, 62, 19, 740, 110, 15.12, CURRENT_DATE);
