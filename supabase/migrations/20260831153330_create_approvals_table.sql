/*
# Create approvals table for admin-gated payment approval

1. New Tables
- `approvals`
  - `id` (uuid, primary key)
  - `session_id` (text, not null) — links to the localStorage session ID from the customer's browser
  - `status` (text, not null, default 'pending') — one of: pending, approved, declined
  - `submission_type` (text) — metadata only (e.g. 'insurance_payment'); never stores sensitive data
  - `created_at` (timestamptz, default now())
  - `decided_at` (timestamptz, nullable) — set when admin approves/declines
2. Security
- Enable RLS on `approvals`.
- This is a no-auth (no sign-in) customer-facing app, so policies use `TO anon, authenticated`.
- INSERT: anon can create new approval requests (status must be 'pending').
- SELECT: anon can read approvals by session_id (to poll/listen for their own approval status).
- UPDATE: only the service role (admin dashboard) can change status. anon CANNOT update.
  This is enforced by NOT granting an UPDATE policy to anon/authenticated — only service_role can update,
  and service_role bypasses RLS entirely.
- DELETE: no delete policy for anon/authenticated (service_role can still delete via bypass).
3. Important Notes
- The customer frontend creates a row when payment is submitted, then listens via Supabase
  realtime for status changes on that row.
- The admin dashboard (running with service_role key) updates the status to 'approved' or 'declined'.
- No sensitive payment data (card numbers, CVVs, etc.) is stored in this table — only metadata flags.
*/

CREATE TABLE IF NOT EXISTS approvals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'declined')),
  submission_type text,
  created_at timestamptz NOT NULL DEFAULT now(),
  decided_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_approvals_session_id ON approvals (session_id);
CREATE INDEX IF NOT EXISTS idx_approvals_status ON approvals (status);

ALTER TABLE approvals ENABLE ROW LEVEL SECURITY;

-- Allow anon to insert new approval requests (status defaults to 'pending')
DROP POLICY IF EXISTS "anon_insert_approvals" ON approvals;
CREATE POLICY "anon_insert_approvals"
ON approvals FOR INSERT
TO anon, authenticated
WITH CHECK (status = 'pending');

-- Allow anon to read approvals (they need to see their own session's status)
DROP POLICY IF EXISTS "anon_select_approvals" ON approvals;
CREATE POLICY "anon_select_approvals"
ON approvals FOR SELECT
TO anon, authenticated
USING (true);

-- No UPDATE or DELETE policy for anon/authenticated.
-- Only the service_role (admin dashboard) can change status, bypassing RLS.
