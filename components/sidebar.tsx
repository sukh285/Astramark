"use client";

import { LogOut } from "lucide-react";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface SidebarProps {
  userAvatar?: string;
  userEmail?: string;
}

export function Sidebar({ userAvatar, userEmail }: SidebarProps) {
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <aside className="w-20 h-screen sticky top-0 z-40 flex flex-col items-center border-r bg-card flex-shrink-0 py-6">
      
      {/* 1. Top: Logo */}
      <div className="shrink-0 mb-8">
        <div className="relative w-10 h-10">
          <Image 
            src="/logo.png" 
            alt="Logo" 
            fill 
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* 2. Middle: Vertical Brand Name */}
      <div className="flex-1 flex items-center justify-center min-h-0 overflow-hidden w-full">
        <h1 
          className="text-primary font-black tracking-[0.2em] text-2xl select-none opacity-80 hover:opacity-100 transition-opacity whitespace-nowrap"
          style={{ 
            writingMode: 'vertical-rl', 
            textOrientation: 'mixed', 
            transform: 'rotate(180deg)' 
          }}
        >
          ASTRABIT
        </h1>
      </div>

      {/* 3. Bottom: User & Actions */}
      <div className="shrink-0 flex flex-col items-center gap-2 w-full">
        
        {/* User Profile */}
        <div 
          className="w-8 h-8 rounded-full bg-secondary overflow-hidden border border-border relative group cursor-help shrink-0"
          title={userEmail}
        >
          {userAvatar ? (
             <Image 
               src={userAvatar} 
               alt="Profile" 
               fill 
               sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
               className="object-cover" 
             />
          ) : (
             <div className="w-full h-full flex items-center justify-center font-bold text-primary text-xs">
               {userEmail?.[0]?.toUpperCase() || 'U'}
             </div>
          )}
        </div>

        {/* Theme Switcher */}
        <ThemeSwitcher />

        {/* Logout Button */}
        <button 
          onClick={handleSignOut}
          title="Sign Out"
          className="p-1 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <LogOut size={20} strokeWidth={2} />
        </button>

      </div>
    </aside>
  );
}