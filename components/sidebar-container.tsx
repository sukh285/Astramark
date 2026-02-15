import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/sidebar";

export async function SidebarContainer() {
  const supabase = await createClient();
  // This fetch now happens inside this component, not blocking the Layout
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <Sidebar 
      userAvatar={user?.user_metadata?.avatar_url}
      userEmail={user?.email}
    />
  );
}