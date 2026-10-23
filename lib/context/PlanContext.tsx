"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import Toast, { type ToastState, type ToastType } from "@/components/Toast";
import type { Workout } from "@/types/workout";

interface PlanItem {
  id: number;
  done: boolean;
}

interface PlanContextValue {
  plan: PlanItem[];
  saved: number[];
  ready: boolean;
  planFull: boolean;
  inPlan: (id: number) => boolean;
  isSaved: (id: number) => boolean;
  addToPlan: (workout: Workout) => void;
  saveForLater: (workout: Workout) => void;
  removeFromPlan: (id: number) => void;
  removeFromSaved: (id: number) => void;
  toggleDone: (id: number) => void;
}

const PlanContext = createContext<PlanContextValue | null>(null);

export const PLAN_LIMIT = 5;
const STORAGE_KEY = "fitlog-state-v1";

export function PlanProvider({ children }: { children: ReactNode }) {
  const [plan, setPlan] = useState<PlanItem[]>([]);
  const [saved, setSaved] = useState<number[]>([]);
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // load from localStorage once, after hydration
  useEffect(() => {
    const timeout = setTimeout(() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as {
            plan?: PlanItem[];
            saved?: number[];
          };
          if (Array.isArray(parsed.plan)) setPlan(parsed.plan);
          if (Array.isArray(parsed.saved)) setSaved(parsed.saved);
        }
      } catch {
        // ignore broken storage
      }
      setReady(true);
    }, 0);

    return () => clearTimeout(timeout);
  }, []);

  // save to localStorage on change
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ plan, saved }));
    } catch {
      // ignore storage errors
    }
  }, [plan, saved, ready]);

  const showToast = useCallback(
    (message: string, type: ToastType = "success") => {
      if (timer.current) clearTimeout(timer.current);
      setToast({ message, type, key: Date.now() });
      timer.current = setTimeout(() => setToast(null), 2600);
    },
    [],
  );

  const inPlan = (id: number) => plan.some((p) => p.id === id);
  const isSaved = (id: number) => saved.includes(id);
  const planFull = plan.length >= PLAN_LIMIT;

  const addToPlan = (workout: Workout) => {
    if (inPlan(workout.id)) {
      showToast(workout.name + " is already in today's plan", "info");
      return;
    }
    if (planFull) {
      showToast("Today's plan is full (5 lifts max)", "error");
      return;
    }
    setPlan([...plan, { id: workout.id, done: false }]);
    showToast("Added to today's plan");
  };

  const saveForLater = (workout: Workout) => {
    if (isSaved(workout.id)) {
      showToast(workout.name + " is already saved", "info");
      return;
    }
    setSaved([...saved, workout.id]);
    showToast("Saved for later");
  };

  const removeFromPlan = (id: number) => {
    setPlan(plan.filter((p) => p.id !== id));
    showToast("Removed from today's plan", "info");
  };

  const removeFromSaved = (id: number) => {
    setSaved(saved.filter((s) => s !== id));
    showToast("Removed from saved", "info");
  };

  const toggleDone = (id: number) => {
    const item = plan.find((p) => p.id === id);
    if (!item) return;
    setPlan(plan.map((p) => (p.id === id ? { ...p, done: !p.done } : p)));
    showToast(item.done ? "Marked as not done" : "Marked as done");
  };

  return (
    <PlanContext.Provider
      value={{
        plan,
        saved,
        ready,
        planFull,
        inPlan,
        isSaved,
        addToPlan,
        saveForLater,
        removeFromPlan,
        removeFromSaved,
        toggleDone,
      }}
    >
      {children}
      <Toast toast={toast} />
    </PlanContext.Provider>
  );
}

export function usePlan(): PlanContextValue {
  const ctx = useContext(PlanContext);
  if (!ctx) throw new Error("usePlan must be used inside PlanProvider");
  return ctx;
}
