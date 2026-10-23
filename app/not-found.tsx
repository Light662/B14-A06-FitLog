import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-28 text-center">
      <p className="font-display text-8xl font-bold text-[#ccff00]">404</p>
      <h1 className="font-display mt-2 text-4xl font-bold uppercase">
        PAGE NOT FOUND
      </h1>
      <p className="mt-3 text-neutral-400">
        {"The page you're looking for doesn't exist or has been moved."}
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-[#ccff00] px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-black"
      >
        Back to workouts
      </Link>
    </div>
  );
}
