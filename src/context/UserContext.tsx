/**
 * CONTEXTO DE USUARIO — Estado global con persistencia en Lovable Cloud
 * 
 * Gestiona:
 * - El usuario actual (perfil en base de datos)
 * - La lista de todos los usuarios registrados
 * - Intentos de quiz (quiz_attempts en DB)
 * 
 * FUNCIONES DISPONIBLES:
 * - login(name, email, department) → Registra un nuevo usuario o recupera uno existente
 * - loginByEmail(email) → Inicia sesión solo con email
 * - logout() → Cierra la sesión actual
 * - addPoints(points) → Suma puntos al usuario actual
 * - completeModule(moduleId) → Marca un módulo como completado
 * - addBadge(badgeId) → Otorga una insignia al usuario
 * - saveQuizAttempt(attempt) → Guarda el resultado completo de un quiz
 * - getQuizAttempt(moduleId) → Obtiene el intento previo de un módulo
 * - refreshUsers() → Recarga la lista de usuarios desde la DB
 */
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Department, QuizAttempt, QuizAnswer } from '@/types/challenge';
import { getLevelFromPoints } from '@/types/challenge';

/** Perfil de usuario tal como viene de la base de datos */
interface DbProfile {
  id: string;
  name: string;
  email: string;
  department: string;
  points: number;
  level: number;
  completed_modules: string[];
  badges: string[];
  created_at: string;
}

/** Intento de quiz tal como viene de la base de datos */
interface DbQuizAttempt {
  id: string;
  profile_id: string;
  module_id: string;
  answers: QuizAnswer[];
  total_points: number;
  average_time: number;
  completed_at: string;
}

/** Tipo User para uso interno (igual que antes, compatible con toda la app) */
export interface User {
  id: string;
  name: string;
  email: string;
  department: Department;
  points: number;
  level: number;
  completedModules: string[];
  badges: string[];
  quizAttempts: QuizAttempt[];
  createdAt: string;
}

interface UserContextType {
  user: User | null;
  allUsers: User[];
  loading: boolean;
  login: (name: string, email: string, department: Department) => Promise<void>;
  loginByEmail: (email: string) => Promise<boolean>;
  logout: () => void;
  addPoints: (points: number) => Promise<void>;
  completeModule: (moduleId: string) => Promise<void>;
  addBadge: (badgeId: string) => Promise<void>;
  saveQuizAttempt: (attempt: QuizAttempt) => Promise<void>;
  getQuizAttempt: (moduleId: string) => QuizAttempt | undefined;
  refreshUsers: () => Promise<void>;
}

const UserContext = createContext<UserContextType | null>(null);

const CURRENT_USER_KEY = 'ia-challenge-current-id';

/** Convierte un perfil de DB + sus quiz attempts a User */
function dbToUser(profile: DbProfile, attempts: DbQuizAttempt[] = []): User {
  return {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    department: profile.department as Department,
    points: profile.points,
    level: profile.level,
    completedModules: profile.completed_modules || [],
    badges: profile.badges || [],
    quizAttempts: attempts.map(a => ({
      moduleId: a.module_id,
      answers: a.answers as QuizAnswer[],
      totalPoints: a.total_points,
      averageTime: a.average_time,
      completedAt: a.completed_at,
    })),
    createdAt: profile.created_at,
  };
}

/** Carga un usuario completo (perfil + quiz attempts) desde la DB */
async function loadUserById(id: string): Promise<User | null> {
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (!profile) return null;

  const { data: attempts } = await supabase
    .from('quiz_attempts')
    .select('*')
    .eq('profile_id', id);

  return dbToUser(profile as DbProfile, (attempts || []) as unknown as DbQuizAttempt[]);
}

