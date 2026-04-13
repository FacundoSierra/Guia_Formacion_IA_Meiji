/**
 * PANEL DE ADMINISTRACIÓN — Ruta: /admin
 * Solo accesible para emails de admin (ver src/lib/admin.ts).
 *
 * 4 pestañas:
 * 1. Resumen — KPIs y distribución de usuarios
 * 2. Usuarios — tabla con búsqueda, filtros y acciones CRUD
 * 3. Departamentos — métricas y progreso por departamento
 * 4. Módulos — tasa de completación por módulo
 */
import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useUser } from "@/context/UserContext";
import { DEPARTMENTS, getLevelName, type Department, type User } from "@/types/challenge";
import { modules, weeklyChallenges } from "@/data/modules";
import { createUser, updateUser, resetUserProgress, deleteUser } from "@/lib/adminActions";
import {
  getAllSubmissions, approveSubmission, rejectSubmission,
  isImageFile, type ChallengeSubmission,
} from "@/lib/challengeSubmissions";
import { weeklyChallenges as allChallenges } from "@/data/modules";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowLeft, Users, BarChart3, BookOpen, Target, Loader2,
  MoreHorizontal, Pencil, RotateCcw, Trash2, UserPlus, Download,
  TrendingUp, Award, CheckCircle2, XCircle, Clock, Eye, FileText,
} from "lucide-react";

// ─── Tipos locales ────────────────────────────────────────────────────────────

type UserFormData = {
  name: string;
  email: string;
  department: Department | "";
  points: number;
};

const EMPTY_FORM: UserFormData = { name: "", email: "", department: "", points: 0 };

// ─── CSV export ───────────────────────────────────────────────────────────────

