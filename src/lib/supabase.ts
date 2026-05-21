type SupabaseClient = {
  from: (table: string) => any;
  storage: {
    from: (bucket: string) => {
      upload: (
        path: string,
        body: Blob,
        options?: { upsert?: boolean },
      ) => Promise<{ data: any; error: any }>;
    };
  };
};

import { createClient } from "@supabase/supabase-js";
import type { Task } from "../types";

const SUPABASE_URL = (import.meta as any).env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(SUPABASE_URL as string, SUPABASE_ANON_KEY as string)
  : null;

export async function fetchTasks(): Promise<Task[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("createdAt", { ascending: false });
  if (error) throw error;
  return (data || []) as Task[];
}

export async function upsertTask(task: Task) {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("tasks")
    .upsert(task, { onConflict: "id" });
  if (error) throw error;
  return data;
}

export async function deleteTaskById(id: string) {
  if (!supabase) return null;
  const { error } = await supabase.from("tasks").delete().eq("id", id);
  if (error) throw error;
  return true;
}

export async function backupTasks(tasks: Task[]) {
  if (!supabase) return null;
  try {
    const payload = JSON.stringify(tasks, null, 2);
    const fileName = `tasks_backups/tasks_${new Date().toISOString()}.json`;
    const blob = new Blob([payload], { type: "application/json" });
    const { data, error } = await supabase.storage
      .from("backups")
      .upload(fileName, blob, { upsert: true });
    if (error) throw error;
    return data;
  } catch (err) {
    throw err;
  }
}
