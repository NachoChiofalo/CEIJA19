import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Calendar, Camera, Users, Heart } from "lucide-react";
import { Navbar } from "@/components/museum/Navbar";
import { Footer } from "@/components/museum/Footer";
import heroImg from "@/assets/main-image.png";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "CEIJA 19 — Museo Digital | Inicio" },
      { name: "description", content: "Bienvenidos al Museo Digital del CEIJA 19. Un espacio para preservar y compartir la historia, las promociones y la memoria de nuestra escuela." },
      { property: "og:title", content: "CEIJA 19 — Museo Digital" },
      { property: "og:description", content: "Preservamos la historia, las promociones y la memoria viva del CEIJA 19." },
    ],
  }),
});

function HomePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={heroImg}
              alt="Edificio histórico del CEIJA 19"
              className="w-full h-full object-cover animate-slow-zoom"
              width={1920}
              height={1080}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/55 to-background" />
          </div>
          <div className="relative max-w-4xl mx-auto px-5 sm:px-8 py-28 sm:py-40 text-center">
            <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-sepia-deep mb-5 sm:mb-6 animate-fade-in">
              Desde 1976
            </p>
            <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-semibold text-foreground leading-[1.05] tracking-tight animate-fade-up">
              Museo Digital
              <br />
              <span className="italic font-normal">del CEIJA 19</span>
            </h1>
            <p className="mt-7 sm:mt-8 text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-fade-up" style={{ animationDelay: "150ms" }}>
              Un espacio para preservar la memoria viva de nuestra escuela. Cada promoción,
              cada docente, cada fotografía guarda una parte de quienes fuimos y somos.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 animate-fade-up" style={{ animationDelay: "300ms" }}>
              <Link
                to="/aportar"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-3.5 rounded-md text-sm font-medium hover:bg-primary/90 transition-all"
              >
                Aportar al museo
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/historia"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md text-sm font-medium text-foreground border border-border hover:bg-secondary transition-all"
              >
                Explorar la historia
              </Link>
            </div>
          </div>
        </section>

        {/* Sections preview */}
        <section className="max-w-6xl mx-auto px-5 sm:px-8 py-20 sm:py-28">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-xs uppercase tracking-[0.25em] text-sepia-deep mb-3">El archivo</p>
            <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground">
              Cuatro caminos para recorrer la memoria
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { to: "/historia", icon: Calendar, title: "Historia", desc: "Hitos clave desde la fundación hasta hoy." },
              { to: "/promociones", icon: Users, title: "Promociones", desc: "Egresados año por año, con sus nombres y anécdotas." },
              { to: "/galeria", icon: Camera, title: "Galería", desc: "Fotos y videos del archivo de la escuela." },
              { to: "/equipo", icon: Heart, title: "Equipo", desc: "Las personas que sostienen la institución hoy." },
            ].map(({ to, icon: Icon, title, desc }) => (
              <Link
                key={to}
                to={to as any}
                className="group p-6 rounded-lg bg-card border border-border hover:border-accent hover:shadow-md transition-all"
              >
                <span className="w-10 h-10 rounded-md bg-accent/40 text-sepia-deep flex items-center justify-center mb-5 group-hover:bg-accent transition-colors">
                  <Icon className="w-5 h-5" />
                </span>
                <h3 className="font-serif text-xl font-semibold text-foreground">{title}</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{desc}</p>
                <span className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-foreground">
                  Ver
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Quote / mission */}
        <section className="bg-secondary/40 border-y border-border">
          <div className="max-w-3xl mx-auto px-5 sm:px-8 py-20 text-center">
            <p className="font-serif text-2xl sm:text-3xl font-medium text-foreground italic leading-relaxed">
              «Una escuela también se construye con sus recuerdos. Este museo es un lugar
              para que esa memoria no se pierda.»
            </p>
            <p className="mt-6 text-sm text-muted-foreground">— Comunidad del CEIJA 19</p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
