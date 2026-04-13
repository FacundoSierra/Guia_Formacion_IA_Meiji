/**
 * PÁGINA DE MÓDULO — Contenido educativo + Quiz con temporizador
 * Ruta: /module/:id
 * 
 * Datos persistidos en Lovable Cloud.
 * Si ya completó: muestra tabs para ver contenido o revisar test.
 * Si no: CONTENT → QUIZ → RESULTS
 */
import { useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { modules } from '@/data/modules';
import { useUser } from '@/context/UserContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, ArrowRight, CheckCircle2, XCircle, Star, Loader2, BookOpen, ClipboardCheck } from 'lucide-react';
import QuizTimer from '@/components/quiz/QuizTimer';
import QuizReview from '@/components/quiz/QuizReview';
import QuizResults from '@/components/quiz/QuizResults';
import ModuleContent from '@/components/module/ModuleContent';
import type { QuizAnswer } from '@/types/challenge';

const MAX_TIME = 30;

function calcBonus(timeSeconds: number): number {
  if (timeSeconds < 10) return 10;
  if (timeSeconds < 20) return 5;
  return 0;
}

export default function ModulePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading, addPoints, completeModule, addBadge, saveQuizAttempt, getQuizAttempt } = useUser();
  const mod = modules.find(m => m.id === id);

  const [phase, setPhase] = useState<'content' | 'quiz' | 'results'>('content');
  const [questionIdx, setQuestionIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [timerKey, setTimerKey] = useState(0);
  const questionStartTime = useRef(Date.now());

  const handleTimeUp = useCallback(() => {
    if (answered) return;
    const q = mod?.questions[questionIdx];
    if (!q) return;
    const answer: QuizAnswer = { questionId: q.id, selectedIndex: null, correct: false, timeSeconds: MAX_TIME, basePoints: 0, bonusPoints: 0, totalPoints: 0 };
    setAnswered(true);
    setSelected(null);
    setAnswers(prev => [...prev, answer]);
  }, [answered, mod, questionIdx]);

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  if (!mod || !user) { navigate('/dashboard'); return null; }

  const existingAttempt = getQuizAttempt(mod.id);

  // === MODO COMPLETADO: Tabs con contenido + revisión del test ===
  if (existingAttempt && phase !== 'results') {
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
            <div className="ml-auto flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-foreground/10 text-primary-foreground">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-sm font-medium">Completado</span>
              </div>
              <div className="bg-white rounded-lg px-2 py-1 shadow-sm">
                <img src="/meiji-logo.svg" alt="Meiji" className="h-6 w-auto" />
              </div>
            </div>
          </div>
        </header>

        <div className="container max-w-4xl mx-auto px-4 py-6">
          <Tabs defaultValue="content" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 h-12">
              <TabsTrigger value="content" className="flex items-center gap-2 text-sm font-medium">
                <BookOpen className="w-4 h-4" /> Contenido
              </TabsTrigger>
              <TabsTrigger value="quiz" className="flex items-center gap-2 text-sm font-medium">
                <ClipboardCheck className="w-4 h-4" /> Test completado
              </TabsTrigger>
            </TabsList>

            <TabsContent value="content">
              <ModuleContent mod={mod} />
            </TabsContent>

            <TabsContent value="quiz">
              <QuizReview attempt={existingAttempt} mod={mod} embedded />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    );
  }

  // === MODO NUEVO: Content → Quiz → Results ===
  const question = mod.questions[questionIdx];
  const isLastQuestion = questionIdx === mod.questions.length - 1;

  const handleAnswer = (idx: number) => {
    if (answered) return;
    const timeSeconds = (Date.now() - questionStartTime.current) / 1000;
    const isCorrect = idx === question.correctIndex;
    const basePoints = isCorrect ? 10 : 0;
    const bonusPoints = isCorrect ? calcBonus(timeSeconds) : 0;
    const totalPoints = basePoints + bonusPoints;

    const answer: QuizAnswer = { questionId: question.id, selectedIndex: idx, correct: isCorrect, timeSeconds, basePoints, bonusPoints, totalPoints };
    setSelected(idx);
    setAnswered(true);
    setAnswers(prev => [...prev, answer]);
    if (totalPoints > 0) addPoints(totalPoints);
    if (isCorrect && timeSeconds < 10) addBadge('speed-demon');
  };

  const nextQuestion = async () => {
    if (isLastQuestion) {
      const allAnswers = answers;
      const totalQuizPts = allAnswers.reduce((s, a) => s + a.totalPoints, 0);
      const avgTime = allAnswers.reduce((s, a) => s + a.timeSeconds, 0) / allAnswers.length;

      await addPoints(mod.completionPoints);
      await completeModule(mod.id);

      const correctCount = allAnswers.filter(a => a.correct).length;
      if (correctCount === mod.questions.length) await addBadge('perfect-score');
      if (user.completedModules.length === 0) await addBadge('first-module');
      if (user.completedModules.length + 1 === modules.length) await addBadge('all-modules');

      await saveQuizAttempt({
        moduleId: mod.id,
        answers: allAnswers,
        totalPoints: totalQuizPts + mod.completionPoints,
        averageTime: avgTime,
        completedAt: new Date().toISOString(),
      });

      setPhase('results');
    } else {
      setQuestionIdx(i => i + 1);
      setSelected(null);
      setAnswered(false);
      setTimerKey(k => k + 1);
      questionStartTime.current = Date.now();
    }
  };

  const currentAnswer = answered ? answers[answers.length - 1] : null;

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
          <div className="ml-auto bg-white rounded-lg px-2 py-1 shadow-sm">
            <img src="/meiji-logo.svg" alt="Meiji" className="h-6 w-auto" />
          </div>
        </div>
      </header>

      <div className="container max-w-4xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {phase === 'content' && (
            <ModuleContent mod={mod} onStartQuiz={() => { setPhase('quiz'); questionStartTime.current = Date.now(); setTimerKey(0); }} />
          )}

          {phase === 'quiz' && question && (
            <motion.div key={`q-${questionIdx}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Pregunta {questionIdx + 1} de {mod.questions.length}</span>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1 text-sm font-medium text-accent">
                    <Star className="w-4 h-4" /> {answers.reduce((s, a) => s + a.totalPoints, 0)} pts
                  </span>
                  <QuizTimer key={timerKey} maxTime={MAX_TIME} onTimeUp={handleTimeUp} isPaused={answered} />
                </div>
              </div>
              <div className="bg-card rounded-2xl p-8 shadow-card space-y-6">
                <h2 className="text-xl font-display font-bold text-card-foreground">{question.question}</h2>
                <div className="space-y-3">
                  {question.options.map((opt, i) => {
                    let cls = 'bg-muted hover:bg-muted/80 text-card-foreground';
                    if (answered) {
                      if (i === question.correctIndex) cls = 'gradient-success text-primary-foreground';
                      else if (i === selected) cls = 'bg-destructive/10 text-destructive border border-destructive/30';
                    }
                    return (
                      <button key={i} onClick={() => handleAnswer(i)} disabled={answered}
                        className={`w-full text-left px-5 py-4 rounded-xl font-medium transition-all ${cls} ${!answered ? 'cursor-pointer' : ''}`}>
                        <span className="mr-3 opacity-50">{String.fromCharCode(65 + i)}.</span>{opt}
                        {answered && i === question.correctIndex && <CheckCircle2 className="w-5 h-5 inline ml-2" />}
                        {answered && i === selected && i !== question.correctIndex && <XCircle className="w-5 h-5 inline ml-2" />}
                      </button>
                    );
                  })}
                </div>
                {answered && currentAnswer && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
                    <div className={`rounded-xl p-4 ${currentAnswer.correct ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-destructive/10 border border-destructive/30'}`}>
                      {currentAnswer.correct ? (
                        <p className="text-sm font-medium text-emerald-700">
                          Correcto: +{currentAnswer.basePoints} puntos base
                          {currentAnswer.bonusPoints > 0 && <span className="text-primary"> +{currentAnswer.bonusPoints} bonus</span>}
                          {' '}= <strong>+{currentAnswer.totalPoints} puntos</strong>
                          {currentAnswer.bonusPoints > 0 && <span className="text-xs ml-1 text-muted-foreground">({currentAnswer.timeSeconds.toFixed(1)}s)</span>}
                        </p>
                      ) : (
                        <p className="text-sm font-medium text-destructive">
                          {currentAnswer.selectedIndex === null ? 'Tiempo agotado' : 'Incorrecto'}: 0 puntos
                        </p>
                      )}
                    </div>
                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                      <p className="text-sm text-card-foreground">{question.explanation}</p>
                    </div>
                  </motion.div>
                )}
              </div>
              {answered && (
                <div className="flex justify-end">
                  <Button className="gradient-primary text-primary-foreground" onClick={nextQuestion}>
                    {isLastQuestion ? 'Ver resultados' : 'Siguiente pregunta'} <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              )}
            </motion.div>
          )}

          {phase === 'results' && (
            <QuizResults mod={mod} answers={answers} totalQuizPoints={answers.reduce((s, a) => s + a.totalPoints, 0)} completionPoints={mod.completionPoints} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
