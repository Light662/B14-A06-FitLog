import Link from "next/link";
import Stats from "./Stats";
import type { Workout } from "@/types/workout";

export default function WorkoutCard({ workout }: { workout: Workout }) {
  return (
    <Link
      href={"/workout/" + workout.id}
      className="group block overflow-hidden rounded-xl border border-white/10 bg-[#111418] transition hover:-translate-y-1 hover:border-[#ccff00]/50"
    >
      <div className="aspect-[16/9] overflow-hidden bg-neutral-900">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={workout.image}
          alt={workout.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <div className="flex flex-wrap gap-1.5">
          {workout.muscleGroups.map((m) => (
            <span
              key={m}
              className="rounded-full bg-[#ccff00] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-black"
            >
              {m}
            </span>
          ))}
        </div>
        <h3 className="font-display mt-3 text-base font-bold uppercase tracking-wide">
          {workout.name}
        </h3>
        <p className="mt-1 text-[11px] text-neutral-500">{workout.equipment}</p>
        <Stats
          workout={workout}
          className="mt-4 border-t border-white/10 pt-3"
        />
      </div>
    </Link>
  );
}
