-- =============================================================================
-- Schengen Journey — Initial Schema
-- Migration: 20260621000000_initial_schema
--
-- Tables
--   user_profiles      One-to-one extension of auth.users
--   appointments       A booked session for one or more applicants
--   applicants         Each person travelling on an appointment
--   applications       Visa application tracking per applicant
--   documents          Files attached to a user / appointment / application
--   blog_posts         CMS content managed by admins
--
-- All tables:
--   • have created_at / updated_at timestamps (auto-maintained by trigger)
--   • have Row Level Security enabled
--   • define explicit RLS policies for authenticated access
-- =============================================================================


-- ---------------------------------------------------------------------------
-- 0. Helper: auto-update updated_at on any row change
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


-- ---------------------------------------------------------------------------
-- 1. ENUMS
-- ---------------------------------------------------------------------------

CREATE TYPE package_type AS ENUM (
  'essential_start',
  'smart_travel_plan',
  'platinum_complete_plan'
);

CREATE TYPE appointment_status AS ENUM (
  'pending',        -- booking received, not yet confirmed
  'confirmed',      -- appointment date locked in
  'completed',      -- appointment attended
  'cancelled'
);

CREATE TYPE application_status AS ENUM (
  'submitted',
  'documents_required',
  'under_review',
  'approved',
  'rejected'
);

CREATE TYPE document_type AS ENUM (
  'passport_copy',
  'passport_photo',
  'visa_application_form',
  'cover_letter',
  'travel_insurance',
  'hotel_reservation',
  'flight_reservation',
  'bank_statement',
  'employment_letter',
  'other'
);

CREATE TYPE document_status AS ENUM (
  'pending',
  'approved',
  'rejected'
);

CREATE TYPE post_status AS ENUM (
  'draft',
  'published',
  'archived'
);

CREATE TYPE region AS ENUM (
  'uk',
  'ireland'
);


-- ---------------------------------------------------------------------------
-- 2. USER PROFILES
--    One row per auth.users entry. Created on first sign-in via trigger or
--    manually. user_id is the primary key and also the FK to auth.users.
-- ---------------------------------------------------------------------------

