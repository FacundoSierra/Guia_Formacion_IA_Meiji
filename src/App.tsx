/**
 * COMPONENTE RAÍZ DE LA APLICACIÓN
 * 
 * Define la estructura principal:
 * 1. QueryClientProvider → Gestión de datos asíncronos (React Query)
 * 2. UserProvider → Estado global del usuario (contexto)
 * 3. BrowserRouter + Routes → Navegación entre páginas
 * 4. TooltipProvider → Tooltips globales
 * 5. Toaster/Sonner → Notificaciones toast
 * 
 * RUTAS DISPONIBLES:
 * /              → Onboarding (login/registro)
 * /dashboard     → Panel principal del usuario
 * /module/:id    → Página de un módulo específico
 * /ranking       → Tabla de clasificación
 * /challenges    → Retos semanales
 * /completion    → Página de finalización
 * /admin         → Panel de administración
 */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UserProvider } from "@/context/UserContext";
import AdminRoute from "@/components/AdminRoute";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import ModulePage from "./pages/ModulePage";
import Ranking from "./pages/Ranking";
import Challenges from "./pages/Challenges";
import CompletionPage from "./pages/CompletionPage";
import AdminPanel from "./pages/AdminPanel";
import Logros from "./pages/Logros";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <BrowserRouter>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Onboarding />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/module/:id" element={<ModulePage />} />
            <Route path="/ranking" element={<Ranking />} />
            <Route path="/challenges" element={<Challenges />} />
            <Route path="/completion" element={<CompletionPage />} />
            <Route path="/logros" element={<Logros />} />
            <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </BrowserRouter>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
