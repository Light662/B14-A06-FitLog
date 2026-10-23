"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import { usePlan } from "@/lib/context/PlanContext";

export default function Navbar() {
  const pathname = usePathname();
  const { plan, saved } = usePlan();

  const onWorkout = pathname === "/" || pathname.startsWith("/workout");
  const onPlan = pathname.startsWith("/my-plan");

  const linkClass = (active: boolean) =>
    "rounded-full px-3 py-1 text-xs font-semibold transition " +
    (active
      ? "bg-[#ccff00]/15 text-[#ccff00]"
      : "text-neutral-400 hover:text-white");

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0b0d10]/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 sm:px-6">
        {/* Left: logo */}
        <Link href="/" aria-label="FitLog home">
          <Logo />
        </Link>

        {/* Middle: links */}
        <nav className="order-3 flex w-full justify-center gap-1 sm:order-none sm:w-auto">
          <Link href="/" className={linkClass(onWorkout)}>
            Workouts
          </Link>
          <Link href="/my-plan" className={linkClass(onPlan)}>
            My Plan
          </Link>
        </nav>

        {/* Right: badges */}
        <div className="flex items-center gap-4 text-xs text-neutral-300">
          <Link href="/my-plan" className="inline-flex items-center gap-2">
            Plan
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#ccff00] px-1.5 text-[11px] font-bold text-black">
              {plan.length}
            </span>
          </Link>
          <Link href="/my-plan" className="inline-flex items-center gap-2">
            Saved
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full border border-white/30 px-1.5 text-[11px] font-bold text-white">
              {saved.length}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
