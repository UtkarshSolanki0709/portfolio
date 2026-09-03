import type { Metadata } from "next";
import { Barlow_Condensed, Rajdhani, Share_Tech_Mono, Bebas_Neue, Press_Start_2P } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/theme-provider";
import { ToastProvider } from "@/components/ui/Toast";
import CommandMenu from "@/components/ui/CommandMenu";
import { Toaster } from "sonner";

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

const pressStart = Press_Start_2P({
  variable: "--font-press-start",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.utkrsh.in"),
  title: {
    default: "Utkarsh Solanki | Full Stack Software Engineer (utkrsh.in)",
    template: "%s | Utkarsh Solanki",
  },
  description:
    "Official portfolio of Utkarsh Solanki (utkrsh) — Full Stack Software Engineer specializing in React, Next.js, TypeScript, Node.js, and AI systems. Step into the arena to explore interactive projects and engineering showcases.",
  applicationName: "Utkarsh Solanki Portfolio",
  keywords: [
    "Utkarsh Solanki",
    "utkrsh",
    "utkrsh.in",
    "Utkarsh",
    "Utkarsh Solanki Portfolio",
    "Utkarsh Solanki Developer",
    "Utkarsh Solanki Software Engineer",
    "UtkarshSolanki0709",
    "Utkarsh Solanki GitHub",
    "Utkarsh Solanki Projects",
    "Full Stack Developer",
    "Software Engineer India",
    "React Developer",
    "Next.js Developer",
    "TypeScript",
    "Node.js",
    "AI Engineer",
    "Web Developer Portfolio",
  ],
  authors: [{ name: "Utkarsh Solanki", url: "https://www.utkrsh.in" }],
  creator: "Utkarsh Solanki",
  publisher: "Utkarsh Solanki",
  alternates: {
    canonical: "https://www.utkrsh.in",
    languages: {
      "en-US": "https://www.utkrsh.in",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.utkrsh.in",
    title: "Utkarsh Solanki | Full Stack Software Engineer (utkrsh.in)",
    description:
      "Welcome to the Main Event. The interactive developer portfolio of Utkarsh Solanki (utkrsh) — Full Stack Engineer.",
    siteName: "Utkarsh Solanki | utkrsh.in",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Utkarsh Solanki | Full Stack Software Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Utkarsh Solanki | Full Stack Software Engineer (utkrsh.in)",
    description:
      "Interactive developer portfolio of Utkarsh Solanki (utkrsh). Step into the ring to explore projects and skills.",
    images: ["/opengraph-image"],
    creator: "Utkarsh Solanki",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: ["/icon.svg"],
  },
  category: "technology",
  classification: "Portfolio",
};

const jsonLdGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://www.utkrsh.in/#person",
      name: "Utkarsh Solanki",
      alternateName: [
        "utkrsh",
        "Utkarsh",
        "utkrsh.in",
        "UtkarshSolanki0709",
        "Utkarsh Solanki Developer",
      ],
      givenName: "Utkarsh",
      familyName: "Solanki",
      gender: "Male",
      url: "https://www.utkrsh.in",
      image: "https://www.utkrsh.in/opengraph-image",
      jobTitle: "Full Stack Software Engineer",
      description:
        "Utkarsh Solanki (utkrsh) is a Full Stack Software Engineer specializing in modern web applications, Next.js, React, Node.js, TypeScript, and AI systems.",
      knowsAbout: [
        "Full Stack Development",
        "React",
        "Next.js",
        "Node.js",
        "TypeScript",
        "JavaScript",
        "Tailwind CSS",
        "Three.js",
        "Software Engineering",
        "AI Research & Integration",
        "Web Development",
        "React Native",
        "Supabase",
      ],
      sameAs: [
        "https://github.com/UtkarshSolanki0709",
        "https://www.linkedin.com/in/utkarsh-solanki-424b55291/",
        "https://www.utkrsh.in",
        "https://utkrsh.in",
      ],
    },
    {
      "@type": "WebSite",
      "@id": "https://www.utkrsh.in/#website",
      url: "https://www.utkrsh.in",
      name: "Utkarsh Solanki | Portfolio (utkrsh.in)",
      alternateName: [
        "utkrsh.in",
        "utkrsh",
        "Utkarsh Solanki Portfolio",
        "Utkarsh Portfolio",
      ],
      publisher: {
        "@id": "https://www.utkrsh.in/#person",
      },
      inLanguage: "en-US",
      description:
        "The official portfolio website of Utkarsh Solanki (utkrsh), Full Stack Software Engineer.",
    },
    {
      "@type": "ProfilePage",
      "@id": "https://www.utkrsh.in/#profilepage",
      url: "https://www.utkrsh.in",
      name: "Utkarsh Solanki - Full Stack Engineer Portfolio",
      isPartOf: {
        "@id": "https://www.utkrsh.in/#website",
      },
      about: {
        "@id": "https://www.utkrsh.in/#person",
      },
      mainEntity: {
        "@id": "https://www.utkrsh.in/#person",
      },
      inLanguage: "en-US",
    },
  ],
};

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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
        />
      </head>
      <body
        className={`${barlowCondensed.variable} ${rajdhani.variable} ${shareTechMono.variable} ${bebasNeue.variable} ${pressStart.variable} dark`}
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
