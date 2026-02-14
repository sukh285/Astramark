const isDev = process.env.NODE_ENV === "development";

export function getSiteUrl() {
  if (isDev) {
    return "http://localhost:3000";
  }

  return process.env.NEXT_PUBLIC_SITE_URL || "https://astramark.vercel.app";
}

export function getSupabaseConfig() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    key: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
  };
}