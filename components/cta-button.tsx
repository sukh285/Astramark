import { signInWithGoogle } from "@/app/actions/auth";
import { SubmitButton } from "./submit-button";
import { ArrowRight } from "lucide-react";

export function CTAButton() {
  return (
    <form action={signInWithGoogle}>
      <SubmitButton 
        className="h-11 px-8 text-sm font-bold bg-primary text-primary-foreground hover:opacity-90 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
        icon={<ArrowRight size={18} />}
      >
        Start Marking
      </SubmitButton>
    </form>
  );
}