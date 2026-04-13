/**
 * PÁGINA DASHBOARD — Panel principal del usuario
 * Ruta: /dashboard
 *
 * Datos cargados desde Lovable Cloud (base de datos).
 * Si no hay usuario logueado, redirige a / (onboarding).
 */
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useUser } from "@/context/UserContext";
import { modules } from "@/data/modules";
import { getLevelName } from "@/types/challenge";
import { Trophy, Star, BookOpen, Target, LogOut, BarChart3, Flame, Loader2, Award, ScrollText, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useSubmissionNotifications } from "@/hooks/useSubmissionNotifications";
import { useTheme } from "@/hooks/useTheme";

export default function Dashboard() {
  const { user, allUsers, loading, logout, addPoints } = useUser();
  const navigate = useNavigate();

  // Notificaciones en tiempo real: aprobaciones/rechazos de retos
  useSubmissionNotifications(user, (_challengeId, points) => {
    addPoints(points);
  });

  const { theme, toggle: toggleTheme } = useTheme();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    navigate("/");
    return null;
  }

  const completedCount = user.completedModules.length;
  const totalModules = modules.length;
  const progress = (completedCount / totalModules) * 100;
  const rank = allUsers.filter((u) => u.points > user.points).length + 1;
  const deptUsers = allUsers.filter((u) => u.department === user.department);
  const deptRank = deptUsers.filter((u) => u.points > user.points).length + 1;

  const stats = [
    { icon: Star, label: "Puntos", value: user.points, color: "gradient-accent" },
    { icon: Trophy, label: "Ranking Global", value: `#${rank}`, color: "gradient-primary" },
    { icon: BarChart3, label: "Ranking Depto.", value: `#${deptRank}`, color: "gradient-success" },
    { icon: Flame, label: "Nivel", value: getLevelName(user.level), color: "gradient-rank-gold" },
  ];

  const initial = user.name.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-background">
      <header className="gradient-hero pb-16 pt-6">
        <div className="container max-w-6xl mx-auto px-4">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="bg-white rounded-lg px-2 py-1 shadow-sm">
              <img src="/meiji-logo.svg" alt="Meiji Pharma Spain" className="h-7 w-auto" />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
                onClick={toggleTheme}
                title={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
              >
                {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
                onClick={() => navigate("/ranking")}
              >
                <Trophy className="w-4 h-4 mr-1" /> Ranking
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
                onClick={() => navigate("/challenges")}
              >
                <Target className="w-4 h-4 mr-1" /> Retos
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
                onClick={() => navigate("/logros")}
              >
                <Award className="w-4 h-4 mr-1" /> Logros
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
          {/* Greeting */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xl font-display font-bold shadow-glow shrink-0">
              {initial}
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold text-primary-foreground">Hola, {user.name}</h2>
              <p className="text-primary-foreground/60 text-sm">
                {getLevelName(user.level)} · {user.department}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container max-w-6xl mx-auto px-4 -mt-8 pb-12 space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-xl p-5 shadow-card"
            >
              <div className={`w-10 h-10 rounded-lg ${s.color} flex items-center justify-center mb-3`}>
                <s.icon className="w-5 h-5 text-primary-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">{s.label}</p>
              <p className="text-2xl font-display font-bold text-card-foreground">{s.value}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card rounded-xl p-6 shadow-card"
        >
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-display font-semibold text-lg text-card-foreground">Tu progreso</h2>
            <span className="text-sm text-muted-foreground">
              {completedCount}/{totalModules} módulos
            </span>
          </div>
          <Progress value={progress} className="h-3" />
          {progress === 100 && (
            <p className="text-sm text-primary font-medium mt-2">¡Has completado toda la formación!</p>
          )}
        </motion.div>

        <div>
          <h2 className="font-display font-semibold text-xl text-foreground mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" /> Módulos de formación
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map((mod, i) => {
              const completed = user.completedModules.includes(mod.id);
              return (
                <motion.div
                  key={mod.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.05 }}
                  className={`bg-card rounded-xl p-5 shadow-card cursor-pointer transition-all hover:shadow-elevated hover:-translate-y-1 ${completed ? "ring-2 ring-primary/30" : ""}`}
                  onClick={() => navigate(`/module/${mod.id}`)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl">{mod.icon}</span>
                    {completed && (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium gradient-success text-primary-foreground">
                        ✓ Completado
                      </span>
                    )}
                  </div>
                  <h3 className="font-display font-semibold text-card-foreground mb-1">{mod.title}</h3>
                  <p className="text-sm text-muted-foreground">{mod.description}</p>
                  <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                    <Star className="w-3 h-3 text-accent" /> +{mod.completionPoints} puntos · {mod.questions.length}{" "}
                    preguntas
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-card rounded-xl p-5 shadow-card flex items-center justify-between cursor-pointer hover:shadow-elevated hover:-translate-y-0.5 transition-all"
          onClick={() => navigate("/logros")}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shrink-0">
              <Award className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-display font-semibold text-card-foreground">Insignias y Diplomas</h3>
              <p className="text-sm text-muted-foreground">
                {user.badges.length} {user.badges.length === 1 ? "insignia" : "insignias"} · {user.completedModules.length} {user.completedModules.length === 1 ? "diploma" : "diplomas"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ScrollText className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Ver todos →</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
