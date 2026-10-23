"use client";

import { AlertCircle, Check, Info } from "lucide-react";

export type ToastType = "success" | "info" | "error";

export interface ToastState {
  message: string;
  type: ToastType;
  key: number;
}

export default function Toast({ toast }: { toast: ToastState | null }) {
  if (!toast) return null;

  const styles: Record<ToastType, string> = {
    success: "border-[#ccff00] text-[#ccff00]",
    info: "border-white/30 text-white",
    error: "border-red-500 text-red-400",
  };
  const Icon =
    toast.type === "error" ? AlertCircle : toast.type === "info" ? Info : Check;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
      <div
        key={toast.key}
        role="status"
        className={
          "toast-in flex items-center gap-2 rounded-full border bg-[#141414] px-5 py-3 text-sm font-semibold shadow-lg " +
          styles[toast.type]
        }
      >
        <Icon size={18} />
        <span className="text-white">{toast.message}</span>
      </div>
    </div>
  );
}
