/**
 * Hook que escucha cambios en challenge_submissions via Supabase Realtime.
 * Cuando un envío del usuario pasa a "approved" o "rejected", muestra un toast.
 */
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { weeklyChallenges } from "@/data/modules";
import type { User } from "@/context/UserContext";

export function useSubmissionNotifications(user: User | null, onApproved?: (challengeId: string, points: number) => void) {
  const knownStatuses = useRef<Record<string, string>>({});

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`submissions-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "challenge_submissions",
          filter: `profile_id=eq.${user.id}`,
        },
        (payload) => {
          const row = payload.new as {
            id: string;
            challenge_id: string;
            status: string;
            admin_comment: string | null;
          };

          const prev = knownStatuses.current[row.id];
          // Solo notificar si el estado cambió (evitar notificaciones duplicadas)
          if (prev === row.status) return;
          knownStatuses.current[row.id] = row.status;

          const challenge = weeklyChallenges.find((c) => c.id === row.challenge_id);
          const title = challenge?.title ?? "Reto";

          if (row.status === "approved") {
            const points = challenge?.points ?? 0;
            toast.success(`¡Reto aprobado! +${points} pts`, {
              description: `"${title}" ha sido aprobado por el administrador.`,
              duration: 6000,
            });
            onApproved?.(row.challenge_id, points);
          } else if (row.status === "rejected") {
            toast.error("Reto rechazado", {
              description: row.admin_comment
                ? `"${title}": ${row.admin_comment}`
                : `"${title}" no ha sido aprobado. Puedes volver a intentarlo.`,
              duration: 8000,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);
}
