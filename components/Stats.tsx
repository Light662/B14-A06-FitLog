import { Clock, Flame, Star } from "lucide-react";
import type { Workout } from "@/types/workout";

interface StatsProps {
  workout: Workout;
  className?: string;
}

export default function Stats({ workout, className = "" }: StatsProps) {
  return (
    <div
      className={
        "flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-neutral-400 " +
        className
      }
    >
      <span className="inline-flex items-center gap-1.5">
        <Clock size={13} />
        {workout.duration} min
      </span>
      <span className="inline-flex items-center gap-1.5">
        <Flame size={13} />
        {workout.caloriesBurned} kcal
      </span>
      <span className="inline-flex items-center gap-1.5">
        <Star size={13} />
        {workout.rating}
      </span>
    </div>
  );
}
