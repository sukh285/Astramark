import { AuthButton } from "@/components/auth-button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";
import { Suspense } from "react";
import { EnvVarWarning } from "@/components/env-var-warning";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CTAButton } from "@/components/cta-button";
import Image from "next/image";

async function AuthRedirect() {
  if (!hasEnvVars) return null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/dashboard");
  }

  return null;
}

export default function Home() {
  return (
    <>
      <Suspense fallback={null}>
        <AuthRedirect />
      </Suspense>

      <main className="min-h-screen flex flex-col">
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
                <Suspense
                  fallback={
                    <div className="w-20 h-10 animate-pulse bg-muted rounded-md" />
                  }
                >
                  <AuthButton />
                </Suspense>
              )}
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="flex-1 flex items-center justify-center px-5 py-20">
          <div className="max-w-3xl text-center space-y-8">
            {!hasEnvVars && (
              <div className="mb-8">
                <EnvVarWarning />
              </div>
            )}

            <div className="space-y-6">
              <h2 className="text-5xl md:text-7xl font-bold tracking-tight">
                Your Bookmarks,
                <span className="block bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                  Organized.
                </span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
                Save, organize, and access your favorite links from anywhere.
                Real-time sync across all your devices.
              </p>
            </div>

            {hasEnvVars && (
              <div className="pt-6">
                <Suspense
                  fallback={
                    <div className="inline-flex w-48 h-14 bg-primary/20 rounded-lg animate-pulse" />
                  }
                >
                  <CTAButton />
                </Suspense>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t py-8 mt-auto">
          <div className="max-w-5xl mx-auto px-5 text-center">
            <p className="text-sm text-muted-foreground">
              Built with Next.js and Supabase
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}