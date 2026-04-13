/**
 * TIPOS Y CONSTANTES CENTRALES
 * 
 * Este archivo define todos los tipos TypeScript del proyecto:
 * - Department: los 6 departamentos de la empresa
 * - User: datos del usuario (puntos, nivel, módulos completados, badges)
 * - QuizQuestion: pregunta tipo test con 4 opciones
 * - Module: módulo de formación (contenido + preguntas)
 * - ModuleContent: bloque de contenido (texto, comparación, tip, ejemplo)
 * - WeeklyChallenge: reto semanal con puntos
 * - Badge: insignia desbloqueable
 * 
 * También contiene funciones auxiliares para calcular niveles.
 */

/** Los 6 departamentos de la empresa */
export type Department = 'Administración' | 'Comercial' | 'Marketing' | 'RRHH' | 'Operaciones' | 'Dirección';

/** Datos completos de un usuario */
export interface User {
  id: string;
  name: string;
  email: string;
  department: Department;
  points: number;             // Puntos totales acumulados
  level: number;              // Nivel actual (1-5), se calcula desde los puntos
  completedModules: string[]; // IDs de módulos completados
  badges: string[];           // IDs de insignias obtenidas
  quizAttempts: QuizAttempt[]; // Historial de intentos de quiz
  createdAt: string;          // Fecha ISO de registro
}

/** Una pregunta del quiz con sus opciones y respuesta correcta */
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];       // 4 opciones de respuesta
  correctIndex: number;    // Índice (0-3) de la respuesta correcta
  explanation: string;     // Explicación que se muestra tras responder
}

/** Un módulo de formación completo */
export interface Module {
  id: string;
  title: string;
  description: string;
  icon: string;            // Emoji del módulo
  questions: QuizQuestion[]; // Preguntas del quiz final
  content: ModuleContent[];  // Slides de contenido educativo
  completionPoints: number;  // Puntos bonus al completar el módulo
}

/** Un bloque de contenido dentro de un módulo */
export interface ModuleContent {
  type: 'text' | 'comparison' | 'tip' | 'example'; // Tipo de bloque visual
  title?: string;
  body: string;
  items?: { label: string; value: string }[]; // Solo para tipo 'comparison'
}

/** Respuesta individual de un usuario a una pregunta del quiz */
export interface QuizAnswer {
  questionId: string;
  selectedIndex: number | null; // null si se agotó el tiempo
  correct: boolean;
  timeSeconds: number;          // Tiempo que tardó en responder
  basePoints: number;           // 10 si correcta, 0 si incorrecta
  bonusPoints: number;          // Bonus por rapidez (solo si correcta)
  totalPoints: number;          // basePoints + bonusPoints
}

/** Intento completo de un quiz (un módulo) */
export interface QuizAttempt {
  moduleId: string;
  answers: QuizAnswer[];
  totalPoints: number;          // Suma de todos los totalPoints
  averageTime: number;          // Tiempo medio por pregunta en segundos
  completedAt: string;          // Fecha ISO
}

/** Un reto semanal */
export interface WeeklyChallenge {
  id: string;
  title: string;
  description: string;
  points: number;
  week: number;
  tool: 'ChatGPT' | 'Gemini' | 'Ambos';
}

/** Una insignia que el usuario puede desbloquear */
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;            // Emoji de la insignia
}

/** Lista de todos los departamentos disponibles */
export const DEPARTMENTS: Department[] = ['Administración', 'Comercial', 'Marketing', 'RRHH', 'Operaciones', 'Dirección'];

/** Todas las insignias disponibles en la plataforma */
export const BADGES: Badge[] = [
  { id: 'first-module', name: 'Primer Paso', description: 'Completaste tu primer módulo', icon: 'crosshair' },
  { id: 'all-modules', name: 'Graduado IA', description: 'Completaste todos los módulos', icon: 'graduation-cap' },
  { id: 'speed-demon', name: 'Rayo', description: 'Respondiste correctamente en menos de 10s', icon: 'zap' },
  { id: 'perfect-score', name: 'Perfeccionista', description: 'Módulo sin errores', icon: 'gem' },
  { id: 'top-10', name: 'Top 10', description: 'Entraste en el Top 10 global', icon: 'trophy' },
  { id: 'challenger', name: 'Retador', description: 'Completaste un reto semanal', icon: 'flame' },
];

/**
 * Calcula el nivel (1-5) basado en los puntos acumulados.
 * Niveles: 0-49=1, 50-119=2, 120-199=3, 200-299=4, 300+=5
 */
export function getLevelFromPoints(points: number): number {
  if (points >= 300) return 5;
  if (points >= 200) return 4;
  if (points >= 120) return 3;
  if (points >= 50) return 2;
  return 1;
}

/** Devuelve el nombre del nivel en español */
export function getLevelName(level: number): string {
  const names = ['Novato IA', 'Aprendiz IA', 'Practicante IA', 'Experto IA', 'Maestro IA'];
  return names[level - 1] || 'Novato IA';
}
