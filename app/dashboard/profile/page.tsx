import { requireAuth } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { ProfileView } from "@/components/dashboard/ProfileView";

export const metadata = { title: "My Profile" };

export default async function ProfilePage() {
  const profile = await requireAuth();

  // Get email from the auth session (not stored in user_profiles)
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const email = user?.email ?? "";

  return <ProfileView profile={profile} email={email} />;
}
