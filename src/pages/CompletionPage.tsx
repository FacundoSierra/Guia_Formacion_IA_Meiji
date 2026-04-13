/**
 * PÁGINA DE FINALIZACIÓN — Resumen de logros
 * Ruta: /completion
 */
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUser } from '@/context/UserContext';
import { getLevelName } from '@/types/challenge';
import { modules } from '@/data/modules';
import { Button } from '@/components/ui/button';
import { Trophy, Target, Loader2, GraduationCap, Rocket } from 'lucide-react';

export default function CompletionPage() {
  const { user, allUsers, loading } = useUser();
  const navigate = useNavigate();

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  if (!user) { navigate('/'); return null; }

  const rank = allUsers.filter(u => u.points > user.points).length + 1;
  const allDone = user.completedModules.length === modules.length;

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-card rounded-2xl p-10 max-w-lg w-full text-center shadow-elevated">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5, delay: 0.2 }} className="flex justify-center mb-4">
          {allDone ? <GraduationCap className="w-16 h-16 text-primary" /> : <Rocket className="w-16 h-16 text-primary" />}
        </motion.div>
        <h1 className="text-3xl font-display font-bold text-card-foreground mb-2">
          {allDone ? '¡Formación completada!' : '¡Sigue así!'}
        </h1>
        <p className="text-muted-foreground mb-6">
          {allDone ? 'Ya sabes usar ChatGPT y Gemini mejor que la mayoría de la empresa' : `Has completado ${user.completedModules.length} de ${modules.length} módulos`}
        </p>
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div><div className="text-3xl font-display font-bold text-gradient-primary">{user.points}</div><div className="text-xs text-muted-foreground">Puntos</div></div>
          <div><div className="text-3xl font-display font-bold text-card-foreground">#{rank}</div><div className="text-xs text-muted-foreground">Ranking</div></div>
          <div><div className="text-3xl font-display font-bold text-card-foreground">{getLevelName(user.level)}</div><div className="text-xs text-muted-foreground">Nivel</div></div>
        </div>
        <div className="space-y-3">
          <Button className="w-full gradient-primary text-primary-foreground font-semibold" onClick={() => navigate('/challenges')}>
            <Target className="w-4 h-4 mr-2" /> Participar en retos semanales
          </Button>
          <Button variant="outline" className="w-full" onClick={() => navigate('/ranking')}>
            <Trophy className="w-4 h-4 mr-2" /> Ver ranking completo
          </Button>
          <Button variant="ghost" className="w-full" onClick={() => navigate('/dashboard')}>Volver al dashboard</Button>
        </div>
      </motion.div>
    </div>
  );
}