/** Carga todos los usuarios (solo perfiles, sin quiz attempts para rendimiento) */
async function loadAllUsers(): Promise<User[]> {
  const { data: profiles } = await supabase.from('profiles').select('*');
  if (!profiles) return [];
  return (profiles as DbProfile[]).map(p => dbToUser(p));
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  /** Carga inicial: recuperar sesión y lista de usuarios */
  useEffect(() => {
    const init = async () => {
      const savedId = localStorage.getItem(CURRENT_USER_KEY);
      const [users, currentUser] = await Promise.all([
        loadAllUsers(),
        savedId ? loadUserById(savedId) : Promise.resolve(null),
      ]);
      setAllUsers(users);
      if (currentUser) setUser(currentUser);
      setLoading(false);
    };
    init();
  }, []);

  /** Suscripción realtime a cambios en profiles */
  useEffect(() => {
    const channel = supabase
      .channel('profiles-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, async () => {
        const users = await loadAllUsers();
        setAllUsers(users);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const refreshUsers = useCallback(async () => {
    const users = await loadAllUsers();
    setAllUsers(users);
  }, []);

  const login = useCallback(async (name: string, email: string, department: Department) => {
    // Buscar si ya existe
    const { data: existing } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (existing) {
      const fullUser = await loadUserById(existing.id);
      if (fullUser) {
        setUser(fullUser);
        localStorage.setItem(CURRENT_USER_KEY, fullUser.id);
      }
      return;
    }

    // Crear nuevo perfil
    const { data: newProfile, error } = await supabase
      .from('profiles')
      .insert({ name, email, department })
      .select()
      .single();

    if (error || !newProfile) {
      console.error('Error creating profile:', error);
      return;
    }

    const newUser = dbToUser(newProfile as DbProfile);
    setUser(newUser);
    setAllUsers(prev => [...prev, newUser]);
    localStorage.setItem(CURRENT_USER_KEY, newUser.id);
  }, []);

  const loginByEmail = useCallback(async (email: string): Promise<boolean> => {
    const { data: existing } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (!existing) return false;

    const fullUser = await loadUserById(existing.id);
    if (fullUser) {
      setUser(fullUser);
      localStorage.setItem(CURRENT_USER_KEY, fullUser.id);
    }
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  }, []);

  const addPoints = useCallback(async (points: number) => {
    if (!user) return;
    const newPoints = user.points + points;
    const newLevel = getLevelFromPoints(newPoints);

    await supabase
      .from('profiles')
      .update({ points: newPoints, level: newLevel })
      .eq('id', user.id);

    setUser(prev => prev ? { ...prev, points: newPoints, level: newLevel } : null);
  }, [user]);

  const completeModule = useCallback(async (moduleId: string) => {
    if (!user || user.completedModules.includes(moduleId)) return;
    const newModules = [...user.completedModules, moduleId];

    await supabase
      .from('profiles')
      .update({ completed_modules: newModules })
      .eq('id', user.id);

    setUser(prev => prev ? { ...prev, completedModules: newModules } : null);
  }, [user]);

  const addBadge = useCallback(async (badgeId: string) => {
    if (!user || user.badges.includes(badgeId)) return;
    const newBadges = [...user.badges, badgeId];

    await supabase
      .from('profiles')
      .update({ badges: newBadges })
      .eq('id', user.id);

    setUser(prev => prev ? { ...prev, badges: newBadges } : null);
  }, [user]);

  const saveQuizAttempt = useCallback(async (attempt: QuizAttempt) => {
    if (!user) return;
    // Si ya existe un intento para este módulo, no sobreescribir
    if (user.quizAttempts?.some(a => a.moduleId === attempt.moduleId)) return;

    const { error } = await supabase.from('quiz_attempts').insert([{
      profile_id: user.id,
      module_id: attempt.moduleId,
      answers: attempt.answers as unknown as Record<string, unknown>[],
      total_points: attempt.totalPoints,
      average_time: attempt.averageTime,
      completed_at: attempt.completedAt,
    }] as any);

    if (error) {
      console.error('Error saving quiz attempt:', error);
      return;
    }

    setUser(prev => prev ? {
      ...prev,
      quizAttempts: [...(prev.quizAttempts || []), attempt],
    } : null);
  }, [user]);

  const getQuizAttempt = useCallback((moduleId: string): QuizAttempt | undefined => {
    return user?.quizAttempts?.find(a => a.moduleId === moduleId);
  }, [user]);

  return (
    <UserContext.Provider value={{
      user, allUsers, loading, login, loginByEmail, logout,
      addPoints, completeModule, addBadge, saveQuizAttempt, getQuizAttempt, refreshUsers
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be inside UserProvider');
  return ctx;
}
