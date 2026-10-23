"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Check, ChevronDown, X } from "lucide-react";
import Stats from "@/components/Stats";
import { getWorkouts } from "@/lib/api";
import { usePlan } from "@/lib/context/PlanContext";
import type { Workout } from "@/types/workout";

type SortKey = "duration" | "calories" | "rating";
type Tab = "plan" | "saved";
type ListItem = Workout & { done?: boolean };

const SORT_FIELDS: Record<SortKey, "duration" | "caloriesBurned" | "rating"> = {
  duration: "duration",
  calories: "caloriesBurned",
  rating: "rating",
};

export default function MyPlanPage() {
  const { plan, saved, ready, removeFromPlan, removeFromSaved, toggleDone } =
    usePlan();

  const [tab, setTab] = useState<Tab>("plan");
  const [sortBy, setSortBy] = useState<SortKey>("duration");
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getWorkouts()
      .then(setWorkouts)
      .catch(() => setError("Could not load workouts. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  const byId = useMemo(
    () =>
      Object.fromEntries(workouts.map((w) => [w.id, w])) as Record<
        number,
        Workout
      >,
    [workouts],
  );

  const planItems: ListItem[] = plan
    .filter((p: { id: number }) => byId[p.id])
    .map((p: { id: number; done?: boolean }) => ({ ...byId[p.id], done: p.done }));
  const savedItems: ListItem[] = saved
    .filter((id: number) => byId[id])
    .map((id: number) => byId[id]);

  const totals = planItems.reduce(
    (acc, w) => ({
      exercises: acc.exercises + 1,
      minutes: acc.minutes + w.duration,
      calories: acc.calories + w.caloriesBurned,
    }),
    { exercises: 0, minutes: 0, calories: 0 },
  );

  const field = SORT_FIELDS[sortBy];
  const list: ListItem[] = [...(tab === "plan" ? planItems : savedItems)].sort(
    (a, b) => a[field] - b[field], // low to high, like the design
  );
  const isLoading = loading || !ready;

  const metrics = [
    { label: "Exercises", value: totals.exercises, accent: true },
    { label: "Minutes", value: totals.minutes, accent: false },
    { label: "Calories", value: totals.calories, accent: false },
  ];

  const tabClass = (active: boolean) =>
    "rounded-md px-4 py-1.5 text-xs transition " +
    (active
      ? "bg-[#1d2127] font-semibold text-white"
      : "text-neutral-400 hover:text-white");

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
      <h1 className="font-display text-3xl font-bold uppercase tracking-wide">
        MY PLAN
      </h1>
      <p className="mt-1 text-xs text-neutral-400">
        Cap of five lifts for today. Finish them, then load more.
      </p>

      {/* Metrics */}
      <div className="mt-6 grid grid-cols-3 gap-4 rounded-xl border border-white/10 bg-[#111418] p-4 sm:p-5">
        {metrics.map((m) => (
          <div key={m.label}>
            <p className="text-[11px] text-neutral-400">{m.label}</p>
            <p
              className={
                "font-display mt-1 text-2xl font-bold sm:text-3xl " +
                (m.accent ? "text-[#ccff00]" : "text-white")
              }
            >
              {m.value}
            </p>
          </div>
        ))}
      </div>

      {/* Tabs + sort */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-lg border border-white/10 bg-[#0e1115] p-1">
          <button
            onClick={() => setTab("plan")}
            className={tabClass(tab === "plan")}
          >
            {"Today's Plan"}
          </button>
          <button
            onClick={() => setTab("saved")}
            className={tabClass(tab === "saved")}
          >
            Saved
          </button>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-neutral-400">
          <label htmlFor="sort">Sort By</label>
          <div className="relative">
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortKey)}
              className="appearance-none rounded-md border border-white/15 bg-[#111418] py-1.5 pl-3 pr-8 text-xs text-white outline-none focus:border-[#ccff00]"
            >
              <option value="duration">Duration</option>
              <option value="calories">Calories</option>
              <option value="rating">Rating</option>
            </select>
            <ChevronDown
              size={14}
              className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2"
            />
          </div>
        </div>
      </div>

      {/* List */}
      <div className="mt-4 space-y-3">
        {isLoading && (
          <div className="flex flex-col items-center gap-4 py-20">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/10 border-t-[#ccff00]" />
            <p className="text-sm text-neutral-400">Loading workouts…</p>
          </div>
        )}

        {!isLoading && error && (
          <p className="py-12 text-center text-red-400">{error}</p>
        )}

        {!isLoading && !error && list.length === 0 && (
          <div className="rounded-xl border border-dashed border-white/15 bg-[#0e1115] px-6 py-16 text-center">
            <h2 className="font-display text-sm font-bold uppercase tracking-wide">
              NOTHING HERE YET
            </h2>
            <p className="mt-1 text-[11px] text-neutral-400">
              Browse the library and add a lift to get today moving.
            </p>
            <Link
              href="/"
              className="mt-4 inline-block rounded-full bg-[#ccff00] px-4 py-1.5 text-[11px] font-bold text-black"
            >
              Go to workouts
            </Link>
          </div>
        )}

        {!isLoading &&
          !error &&
          list.map((w) => (
            <div
              key={w.id}
              className="flex flex-col gap-3 rounded-xl border border-white/10 bg-[#111418] p-3 sm:flex-row sm:items-center"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={w.image}
                alt={w.name}
                className="h-28 w-full shrink-0 rounded-lg object-cover sm:h-14 sm:w-24"
              />

              <div className="min-w-0 flex-1">
                <h3
                  className={
                    "font-display text-sm font-bold uppercase tracking-wide " +
                    (tab === "plan" && w.done ? "line-through opacity-60" : "")
                  }
                >
                  {w.name}
                </h3>
                <p className="text-[11px] text-neutral-500">{w.equipment}</p>
                <Stats workout={w} className="mt-1" />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={"/workout/" + w.id}
                  className="rounded-full border border-white/25 px-4 py-1.5 text-[11px] font-semibold transition hover:border-[#ccff00] hover:text-[#ccff00]"
                >
                  View Details
                </Link>

                {tab === "plan" && (
                  <button
                    onClick={() => toggleDone(w.id)}
                    className={
                      "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[11px] font-bold transition " +
                      (w.done
                        ? "border border-[#ccff00] bg-transparent text-[#ccff00]"
                        : "bg-[#ccff00] text-black hover:brightness-110")
                    }
                  >
                    <Check size={13} />
                    {w.done ? "Done" : "Mark as Done"}
                  </button>
                )}

                <button
                  onClick={() =>
                    tab === "plan"
                      ? removeFromPlan(w.id)
                      : removeFromSaved(w.id)
                  }
                  aria-label={"Remove " + w.name}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-neutral-500 transition hover:text-red-400"
                >
                  <X size={15} />
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
