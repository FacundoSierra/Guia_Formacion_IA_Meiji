/**
 * GUARD DE RUTA ADMIN
 * Protege /admin: solo accesible por emails autorizados y usuarios logueados.
 * Cambia ADMIN_EMAILS para añadir o quitar acceso de administrador.
 */
import { Navigate } from "react-router-dom";
import { Loader2, ShieldX } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { isAdminEmail } from "@/lib/admin";

interface AdminRouteProps {
  children: React.ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (!isAdminEmail(user.email)) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 text-center p-6">
        <ShieldX className="w-14 h-14 text-destructive" />
        <h1 className="text-2xl font-display font-bold text-foreground">Acceso restringido</h1>
        <p className="text-muted-foreground max-w-sm">
          No tienes permisos para acceder al panel de administración.
          Contacta con el responsable del proyecto si crees que es un error.
        </p>
      </div>
    );
  }

  return <>{children}</>;
}
