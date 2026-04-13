/**
 * COMPONENTE NAVLINK — Wrapper de React Router NavLink
 * 
 * Extiende el NavLink de React Router para soportar props de clases
 * personalizadas cuando el enlace está activo o pendiente.
 * 
 * Props:
 * - className: clase CSS base
 * - activeClassName: clase adicional cuando la ruta está activa
 * - pendingClassName: clase adicional cuando la navegación está pendiente
 */
import { NavLink as RouterNavLink, NavLinkProps } from "react-router-dom";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface NavLinkCompatProps extends Omit<NavLinkProps, "className"> {
  className?: string;
  activeClassName?: string;
  pendingClassName?: string;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  ({ className, activeClassName, pendingClassName, to, ...props }, ref) => {
    return (
      <RouterNavLink
        ref={ref}
        to={to}
        className={({ isActive, isPending }) =>
          cn(className, isActive && activeClassName, isPending && pendingClassName)
        }
        {...props}
      />
    );
  },
);

NavLink.displayName = "NavLink";

export { NavLink };
