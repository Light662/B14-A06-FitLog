import type { Workout } from "@/types/workout";

const PRIMARY = "https://api.abcz.workers.dev/api/fitlog";
const FALLBACK = "https://api.api-store.workers.dev/api/fitlog";

async function request<T>(path = ""): Promise<T> {
  let lastError: unknown;
  for (const base of [PRIMARY, FALLBACK]) {
    try {
      const res = await fetch(base + path);
      if (!res.ok) throw new Error("Request failed: " + res.status);
      return (await res.json()) as T;
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError;
}

export async function getWorkouts(): Promise<Workout[]> {
  const data = await request<Workout[] | { data?: Workout[] }>();
  return Array.isArray(data) ? data : (data.data ?? []);
}

export async function getWorkout(id: string): Promise<Workout | null> {
  try {
    const raw = await request<Workout | { data?: Workout }>("/" + id);
    const item = "data" in raw && raw.data ? raw.data : (raw as Workout);
    if (item && item.id && item.name) return item;
  } catch {
    // fall through to the list lookup below
  }
  const all = await getWorkouts();
  return all.find((w) => String(w.id) === String(id)) ?? null;
}
