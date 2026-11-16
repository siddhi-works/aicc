import type { Metadata } from "next";
import { Nunito, Baloo_2 } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { ProfileProvider } from "@/lib/profile-context";

const inter = Nunito({ subsets: ["latin"], variable: "--font-nunito" });
const fraunces = Baloo_2({ subsets: ["latin"], variable: "--font-baloo" });

export const metadata: Metadata = {
  title: { default: "All India Chess Club — Play chess. Think deeper.", template: "%s · All India Chess Club" },
  description:
    "All India Chess Club is a modern chess platform: play, learn and compete. Local play is live; online multiplayer is a prototype.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="min-h-screen flex flex-col">
        <ProfileProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </ProfileProvider>
      </body>
    </html>
  );
}
