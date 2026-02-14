import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { getBookmarks } from "@/app/actions/bookmarks";
import { BookmarkList } from "@/components/bookmark-list";
import { BookmarkForm } from "@/components/bookmark-form";

async function DashboardContent() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  if (!user) {
    return redirect("/");
  }

  // Fetch initial bookmarks on server
  const initialBookmarks = await getBookmarks();

  return (
    <>
      <nav className="w-full border-b">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-5 py-4">
          <h1 className="text-xl font-semibold">Astramark</h1>
          <div className="flex items-center gap-4">
            <ThemeSwitcher />
            <AuthButton />
          </div>
        </div>
      </nav>

      <main className="flex-1 max-w-4xl mx-auto w-full px-5 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">
              Your Bookmarks
            </h2>
            <p className="text-muted-foreground">
              Save and organize your favorite links
            </p>
          </div>

          {/* Add Bookmark Form */}
          <BookmarkForm />

          {/* Bookmarks List */}
          <BookmarkList initialBookmarks={initialBookmarks} userId={user.sub} />
        </div>
      </main>
    </>
  );
}

export default function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Suspense fallback={<DashboardLoading />}>
        <DashboardContent />
      </Suspense>
    </div>
  );
}

function DashboardLoading() {
  return (
    <>
      <nav className="w-full border-b">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-5 py-4">
          <div className="h-6 w-32 bg-muted animate-pulse rounded" />
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 bg-muted animate-pulse rounded-full" />
            <div className="h-10 w-24 bg-muted animate-pulse rounded" />
          </div>
        </div>
      </nav>
      <main className="flex-1 max-w-4xl mx-auto w-full px-5 py-8">
        <div className="space-y-8">
          <div className="space-y-2">
            <div className="h-9 w-64 bg-muted animate-pulse rounded" />
            <div className="h-5 w-80 bg-muted animate-pulse rounded" />
          </div>
          <div className="h-56 bg-muted animate-pulse rounded-lg" />
          <div className="space-y-4">
            <div className="h-28 bg-muted animate-pulse rounded-lg" />
            <div className="h-28 bg-muted animate-pulse rounded-lg" />
            <div className="h-28 bg-muted animate-pulse rounded-lg" />
          </div>
        </div>
      </main>
    </>
  );
}
