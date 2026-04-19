import { createFileRoute, Link } from "@tanstack/react-router";
import { Camera } from "lucide-react";
import { Navbar } from "@/components/museum/Navbar";
import { Footer } from "@/components/museum/Footer";
import { GALLERY } from "@/lib/museum-data";

export const Route = createFileRoute("/galeria/")({
  component: GaleriaPage,
  head: () => ({
    meta: [
      { title: "Galería — CEIJA 19 Museo Digital" },
      { name: "description", content: "Galería audiovisual del CEIJA 19. Fotos y videos históricos del archivo de nuestra escuela." },
      { property: "og:title", content: "Galería del CEIJA 19" },
      { property: "og:description", content: "Fotos y videos históricos del archivo de nuestra escuela." },
    ],
  }),
});

function GaleriaPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="max-w-6xl mx-auto px-5 sm:px-8 pt-16 sm:pt-24 pb-10">
          <p className="text-xs uppercase tracking-[0.25em] text-sepia-deep mb-4">Archivo audiovisual</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-foreground tracking-tight">
            Galería
          </h1>
          <p className="mt-5 text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Fotografías y videos que sobrevivieron al paso del tiempo. Pasá el cursor por
            cada imagen para conocer su historia.
          </p>
        </section>

        <section className="max-w-6xl mx-auto px-5 sm:px-8 pb-20">
          {/* Masonry-like layout via CSS columns */}
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 [column-fill:_balance]">
            {GALLERY.map((item, i) => (
              <Link
                key={item.id}
                to="/galeria/$id"
                params={{ id: item.id }}
                className="group relative break-inside-avoid mb-5 rounded-lg overflow-hidden bg-card border border-border hover:shadow-lg hover:border-primary/50 transition-all block"
                style={{ animation: `fade-up 600ms cubic-bezier(0.16, 1, 0.3, 1) both`, animationDelay: `${i * 50}ms` }}
              >
                <img
                  src={item.src}
                  alt={item.caption}
                  loading="lazy"
                  className="w-full h-auto object-cover transition-all duration-500 group-hover:scale-105"
                />
                {/* Overlay */}
                <figcaption className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                  <div className="flex items-center gap-2 text-cream/90 text-xs uppercase tracking-[0.2em] mb-2">
                    <Camera className="w-3.5 h-3.5" />
                    {item.year && <span>{item.year}</span>}
                  </div>
                  <p className="text-cream font-serif text-base font-medium leading-snug">
                    {item.caption}
                  </p>
                  <span className="text-cream/80 text-xs mt-2">Ver más →</span>
                </figcaption>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
