import type { Metadata } from "next";
import "./globals.css";

// Plain <link> tags rather than next/font/google: Turbopack's font pipeline
// (@vercel/turbopack-next/internal/font/google/font) fails to resolve in this
// environment even though fonts.googleapis.com is reachable directly — same
// approach the Stitch mockups used, and it avoids the build-time dependency.

export const metadata: Metadata = {
  title: "UT Opportunity Navigator",
  description: "Government funding intelligence analyst for Utah startups — GOED AI Builder Day 2026",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="h-full flex flex-col bg-background text-on-background font-body-md">{children}</body>
    </html>
  );
}
