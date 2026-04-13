/**
 * COMPONENTE TIMER — Temporizador circular de 30 segundos
 * Se muestra durante cada pregunta del quiz.
 * Cambia de color según el tiempo restante (verde → amarillo → rojo).
 */
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface QuizTimerProps {
  maxTime: number;        // Tiempo máximo en segundos (30)
  onTimeUp: () => void;   // Callback cuando el tiempo llega a 0
  isPaused: boolean;       // Pausar cuando ya se respondió
}

export default function QuizTimer({ maxTime, onTimeUp, isPaused }: QuizTimerProps) {
  const [timeLeft, setTimeLeft] = useState(maxTime);
  // Stable ref para onTimeUp: evita recrear el intervalo en cada render del padre
  const onTimeUpRef = useRef(onTimeUp);
  useEffect(() => { onTimeUpRef.current = onTimeUp; }, [onTimeUp]);

  useEffect(() => {
    setTimeLeft(maxTime);
    if (isPaused) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeUpRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused, maxTime]);

  const percentage = (timeLeft / maxTime) * 100;
  const circumference = 2 * Math.PI * 20;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Color según tiempo restante
  const getColor = () => {
    if (timeLeft > 20) return 'hsl(145, 60%, 40%)';  // Verde
    if (timeLeft > 10) return 'hsl(45, 95%, 55%)';   // Amarillo
    return 'hsl(0, 65%, 42%)';                         // Rojo (primary)
  };

  return (
    <div className="relative w-14 h-14 flex items-center justify-center">
      <svg className="w-14 h-14 -rotate-90" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r="20" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
        <motion.circle
          cx="24" cy="24" r="20" fill="none"
          stroke={getColor()}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transition={{ duration: 0.5 }}
        />
      </svg>
      <span className={`absolute text-sm font-bold ${timeLeft <= 10 ? 'text-destructive' : 'text-card-foreground'}`}>
        {timeLeft}s
      </span>
    </div>
  );
}
