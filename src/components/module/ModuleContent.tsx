/**
 * COMPONENTE ModuleContent — Muestra el contenido educativo de un módulo.
 * 
 * Características:
 * - Slide 0 = Índice del módulo con títulos clickables
 * - Mini navbar horizontal para navegar entre secciones
 * - Navegación con flechas del teclado (← →)
 * - Botón "Empezar quiz" en la última slide (modo primera vez)
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, ListOrdered } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import type { Module } from '@/types/challenge';

interface ModuleContentProps {
  mod: Module;
  /** Si se pasa, muestra el botón "Empezar quiz" en la última slide */
  onStartQuiz?: () => void;
}

export default function ModuleContent({ mod, onStartQuiz }: ModuleContentProps) {
  // contentIdx 0 = índice, 1..N = slides del módulo
  const [contentIdx, setContentIdx] = useState(0);
  const navRef = useRef<HTMLDivElement>(null);

  const totalSlides = mod.content.length + 1; // +1 por el índice
  const isIndex = contentIdx === 0;
  const isLastContent = contentIdx === totalSlides - 1;
  const currentContent = isIndex ? null : mod.content[contentIdx - 1];

  // Navegación con teclado
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      if (isLastContent && onStartQuiz) {
        onStartQuiz();
      } else if (!isLastContent) {
        setContentIdx(i => i + 1);
      }
    } else if (e.key === 'ArrowLeft' && contentIdx > 0) {
      setContentIdx(i => i - 1);
    }
  }, [contentIdx, isLastContent, onStartQuiz]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Scroll activo en navbar
  useEffect(() => {
    if (navRef.current) {
      const activeBtn = navRef.current.querySelector('[data-active="true"]');
      if (activeBtn) {
        activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [contentIdx]);

  return (
    <motion.div
      key={`content-${contentIdx}`}
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      className="space-y-6"
    >
      {/* Mini navbar de secciones */}
      <ScrollArea className="w-full">
        <div ref={navRef} className="flex gap-1 pb-2 px-1">
          {/* Botón índice */}
          <button
            data-active={contentIdx === 0}
            onClick={() => setContentIdx(0)}
            className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              contentIdx === 0
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'bg-muted/60 text-muted-foreground hover:bg-muted'
            }`}
          >
            <ListOrdered className="w-3.5 h-3.5" />
            Índice
          </button>
          {/* Botones de cada sección */}
          {mod.content.map((c, i) => {
            const slideIdx = i + 1;
            const isActive = contentIdx === slideIdx;
            const isVisited = slideIdx < contentIdx;
            return (
              <button
                key={i}
                data-active={isActive}
                onClick={() => setContentIdx(slideIdx)}
                className={`shrink-0 px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap max-w-[180px] truncate ${
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : isVisited
                    ? 'bg-primary/15 text-primary hover:bg-primary/25'
                    : 'bg-muted/60 text-muted-foreground hover:bg-muted'
                }`}
                title={c.title || `Sección ${slideIdx}`}
              >
                {c.title || `Sección ${slideIdx}`}
              </button>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      {/* Contenido */}
      {isIndex ? (
        /* === SLIDE 0: ÍNDICE DEL MÓDULO === */
        <div className="bg-card rounded-2xl p-8 shadow-card space-y-6 max-h-[65vh] overflow-y-auto">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{mod.icon}</span>
              <h2 className="text-2xl font-display font-bold text-card-foreground">{mod.title}</h2>
            </div>
            <p className="text-muted-foreground">{mod.description}</p>
          </div>

          <div className="border-t border-border pt-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              Contenido del módulo
            </h3>
            <ol className="space-y-2">
              {mod.content.map((c, i) => (
                <li key={i}>
                  <button
                    onClick={() => setContentIdx(i + 1)}
                    className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted/60 transition-colors group"
                  >
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="text-card-foreground font-medium group-hover:text-primary transition-colors">
                      {c.title || `Sección ${i + 1}`}
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </div>

          <p className="text-xs text-muted-foreground text-center pt-2">
            Usa las flechas del teclado (← →) para navegar
          </p>
        </div>
      ) : currentContent ? (
        /* === SLIDES DE CONTENIDO === */
        <div className="bg-card rounded-2xl p-8 shadow-card max-h-[65vh] overflow-y-auto">
          {currentContent.title && (
            <h2 className="text-2xl font-display font-bold text-card-foreground mb-4">{currentContent.title}</h2>
          )}
          {currentContent.type === 'comparison' && currentContent.items ? (
            <div className="space-y-3">
              <p className="text-muted-foreground mb-4">{currentContent.body}</p>
              {currentContent.items.map((item, i) => (
                <div key={i} className="flex justify-between items-center bg-muted rounded-lg px-4 py-3">
                  <span className="font-medium text-card-foreground">{item.label}</span>
                  <span className="text-sm text-muted-foreground">{item.value}</span>
                </div>
              ))}
            </div>
          ) : (
            <div
              className={`whitespace-pre-line text-card-foreground leading-relaxed ${
                currentContent.type === 'tip'
                  ? 'bg-primary/5 border border-primary/20 rounded-xl p-5'
                  : currentContent.type === 'example'
                  ? 'bg-accent/10 border border-accent/20 rounded-xl p-5'
                  : ''
              }`}
            >
              {currentContent.body}
            </div>
          )}
        </div>
      ) : null}

      {/* Navegación inferior */}
      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          onClick={() => setContentIdx(i => i - 1)}
          disabled={contentIdx === 0}
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Anterior
        </Button>

        <span className="text-xs text-muted-foreground">
          {contentIdx} / {totalSlides - 1}
        </span>

        <Button
          className="gradient-primary text-primary-foreground"
          onClick={() => {
            if (isLastContent && onStartQuiz) {
              onStartQuiz();
            } else if (!isLastContent) {
              setContentIdx(i => i + 1);
            }
          }}
          disabled={isLastContent && !onStartQuiz}
        >
          {isLastContent && onStartQuiz
            ? 'Empezar quiz'
            : isLastContent
            ? 'Fin del contenido'
            : 'Siguiente'}{' '}
          {!(isLastContent && !onStartQuiz) && <ArrowRight className="w-4 h-4 ml-1" />}
        </Button>
      </div>
    </motion.div>
  );
}
