import { Link } from "@tanstack/react-router";
import { Landmark } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/30 mt-20">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="w-9 h-9 rounded-md bg-primary text-primary-foreground flex items-center justify-center">
              <Landmark className="w-5 h-5" />
            </span>
            <div>
              <p className="font-serif text-base font-semibold text-foreground">CEIJA 19 — Museo Digital</p>
              <p className="text-xs text-muted-foreground mt-0.5">Preservando la memoria de nuestra escuela.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <Link to="/historia" className="hover:text-foreground transition-colors">Historia</Link>
            <Link to="/promociones" className="hover:text-foreground transition-colors">Promociones</Link>
            <Link to="/galeria" className="hover:text-foreground transition-colors">Galería</Link>
            <Link to="/equipo" className="hover:text-foreground transition-colors">Equipo</Link>
            <Link to="/aportar" className="hover:text-foreground transition-colors">Aportar</Link>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-border text-xs text-muted-foreground text-center">
          © {new Date().getFullYear()} CEIJA 19. Un proyecto de memoria construido por su comunidad.
        </div>
      </div>
    </footer>
  );
}
