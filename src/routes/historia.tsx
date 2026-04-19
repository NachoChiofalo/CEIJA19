import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Calendar } from "lucide-react";
import { Navbar } from "@/components/museum/Navbar";
import { Footer } from "@/components/museum/Footer";
import { TIMELINE } from "@/lib/museum-data";

export const Route = createFileRoute("/historia")({
  component: HistoriaPage,
  head: () => ({
    meta: [
      { title: "Historia — CEIJA 19 Museo Digital" },
      { name: "description", content: "Línea del tiempo del CEIJA 19: hitos, fundación y momentos clave en la historia de la escuela." },
      { property: "og:title", content: "Historia del CEIJA 19" },
      { property: "og:description", content: "Hitos clave en la historia de nuestra escuela, desde 1985 hasta hoy." },
    ],
  }),
});

function HistoriaPage() {
  const [selected, setSelected] = useState(0);
  const event = TIMELINE[selected];

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="max-w-6xl mx-auto px-5 sm:px-8 pt-16 sm:pt-24 pb-10">
          <p className="text-xs uppercase tracking-[0.25em] text-primary mb-4">Línea del tiempo</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-foreground tracking-tight">
            La historia del CEIJA 19
          </h1>
          <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Cada año dejó una marca. Hacé clic en un hito para leer su historia
            completa al costado.
          </p>
        </section>

        <section className="max-w-6xl mx-auto px-5 sm:px-8 pb-20 grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-10 lg:gap-14 items-start">
          {/* Timeline (clickable) */}
          <ol className="relative border-l-2 border-border ml-3">
            {TIMELINE.map((e, i) => {
              const active = i === selected;
              return (
                <li key={e.year} className="relative pl-8 pb-6 last:pb-0">
                  <span
                    className={`absolute -left-[9px] top-2 w-4 h-4 rounded-full border-2 border-background transition-all ${
                      active ? "bg-primary scale-125 shadow-[0_0_0_4px_color-mix(in_oklab,var(--color-primary)_25%,transparent)]" : "bg-accent"
                    }`}
                  />
                  <button
                    onClick={() => setSelected(i)}
                    className={`w-full text-left rounded-lg border p-4 transition-all ${
                      active
                        ? "bg-card border-primary shadow-md"
                        : "bg-card/60 border-border hover:border-primary/50 hover:bg-card"
                    }`}
                  >
                    <div className={`flex items-center gap-2 ${active ? "text-primary" : "text-muted-foreground"} mb-1`}>
                      <Calendar className="w-3.5 h-3.5" />
                      <span className="font-serif text-lg font-semibold tracking-tight">{e.year}</span>
                    </div>
                    <p className={`font-serif text-sm font-medium ${active ? "text-foreground" : "text-foreground/80"}`}>
                      {e.title}
                    </p>
                  </button>
                </li>
              );
            })}
          </ol>

          {/* Detail panel */}
          <aside className="lg:sticky lg:top-24">
            <article
              key={event.year}
              className="bg-card border border-border rounded-xl p-7 sm:p-9 shadow-sm"
              style={{ animation: "fade-up 500ms cubic-bezier(0.16, 1, 0.3, 1) both" }}
            >
              <div className="flex items-center gap-2 text-primary mb-3">
                <Calendar className="w-4 h-4" />
                <span className="text-xs uppercase tracking-[0.25em] font-medium">Hito</span>
              </div>
              <p className="font-serif text-5xl sm:text-6xl font-semibold text-primary tracking-tight leading-none">
                {event.year}
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground mt-5">
                {event.title}
              </h2>
              <p className="mt-5 text-base text-muted-foreground leading-relaxed">
                {event.description}
              </p>
              <div className="mt-7 flex items-center gap-2 text-xs text-muted-foreground">
                <span>{selected + 1} de {TIMELINE.length}</span>
                <span className="flex-1 h-px bg-border" />
                <button
                  onClick={() => setSelected((s) => Math.max(0, s - 1))}
                  disabled={selected === 0}
                  className="px-3 py-1.5 rounded-md border border-border text-xs font-medium hover:bg-secondary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Anterior
                </button>
                <button
                  onClick={() => setSelected((s) => Math.min(TIMELINE.length - 1, s + 1))}
                  disabled={selected === TIMELINE.length - 1}
                  className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Siguiente
                </button>
              </div>
            </article>
          </aside>
        </section>
      </main>
      <Footer />
    </>
  );
}
