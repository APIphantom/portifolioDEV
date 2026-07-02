-- Additive migration: explicit structured case-study data per project
ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS case_study jsonb NOT NULL DEFAULT '{}'::jsonb;

COMMENT ON COLUMN public.projects.case_study IS
  'Structured case study content edited in admin and rendered in project detail page.';

CREATE INDEX IF NOT EXISTS idx_projects_case_study_gin
ON public.projects USING GIN (case_study jsonb_path_ops);
