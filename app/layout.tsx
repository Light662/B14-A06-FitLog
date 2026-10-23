import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PlanProvider } from "@/lib/context/PlanContext";

const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
  weight: ["400", "500", "600", "700"],
});
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "FitLog — Workout Library",
  description:
    "A dark, no-nonsense gym companion: pick a lift, lock it into today's plan, and log every set.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={oswald.variable + " " + inter.variable}>
      <body className="flex min-h-screen flex-col">
        <PlanProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </PlanProvider>
      </body>
    </html>
  );
}
