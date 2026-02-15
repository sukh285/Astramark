import { createClient } from "@/lib/supabase/server";
import { getCollections } from "@/app/actions/collections";
import { getBookmarksByCollection } from "@/app/actions/bookmarks";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();

  const authPromise = supabase.auth.getUser();
  const collectionsPromise = getCollections();

  const [authResponse, collections] = await Promise.all([
    authPromise,
    collectionsPromise,
  ]);

  const user = authResponse.data.user;

  if (!user) {
    redirect("/");
  }

  const defaultCollection =
    collections.find((c) => c.is_default) || collections[0];

  const bookmarksPromise = defaultCollection
    ? getBookmarksByCollection(defaultCollection.id)
    : Promise.resolve([]);

  // 🟢 Now fully parallel
  const initialBookmarks = await bookmarksPromise;

  return (
    <DashboardShell
      initialCollections={collections}
      defaultCollectionId={defaultCollection?.id}
      initialBookmarks={initialBookmarks}
      userId={user.id}
      userEmail={user.email!}
    />
  );
}