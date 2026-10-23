import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#07080a]">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-center sm:px-6 md:flex-row md:text-left">
        <Logo />
        <p className="text-xs text-neutral-500">
          © 2026 FitLog — Workout Library. Train hard, log honest.
        </p>
      </div>
    </footer>
  );
}
