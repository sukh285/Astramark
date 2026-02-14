import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { getSiteUrl } from "@/lib/config";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  // Title
  title: {
    default: "AstraMark",
    template: "%s | AstraMark", 
  },
  // Description
  description: "Bookmark all your favorite links in one place. Sync across devices in real-time.",
  // Icons
  icons: {
    icon: "/icon.png", 
  },
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}