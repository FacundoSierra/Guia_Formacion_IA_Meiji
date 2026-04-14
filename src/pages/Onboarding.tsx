/**
 * PÁGINA DE ONBOARDING — Login y Registro
 * Ruta: /
 *
 * Dos modos via tabs:
 * 1. "Iniciar sesión": Solo email → busca en DB
 * 2. "Registrarse": Nombre + email + departamento → crea perfil en DB
 */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useUser } from "@/context/UserContext";
import { isAdminEmail } from "@/lib/admin";
import { DEPARTMENTS, type Department } from "@/types/challenge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Zap, Trophy, Users, LogIn, UserPlus, Loader2 } from "lucide-react";

export default function Onboarding() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dept, setDept] = useState<Department | "">("");
  const [loginEmail, setLoginEmail] = useState("");
  const [loginError, setLoginError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { login, loginByEmail } = useUser();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !dept || submitting) return;
    setSubmitting(true);
    try {
      await login(name.trim(), email.trim(), dept);
      navigate(isAdminEmail(email.trim()) ? "/admin" : "/dashboard");
    } catch {
      toast.error("Error al crear la cuenta. Inténtalo de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim() || submitting) return;
    setSubmitting(true);
    setLoginError("");
    try {
      const found = await loginByEmail(loginEmail.trim());
      if (found) {
        navigate(isAdminEmail(loginEmail.trim()) ? "/admin" : "/dashboard");
      } else {
        setLoginError("No se encontró una cuenta con ese email. Regístrate primero.");
      }
    } catch {
      toast.error("Error al iniciar sesión. Inténtalo de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  const features = [
    { icon: Sparkles, text: "Aprende IA aplicada a tu trabajo" },
    { icon: Zap, text: "Gana puntos y sube de nivel" },
    { icon: Trophy, text: "Compite con tus compañeros" },
    { icon: Users, text: "Retos semanales por departamento" },
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <div className="space-y-3">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block px-4 py-1.5 rounded-full text-sm font-semibold gradient-primary text-primary-foreground"
            >
              Guia de Formación de IA
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-display font-bold leading-tight text-foreground">
              Mejora tu trabajo
              <br />
              <span className="text-primary">con IA</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Domina Gemini en tu día a día. Gana puntos. Compite con tu equipo.
            </p>
          </div>
          <div className="space-y-4">
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-4"
              >
                <div className="w-11 h-11 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground shrink-0">
                  <f.icon className="w-5 h-5" />
                </div>
                <span className="font-medium text-foreground">{f.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-card rounded-2xl p-8 shadow-elevated border-t-4 border-primary">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted">
                <TabsTrigger
                  value="login"
                  className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <LogIn className="w-4 h-4" /> Iniciar sesión
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  <UserPlus className="w-4 h-4" /> Registrarse
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-5">
                  <div className="text-center space-y-1 mb-2">
                    <h2 className="text-2xl font-display font-bold text-card-foreground">¡Bienvenido de nuevo!</h2>
                    <p className="text-muted-foreground text-sm">Introduce tu email para continuar</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-card-foreground mb-1.5 block">Email</label>
                    <Input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => {
                        setLoginEmail(e.target.value);
                        setLoginError("");
                      }}
                      placeholder="tu@empresa.com"
                      required
                    />
                  </div>
                  {loginError && <p className="text-sm text-destructive font-medium">{loginError}</p>}
                  <Button
                    type="submit"
                    className="w-full gradient-primary text-primary-foreground font-semibold text-lg h-12"
                    disabled={!loginEmail || submitting}
                  >
                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Iniciar sesión"}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-5">
                  <div className="text-center space-y-1 mb-2">
                    <h2 className="text-2xl font-display font-bold text-card-foreground">¡Únete a la formación!</h2>
                    <p className="text-muted-foreground text-sm">Completa tus datos para empezar</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-card-foreground mb-1.5 block">Nombre</label>
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Tu nombre completo"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-card-foreground mb-1.5 block">Email</label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@empresa.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-card-foreground mb-1.5 block">Departamento</label>
                    <Select value={dept} onValueChange={(v) => setDept(v as Department)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tu departamento" />
                      </SelectTrigger>
                      <SelectContent>
                        {DEPARTMENTS.map((d) => (
                          <SelectItem key={d} value={d}>
                            {d}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    type="submit"
                    className="w-full gradient-primary text-primary-foreground font-semibold text-lg h-12"
                    disabled={!name || !email || !dept || submitting}
                  >
                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Empezar experiencia IA"}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
