/**
 * Lista de emails con acceso al panel de administración.
 * Modifica esta lista para añadir o quitar administradores.
 */
export const ADMIN_EMAILS = [
  "admin@meiji.es",
  "demo@meiji.es",
];

export function isAdminEmail(email: string): boolean {
  return ADMIN_EMAILS.includes(email.toLowerCase());
}