CREATE TABLE user_profiles (
  id                  UUID        PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,

  -- Personal
  first_name          TEXT        NOT NULL DEFAULT '',
  last_name           TEXT        NOT NULL DEFAULT '',
  dob                 DATE,
  nationality         TEXT,
  region              region      NOT NULL DEFAULT 'ireland',

  -- Contact
  phone               TEXT,
  address             TEXT,

  -- Passport
  passport_no         TEXT,
  passport_country    TEXT,
  passport_issue_date DATE,
  passport_expiry     DATE,

  -- Role
  is_admin            BOOLEAN     NOT NULL DEFAULT FALSE,

  -- Timestamps
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Index for fast lookup by email via auth join
CREATE INDEX idx_user_profiles_created_at ON user_profiles (created_at DESC);


-- ---------------------------------------------------------------------------
-- 3. APPOINTMENTS
--    Top-level booking record created when a user completes the booking form.
-- ---------------------------------------------------------------------------

CREATE TABLE appointments (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID        NOT NULL REFERENCES user_profiles (id) ON DELETE CASCADE,

  -- Package
  package             package_type NOT NULL,
  region              region       NOT NULL DEFAULT 'ireland',
  price_paid          NUMERIC(8, 2),        -- snapshot of price at booking time

  -- Travel
  destination         TEXT        NOT NULL,
  travel_date_from    DATE,
  travel_date_to      DATE,

  -- Appointment slot
  appointment_date    DATE,
  appointment_time    TIME,

  -- Status
  status              appointment_status NOT NULL DEFAULT 'pending',

  -- Reference shown to customer (e.g. SJ-ABC123)
  reference           TEXT        UNIQUE NOT NULL,

  -- Admin notes
  notes               TEXT,

  -- Timestamps
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_appointments_updated_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_appointments_user_id   ON appointments (user_id);
CREATE INDEX idx_appointments_status    ON appointments (status);
CREATE INDEX idx_appointments_created_at ON appointments (created_at DESC);


-- ---------------------------------------------------------------------------
-- 4. APPLICANTS
--    Each person on an appointment (primary + additional). Separate from
--    user_profiles because an applicant might not have a platform account
--    (e.g. a family member).
-- ---------------------------------------------------------------------------

CREATE TABLE applicants (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id      UUID        NOT NULL REFERENCES appointments (id) ON DELETE CASCADE,

  -- Identification
  first_name          TEXT        NOT NULL,
  last_name           TEXT        NOT NULL,
  dob                 DATE        NOT NULL,
  nationality         TEXT        NOT NULL,

  -- Passport
  passport_no         TEXT        NOT NULL,
  passport_country    TEXT        NOT NULL,
  passport_issue_date DATE        NOT NULL,
  passport_expiry     DATE        NOT NULL,

  -- The first applicant (index 0 in form) is the primary contact
  is_primary          BOOLEAN     NOT NULL DEFAULT FALSE,

  -- Timestamps
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_applicants_updated_at
  BEFORE UPDATE ON applicants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_applicants_appointment_id ON applicants (appointment_id);


-- ---------------------------------------------------------------------------
-- 5. APPLICATIONS
--    Visa application tracking — one per applicant per appointment.
--    Tracks the status lifecycle from Submitted → Approved/Rejected.
-- ---------------------------------------------------------------------------

CREATE TABLE applications (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id      UUID        NOT NULL REFERENCES appointments (id) ON DELETE CASCADE,
  applicant_id        UUID        NOT NULL REFERENCES applicants (id) ON DELETE CASCADE,
  user_id             UUID        NOT NULL REFERENCES user_profiles (id) ON DELETE CASCADE,

  -- Status lifecycle
  status              application_status NOT NULL DEFAULT 'submitted',

  -- Key dates
  submitted_at        TIMESTAMPTZ,
  decision_at         TIMESTAMPTZ,

  -- Optional embassy / VFS tracking reference
  embassy_ref         TEXT,

  -- Admin notes visible only to staff
  admin_notes         TEXT,

  -- Timestamps
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- One application per applicant per appointment
  UNIQUE (appointment_id, applicant_id)
);

CREATE TRIGGER trg_applications_updated_at
  BEFORE UPDATE ON applications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_applications_user_id        ON applications (user_id);
CREATE INDEX idx_applications_appointment_id ON applications (appointment_id);
CREATE INDEX idx_applications_status         ON applications (status);


-- ---------------------------------------------------------------------------
-- 6. DOCUMENTS
--    Files uploaded by customers or generated by staff. Linked to a user and
--    optionally to an appointment and/or application.
-- ---------------------------------------------------------------------------

CREATE TABLE documents (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID        NOT NULL REFERENCES user_profiles (id) ON DELETE CASCADE,
  appointment_id      UUID        REFERENCES appointments (id) ON DELETE SET NULL,
  application_id      UUID        REFERENCES applications (id) ON DELETE SET NULL,

  -- File metadata
  name                TEXT        NOT NULL,
  type                document_type NOT NULL DEFAULT 'other',
  file_path           TEXT        NOT NULL, -- path in Supabase Storage bucket
  file_size_bytes     BIGINT,
  mime_type           TEXT,

  -- Review
  status              document_status NOT NULL DEFAULT 'pending',
  reviewed_by         UUID        REFERENCES user_profiles (id) ON DELETE SET NULL,
  reviewed_at         TIMESTAMPTZ,
  review_note         TEXT,

  -- Timestamps
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_documents_user_id         ON documents (user_id);
CREATE INDEX idx_documents_appointment_id  ON documents (appointment_id);
CREATE INDEX idx_documents_application_id  ON documents (application_id);
CREATE INDEX idx_documents_status          ON documents (status);


-- ---------------------------------------------------------------------------
-- 7. BLOG POSTS
--    CMS table for the marketing blog. Authors must be admin users.
-- ---------------------------------------------------------------------------

CREATE TABLE blog_posts (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id           UUID        REFERENCES user_profiles (id) ON DELETE SET NULL,

  -- Content
  slug                TEXT        UNIQUE NOT NULL,
  title               TEXT        NOT NULL,
  excerpt             TEXT,
  content             TEXT        NOT NULL DEFAULT '',
  cover_image_url     TEXT,
  tags                TEXT[]      NOT NULL DEFAULT '{}',

  -- Publishing
  status              post_status NOT NULL DEFAULT 'draft',
  published_at        TIMESTAMPTZ,

  -- Timestamps
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE INDEX idx_blog_posts_slug       ON blog_posts (slug);
CREATE INDEX idx_blog_posts_status     ON blog_posts (status);
CREATE INDEX idx_blog_posts_published  ON blog_posts (published_at DESC NULLS LAST);
CREATE INDEX idx_blog_posts_author_id  ON blog_posts (author_id);


-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================


-- ---------------------------------------------------------------------------
-- user_profiles RLS
-- ---------------------------------------------------------------------------

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Users can read and update their own profile
CREATE POLICY "users: select own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "users: update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- New profile is inserted by the sign-up trigger (service role) or by the user
CREATE POLICY "users: insert own profile"
  ON user_profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Admins can read every profile
CREATE POLICY "admins: select all profiles"
  ON user_profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid() AND up.is_admin = TRUE
    )
  );

-- Admins can update any profile (e.g. set is_admin flag)
CREATE POLICY "admins: update all profiles"
  ON user_profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid() AND up.is_admin = TRUE
    )
  );


-- ---------------------------------------------------------------------------
-- appointments RLS
-- ---------------------------------------------------------------------------

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users: select own appointments"
  ON appointments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "users: insert own appointments"
  ON appointments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users: update own appointments"
  ON appointments FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "admins: all appointments"
  ON appointments FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid() AND up.is_admin = TRUE
    )
  );


