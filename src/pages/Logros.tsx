/**
 * PÁGINA DE LOGROS — Ruta: /logros
 *
 * Dos secciones:
 * 1. Insignias — todas las insignias, ganadas y bloqueadas
 * 2. Diplomas  — un diploma visual por cada módulo completado
 */
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@/context/UserContext";
import { BADGES } from "@/types/challenge";
import { modules } from "@/data/modules";
import { downloadCertificate, downloadFinalCertificate } from "@/lib/certificate";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, Loader2, Crosshair, GraduationCap, Zap, Gem,
  Trophy, Flame, Lock, Award, ScrollText, Download, Star, Sparkles,
} from "lucide-react";

// ─── Mapa de iconos para insignias ───────────────────────────────────────────

const BADGE_ICONS: Record<string, React.ElementType> = {
  "first-module": Crosshair,
  "all-modules": GraduationCap,
  "speed-demon": Zap,
  "perfect-score": Gem,
  "top-10": Trophy,
  "challenger": Flame,
};

const BADGE_COLORS: Record<string, string> = {
  "first-module": "text-blue-500 bg-blue-500/10",
  "all-modules": "text-purple-500 bg-purple-500/10",
  "speed-demon": "text-yellow-500 bg-yellow-500/10",
  "perfect-score": "text-emerald-500 bg-emerald-500/10",
  "top-10": "text-amber-500 bg-amber-500/10",
  "challenger": "text-rose-500 bg-rose-500/10",
};

// ─── Componente principal ─────────────────────────────────────────────────────

