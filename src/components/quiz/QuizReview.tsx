/**
 * COMPONENTE REVIEW — Muestra el quiz completado en modo lectura
 * Se usa cuando el usuario ya completó el módulo e intenta volver a entrar.
 * Muestra respuestas bloqueadas, puntos por pregunta, y resultado final.
 * 
 * Props:
 * - embedded: si true, no renderiza header/footer propios (se usa dentro de tabs)
 */
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, XCircle, Clock, Trophy, ArrowLeft, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { QuizAttempt, Module } from '@/types/challenge';

interface QuizReviewProps {
  attempt: QuizAttempt;
  mod: Module;
  embedded?: boolean;
}

export default function QuizReview({ attempt, mod, embedded = false }: QuizReviewProps) {
  const navigate = useNavigate();

  const content = (
    <div className="space-y-6">
      {/* Banner de aviso */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center gap-3"
      >
        <Lock className="w-5 h-5 text-primary shrink-0" />
        <p className="text-sm text-card-foreground">
          Este test ya ha sido completado. Puedes revisar tus respuestas pero no modificarlo.
        </p>
      </motion.div>

      {/* Resumen de puntuación */}
      <div className="bg-card rounded-2xl p-6 shadow-card">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-primary">{attempt.totalPoints}</div>
            <div className="text-xs text-muted-foreground">Puntos totales</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-card-foreground">
              {attempt.answers.filter(a => a.correct).length}/{attempt.answers.length}
            </div>
            <div className="text-xs text-muted-foreground">Correctas</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-card-foreground">{attempt.averageTime.toFixed(1)}s</div>
            <div className="text-xs text-muted-foreground">Tiempo medio</div>
          </div>
        </div>
      </div>

      {/* Desglose por pregunta */}
      <div className="space-y-4">
        {mod.questions.map((q, i) => {
          const answer = attempt.answers[i];
          if (!answer) return null;
          return (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card rounded-xl p-5 shadow-card"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-sm font-semibold text-card-foreground flex-1">
                  <span className="text-muted-foreground mr-2">P{i + 1}.</span>
                  {q.question}
                </h3>
                {answer.correct ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 ml-2" />
                ) : (
                  <XCircle className="w-5 h-5 text-destructive shrink-0 ml-2" />
                )}
              </div>

              <div className="space-y-2 mb-3">
                {q.options.map((opt, oi) => {
                  let cls = 'bg-muted text-muted-foreground';
                  if (oi === q.correctIndex) cls = 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/30';
                  else if (oi === answer.selectedIndex && !answer.correct) cls = 'bg-destructive/10 text-destructive border border-destructive/30';
                  return (
                    <div key={oi} className={`px-4 py-2.5 rounded-lg text-sm ${cls}`}>
                      <span className="mr-2 opacity-50">{String.fromCharCode(65 + oi)}.</span>
                      {opt}
                      {oi === q.correctIndex && <CheckCircle2 className="w-4 h-4 inline ml-1" />}
                      {oi === answer.selectedIndex && oi !== q.correctIndex && <XCircle className="w-4 h-4 inline ml-1" />}
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center gap-4 text-xs text-muted-foreground border-t border-border pt-3">
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {answer.timeSeconds.toFixed(1)}s</span>
                {answer.correct ? (
                  <span className="text-emerald-600 font-medium">
                    +{answer.basePoints} base {answer.bonusPoints > 0 && `+${answer.bonusPoints} bonus`} = {answer.totalPoints} pts
                  </span>
                ) : (
                  <span className="text-destructive font-medium">0 puntos</span>
                )}
              </div>

              <div className="mt-3 bg-muted/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">{q.explanation}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {!embedded && (
        <div className="flex gap-3 justify-center pt-4">
          <Button variant="outline" onClick={() => navigate('/dashboard')}>Volver al dashboard</Button>
          <Button className="gradient-primary text-primary-foreground" onClick={() => navigate('/ranking')}>
            <Trophy className="w-4 h-4 mr-1" /> Ver ranking
          </Button>
        </div>
      )}
    </div>
  );

  if (embedded) return content;

  return (
    <div className="min-h-screen bg-background">
      <header className="gradient-hero py-4">
        <div className="container max-w-4xl mx-auto px-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-primary-foreground" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{mod.icon}</span>
            <span className="text-lg font-display font-bold text-primary-foreground">{mod.title}</span>
          </div>
          <div className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 text-primary-foreground">
            <Lock className="w-4 h-4" />
            <span className="text-sm font-medium">Completado</span>
          </div>
        </div>
      </header>
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {content}
      </div>
    </div>
  );
}
