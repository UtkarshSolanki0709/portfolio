import type { Metadata } from "next";
import { Barlow_Condensed, Rajdhani, Share_Tech_Mono, Bebas_Neue } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"

const barlowCondensed = Barlow_Condensed({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const shareTechMono = Share_Tech_Mono({
  variable: "--font-share-tech",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://portfolio-livid-three-99.vercel.app/"),
  title: "Utkarsh Solanki | Full Stack Software Engineer",
  description:
    "The official portfolio of Utkarsh Solanki, a Full Stack Developer specializing in React, Next.js, and Node.js. Experience my interactive, wrestling-game-themed engineering showcase.",
  keywords: [
    "Utkarsh Solanki",
    "Utkarsh Solanki Portfolio",
    "Utkarsh Solanki Developer",
    "Full Stack Developer",
    "Software Engineer",
    "React Developer",
    "Next.js",
    "Node.js",
  ],
  authors: [{ name: "Utkarsh Solanki", url: "https://portfolio-livid-three-99.vercel.app/" }],
  creator: "Utkarsh Solanki",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Utkarsh Solanki | Full Stack Engineer",
    description: "Welcome to the Main Event. The interactive developer portfolio of Utkarsh Solanki.",
    url: "https://portfolio-livid-three-99.vercel.app/",
    siteName: "Utkarsh Solanki Portfolio",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Utkarsh Solanki | Full Stack Engineer",
    description: "Interactive developer portfolio of Utkarsh Solanki. Step into the ring.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Utkarsh Solanki",
  url: "https://portfolio-livid-three-99.vercel.app/",
  jobTitle: "Full Stack Software Engineer",
  knowsAbout: ["Web Development", "React", "Next.js", "Node.js", "TypeScript", "MERN Stack"],
  sameAs: [
    // Provide your social links here if available (e.g. LinkedIn, GitHub)
    // "https://github.com/yourusername",
    // "https://linkedin.com/in/yourusername"
  ]
};

import { ThemeProvider } from "@/components/theme-provider";
import { ToastProvider } from "@/components/ui/Toast";
import CommandMenu from "@/components/ui/CommandMenu";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${barlowCondensed.variable} ${rajdhani.variable} ${shareTechMono.variable} ${bebasNeue.variable} dark`}
        style={{
          fontFamily: "var(--font-rajdhani, 'Rajdhani', sans-serif)",
        }}
        suppressHydrationWarning
      >
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <ThemeProvider>
          <ToastProvider>
            {children}
            <CommandMenu />
            <Toaster theme="dark" position="bottom-right" richColors />
          </ToastProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
