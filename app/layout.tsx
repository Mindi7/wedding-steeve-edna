import type { Metadata } from "next";
import { Cormorant_Garamond, Jost, Great_Vibes } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400"],
  variable: "--font-serif-loaded",
});
const jost = Jost({
  subsets: ["latin"],
  weight: ["200", "300", "400"],
  variable: "--font-sans-loaded",
});
const greatVibes = Great_Vibes({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-script-loaded",
});

export const metadata: Metadata = {
  title: "Steeve & Edna — 29 Août 2026",
  description: "Rejoignez-nous pour célébrer notre mariage en Guyane française",
  openGraph: {
    title: "Steeve & Edna se marient ! 💍",
    description: "29 Août 2026 · Macouria, Guyane française",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${cormorant.variable} ${jost.variable} ${greatVibes.variable}`}>
      <body>{children}</body>
    </html>
  );
}
