import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;


  if (!user) {
    return redirect("/");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="w-full border-b">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-5 py-4">
          <h1 className="text-xl font-semibold">Astramark</h1>
          <div className="flex items-center gap-4">
            <ThemeSwitcher/>
            <AuthButton />
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full px-5 py-8">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">Dashboard</h2>
            <p className="text-muted-foreground">Manage your bookmarks</p>
          </div>

          {/* Bookmarks will go here */}
          <div className="border border-dashed border-border rounded-lg p-12 text-center">
            <p className="text-muted-foreground">No bookmarks yet. Add your first one!</p>
          </div>
        </div>
      </main>
    </div>
  );
}