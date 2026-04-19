import { useState } from "react";
import { createPortal } from "react-dom";
import { createFileRoute } from "@tanstack/react-router";
import { Users, X } from "lucide-react";
import { Navbar } from "@/components/museum/Navbar";
import { Footer } from "@/components/museum/Footer";
import { PROMOCIONES, type Promocion } from "@/lib/museum-data";

export const Route = createFileRoute("/promociones")({
  component: PromocionesPage,
  head: () => ({
    meta: [
      { title: "Promociones — CEIJA 19 Museo Digital" },
      { name: "description", content: "Egresados del CEIJA 19 año por año. Conocé las promociones, sus historias y a quienes formaron parte de cada una." },
      { property: "og:title", content: "Promociones del CEIJA 19" },
      { property: "og:description", content: "Cada promoción, su historia y sus egresados." },
    ],
  }),
});

function resolvePromotionDescription(promo: Promocion) {
  const raw = promo.story?.trim();

  if (!raw) {
    return `Descripción provisoria de la promoción ${promo.year}. Seguimos completando este archivo histórico.`;
  }

  const genericLabels = new Set([
    "peritos comerciales",
    "perito comerciales",
    "bachiller orientado en producción de bienes y servicios",
  ]);

  if (genericLabels.has(raw.toLowerCase())) {
    return `Promoción ${promo.year} del CEIJA 19. Estamos ampliando la descripción histórica de este año.`;
  }

  return raw;
}

function PromocionesPage() {
  const [selected, setSelected] = useState<Promocion | null>(null);

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="max-w-6xl mx-auto px-5 sm:px-8 pt-16 sm:pt-24 pb-10">
          <p className="text-xs uppercase tracking-[0.25em] text-sepia-deep mb-4">Egresados</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-foreground tracking-tight">
            Promociones
          </h1>
          <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Cada promoción es un capítulo. Tocá una tarjeta para ver la historia de ese año
            y la lista completa de egresados.
          </p>
        </section>

        <section className="max-w-6xl mx-auto px-5 sm:px-8 pb-20">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PROMOCIONES.map((promo, i) => (
              <button
                key={promo.id}
                onClick={() => setSelected(promo)}
                className="group text-left rounded-lg overflow-hidden bg-card border border-border hover:border-accent hover:shadow-lg transition-all active:scale-[0.99]"
                style={{ animation: `fade-up 600ms cubic-bezier(0.16, 1, 0.3, 1) both`, animationDelay: `${i * 60}ms` }}
              >
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  <img
                    src={promo.imageUrl}
                    alt={promo.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 sepia-[0.25]"
                  />
                </div>
                <div className="p-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-sepia-deep">Promoción</p>
                  <h2 className="font-serif text-2xl font-semibold text-foreground mt-1">{promo.year}</h2>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed line-clamp-2">
                    {resolvePromotionDescription(promo)}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground inline-flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    {promo.graduates.length} egresados
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>
      </main>
      <Footer />

      {/* Modal */}
      {selected && typeof document !== "undefined" && createPortal(
        <div
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6 bg-foreground/60 animate-fade-in"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto bg-background rounded-t-2xl sm:rounded-lg shadow-2xl animate-fade-up"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-background/90 border border-border flex items-center justify-center text-foreground hover:bg-secondary transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="aspect-[16/9] sm:aspect-[2/1] overflow-hidden bg-muted">
              <img
                src={selected.imageUrl}
                alt={selected.title}
                className="w-full h-full object-cover sepia-[0.25]"
              />
            </div>
            <div className="p-6 sm:p-8">
              <p className="text-xs uppercase tracking-[0.25em] text-sepia-deep">Promoción</p>
              <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground mt-1">
                {selected.year}
              </h2>
              <p className="mt-5 text-sm sm:text-base text-foreground leading-relaxed">
                {resolvePromotionDescription(selected)}
              </p>

              <div className="mt-8">
                <h3 className="font-serif text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Users className="w-4 h-4 text-sepia-deep" />
                  Egresados ({selected.graduates.length})
                </h3>
                <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2">
                  {selected.graduates.map((name) => (
                    <li key={name} className="text-sm text-foreground flex items-baseline gap-2">
                      <span className="text-sepia-deep">·</span>
                      {name}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
