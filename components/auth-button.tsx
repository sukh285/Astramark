import { createClient } from "@/lib/supabase/server";
import { signInWithGoogle, signOut } from "@/app/actions/auth";
import { SubmitButton } from "./submit-button";
import { LogOut } from "lucide-react";

export async function AuthButton() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    return (
      <form action={signOut}>
        <SubmitButton className="p-2 text-muted-foreground hover:text-destructive transition-colors">
          <LogOut size={18} />
        </SubmitButton>
      </form>
    );
  }

  return (
    <form action={signInWithGoogle}>
      <SubmitButton 
        className="h-9 px-4 text-xs font-bold bg-primary/10 text-primary hover:bg-primary/20 rounded-lg transition-colors border border-primary/10"
      >
        SIGN IN
      </SubmitButton>
    </form>
  );
}