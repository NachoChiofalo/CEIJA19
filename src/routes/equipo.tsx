import { createFileRoute } from "@tanstack/react-router";
import { User } from "lucide-react";
import { Navbar } from "@/components/museum/Navbar";
import { Footer } from "@/components/museum/Footer";
import { TEAM } from "@/lib/museum-data";

export const Route = createFileRoute("/equipo")({
  component: EquipoPage,
  head: () => ({
    meta: [
      { title: "Equipo — CEIJA 19 Museo Digital" },
      { name: "description", content: "Conocé al equipo directivo y docente del CEIJA 19, las personas que sostienen la institución día a día." },
      { property: "og:title", content: "Equipo del CEIJA 19" },
      { property: "og:description", content: "Equipo directivo y docente del CEIJA 19." },
    ],
  }),
});

function getInitials(name: string) {
  return name
    .replace(/^Prof\.\s*/, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function EquipoPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="max-w-6xl mx-auto px-5 sm:px-8 pt-16 sm:pt-24 pb-10">
          <p className="text-xs uppercase tracking-[0.25em] text-sepia-deep mb-4">Comunidad educativa</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-foreground tracking-tight">
            El equipo del CEIJA
          </h1>
          <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Las personas que hoy sostienen la escuela. Directivos y docentes que cada día
            acompañan el aprendizaje de nuestros alumnos.
          </p>
        </section>

        <section className="max-w-6xl mx-auto px-5 sm:px-8 pb-20">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TEAM.map((member, i) => (
              <div
                key={member.id}
                className="text-center p-6 rounded-lg bg-card border border-border hover:border-accent hover:shadow-md transition-all"
                style={{ animation: `fade-up 600ms cubic-bezier(0.16, 1, 0.3, 1) both`, animationDelay: `${i * 60}ms` }}
              >
                <div className="w-20 h-20 mx-auto rounded-full bg-accent/40 flex items-center justify-center mb-4 ring-4 ring-secondary">
                  {member.imageUrl ? (
                    <img
                      src={member.imageUrl}
                      alt={member.name}
                      className="w-full h-full rounded-full object-cover sepia-[0.2]"
                      loading="lazy"
                    />
                  ) : (
                    <span className="font-serif text-xl font-semibold text-sepia-deep">
                      {getInitials(member.name)}
                    </span>
                  )}
                </div>
                <h2 className="font-serif text-base font-semibold text-foreground leading-tight">
                  {member.name}
                </h2>
                <p className="mt-1.5 text-xs uppercase tracking-[0.15em] text-muted-foreground inline-flex items-center gap-1.5">
                  <User className="w-3 h-3" />
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