-- ---------------------------------------------------------------------------
-- applicants RLS
-- ---------------------------------------------------------------------------

ALTER TABLE applicants ENABLE ROW LEVEL SECURITY;

-- Users access applicants through their appointments
CREATE POLICY "users: select own applicants"
  ON applicants FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM appointments a
      WHERE a.id = applicants.appointment_id
        AND a.user_id = auth.uid()
    )
  );

CREATE POLICY "users: insert own applicants"
  ON applicants FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM appointments a
      WHERE a.id = applicants.appointment_id
        AND a.user_id = auth.uid()
    )
  );

CREATE POLICY "users: update own applicants"
  ON applicants FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM appointments a
      WHERE a.id = applicants.appointment_id
        AND a.user_id = auth.uid()
    )
  );

CREATE POLICY "admins: all applicants"
  ON applicants FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid() AND up.is_admin = TRUE
    )
  );


-- ---------------------------------------------------------------------------
-- applications RLS
-- ---------------------------------------------------------------------------

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users: select own applications"
  ON applications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "users: insert own applications"
  ON applications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users cannot change status themselves — admin-only
CREATE POLICY "admins: all applications"
  ON applications FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid() AND up.is_admin = TRUE
    )
  );


-- ---------------------------------------------------------------------------
-- documents RLS
-- ---------------------------------------------------------------------------

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users: select own documents"
  ON documents FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "users: insert own documents"
  ON documents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "users: delete own documents"
  ON documents FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "admins: all documents"
  ON documents FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid() AND up.is_admin = TRUE
    )
  );


-- ---------------------------------------------------------------------------
-- blog_posts RLS
-- ---------------------------------------------------------------------------

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Anyone (including anonymous) can read published posts
CREATE POLICY "public: select published posts"
  ON blog_posts FOR SELECT
  USING (status = 'published');

-- Admins have full access
CREATE POLICY "admins: all blog posts"
  ON blog_posts FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.id = auth.uid() AND up.is_admin = TRUE
    )
  );


-- =============================================================================
-- AUTO-CREATE PROFILE ON SIGN-UP
-- Fires when a new row is inserted into auth.users (via Supabase Auth).
-- =============================================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO user_profiles (id, first_name, last_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'first_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'last_name',  '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();


-- =============================================================================
-- APPOINTMENT REFERENCE GENERATOR
-- Generates a short human-readable reference like SJ-A1B2C3 on INSERT.
-- =============================================================================

CREATE OR REPLACE FUNCTION generate_appointment_reference()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  ref   TEXT := '';
  i     INT;
BEGIN
  IF NEW.reference IS NULL OR NEW.reference = '' THEN
    FOR i IN 1..6 LOOP
      ref := ref || SUBSTR(chars, FLOOR(RANDOM() * LENGTH(chars) + 1)::INT, 1);
    END LOOP;
    NEW.reference := 'SJ-' || ref;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_appointments_reference
  BEFORE INSERT ON appointments
  FOR EACH ROW EXECUTE FUNCTION generate_appointment_reference();
