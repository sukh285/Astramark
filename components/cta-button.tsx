import { getSiteUrl } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function CTAButton() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Server action for OAuth (same behavior as AuthButton)
  const handleClick = async () => {
    "use server";

    const supabase = await createClient();

    // If already logged in → go to dashboard
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      return redirect("/dashboard");
    }

    // If not logged in → start Google OAuth
    const redirectUrl = `${getSiteUrl()}/auth/callback?next=/dashboard`;

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectUrl,
      },
    });

    if (error) {
      return redirect("/auth/error");
    }

    if (data.url) {
      return redirect(data.url);
    }
  };

  return (
    <form action={handleClick}>
      <button
        type="submit"
        className="inline-flex items-center justify-center px-4 py-2 text-lg font-semibold rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition"
      >
        {user ? "Go to Dashboard" : "Start Marking"}
      </button>
    </form>
  );
}
