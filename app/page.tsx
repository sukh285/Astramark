import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CTAButton } from "@/components/cta-button";
import Image from "next/image";
import { Github, FileText } from "lucide-react";

async function AuthRedirect() {
  if (!hasEnvVars) return null;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect("/dashboard");
  return null;
}

export default function Home() {
  return (
    <>
      <Suspense fallback={null}>
        <AuthRedirect />
      </Suspense>

      <main className="min-h-screen flex flex-col bg-background">
        {/* Navigation */}
        <nav className="w-full border-b">
          <div className="max-w-5xl mx-auto flex justify-between items-center px-5 py-4">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <Image 
                src="/logo.png"       
                alt="Astramark Logo"
                width={32}            
                height={32}
                className="rounded-sm" 
              />
              <h1 className="text-xl font-semibold tracking-tight">
                Astramark
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <ThemeSwitcher />
              {hasEnvVars && (
                <Suspense fallback={<div className="w-20 h-10 animate-pulse bg-muted rounded-md" />}>
                  <AuthButton />
                </Suspense>
              )}
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="flex-1 flex items-center justify-center px-5 py-20">
          <div className="max-w-3xl text-center space-y-8">
            <div className="space-y-6">
              <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground">
                Your Bookmarks, <br />
                <span className="text-primary">
                  Organized.
                </span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
                Save, organize, and access your favorite links from anywhere.
                Real-time sync across all your devices.
              </p>
            </div>

            {hasEnvVars && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
                {/* Auth-aware Button */}
                <Suspense fallback={<div className="inline-flex w-48 h-14 bg-primary/20 rounded-lg animate-pulse" />}>
                  <CTAButton />
                </Suspense>

                {/* Social/Resume Links */}
                <div className="flex items-center gap-3">
                  <a 
                    href="https://github.com/sukh285/astramark" 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-3 rounded-lg bg-secondary text-muted-foreground hover:bg-foreground hover:text-background transition-colors"
                    title="GitHub"
                  >
                    <Github size={20} />
                  </a>
                  <a 
                    href="https://drive.google.com/file/d/1MJtLiCy1b6tFqeB_7L9ahOJaWLdQ1zy5/view?usp=drive_link" 
                    target="_blank" 
                    rel="noreferrer"
                    className="p-3 rounded-lg bg-secondary text-muted-foreground hover:bg-blue-600 hover:text-white transition-colors"
                    title="Resume"
                  >
                    <FileText size={20} />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t py-8 mt-auto">
          <div className="max-w-5xl mx-auto px-5 text-center">
            <p className="text-sm text-muted-foreground">
              Built with Next.js and Supabase, with love by Sukh
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}