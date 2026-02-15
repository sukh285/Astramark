"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";
import { ReactNode } from "react";

export function SubmitButton({ 
  children, 
  className, 
  icon 
}: { 
  children: ReactNode; 
  className?: string;
  icon?: ReactNode;
}) {
  const { pending } = useFormStatus();

  return (
    <button 
      type="submit" 
      disabled={pending} 
      className={`relative disabled:opacity-70 disabled:cursor-not-allowed ${className}`}
    >
      {pending && (
        <div className="absolute inset-0 flex items-center justify-center bg-inherit rounded-md">
          <Loader2 size={16} className="animate-spin" />
        </div>
      )}
      <span className={`flex items-center gap-2 ${pending ? "opacity-0" : "opacity-100"}`}>
        {icon}
        {children}
      </span>
    </button>
  );
}