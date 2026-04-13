/**
 * Operaciones de Supabase para envíos de retos con imagen.
 * Tabla: challenge_submissions
 * Storage bucket: challenge-images
 */
import { supabase } from "@/integrations/supabase/client";

export type SubmissionStatus = "pending" | "approved" | "rejected";

export interface ChallengeSubmission {
  id: string;
  profile_id: string;
  challenge_id: string;
  image_url: string;
  status: SubmissionStatus;
  admin_comment: string | null;
  submitted_at: string;
  reviewed_at: string | null;
  // Join con profiles (opcional)
  profiles?: { name: string; email: string; department: string } | null;
}

export const ACCEPTED_TYPES = [
  "image/png", "image/jpeg", "image/webp", "image/gif",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "text/plain",
];

export const ACCEPTED_EXTENSIONS = ".png,.jpg,.jpeg,.webp,.gif,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt";

export function isImageFile(file: File | string): boolean {
  if (typeof file === "string") {
    return /\.(png|jpe?g|webp|gif)$/i.test(file);
  }
  return file.type.startsWith("image/");
}

/** Sube un archivo (imagen o documento) al bucket y devuelve la URL pública */
export async function uploadChallengeFile(
  file: File,
  profileId: string,
  challengeId: string
): Promise<string> {
  const ext = file.name.split(".").pop() ?? "bin";
  const path = `${profileId}/${challengeId}-${Date.now()}.${ext}`;

  const { error } = await supabase.storage
    .from("challenge-images")
    .upload(path, file, { upsert: true, contentType: file.type });

  if (error) throw new Error(`Error al subir archivo: ${error.message}`);

  const { data } = supabase.storage.from("challenge-images").getPublicUrl(path);
  return data.publicUrl;
}

/** Crea o actualiza un envío de reto */
export async function submitChallenge(
  profileId: string,
  challengeId: string,
  imageUrl: string
): Promise<void> {
  const { error } = await supabase
    .from("challenge_submissions" as never)
    .upsert({
      profile_id: profileId,
      challenge_id: challengeId,
      image_url: imageUrl,
      status: "pending",
      admin_comment: null,
      reviewed_at: null,
      submitted_at: new Date().toISOString(),
    } as never, { onConflict: "profile_id,challenge_id" });

  if (error) throw new Error(`Error al enviar reto: ${error.message}`);
}

/** Obtiene todos los envíos del usuario */
export async function getUserSubmissions(
  profileId: string
): Promise<ChallengeSubmission[]> {
  const { data, error } = await supabase
    .from("challenge_submissions" as never)
    .select("*")
    .eq("profile_id", profileId)
    .order("submitted_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as ChallengeSubmission[];
}

/** Obtiene todos los envíos pendientes (para admin) */
export async function getAllSubmissions(): Promise<ChallengeSubmission[]> {
  const { data, error } = await supabase
    .from("challenge_submissions" as never)
    .select("*, profiles(name, email, department)")
    .order("submitted_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as ChallengeSubmission[];
}

/** Admin aprueba un envío */
export async function approveSubmission(
  submissionId: string,
  comment?: string
): Promise<void> {
  const { error } = await supabase
    .from("challenge_submissions" as never)
    .update({
      status: "approved",
      admin_comment: comment ?? null,
      reviewed_at: new Date().toISOString(),
    } as never)
    .eq("id", submissionId);

  if (error) throw new Error(error.message);
}

/** Admin rechaza un envío */
export async function rejectSubmission(
  submissionId: string,
  comment?: string
): Promise<void> {
  const { error } = await supabase
    .from("challenge_submissions" as never)
    .update({
      status: "rejected",
      admin_comment: comment ?? null,
      reviewed_at: new Date().toISOString(),
    } as never)
    .eq("id", submissionId);

  if (error) throw new Error(error.message);
}
