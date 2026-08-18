import type { Metadata } from "next";
import { Anton, Inter, Oswald } from "next/font/google";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { ChromeGate } from "@/components/ChromeGate";
import { getSite } from "@/lib/content";
import "./globals.css";

const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton" });
const oswald = Oswald({ subsets: ["latin"], variable: "--font-oswald" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const site = getSite();

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Beyond Syllabus | Reimagining Education for the Next Generation",
    template: "%s | Beyond Syllabus",
  },
  description:
    "Beyond Syllabus is a six-month stakeholder initiative bringing students, educators, researchers, industry, policymakers and communities together to move from conversations about education to practical solutions and working prototypes.",
  openGraph: {
    siteName: "Beyond Syllabus",
    type: "website",
    locale: "en_IN",
    images: [
      // Landscape card first — WhatsApp and most platforms use the first
      // og:image and only render large previews for ~1.91:1 images.
      { url: "/og/share-card.jpg", width: 1200, height: 630, alt: "Bridge The Gap 4.0: Beyond Syllabus, a symposium for the future of education" },
      { url: "/poster/beyond-syllabus-2026.jpg", width: 1278, height: 1600, alt: "Bridge The Gap 4.0: the Beyond Syllabus poster" },
    ],
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${anton.variable} ${oswald.variable} ${inter.variable}`}>
      <body>
        <a
          href="#main"
          className="condensed sr-only z-[100] bg-purple px-4 py-3 text-white focus:not-sr-only focus:fixed focus:left-2 focus:top-2"
        >
          Skip to content
        </a>
        <ChromeGate>
          <Nav />
        </ChromeGate>
        <main id="main">{children}</main>
        <ChromeGate>
          <Footer />
        </ChromeGate>
      </body>
    </html>
  );
}
