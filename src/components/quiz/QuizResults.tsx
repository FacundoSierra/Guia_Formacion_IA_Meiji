/**
 * COMPONENTE RESULTS — Resumen final tras completar el quiz
 * Muestra: puntos totales, desglose por pregunta, tiempo medio, badges obtenidos.
 */
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, Clock, Trophy, Star, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { QuizAnswer, Module } from '@/types/challenge';

interface QuizResultsProps {
  mod: Module;
  answers: QuizAnswer[];
  totalQuizPoints: number;
  completionPoints: number;
}

export default function QuizResults({ mod, answers, totalQuizPoints, completionPoints }: QuizResultsProps) {
  const navigate = useNavigate();
  const correctCount = answers.filter(a => a.correct).length;
  const avgTime = answers.reduce((s, a) => s + a.timeSeconds, 0) / answers.length;
  const grandTotal = totalQuizPoints + completionPoints;

  return (
    <motion.div key="results" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
      {/* Tarjeta principal */}
      <div className="bg-card rounded-2xl p-8 shadow-elevated text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }} className="flex justify-center mb-4">
          <Award className="w-16 h-16 text-primary" />
        </motion.div>
        <h2 className="text-3xl font-display font-bold text-card-foreground mb-2">¡Módulo completado!</h2>
        <p className="text-muted-foreground mb-6">{mod.title}</p>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-gradient-primary">{grandTotal}</div>
            <div className="text-xs text-muted-foreground">Puntos totales</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-card-foreground">{correctCount}/{answers.length}</div>
            <div className="text-xs text-muted-foreground">Correctas</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-card-foreground">{avgTime.toFixed(1)}s</div>
            <div className="text-xs text-muted-foreground">Tiempo medio</div>
          </div>
        </div>
      </div>

      {/* Desglose por pregunta */}
      <div className="bg-card rounded-2xl p-6 shadow-card">
        <h3 className="font-display font-semibold text-card-foreground mb-4 flex items-center gap-2">
          <Star className="w-4 h-4 text-primary" /> Desglose por pregunta
        </h3>
        <div className="space-y-3">
          {answers.map((a, i) => (
            <div key={i} className={`flex items-center justify-between rounded-lg px-4 py-3 ${a.correct ? 'bg-emerald-500/5 border border-emerald-500/20' : 'bg-destructive/5 border border-destructive/20'}`}>
              <div className="flex items-center gap-3">
                {a.correct ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <XCircle className="w-4 h-4 text-destructive" />}
                <span className="text-sm text-card-foreground">Pregunta {i + 1}</span>
                <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" /> {a.timeSeconds.toFixed(1)}s</span>
              </div>
              <div className="text-sm font-medium">
                {a.correct ? (
                  <span className="text-emerald-600">
                    +{a.basePoints} {a.bonusPoints > 0 && <span className="text-primary">+{a.bonusPoints} bonus</span>} = {a.totalPoints} pts
                  </span>
                ) : (
                  <span className="text-destructive">0 pts</span>
                )}
              </div>
            </div>
          ))}
          {/* Bonus de completación */}
          <div className="flex items-center justify-between rounded-lg px-4 py-3 bg-primary/5 border border-primary/20">
            <span className="text-sm text-card-foreground font-medium flex items-center gap-2"><Award className="w-4 h-4 text-primary" /> Bonus de completación</span>
            <span className="text-sm font-medium text-primary">+{completionPoints} pts</span>
          </div>
        </div>
      </div>

      <div className="flex gap-3 justify-center">
        <Button variant="outline" onClick={() => navigate('/dashboard')}>Volver al dashboard</Button>
        <Button className="gradient-primary text-primary-foreground" onClick={() => navigate('/ranking')}>
          <Trophy className="w-4 h-4 mr-1" /> Ver ranking
        </Button>
      </div>
    </motion.div>
  );
}
