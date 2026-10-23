import { ArrowDown } from "lucide-react";

export default function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-14 sm:px-6 md:grid-cols-2 md:py-20 ">
      {/* Hero content */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-widest text-[#ccff00]">
          WORKOUT LIBRARY
        </p>

        <h1 className="font-display mt-4 max-w-md text-4xl font-bold uppercase leading-tight sm:text-5xl">
          TRAIN WITH INTENT. LOG EVERY SET.
        </h1>

        <p className="mt-4 max-w-md text-sm leading-6 text-neutral-400">
          FitLog is a dark, no-nonsense gym companion: pick a lift, lock it into
          today's plan, and watch the week's work add up.
        </p>

        <a
          href="#library"
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-[#ccff00] px-4 py-2.5 text-[11px] font-bold uppercase tracking-wide text-black transition hover:brightness-110"
        >
          BROWSE WORKOUTS
          <ArrowDown size={14} />
        </a>
      </div>

      {/* Hero image */}
      <div className="flex justify-center md:justify-end">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero.png"
          alt="Athlete training illustration"
          className="h-64 w-auto object-contain sm:h-80"
        />
      </div>
    </section>
  );
}
