import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import logo from "@/assets/ceija-logo.jpeg";

const LINKS = [
  { to: "/" as const, label: "Inicio" },
  { to: "/historia" as const, label: "Historia" },
  { to: "/promociones" as const, label: "Promociones" },
  { to: "/galeria" as const, label: "Galería" },
  { to: "/equipo" as const, label: "Equipo" },
  { to: "/aportar" as const, label: "Aportar" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-md border-b border-border">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group" onClick={() => setOpen(false)}>
          <img src={logo} alt="Logo CEIJA 19" className="w-10 h-10 rounded-full object-contain" width={40} height={40} />
          <span className="font-serif text-lg font-semibold tracking-tight text-foreground leading-none">
            CEIJA 19
            <span className="block text-[10px] tracking-[0.18em] uppercase text-muted-foreground font-sans font-medium mt-0.5">
              Museo Digital
            </span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeProps={{ className: "text-foreground bg-secondary" }}
              inactiveProps={{ className: "text-muted-foreground" }}
              className="px-3.5 py-2 rounded-md text-sm font-medium hover:text-foreground hover:bg-secondary/60 transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden p-2 rounded-md text-foreground hover:bg-secondary"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="md:hidden border-t border-border bg-background animate-fade-in">
          <div className="px-5 py-3 flex flex-col">
            {LINKS.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                activeProps={{ className: "text-foreground bg-secondary" }}
                inactiveProps={{ className: "text-muted-foreground" }}
                className="px-3 py-3 rounded-md text-sm font-medium hover:text-foreground hover:bg-secondary/60 transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
