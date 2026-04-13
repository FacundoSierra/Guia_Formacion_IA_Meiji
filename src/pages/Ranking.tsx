/**
 * PÁGINA DE RANKING — Tabla de clasificación
 * Ruta: /ranking
 * Datos desde Lovable Cloud con actualización en tiempo real.
 */
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useUser } from "@/context/UserContext";
import { DEPARTMENTS, getLevelName } from "@/types/challenge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trophy, Medal, Crown, Users, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Ranking() {
  const { user, allUsers, loading } = useUser();
  const navigate = useNavigate();

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

  const sorted = [...allUsers].sort((a, b) => b.points - a.points);
  const userRank = sorted.findIndex((u) => u.id === user.id) + 1;

  const deptRankings = DEPARTMENTS.map((dept) => {
    const users = allUsers.filter((u) => u.department === dept);
    const totalPoints = users.reduce((s, u) => s + u.points, 0);
    return { dept, totalPoints, count: users.length, avg: users.length ? Math.round(totalPoints / users.length) : 0 };
  }).sort((a, b) => b.totalPoints - a.totalPoints);

  const podiumColors = ["gradient-rank-gold", "gradient-rank-silver", "gradient-rank-bronze"];
  const podiumIcons = [Crown, Trophy, Medal];

  return (
    <div className="min-h-screen bg-background">
      <header className="gradient-hero py-4">
        <div className="container max-w-4xl mx-auto px-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-primary-foreground"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-display font-bold text-primary-foreground">Ranking</h1>
          <div className="ml-auto bg-white rounded-lg px-2 py-1 shadow-sm">
            <img src="/meiji-logo.svg" alt="Meiji" className="h-6 w-auto" />
          </div>
        </div>
      </header>

      <div className="container max-w-4xl mx-auto px-4 py-8 space-y-6">
        <Tabs defaultValue="global">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="global">Global</TabsTrigger>
            <TabsTrigger value="department">Mi Depto.</TabsTrigger>
            <TabsTrigger value="teams">Departamentos</TabsTrigger>
          </TabsList>

          <TabsContent value="global" className="space-y-4 mt-4">
            {sorted.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mb-4">
                {sorted.slice(0, 3).map((u, i) => {
                  const Icon = podiumIcons[i];
                  return (
                    <motion.div
                      key={u.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`bg-card rounded-xl p-5 text-center shadow-card ${u.id === user.id ? "ring-2 ring-primary" : ""}`}
                    >
                      <div
                        className={`w-12 h-12 rounded-full ${podiumColors[i]} flex items-center justify-center mx-auto mb-2`}
                      >
                        <Icon className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <p className="font-display font-bold text-card-foreground text-sm truncate">{u.name}</p>
                      <p className="text-xs text-muted-foreground">{u.department}</p>
                      <p className="text-lg font-bold text-gradient-primary mt-1">{u.points} pts</p>
                    </motion.div>
                  );
                })}
              </div>
            )}
            <div className="bg-card rounded-xl shadow-card overflow-hidden">
              {sorted.map((u, i) => (
                <div
                  key={u.id}
                  className={`flex items-center gap-4 px-5 py-3 border-b border-border last:border-0 ${u.id === user.id ? "bg-primary/5" : ""}`}
                >
                  <span className="w-8 text-center font-display font-bold text-muted-foreground">#{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-card-foreground truncate">
                      {u.name} {u.id === user.id && "(tú)"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {u.department} · {getLevelName(u.level)}
                    </p>
                  </div>
                  <span className="font-display font-bold text-card-foreground">{u.points}</span>
                </div>
              ))}
              {sorted.length === 0 && <p className="p-8 text-center text-muted-foreground">Aún no hay participantes</p>}
            </div>
            {userRank > 3 && (
              <div className="bg-primary/5 rounded-xl p-4 text-center">
                <p className="text-sm text-muted-foreground">
                  Tu posición: <span className="font-bold text-primary">#{userRank}</span> de {sorted.length}
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="department" className="space-y-4 mt-4">
            {(() => {
              const deptUsers = sorted.filter((u) => u.department === user.department);
              return (
                <>
                  <div className="bg-primary/5 rounded-xl p-4 text-center mb-4">
                    <Users className="w-6 h-6 text-primary mx-auto mb-1" />
                    <p className="font-display font-bold text-foreground">{user.department}</p>
                    <p className="text-sm text-muted-foreground">{deptUsers.length} participantes</p>
                  </div>
                  <div className="bg-card rounded-xl shadow-card overflow-hidden">
                    {deptUsers.map((u, i) => (
                      <div
                        key={u.id}
                        className={`flex items-center gap-4 px-5 py-3 border-b border-border last:border-0 ${u.id === user.id ? "bg-primary/5" : ""}`}
                      >
                        <span className="w-8 text-center font-display font-bold text-muted-foreground">#{i + 1}</span>
                        <div className="flex-1">
                          <p className="font-medium text-card-foreground">
                            {u.name} {u.id === user.id && "(tú)"}
                          </p>
                        </div>
                        <span className="font-display font-bold">{u.points}</span>
                      </div>
                    ))}
                  </div>
                </>
              );
            })()}
          </TabsContent>

          <TabsContent value="teams" className="space-y-4 mt-4">
            {deptRankings.map((d, i) => (
              <motion.div
                key={d.dept}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`bg-card rounded-xl p-5 shadow-card flex items-center gap-4 ${d.dept === user.department ? "ring-2 ring-primary" : ""}`}
              >
                <span className="w-8 text-center font-display font-bold text-2xl">
                  {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                </span>
                <div className="flex-1">
                  <p className="font-display font-bold text-card-foreground">
                    {d.dept} {d.dept === user.department && "(tu equipo)"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {d.count} miembros · Media: {d.avg} pts
                  </p>
                </div>
                <span className="font-display font-bold text-lg text-gradient-primary">{d.totalPoints} pts</span>
              </motion.div>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
