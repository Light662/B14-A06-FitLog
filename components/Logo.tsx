import { Dumbbell } from "lucide-react";

export default function Logo() {
  return (
    <span className="inline-flex items-center gap-2">
      <Dumbbell size={18} strokeWidth={2.5} className="text-[#ccff00]" />
      <span className="font-display text-sm font-bold tracking-wider">
        FITLOG
      </span>
    </span>
  );
}
