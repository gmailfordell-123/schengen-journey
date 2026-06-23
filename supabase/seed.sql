-- =============================================================================
-- Schengen Journey — Seed Data (local development only)
-- Run AFTER the initial migration.
-- Uses hardcoded UUIDs so seeds are idempotent.
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Admin user profile (must already exist in auth.users in local Supabase)
-- Create via: supabase auth signup --email admin@schengenjourney.com --password admin1234
-- Then paste the returned UUID below.
-- ---------------------------------------------------------------------------

-- INSERT INTO user_profiles (id, first_name, last_name, is_admin, region)
-- VALUES ('00000000-0000-0000-0000-000000000001', 'Admin', 'User', TRUE, 'ireland')
-- ON CONFLICT (id) DO UPDATE SET is_admin = TRUE;


-- ---------------------------------------------------------------------------
-- Sample customer profiles
-- ---------------------------------------------------------------------------

INSERT INTO user_profiles (id, first_name, last_name, dob, nationality, phone, region,
                            passport_no, passport_country, passport_issue_date, passport_expiry)
VALUES
  (
    '10000000-0000-0000-0000-000000000001',
    'Sarah', 'O''Brien',
    '1990-03-14', 'Irish', '+353 87 123 4567', 'ireland',
    'P1234567', 'Ireland', '2020-04-01', '2030-04-01'
  ),
  (
    '10000000-0000-0000-0000-000000000002',
    'James', 'Murphy',
    '1985-11-22', 'Irish', '+353 86 987 6543', 'ireland',
    'P7654321', 'Ireland', '2019-06-15', '2029-06-15'
  ),
  (
    '10000000-0000-0000-0000-000000000003',
    'Amina', 'Khan',
    '1992-07-05', 'British', '+44 7700 900 123', 'uk',
    'UK987654', 'United Kingdom', '2021-01-10', '2031-01-10'
  )
ON CONFLICT (id) DO NOTHING;


-- ---------------------------------------------------------------------------
-- Sample appointments
-- ---------------------------------------------------------------------------

INSERT INTO appointments (id, user_id, package, region, price_paid, destination,
                           travel_date_from, travel_date_to, appointment_date, appointment_time,
                           status, reference)
VALUES
  (
    '20000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    'smart_travel_plan', 'ireland', 150.00,
    'France', '2026-08-01', '2026-08-14',
    '2026-07-10', '10:00',
    'confirmed', 'SJ-SAR001'
  ),
  (
    '20000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000002',
    'essential_start', 'ireland', 99.00,
    'Germany', '2026-07-20', '2026-07-30',
    '2026-07-15', '14:30',
    'pending', 'SJ-JAM002'
  ),
  (
    '20000000-0000-0000-0000-000000000003',
    '10000000-0000-0000-0000-000000000003',
    'platinum_complete_plan', 'uk', 200.00,
    'Italy', '2026-07-15', '2026-07-29',
    '2026-07-08', '11:00',
    'completed', 'SJ-AMI003'
  )
ON CONFLICT (id) DO NOTHING;


-- ---------------------------------------------------------------------------
-- Sample applicants
-- ---------------------------------------------------------------------------

INSERT INTO applicants (id, appointment_id, first_name, last_name, dob, nationality,
                         passport_no, passport_country, passport_issue_date, passport_expiry, is_primary)
VALUES
  -- Appointment 1
  (
    '30000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000001',
    'Sarah', 'O''Brien', '1990-03-14', 'Irish',
    'P1234567', 'Ireland', '2020-04-01', '2030-04-01', TRUE
  ),
  -- Appointment 2
  (
    '30000000-0000-0000-0000-000000000002',
    '20000000-0000-0000-0000-000000000002',
    'James', 'Murphy', '1985-11-22', 'Irish',
    'P7654321', 'Ireland', '2019-06-15', '2029-06-15', TRUE
  ),
  -- Appointment 3 — primary + additional applicant
  (
    '30000000-0000-0000-0000-000000000003',
    '20000000-0000-0000-0000-000000000003',
    'Amina', 'Khan', '1992-07-05', 'British',
    'UK987654', 'United Kingdom', '2021-01-10', '2031-01-10', TRUE
  ),
  (
    '30000000-0000-0000-0000-000000000004',
    '20000000-0000-0000-0000-000000000003',
    'Tariq', 'Khan', '1989-03-22', 'British',
    'UK112233', 'United Kingdom', '2020-05-01', '2030-05-01', FALSE
  )
ON CONFLICT (id) DO NOTHING;


-- ---------------------------------------------------------------------------
-- Sample applications
-- ---------------------------------------------------------------------------

INSERT INTO applications (id, appointment_id, applicant_id, user_id, status, submitted_at)
VALUES
  (
    '40000000-0000-0000-0000-000000000001',
    '20000000-0000-0000-0000-000000000001',
    '30000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    'under_review',
    NOW() - INTERVAL '5 days'
  ),
  (
    '40000000-0000-0000-0000-000000000002',
    '20000000-0000-0000-0000-000000000002',
    '30000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000002',
    'documents_required',
    NOW() - INTERVAL '2 days'
  ),
  (
    '40000000-0000-0000-0000-000000000003',
    '20000000-0000-0000-0000-000000000003',
    '30000000-0000-0000-0000-000000000003',
    '10000000-0000-0000-0000-000000000003',
    'approved',
    NOW() - INTERVAL '14 days'
  ),
  (
    '40000000-0000-0000-0000-000000000004',
    '20000000-0000-0000-0000-000000000003',
    '30000000-0000-0000-0000-000000000004',
    '10000000-0000-0000-0000-000000000003',
    'approved',
    NOW() - INTERVAL '14 days'
  )
ON CONFLICT (id) DO NOTHING;


-- ---------------------------------------------------------------------------
-- Sample blog posts
-- ---------------------------------------------------------------------------

INSERT INTO blog_posts (id, slug, title, excerpt, content, tags, status, published_at)
VALUES
  (
    '50000000-0000-0000-0000-000000000001',
    'what-is-the-90-180-day-rule',
    'What is the Schengen 90/180-day rule?',
    'Everything you need to know about how long you can stay in the Schengen Area and how to calculate your remaining days.',
    'The 90/180-day rule limits non-EU nationals to 90 days within any 180-day rolling period across the Schengen Area. This applies to all 27 member states combined, not per country...',
    ARRAY['visa-tips', 'schengen-rules', 'travel'],
    'published',
    NOW() - INTERVAL '10 days'
  ),
  (
    '50000000-0000-0000-0000-000000000002',
    'documents-checklist-schengen-visa',
    'Complete Schengen visa documents checklist for Irish residents',
    'A step-by-step checklist of every document you need to submit a successful Schengen visa application from Ireland.',
    'Applying for a Schengen visa requires careful preparation. Here is a complete checklist of documents you will need...',
    ARRAY['documents', 'checklist', 'ireland'],
    'published',
    NOW() - INTERVAL '3 days'
  ),
  (
    '50000000-0000-0000-0000-000000000003',
    'how-to-book-vfs-appointment',
    'How to book a VFS Global appointment in Ireland',
    'A walkthrough of the VFS Global portal and how Schengen Journey handles the booking process for you.',
    'VFS Global manages Schengen visa appointments for most embassies in Ireland. Here is how the process works...',
    ARRAY['vfs', 'appointment', 'how-to'],
    'draft',
    NULL
  )
ON CONFLICT (id) DO NOTHING;
