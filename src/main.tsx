/**
 * PUNTO DE ENTRADA DE LA APLICACIÓN
 * 
 * Este archivo monta el componente raíz <App /> en el elemento HTML con id="root".
 * También importa los estilos globales (index.css).
 * 
 * No suele necesitar cambios a menos que añadas providers globales.
 */
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Aplicar tema guardado antes del primer render (evita flash)
const saved = localStorage.getItem("ia-challenge-theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
if (saved === "dark" || (!saved && prefersDark)) {
  document.documentElement.classList.add("dark");
}

createRoot(document.getElementById("root")!).render(<App />);
