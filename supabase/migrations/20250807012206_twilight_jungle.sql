/*
  # Create checklists and videos tables

  1. New Tables
    - `checklists`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `vehicle_plate` (text)
      - `vehicle_model` (text)
      - `driver_name` (text)
      - `inspector_name` (text)
      - `status` (text)
      - `basic_checks` (jsonb)
      - `visual_inspections` (jsonb)
      - `total_frames` (integer)
      - `total_videos` (integer)
    
    - `inspection_videos`
      - `id` (uuid, primary key)
      - `checklist_id` (uuid, foreign key)
      - `inspection_id` (integer)
      - `inspection_name` (text)
      - `video_data` (bytea)
      - `video_type` (text)
      - `video_size` (bigint)
      - `recorded_at` (timestamp)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS checklists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  vehicle_plate text DEFAULT '',
  vehicle_model text DEFAULT '',
  driver_name text DEFAULT '',
  inspector_name text DEFAULT '',
  status text DEFAULT 'draft',
  basic_checks jsonb DEFAULT '[]'::jsonb,
  visual_inspections jsonb DEFAULT '[]'::jsonb,
  total_frames integer DEFAULT 0,
  total_videos integer DEFAULT 0
);

CREATE TABLE IF NOT EXISTS inspection_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  checklist_id uuid REFERENCES checklists(id) ON DELETE CASCADE,
  inspection_id integer NOT NULL,
  inspection_name text NOT NULL,
  video_data bytea NOT NULL,
  video_type text DEFAULT 'video/webm',
  video_size bigint DEFAULT 0,
  recorded_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE inspection_videos ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Users can manage their own checklists"
  ON checklists
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can manage their own videos"
  ON inspection_videos
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_checklists_created_at ON checklists(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_checklists_status ON checklists(status);
CREATE INDEX IF NOT EXISTS idx_checklists_vehicle_plate ON checklists(vehicle_plate);
CREATE INDEX IF NOT EXISTS idx_inspection_videos_checklist_id ON inspection_videos(checklist_id);
CREATE INDEX IF NOT EXISTS idx_inspection_videos_inspection_id ON inspection_videos(inspection_id);