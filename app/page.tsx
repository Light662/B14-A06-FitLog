"use client";

import { useEffect, useState } from "react";
import Hero from "@/components/Hero";
import WorkoutCard from "@/components/WorkoutCard";
import { getWorkouts } from "@/lib/api";
import type { Workout } from "@/types/workout";

export default function HomePage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getWorkouts()
      .then(setWorkouts)
      .catch(() => setError("Could not load workouts. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Hero />

      <section
        id="library"
        className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-20 sm:px-6"
      >
        <h2 className="font-display text-2xl font-bold uppercase tracking-wide">
          THE LIBRARY
        </h2>
        <p className="mb-6 mt-1 text-xs text-neutral-400">
          Twelve lifts covering every major muscle group.
        </p>

        {loading && (
          <div className="flex flex-col items-center justify-center gap-4 py-24">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/10 border-t-[#ccff00]" />
            <p className="text-sm text-neutral-400">Loading workouts…</p>
          </div>
        )}

        {!loading && error && (
          <p className="py-16 text-center text-red-400">{error}</p>
        )}

        {!loading && !error && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {workouts.map((w) => (
              <WorkoutCard key={w.id} workout={w} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
