/**
 * PÁGINA DE RETOS SEMANALES — Ruta: /challenges
 *
 * Flujo con validación:
 * 1. Usuario hace clic en "Participar"
 * 2. Sube una imagen como evidencia
 * 3. El reto queda en estado "pendiente" hasta que un admin lo apruebe
 * 4. Al aprobarse, se suman los puntos automáticamente
 */
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useUser } from '@/context/UserContext';
import { weeklyChallenges } from '@/data/modules';
import { type WeeklyChallenge } from '@/types/challenge';
import { Button } from '@/components/ui/button';
import {
  Dialog, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  ArrowLeft, Target, Star, CheckCircle2, Loader2,
  Flame, Upload, Clock, XCircle, ImageIcon, FileText,
} from 'lucide-react';
import {
  uploadChallengeFile, submitChallenge, getUserSubmissions,
  isImageFile, ACCEPTED_EXTENSIONS,
  type ChallengeSubmission,
} from '@/lib/challengeSubmissions';

const TOOL_STYLES: Record<WeeklyChallenge['tool'], string> = {
  ChatGPT: 'bg-primary/10 text-primary',
  Gemini: 'bg-accent/10 text-accent',
  Ambos: 'bg-muted text-muted-foreground',
};

const STATUS_CONFIG = {
  pending:  { label: 'Pendiente de revisión', icon: Clock,        color: 'text-amber-600 bg-amber-50 border-amber-200' },
  approved: { label: 'Aprobado',              icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  rejected: { label: 'Rechazado',             icon: XCircle,      color: 'text-red-600 bg-red-50 border-red-200' },
};

export default function Challenges() {
  const { user, loading, addPoints, addBadge } = useUser();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [confirmChallenge, setConfirmChallenge] = useState<WeeklyChallenge | null>(null);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<ChallengeSubmission[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);

  useEffect(() => {
    if (!user) return;
    setLoadingSubmissions(true);
    getUserSubmissions(user.id)
      .then(setSubmissions)
      .catch(() => {})
      .finally(() => setLoadingSubmissions(false));
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) { navigate('/'); return null; }

  const getSubmission = (challengeId: string) =>
    submissions.find((s) => s.challenge_id === challengeId);

  const weeks = [...new Set(weeklyChallenges.map(c => c.week))].sort((a, b) => a - b);
  const approvedCount = submissions.filter((s) => s.status === 'approved').length;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast.error('El archivo no puede superar 10 MB');
      return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleOpenDialog = (challenge: WeeklyChallenge) => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setConfirmChallenge(challenge);
  };

  const handleCloseDialog = () => {
    setConfirmChallenge(null);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleSubmit = async () => {
    if (!confirmChallenge || !selectedFile) return;
    setUploading(true);
    try {
      const imageUrl = await uploadChallengeFile(selectedFile, user.id, confirmChallenge.id);
      await submitChallenge(user.id, confirmChallenge.id, imageUrl);

      // Badge al primer envío
      if (submissions.length === 0) {
        await addBadge('challenger');
      }

      // Recargar submissions
      const updated = await getUserSubmissions(user.id);
      setSubmissions(updated);

      toast.success('¡Evidencia enviada! Tu reto está pendiente de revisión por el administrador.');
      handleCloseDialog();
    } catch (err) {
      toast.error('Error al enviar. Inténtalo de nuevo.');
    } finally {
      setUploading(false);
    }
  };

  // Llamado desde AdminPanel al aprobar — aquí los puntos se suman en tiempo real via Supabase Realtime
  // Si el usuario está en la página, los puntos ya llegarán. Este efecto lo maneja UserContext.

  return (
    <div className="min-h-screen bg-background">
      <header className="gradient-hero py-4">
        <div className="container max-w-4xl mx-auto px-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-primary-foreground" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-display font-bold text-primary-foreground">🎯 Retos Semanales</h1>
          <div className="ml-auto bg-white rounded-lg px-2 py-1 shadow-sm">
            <img src="/meiji-logo.svg" alt="Meiji" className="h-6 w-auto" />
          </div>
        </div>
      </header>

      <div className="container max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Banner informativo */}
        <div className="bg-card rounded-xl p-6 shadow-card text-center">
          <Target className="w-8 h-8 text-primary mx-auto mb-2" />
          <h2 className="font-display font-bold text-xl text-card-foreground">Retos para tu equipo</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Completa retos semanales, sube una captura como evidencia y espera la aprobación del administrador
          </p>
          {approvedCount > 0 && (
            <p className="text-sm font-medium text-primary mt-3 flex items-center justify-center gap-1">
              <Flame className="w-4 h-4" />
              {approvedCount} {approvedCount === 1 ? 'reto aprobado' : 'retos aprobados'}
            </p>
          )}
        </div>

        {/* Lista de retos por semana */}
        {loadingSubmissions ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          weeks.map(week => (
            <div key={week}>
              <h3 className="font-display font-semibold text-lg text-foreground mb-3">Semana {week}</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {weeklyChallenges.filter(c => c.week === week).map((c, i) => {
                  const sub = getSubmission(c.id);
                  const statusCfg = sub ? STATUS_CONFIG[sub.status] : null;
                  const StatusIcon = statusCfg?.icon;

                  return (
                    <motion.div
                      key={c.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className={`bg-card rounded-xl p-5 shadow-card flex flex-col gap-3 ${sub ? 'opacity-90' : ''}`}
                    >
                      <div className="flex items-start justify-between">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${TOOL_STYLES[c.tool]}`}>
                          {c.tool}
                        </span>
                        <span className="flex items-center gap-1 text-sm font-medium text-accent">
                          <Star className="w-3 h-3" /> +{c.points}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-display font-bold text-card-foreground mb-1">{c.title}</h4>
                        <p className="text-sm text-muted-foreground">{c.description}</p>
                      </div>

                      {sub && statusCfg && StatusIcon ? (
                        <div className={`flex flex-col gap-1.5 mt-auto`}>
                          <div className={`flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg border ${statusCfg.color}`}>
                            <StatusIcon className="w-3.5 h-3.5 shrink-0" />
                            {statusCfg.label}
                          </div>
                          {sub.admin_comment && (
                            <p className="text-xs text-muted-foreground italic px-1">
                              "{sub.admin_comment}"
                            </p>
                          )}
                          {sub.status === 'rejected' && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-xs mt-1"
                              onClick={() => handleOpenDialog(c)}
                            >
                              Volver a enviar
                            </Button>
                          )}
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          className="mt-auto gradient-primary text-primary-foreground"
                          onClick={() => handleOpenDialog(c)}
                        >
                          <Upload className="w-3.5 h-3.5 mr-1.5" />
                          Participar
                        </Button>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Dialog de envío con imagen */}
      <Dialog open={!!confirmChallenge} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Enviar evidencia del reto</DialogTitle>
            <DialogDescription>
              Sube una captura de pantalla que demuestre que completaste
              <strong> "{confirmChallenge?.title}"</strong>.
              Un administrador revisará tu envío y aprobará los{' '}
              <strong>+{confirmChallenge?.points} puntos</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Área de subida */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors
                ${selectedFile ? 'border-primary/40 bg-primary/5' : 'border-border hover:border-primary/40 hover:bg-muted/30'}`}
            >
              {selectedFile && previewUrl && isImageFile(selectedFile) ? (
                <img
                  src={previewUrl}
                  alt="Vista previa"
                  className="max-h-48 mx-auto rounded-lg object-contain"
                />
              ) : selectedFile ? (
                <div className="flex flex-col items-center gap-2 text-primary">
                  <FileText className="w-12 h-12 opacity-70" />
                  <p className="text-sm font-semibold">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(selectedFile.size / 1024).toFixed(0)} KB
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <div className="flex gap-3 justify-center mb-1">
                    <ImageIcon className="w-8 h-8 opacity-40" />
                    <FileText className="w-8 h-8 opacity-40" />
                  </div>
                  <p className="text-sm font-medium">Haz clic para adjuntar evidencia</p>
                  <p className="text-xs opacity-60">
                    Imágenes (PNG, JPG) · Documentos (PDF, Word, Excel, PPT) · Máx. 10 MB
                  </p>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_EXTENSIONS}
              className="hidden"
              onChange={handleFileChange}
            />
            {selectedFile && (
              <p className="text-xs text-center text-muted-foreground">
                {selectedFile.name} · {(selectedFile.size / 1024).toFixed(0)} KB —{' '}
                <button
                  className="text-primary underline"
                  onClick={(e) => { e.stopPropagation(); setSelectedFile(null); setPreviewUrl(null); }}
                >
                  Cambiar
                </button>
              </p>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={handleCloseDialog} disabled={uploading}>
              Cancelar
            </Button>
            <Button
              className="gradient-primary text-primary-foreground"
              onClick={handleSubmit}
              disabled={!selectedFile || uploading}
            >
              {uploading
                ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Subiendo...</>
                : <><Upload className="w-4 h-4 mr-2" />Enviar evidencia</>
              }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
