import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/sidebar";

export async function SidebarContainer() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <Sidebar 
      userAvatar={user?.user_metadata?.avatar_url}
      userEmail={user?.email}
    />
  );
}