export default function Logros() {
  const { user, loading } = useUser();
  const navigate = useNavigate();
  const [celebration, setCelebration] = useState(false);
  const celebrationShown = useRef(false);

  const allCompleted = !loading && !!user && user.completedModules.length === modules.length;

  useEffect(() => {
    if (allCompleted && !celebrationShown.current) {
      celebrationShown.current = true;
      setCelebration(true);
      const t = setTimeout(() => setCelebration(false), 4500);
      return () => clearTimeout(t);
    }
  }, [allCompleted]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) { navigate("/"); return null; }

  const earnedBadges = new Set(user.badges);

  // Para cada módulo completado, busca la fecha en quizAttempts
  const getCompletionDate = (moduleId: string): string => {
    const attempt = user.quizAttempts?.find((a) => a.moduleId === moduleId);
    if (attempt?.completedAt) {
      return new Date(attempt.completedAt).toLocaleDateString("es-ES", {
        day: "numeric", month: "long", year: "numeric",
      });
    }
    return "Fecha no disponible";
  };

  const completedModules = modules.filter((m) => user.completedModules.includes(m.id));
  const pendingModules = modules.filter((m) => !user.completedModules.includes(m.id));

  // Fecha del diploma final = la del último módulo completado
  const finalDiplomaDate = (): string => {
    const dates = user.quizAttempts
      ?.map((a) => new Date(a.completedAt).getTime())
      .filter(Boolean) ?? [];
    if (!dates.length) return "Fecha no disponible";
    return new Date(Math.max(...dates)).toLocaleDateString("es-ES", {
      day: "numeric", month: "long", year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="gradient-hero py-4">
        <div className="container max-w-4xl mx-auto px-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-primary-foreground" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-display font-bold text-primary-foreground">🏅 Insignias y Diplomas</h1>
          <div className="ml-auto bg-white rounded-lg px-2 py-1 shadow-sm">
            <img src="/meiji-logo.svg" alt="Meiji" className="h-6 w-auto" />
          </div>
        </div>
      </header>

      {/* ── BANNER DE CELEBRACIÓN ────────────────────────────────────────────── */}
      <AnimatePresence>
        {celebration && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-4"
          >
            <div className="bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-white rounded-2xl px-6 py-4 shadow-2xl flex items-center gap-4">
              <motion.div
                animate={{ rotate: [0, -15, 15, -10, 10, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Trophy className="w-10 h-10 shrink-0" />
              </motion.div>
              <div>
                <p className="font-display font-bold text-lg leading-tight">¡Formación completada!</p>
                <p className="text-sm text-white/90">Has completado los {modules.length} módulos. Tu diploma final está listo.</p>
              </div>
              <Sparkles className="w-6 h-6 shrink-0 opacity-70" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container max-w-4xl mx-auto px-4 py-8 space-y-12">

        {/* ── SECCIÓN 1: INSIGNIAS ──────────────────────────────────────────── */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <Award className="w-6 h-6 text-primary" />
            <div>
              <h2 className="font-display font-bold text-xl text-foreground">Insignias</h2>
              <p className="text-sm text-muted-foreground">
                {earnedBadges.size} de {BADGES.length} conseguidas
              </p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {BADGES.map((badge, i) => {
              const earned = earnedBadges.has(badge.id);
              const Icon = BADGE_ICONS[badge.id] ?? Trophy;
              const colorClass = BADGE_COLORS[badge.id] ?? "text-primary bg-primary/10";

              return (
                <motion.div
                  key={badge.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className={`relative bg-card rounded-xl p-5 shadow-card border-2 transition-all
                    ${earned ? "border-primary/30" : "border-transparent opacity-50"}`}
                >
                  {!earned && (
                    <div className="absolute top-3 right-3">
                      <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                  )}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${earned ? colorClass : "bg-muted text-muted-foreground"}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-display font-bold text-card-foreground">{badge.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
                  {earned && (
                    <span className="inline-block mt-2 text-xs font-semibold text-primary">✓ Conseguida</span>
                  )}
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ── SECCIÓN 2: DIPLOMAS ───────────────────────────────────────────── */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <ScrollText className="w-6 h-6 text-primary" />
            <div>
              <h2 className="font-display font-bold text-xl text-foreground">Diplomas</h2>
              <p className="text-sm text-muted-foreground">
                {completedModules.length} de {modules.length} diplomas obtenidos
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* ── DIPLOMA FINAL ──────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className={`relative rounded-xl overflow-hidden border-2 shadow-elevated transition-all
                ${allCompleted
                  ? "border-yellow-400 bg-gradient-to-br from-yellow-50 via-white to-amber-50"
                  : "border-transparent bg-card opacity-60"
                }`}
            >
              {/* Franja superior */}
              <div className={`h-2 ${allCompleted
                ? "bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-500"
                : "bg-gradient-to-r from-muted to-muted"
              }`} />

              <div className="p-6">
                <div className="flex items-start gap-5">
                  {/* Icono */}
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-md
                    ${allCompleted
                      ? "bg-gradient-to-br from-yellow-400 to-amber-500"
                      : "bg-muted"
                    }`}
                  >
                    {allCompleted
                      ? <Trophy className="w-8 h-8 text-white" />
                      : <Lock className="w-7 h-7 text-muted-foreground" />
                    }
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className={`text-xs font-bold uppercase tracking-wider
                        ${allCompleted ? "text-amber-600" : "text-muted-foreground"}`}>
                        Diploma Final · Programa Completo
                      </p>
                      {allCompleted && (
                        <span className="flex gap-0.5">
                          {[...Array(3)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          ))}
                        </span>
                      )}
                    </div>
                    <h3 className="font-display font-bold text-xl text-card-foreground leading-tight">
                      Guía de Formación en Inteligencia Artificial
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {allCompleted
                        ? `Otorgado a ${user.name} · ${finalDiplomaDate()}`
                        : `${completedModules.length} de ${modules.length} módulos completados — completa todos para desbloquear`
                      }
                    </p>
                  </div>

                  {/* Progreso o puntos */}
                  {allCompleted ? (
                    <div className="text-right shrink-0">
                      <p className="text-2xl font-display font-bold text-amber-500">6/6</p>
                      <p className="text-xs text-muted-foreground">módulos</p>
                    </div>
                  ) : (
                    <div className="text-right shrink-0">
                      <p className="text-2xl font-display font-bold text-muted-foreground">
                        {completedModules.length}/{modules.length}
                      </p>
                      <p className="text-xs text-muted-foreground">módulos</p>
                    </div>
                  )}
                </div>

                {/* Barra de progreso o botón descarga */}
                {allCompleted ? (
                  <div className="mt-4 pt-4 border-t border-yellow-200 flex items-center justify-between">
                    <span className="text-sm font-semibold text-amber-700">
                      ✓ Formación completa — Meiji Pharma Spain, S.A.
                    </span>
                    <Button
                      size="sm"
                      className="gap-2 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white border-0 shadow-md"
                      onClick={() => downloadFinalCertificate({
                        userName: user.name.toUpperCase(),
                        completionDate: finalDiplomaDate(),
                        totalModules: modules.length,
                      })}
                    >
                      <Download className="w-3.5 h-3.5" />
                      Descargar PDF
                    </Button>
                  </div>
                ) : (
                  <div className="mt-4">
                    <div className="w-full bg-muted rounded-full h-1.5">
                      <div
                        className="bg-gradient-to-r from-yellow-400 to-amber-400 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${(completedModules.length / modules.length) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Diplomas obtenidos */}
            {completedModules.map((mod, i) => (
              <motion.div
                key={mod.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-card rounded-xl shadow-card overflow-hidden border-2 border-primary/20"
              >
                {/* Franja superior dorada */}
                <div className="h-1.5 bg-gradient-to-r from-yellow-400 via-amber-300 to-yellow-400" />

                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center text-2xl shrink-0 shadow-glow">
                        {mod.icon}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-0.5">
                          Diploma de completación
                        </p>
                        <h3 className="font-display font-bold text-lg text-card-foreground leading-tight">
                          {mod.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-0.5">{mod.description}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-2xl font-display font-bold text-primary">+{mod.completionPoints}</p>
                      <p className="text-xs text-muted-foreground">puntos</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Otorgado a <span className="font-semibold text-card-foreground">{user.name}</span>
                      <span className="mx-2 text-border">·</span>
                      {getCompletionDate(mod.id)}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-2 shrink-0"
                      onClick={() => downloadCertificate({
                        userName: user.name.toUpperCase(),
                        moduleName: mod.title,
                        completionDate: getCompletionDate(mod.id),
                      })}
                    >
                      <Download className="w-3.5 h-3.5" />
                      Descargar PDF
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Módulos pendientes (bloqueados) */}
            {pendingModules.map((mod) => (
              <div
                key={mod.id}
                className="bg-card rounded-xl shadow-card overflow-hidden border-2 border-transparent opacity-40"
              >
                <div className="h-1.5 bg-muted" />
                <div className="p-6 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center text-2xl shrink-0 grayscale">
                    {mod.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">
                      Diploma de completación
                    </p>
                    <h3 className="font-display font-bold text-card-foreground">{mod.title}</h3>
                  </div>
                  <Lock className="w-5 h-5 text-muted-foreground shrink-0" />
                </div>
              </div>
            ))}

            {completedModules.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                Completa tu primer módulo para obtener tu primer diploma.
              </p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