function exportCSV(users: User[]) {
  const headers = ["Nombre", "Email", "Departamento", "Puntos", "Nivel", "Módulos completados", "Insignias", "Fecha registro"];
  const rows = users.map((u) => [
    u.name,
    u.email,
    u.department,
    u.points,
    getLevelName(u.level),
    u.completedModules.length,
    u.badges.join(" | "),
    new Date(u.createdAt).toLocaleDateString("es-ES"),
  ]);
  const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `usuarios-ia-challenge-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function AdminPanel() {
  const { allUsers, loading, refreshUsers } = useUser();
  const navigate = useNavigate();

  // Búsqueda y filtros
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState<Department | "all">("all");

  // Modales
  const [userFormOpen, setUserFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>(EMPTY_FORM);
  const [formSubmitting, setFormSubmitting] = useState(false);

  const [resetTarget, setResetTarget] = useState<User | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<User | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Retos
  const [submissions, setSubmissions] = useState<ChallengeSubmission[]>([]);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    setSubmissionsLoading(true);
    getAllSubmissions()
      .then(setSubmissions)
      .catch(() => toast.error("Error al cargar retos"))
      .finally(() => setSubmissionsLoading(false));
  }, []);

  const handleApprove = async (sub: ChallengeSubmission) => {
    setReviewingId(sub.id);
    try {
      await approveSubmission(sub.id);
      // Sumar puntos al usuario
      const challenge = allChallenges.find((c) => c.id === sub.challenge_id);
      if (challenge) {
        const { supabase } = await import("@/integrations/supabase/client");
        const profile = allUsers.find((u) => u.id === sub.profile_id);
        if (profile) {
          await supabase
            .from("profiles")
            .update({ points: profile.points + challenge.points })
            .eq("id", sub.profile_id);
          refreshUsers();
        }
      }
      setSubmissions((prev) =>
        prev.map((s) => s.id === sub.id ? { ...s, status: "approved", reviewed_at: new Date().toISOString() } : s)
      );
      toast.success("Reto aprobado y puntos sumados");
    } catch {
      toast.error("Error al aprobar el reto");
    } finally {
      setReviewingId(null);
    }
  };

  const handleReject = async (sub: ChallengeSubmission) => {
    setReviewingId(sub.id);
    try {
      await rejectSubmission(sub.id, "No cumple los requisitos del reto");
      setSubmissions((prev) =>
        prev.map((s) => s.id === sub.id ? { ...s, status: "rejected", reviewed_at: new Date().toISOString() } : s)
      );
      toast.success("Reto rechazado");
    } catch {
      toast.error("Error al rechazar el reto");
    } finally {
      setReviewingId(null);
    }
  };

  const pendingCount = submissions.filter((s) => s.status === "pending").length;

  // ── Datos calculados ────────────────────────────────────────────────────────

  const totalUsers = allUsers.length;
  const avgPoints = totalUsers
    ? Math.round(allUsers.reduce((s, u) => s + u.points, 0) / totalUsers)
    : 0;
  const completedAll = allUsers.filter((u) => u.completedModules.length === modules.length).length;
  const completionRate = totalUsers ? Math.round((completedAll / totalUsers) * 100) : 0;

  const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const newThisWeek = allUsers.filter((u) => new Date(u.createdAt).getTime() > oneWeekAgo).length;

  const levelDistribution = useMemo(() => {
    const counts = [1, 2, 3, 4, 5].map((lvl) => ({
      level: lvl,
      name: getLevelName(lvl),
      count: allUsers.filter((u) => u.level === lvl).length,
    }));
    return counts;
  }, [allUsers]);

  const deptStats = useMemo(() =>
    DEPARTMENTS.map((dept) => {
      const users = allUsers.filter((u) => u.department === dept);
      const totalPts = users.reduce((s, u) => s + u.points, 0);
      const avgModules = users.length
        ? users.reduce((s, u) => s + u.completedModules.length, 0) / users.length
        : 0;
      return {
        dept,
        count: users.length,
        totalPoints: totalPts,
        avgPoints: users.length ? Math.round(totalPts / users.length) : 0,
        completion: users.length
          ? Math.round((users.filter((u) => u.completedModules.length === modules.length).length / users.length) * 100)
          : 0,
        avgModules: Math.round(avgModules * 10) / 10,
      };
    }).sort((a, b) => b.totalPoints - a.totalPoints),
    [allUsers]
  );

  const moduleStats = useMemo(() =>
    modules.map((mod) => ({
      ...mod,
      completions: allUsers.filter((u) => u.completedModules.includes(mod.id)).length,
      rate: totalUsers ? Math.round((allUsers.filter((u) => u.completedModules.includes(mod.id)).length / totalUsers) * 100) : 0,
    })).sort((a, b) => b.completions - a.completions),
    [allUsers, totalUsers]
  );

  const filteredUsers = useMemo(() => {
    const q = search.toLowerCase();
    return [...allUsers]
      .sort((a, b) => b.points - a.points)
      .filter((u) =>
        (deptFilter === "all" || u.department === deptFilter) &&
        (q === "" || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
      );
  }, [allUsers, search, deptFilter]);

  const topDepts = useMemo(() =>
    [...deptStats].slice(0, 3),
    [deptStats]
  );
  const maxDeptPoints = topDepts[0]?.totalPoints || 1;

  // ── Handlers del formulario ─────────────────────────────────────────────────

  const openCreateForm = () => {
    setEditingUser(null);
    setFormData(EMPTY_FORM);
    setUserFormOpen(true);
  };

  const openEditForm = (u: User) => {
    setEditingUser(u);
    setFormData({ name: u.name, email: u.email, department: u.department, points: u.points });
    setUserFormOpen(true);
  };

  const handleFormSubmit = async () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.department) return;
    setFormSubmitting(true);
    try {
      if (editingUser) {
        await updateUser(editingUser.id, {
          name: formData.name.trim(),
          email: formData.email.trim(),
          department: formData.department as Department,
          points: Number(formData.points),
        });
        toast.success("Usuario actualizado");
      } else {
        await createUser(formData.name.trim(), formData.email.trim(), formData.department as Department);
        toast.success("Usuario creado");
      }
      await refreshUsers();
      setUserFormOpen(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      toast.error(msg.includes("unique") ? "Ese email ya está registrado" : "Error al guardar");
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleReset = async () => {
    if (!resetTarget) return;
    setActionLoading(true);
    try {
      await resetUserProgress(resetTarget.id);
      await refreshUsers();
      toast.success(`Progreso de ${resetTarget.name} reseteado`);
    } catch {
      toast.error("Error al resetear el progreso");
    } finally {
      setActionLoading(false);
      setResetTarget(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setActionLoading(true);
    try {
      await deleteUser(deleteTarget.id);
      await refreshUsers();
      toast.success(`${deleteTarget.name} eliminado`);
    } catch {
      toast.error("Error al eliminar el usuario");
    } finally {
      setActionLoading(false);
      setDeleteTarget(null);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="gradient-hero py-4">
        <div className="container max-w-7xl mx-auto px-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-primary-foreground" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-display font-bold text-primary-foreground">Panel de Administración</h1>
            <p className="text-xs text-primary-foreground/70">Gestión de la plataforma IA Challenge</p>
          </div>
          <div className="ml-auto bg-white rounded-lg px-2 py-1 shadow-sm">
            <img src="/meiji-logo.svg" alt="Meiji" className="h-6 w-auto" />
          </div>
        </div>
      </header>

      <div className="container max-w-7xl mx-auto px-4 py-8">
        <Tabs defaultValue="resumen">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="resumen" className="gap-2"><BarChart3 className="w-4 h-4" />Resumen</TabsTrigger>
            <TabsTrigger value="usuarios" className="gap-2"><Users className="w-4 h-4" />Usuarios</TabsTrigger>
            <TabsTrigger value="departamentos" className="gap-2"><TrendingUp className="w-4 h-4" />Departamentos</TabsTrigger>
            <TabsTrigger value="modulos" className="gap-2"><BookOpen className="w-4 h-4" />Módulos</TabsTrigger>
            <TabsTrigger value="retos" className="gap-2 relative">
              <Target className="w-4 h-4" />Retos
              {pendingCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                  {pendingCount}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* ── PESTAÑA 1: RESUMEN ─────────────────────────────────────────────── */}
          <TabsContent value="resumen" className="space-y-6">
            {/* KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { icon: Users, label: "Usuarios", value: totalUsers, color: "text-primary" },
                { icon: BarChart3, label: "Media puntos", value: avgPoints, color: "text-blue-500" },
                { icon: Award, label: "Completaron todo", value: completedAll, color: "text-emerald-500" },
                { icon: TrendingUp, label: "Tasa completación", value: `${completionRate}%`, color: "text-amber-500" },
                { icon: Target, label: "Retos activos", value: weeklyChallenges.length, color: "text-purple-500" },
                { icon: UserPlus, label: "Nuevos esta semana", value: newThisWeek, color: "text-rose-500" },
              ].map((s, i) => (
                <div key={i} className="bg-card rounded-xl p-4 shadow-card">
                  <s.icon className={`w-5 h-5 ${s.color} mb-2`} />
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="text-2xl font-display font-bold text-card-foreground">{s.value}</p>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Distribución por nivel */}
              <div className="bg-card rounded-xl p-6 shadow-card">
                <h3 className="font-display font-bold text-card-foreground mb-4">Distribución por nivel</h3>
                <div className="space-y-3">
                  {levelDistribution.map(({ level, name, count }) => (
                    <div key={level}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-card-foreground font-medium">{name}</span>
                        <span className="text-muted-foreground">{count} {count === 1 ? "usuario" : "usuarios"}</span>
                      </div>
                      <Progress value={totalUsers ? (count / totalUsers) * 100 : 0} className="h-2" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Top 3 departamentos */}
              <div className="bg-card rounded-xl p-6 shadow-card">
                <h3 className="font-display font-bold text-card-foreground mb-4">Top departamentos</h3>
                <div className="space-y-4">
                  {topDepts.map((d, i) => (
                    <div key={d.dept}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-card-foreground">
                          {i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"} {d.dept}
                        </span>
                        <span className="text-muted-foreground">{d.totalPoints} pts</span>
                      </div>
                      <Progress value={(d.totalPoints / maxDeptPoints) * 100} className="h-2" />
                    </div>
                  ))}
                  {topDepts.length === 0 && (
                    <p className="text-sm text-muted-foreground">Sin datos todavía</p>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* ── PESTAÑA 2: USUARIOS ────────────────────────────────────────────── */}
          <TabsContent value="usuarios" className="space-y-4">
            {/* Controles */}
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <div className="flex gap-3 flex-1 max-w-lg">
                <Input
                  placeholder="Buscar por nombre o email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1"
                />
                <Select value={deptFilter} onValueChange={(v) => setDeptFilter(v as Department | "all")}>
                  <SelectTrigger className="w-44">
                    <SelectValue placeholder="Departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los deptos.</SelectItem>
                    {DEPARTMENTS.map((d) => (
                      <SelectItem key={d} value={d}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => exportCSV(allUsers)} className="gap-2">
                  <Download className="w-4 h-4" /> Exportar CSV
                </Button>
                <Button size="sm" className="gradient-primary text-primary-foreground gap-2" onClick={openCreateForm}>
                  <UserPlus className="w-4 h-4" /> Añadir usuario
                </Button>
              </div>
            </div>

            {/* Tabla */}
            <div className="bg-card rounded-xl shadow-card overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-4 py-3 text-muted-foreground font-medium">Nombre</th>
                    <th className="text-left px-4 py-3 text-muted-foreground font-medium">Email</th>
                    <th className="text-left px-4 py-3 text-muted-foreground font-medium">Depto.</th>
                    <th className="text-right px-4 py-3 text-muted-foreground font-medium">Puntos</th>
                    <th className="text-right px-4 py-3 text-muted-foreground font-medium">Nivel</th>
                    <th className="text-right px-4 py-3 text-muted-foreground font-medium">Módulos</th>
                    <th className="text-right px-4 py-3 text-muted-foreground font-medium">Registro</th>
                    <th className="px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-medium text-card-foreground">{u.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                      <td className="px-4 py-3 text-muted-foreground">{u.department}</td>
                      <td className="px-4 py-3 text-right font-bold text-card-foreground">{u.points}</td>
                      <td className="px-4 py-3 text-right text-muted-foreground">{getLevelName(u.level)}</td>
                      <td className="px-4 py-3 text-right text-muted-foreground">{u.completedModules.length}/{modules.length}</td>
                      <td className="px-4 py-3 text-right text-muted-foreground">{new Date(u.createdAt).toLocaleDateString("es-ES")}</td>
                      <td className="px-4 py-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="w-8 h-8">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openEditForm(u)} className="gap-2">
                              <Pencil className="w-3.5 h-3.5" /> Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setResetTarget(u)} className="gap-2">
                              <RotateCcw className="w-3.5 h-3.5" /> Resetear progreso
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setDeleteTarget(u)}
                              className="gap-2 text-destructive focus:text-destructive"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-4 py-10 text-center text-muted-foreground">
                        {search || deptFilter !== "all" ? "No hay usuarios con ese filtro" : "No hay usuarios registrados"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground text-right">
              {filteredUsers.length} de {totalUsers} usuarios
            </p>
          </TabsContent>

          {/* ── PESTAÑA 3: DEPARTAMENTOS ───────────────────────────────────────── */}
          <TabsContent value="departamentos" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {deptStats.map((d, i) => (
                <div key={d.dept} className="bg-card rounded-xl p-5 shadow-card">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-display font-bold text-card-foreground">
                        {i < 3 ? ["🥇", "🥈", "🥉"][i] + " " : ""}{d.dept}
                      </h3>
                      <p className="text-sm text-muted-foreground">{d.count} {d.count === 1 ? "miembro" : "miembros"}</p>
                    </div>
                    <span className="text-xl font-display font-bold text-primary">{d.totalPoints}</span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Media de puntos</span><span className="font-medium text-card-foreground">{d.avgPoints} pts</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Módulos promedio</span><span className="font-medium text-card-foreground">{d.avgModules}/{modules.length}</span>
                    </div>
                    <div className="mt-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted-foreground">Completaron todo</span>
                        <span className="font-medium text-card-foreground">{d.completion}%</span>
                      </div>
                      <Progress value={d.completion} className="h-2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* ── PESTAÑA 4: MÓDULOS ─────────────────────────────────────────────── */}
          <TabsContent value="modulos" className="space-y-4">
            <div className="bg-card rounded-xl shadow-card overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-4 py-3 text-muted-foreground font-medium">Módulo</th>
                    <th className="text-right px-4 py-3 text-muted-foreground font-medium">Completaciones</th>
                    <th className="text-right px-4 py-3 text-muted-foreground font-medium">Puntos posibles</th>
                    <th className="px-4 py-3 text-muted-foreground font-medium w-48">Tasa</th>
                  </tr>
                </thead>
                <tbody>
                  {moduleStats.map((mod) => (
                    <tr key={mod.id} className="border-b border-border last:border-0">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{mod.icon}</span>
                          <div>
                            <p className="font-medium text-card-foreground">{mod.title}</p>
                            <p className="text-xs text-muted-foreground">{mod.questions.length} preguntas</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right font-bold text-card-foreground">
                        {mod.completions}/{totalUsers || "—"}
                      </td>
                      <td className="px-4 py-3 text-right text-muted-foreground">
                        {mod.completionPoints + mod.questions.length * 20} pts
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Progress value={mod.rate} className="flex-1 h-2" />
                          <span className="text-xs text-muted-foreground w-10 text-right">{mod.rate}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          {/* ── PESTAÑA 5: RETOS ───────────────────────────────────────────────── */}
          <TabsContent value="retos" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display font-semibold text-lg">Evidencias de retos</h3>
                <p className="text-sm text-muted-foreground">
                  {pendingCount} pendiente{pendingCount !== 1 ? "s" : ""} de revisión ·{" "}
                  {submissions.length} envíos en total
                </p>
              </div>
            </div>

            {submissionsLoading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
              </div>
            ) : submissions.length === 0 ? (
              <div className="bg-card rounded-xl p-12 text-center shadow-card">
                <Target className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-40" />
                <p className="text-muted-foreground">No hay envíos todavía.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {submissions.map((sub) => {
                  const challenge = allChallenges.find((c) => c.id === sub.challenge_id);
                  const user = allUsers.find((u) => u.id === sub.profile_id);
                  const isReviewing = reviewingId === sub.id;

                  return (
                    <div key={sub.id} className="bg-card rounded-xl shadow-card p-5 flex flex-col md:flex-row md:items-center gap-4">
                      {/* Miniatura o icono de documento */}
                      <a
                        href={sub.image_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => { if (isImageFile(sub.image_url)) { e.preventDefault(); setPreviewImage(sub.image_url); } }}
                        className="w-20 h-20 rounded-lg overflow-hidden border border-border shrink-0 hover:opacity-80 transition-opacity flex items-center justify-center bg-muted"
                        title="Ver archivo"
                      >
                        {isImageFile(sub.image_url) ? (
                          <img src={sub.image_url} alt="Evidencia" className="w-full h-full object-cover" />
                        ) : (
                          <div className="flex flex-col items-center gap-1 text-muted-foreground p-2">
                            <FileText className="w-8 h-8 text-primary/60" />
                            <span className="text-[10px] font-medium uppercase text-primary/60">
                              {sub.image_url.split('.').pop()?.toUpperCase() ?? 'DOC'}
                            </span>
                          </div>
                        )}
                      </a>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="font-display font-bold text-card-foreground truncate">
                            {challenge?.title ?? sub.challenge_id}
                          </span>
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full
                            ${sub.status === "pending"  ? "bg-amber-100 text-amber-700" : ""}
                            ${sub.status === "approved" ? "bg-emerald-100 text-emerald-700" : ""}
                            ${sub.status === "rejected" ? "bg-red-100 text-red-700" : ""}
                          `}>
                            {sub.status === "pending"  && "Pendiente"}
                            {sub.status === "approved" && "Aprobado"}
                            {sub.status === "rejected" && "Rechazado"}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium text-card-foreground">{user?.name ?? "Usuario"}</span>
                          {" · "}{user?.department}{" · "}
                          {new Date(sub.submitted_at).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                        {challenge && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Herramienta: {challenge.tool} · +{challenge.points} pts
                          </p>
                        )}
                      </div>

                      {/* Acciones */}
                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-1.5 text-xs"
                          onClick={() => setPreviewImage(sub.image_url)}
                        >
                          <Eye className="w-3.5 h-3.5" />
                          Ver
                        </Button>
                        {sub.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              className="gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                              onClick={() => handleApprove(sub)}
                              disabled={isReviewing}
                            >
                              {isReviewing
                                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                : <CheckCircle2 className="w-3.5 h-3.5" />
                              }
                              Aprobar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="gap-1.5 text-xs text-red-600 border-red-200 hover:bg-red-50"
                              onClick={() => handleReject(sub)}
                              disabled={isReviewing}
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              Rechazar
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* ── MODAL: PREVISUALIZACIÓN DE IMAGEN ─────────────────────────────────── */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <img
            src={previewImage}
            alt="Evidencia"
            className="max-w-full max-h-[90vh] rounded-xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white text-3xl font-light leading-none"
            onClick={() => setPreviewImage(null)}
          >
            ×
          </button>
        </div>
      )}

      {/* ── MODAL: CREAR / EDITAR USUARIO ──────────────────────────────────────── */}
      <Dialog open={userFormOpen} onOpenChange={setUserFormOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingUser ? "Editar usuario" : "Nuevo usuario"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium text-card-foreground mb-1.5 block">Nombre</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))}
                placeholder="Nombre completo"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-card-foreground mb-1.5 block">Email</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData((f) => ({ ...f, email: e.target.value }))}
                placeholder="email@empresa.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-card-foreground mb-1.5 block">Departamento</label>
              <Select
                value={formData.department}
                onValueChange={(v) => setFormData((f) => ({ ...f, department: v as Department }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona departamento" />
                </SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS.map((d) => (
                    <SelectItem key={d} value={d}>{d}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {editingUser && (
              <div>
                <label className="text-sm font-medium text-card-foreground mb-1.5 block">Puntos</label>
                <Input
                  type="number"
                  min={0}
                  value={formData.points}
                  onChange={(e) => setFormData((f) => ({ ...f, points: Number(e.target.value) }))}
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUserFormOpen(false)} disabled={formSubmitting}>
              Cancelar
            </Button>
            <Button
              className="gradient-primary text-primary-foreground"
              onClick={handleFormSubmit}
              disabled={formSubmitting || !formData.name || !formData.email || !formData.department}
            >
              {formSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {editingUser ? "Guardar cambios" : "Crear usuario"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── ALERT: RESETEAR PROGRESO ───────────────────────────────────────────── */}
      <AlertDialog open={!!resetTarget} onOpenChange={() => setResetTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Resetear progreso?</AlertDialogTitle>
            <AlertDialogDescription>
              Esto borrará todos los puntos, módulos completados, insignias y respuestas de quiz de{" "}
              <strong>{resetTarget?.name}</strong>. El usuario podrá volver a hacer los módulos desde cero.
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleReset} disabled={actionLoading} className="bg-amber-500 hover:bg-amber-600">
              {actionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Sí, resetear
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── ALERT: ELIMINAR USUARIO ────────────────────────────────────────────── */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar usuario?</AlertDialogTitle>
            <AlertDialogDescription>
              Esto eliminará permanentemente el perfil de <strong>{deleteTarget?.name}</strong> ({deleteTarget?.email}),
              incluyendo todos sus datos, puntos y respuestas. Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={actionLoading} className="bg-destructive hover:bg-destructive/90">
              {actionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Sí, eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
