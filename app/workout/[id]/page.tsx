"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Bookmark, CalendarPlus } from "lucide-react";
import { getWorkout } from "@/lib/api";
import { usePlan } from "@/lib/context/PlanContext";
import type { Workout } from "@/types/workout";

type Status = "loading" | "ready" | "missing" | "error";

export default function WorkoutDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const { addToPlan, saveForLater, inPlan, planFull } = usePlan();

  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (!cancelled) setStatus("loading");
    });
    getWorkout(id)
      .then((w) => {
        if (cancelled) return;
        if (w) {
          setWorkout(w);
          setStatus("ready");
        } else {
          setStatus("missing");
        }
      })
      .catch(() => {
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-32">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/10 border-t-[#ccff00]" />
        <p className="text-sm text-neutral-400">Loading workout…</p>
      </div>
    );
  }

  if (status !== "ready" || !workout) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-bold uppercase">
          {status === "missing" ? "WORKOUT NOT FOUND" : "SOMETHING WENT WRONG"}
        </h1>
        <Link
          href="/"
          className="mt-6 inline-block rounded-md bg-[#ccff00] px-5 py-2.5 text-sm font-bold text-black"
        >
          Go to workouts
        </Link>
      </div>
    );
  }

  const specs: [string, string | number][] = [
    ["Equipment", workout.equipment],
    ["Difficulty", workout.difficulty],
    ["Sets", workout.sets],
    ["Reps", workout.reps],
    ["Duration", workout.duration + " min"],
    ["Calories", workout.caloriesBurned + " kcal"],
    ["Rating", workout.rating],
  ];

  const addDisabled = !inPlan(workout.id) && planFull;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="grid gap-8 md:grid-cols-2">
        {/* Left: media */}
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={workout.image}
            alt={workout.name}
            className="aspect-[4/5] w-full rounded-2xl border border-white/10 object-cover"
          />
        </div>

        {/* Right: details */}
        <div>
          <h1 className="font-display text-3xl font-bold uppercase tracking-wide">
            {workout.name}
          </h1>
          <p className="mt-2 text-sm text-neutral-400">{workout.description}</p>

          <div className="mt-3 flex flex-wrap gap-2">
            {workout.muscleGroups.map((m) => (
              <span
                key={m}
                className="rounded-full bg-[#ccff00] px-3 py-0.5 text-xs font-semibold text-black"
              >
                {m}
              </span>
            ))}
          </div>

          {/* Key specs */}
          <dl className="mt-5 divide-y divide-white/10 overflow-hidden rounded-xl border border-white/10 bg-[#111418]">
            {specs.map(([label, value]) => (
              <div
                key={label}
                className="flex items-center justify-between px-4 py-3"
              >
                <dt className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                  {label}
                </dt>
                <dd className="text-xs">{value}</dd>
              </div>
            ))}
          </dl>

          {/* Instructions */}
          <h2 className="font-display mt-6 text-sm font-bold uppercase tracking-wide">
            INSTRUCTIONS
          </h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-xs text-neutral-300 marker:text-neutral-400">
            {workout.instructions.map((step, i) => (
              <li key={i} className="pl-1">
                {step}
              </li>
            ))}
          </ol>

          {/* Buttons */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => addToPlan(workout)}
              disabled={addDisabled}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#ccff00] px-5 py-2.5 text-xs font-bold text-black transition hover:brightness-110 disabled:opacity-40"
            >
              <CalendarPlus size={15} />
              {"Add to today's plan"}
            </button>
            <button
              onClick={() => saveForLater(workout)}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-[#111418] px-5 py-2.5 text-xs font-semibold transition hover:border-[#ccff00] hover:text-[#ccff00]"
            >
              <Bookmark size={15} />
              Save for later
            </button>
          </div>
          {addDisabled && (
            <p className="mt-3 text-xs text-red-400">
              {"Today's plan already has 5 lifts. Remove one to add this."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
