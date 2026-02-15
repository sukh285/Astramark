"use server";

import { getSiteUrl } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function signInWithGoogle() {
  const supabase = await createClient();
  const redirectUrl = `${getSiteUrl()}/auth/callback?next=/dashboard`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: redirectUrl,
    },
  });

  if (error) {
    console.error("Auth Error:", error);
    return redirect("/auth/error");
  }

  if (data.url) {
    return redirect(data.url);
  }
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/");
}