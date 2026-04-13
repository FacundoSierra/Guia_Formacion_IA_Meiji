/**
 * Operaciones administrativas directas sobre Supabase.
 * Estas funciones operan sobre cualquier usuario (no solo el actual),
 * por lo que están separadas del UserContext.
 */
import { supabase } from "@/integrations/supabase/client";
import { getLevelFromPoints } from "@/types/challenge";
import type { Department } from "@/types/challenge";

/** Crea un usuario nuevo desde el panel de admin */
export async function createUser(
  name: string,
  email: string,
  department: Department
): Promise<void> {
  const { error } = await supabase.from("profiles").insert({
    name,
    email: email.toLowerCase(),
    department,
    points: 0,
    level: 1,
    completed_modules: [],
    badges: [],
  });
  if (error) throw error;
}

/** Edita los datos de un usuario existente */
export async function updateUser(
  userId: string,
  data: { name: string; email: string; department: Department; points: number }
): Promise<void> {
  const { error } = await supabase
    .from("profiles")
    .update({
      name: data.name,
      email: data.email.toLowerCase(),
      department: data.department,
      points: data.points,
      level: getLevelFromPoints(data.points),
    })
    .eq("id", userId);
  if (error) throw error;
}

/** Resetea el progreso de un usuario: puntos, nivel, módulos, badges y quiz_attempts */
export async function resetUserProgress(userId: string): Promise<void> {
  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      points: 0,
      level: 1,
      completed_modules: [],
      badges: [],
    })
    .eq("id", userId);
  if (profileError) throw profileError;

  const { error: attemptsError } = await supabase
    .from("quiz_attempts")
    .delete()
    .eq("profile_id", userId);
  if (attemptsError) throw attemptsError;
}

/** Elimina un usuario completo (quiz_attempts se borran por CASCADE) */
export async function deleteUser(userId: string): Promise<void> {
  const { error } = await supabase
    .from("profiles")
    .delete()
    .eq("id", userId);
  if (error) throw error;
}
