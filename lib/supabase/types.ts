/**
 * Database types derived from the Supabase schema.
 * Re-generate with: npx supabase gen types typescript --local > lib/supabase/types.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// ─── Enums ────────────────────────────────────────────────────────────────────

export type PackageType =
  | "essential_start"
  | "smart_travel_plan"
  | "platinum_complete_plan";

export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled";

export type ApplicationStatus =
  | "submitted"
  | "documents_required"
  | "under_review"
  | "approved"
  | "rejected";

export type DocumentType =
  | "passport_copy"
  | "passport_photo"
  | "visa_application_form"
  | "cover_letter"
  | "travel_insurance"
  | "hotel_reservation"
  | "flight_reservation"
  | "bank_statement"
  | "employment_letter"
  | "other";

export type DocumentStatus = "pending" | "approved" | "rejected";

export type PostStatus = "draft" | "published" | "archived";

export type Region = "uk" | "ireland";

// ─── Row types ────────────────────────────────────────────────────────────────

export type UserProfile = {
  id: string;
  first_name: string;
  last_name: string;
  dob: string | null;
  nationality: string | null;
  region: Region;
  phone: string | null;
  address: string | null;
  passport_no: string | null;
  passport_country: string | null;
  passport_issue_date: string | null;
  passport_expiry: string | null;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
};

export type Appointment = {
  id: string;
  user_id: string;
  package: PackageType;
  region: Region;
  price_paid: number | null;
  destination: string;
  travel_date_from: string | null;
  travel_date_to: string | null;
  appointment_date: string | null;
  appointment_time: string | null;
  status: AppointmentStatus;
  reference: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type Applicant = {
  id: string;
  appointment_id: string;
  first_name: string;
  last_name: string;
  dob: string;
  nationality: string;
  passport_no: string;
  passport_country: string;
  passport_issue_date: string;
  passport_expiry: string;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
};

export type Application = {
  id: string;
  appointment_id: string;
  applicant_id: string;
  user_id: string;
  status: ApplicationStatus;
  submitted_at: string | null;
  decision_at: string | null;
  embassy_ref: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
};

export type Document = {
  id: string;
  user_id: string;
  appointment_id: string | null;
  application_id: string | null;
  name: string;
  type: DocumentType;
  file_path: string;
  file_size_bytes: number | null;
  mime_type: string | null;
  status: DocumentStatus;
  reviewed_by: string | null;
  reviewed_at: string | null;
  review_note: string | null;
  created_at: string;
  updated_at: string;
};

export type BlogPost = {
  id: string;
  author_id: string | null;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  tags: string[];
  status: PostStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

// ─── Supabase Database shape (used by createClient generic) ──────────────────

export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: UserProfile;
        Insert: Omit<UserProfile, "created_at" | "updated_at"> & {
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<UserProfile, "id" | "created_at">>;
      };
      appointments: {
        Row: Appointment;
        Insert: Omit<Appointment, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
          reference?: string;
        };
        Update: Partial<Omit<Appointment, "id" | "created_at">>;
      };
      applicants: {
        Row: Applicant;
        Insert: Omit<Applicant, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Applicant, "id" | "created_at">>;
      };
      applications: {
        Row: Application;
        Insert: Omit<Application, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Application, "id" | "created_at">>;
      };
      documents: {
        Row: Document;
        Insert: Omit<Document, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Document, "id" | "created_at">>;
      };
      blog_posts: {
        Row: BlogPost;
        Insert: Omit<BlogPost, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<BlogPost, "id" | "created_at">>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      package_type: PackageType;
      appointment_status: AppointmentStatus;
      application_status: ApplicationStatus;
      document_type: DocumentType;
      document_status: DocumentStatus;
      post_status: PostStatus;
      region: Region;
    };
  };
};
