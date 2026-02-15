"use client";

import { createBookmark } from "@/app/actions/bookmarks";
import { useRef, useState } from "react";
import { Plus, ArrowRight, Loader2 } from "lucide-react";

export function BookmarkForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); // Prevent default form submission
    
    console.log("🟢 Form submit started");
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    
    console.log("🟡 Calling createBookmark action...");
    const result = await createBookmark(formData);
    console.log("🔵 Result:", result);
    
    if (result.success) {
      formRef.current?.reset();
      console.log("✅ Form reset");
    } else {
      alert(result.error);
    }
    
    setIsLoading(false);
    console.log("🔴 Form submit ended");
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <div className="flex items-center gap-2 p-2 bg-card border border-border rounded-lg hover:border-accent focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10 transition-all">
        
        {/* Icon */}
        <div className="pl-1 text-muted-foreground/60">
          <Plus size={18} />
        </div>

        {/* Inputs */}
        <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2">
          <input 
            name="url" 
            type="url" 
            required 
            placeholder="Paste URL..." 
            disabled={isLoading}
            className="flex-1 bg-transparent text-sm h-9 px-3 rounded-md focus:outline-none focus:bg-secondary/30 placeholder:text-muted-foreground/50 transition-colors disabled:opacity-50"
          />
          
          <div className="hidden sm:block w-[1px] h-4 bg-border" />
          
          <input 
            name="title" 
            type="text" 
            required 
            placeholder="Title (e.g. Design Inspiration)" 
            disabled={isLoading}
            className="flex-1 bg-transparent text-sm h-9 px-3 rounded-md focus:outline-none focus:bg-secondary/30 placeholder:text-muted-foreground/50 transition-colors disabled:opacity-50"
          />
        </div>

        {/* Submit Button */}
        <button 
          type="submit" 
          disabled={isLoading}
          className="mr-1 p-2 rounded-md bg-secondary/50 border border-border hover:bg-accent hover:border-accent-foreground/10 text-muted-foreground hover:text-foreground transition-all disabled:opacity-50 disabled:hover:bg-secondary/50"
        >
          {isLoading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <ArrowRight size={16} />
          )}
        </button>
      </div>
    </form>
  );
}