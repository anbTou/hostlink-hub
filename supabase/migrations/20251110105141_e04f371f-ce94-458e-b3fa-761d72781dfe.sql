-- Create saved views table for storing user-defined filters
CREATE TABLE IF NOT EXISTS public.user_saved_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  icon TEXT,
  filters JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, name)
);

-- Enable RLS
ALTER TABLE public.user_saved_views ENABLE ROW LEVEL SECURITY;

-- Users can only see their own saved views
CREATE POLICY "Users can view their own saved views"
  ON public.user_saved_views
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own saved views
CREATE POLICY "Users can create their own saved views"
  ON public.user_saved_views
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own saved views
CREATE POLICY "Users can update their own saved views"
  ON public.user_saved_views
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own saved views
CREATE POLICY "Users can delete their own saved views"
  ON public.user_saved_views
  FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger for updating updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_saved_views_updated_at
  BEFORE UPDATE ON public.user_saved_views
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();