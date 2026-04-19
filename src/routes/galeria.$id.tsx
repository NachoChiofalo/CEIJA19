import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Camera, Calendar, MapPin, User, Users, Tag } from "lucide-react";
import { Navbar } from "@/components/museum/Navbar";
import { Footer } from "@/components/museum/Footer";
import { GALLERY } from "@/lib/museum-data";

export const Route = createFileRoute("/galeria/$id")({
  loader: ({ params }) => {
    const item = GALLERY.find((g) => g.id === params.id);
    if (!item) throw notFound();
    const idx = GALLERY.findIndex((g) => g.id === params.id);
    const prev = GALLERY[idx - 1];
    const next = GALLERY[idx + 1];
    return { item, prev, next };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.item.caption} — Galería CEIJA 19` },
          { name: "description", content: `${loaderData.item.caption}${loaderData.item.year ? ` (${loaderData.item.year})` : ""}. Archivo del Museo Digital del CEIJA 19.` },
          { property: "og:title", content: loaderData.item.caption },
          { property: "og:description", content: `Archivo del Museo Digital del CEIJA 19${loaderData.item.year ? ` — ${loaderData.item.year}` : ""}.` },
          { property: "og:image", content: loaderData.item.src },
          { name: "twitter:image", content: loaderData.item.src },
        ]
      : [{ title: "Imagen — Galería CEIJA 19" }],
  }),
  notFoundComponent: () => (
    <>
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto px-5 sm:px-8 py-24 text-center">
        <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-4">No encontrada</p>
        <h1 className="font-serif text-3xl font-semibold text-foreground">Esta imagen no existe en el archivo</h1>
        <Link to="/galeria" className="mt-8 inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Volver a la galería
        </Link>
      </main>
      <Footer />
    </>
  ),
  errorComponent: ({ error }) => (
    <>
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto px-5 sm:px-8 py-24 text-center">
        <h1 className="font-serif text-3xl font-semibold text-foreground">Algo salió mal</h1>
        <p className="text-muted-foreground mt-3">{error.message}</p>
      </main>
      <Footer />
    </>
  ),
  component: GalleryDetailPage,
});

function GalleryDetailPage() {
  const { item, prev, next } = Route.useLoaderData();

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="max-w-5xl mx-auto px-5 sm:px-8 pt-10 sm:pt-14">
          <Link
            to="/galeria"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a la galería
          </Link>
        </section>

        <section className="max-w-5xl mx-auto px-5 sm:px-8 pt-8 pb-16">
          <figure className="rounded-xl overflow-hidden bg-card border border-border shadow-sm">
            <img
              src={item.src}
              alt={item.caption}
              className="w-full h-auto object-contain max-h-[70vh] bg-secondary/30"
            />
          </figure>

          <div className="mt-8 grid lg:grid-cols-[1fr_300px] gap-10 items-start">
            <div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs uppercase tracking-[0.22em] text-primary mb-3">
                <span className="inline-flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5" />
                  Archivo
                </span>
                {item.year && (
                  <>
                    <span className="text-border">•</span>
                    <span className="inline-flex items-center gap-1.5 text-muted-foreground normal-case tracking-normal">
                      <Calendar className="w-3.5 h-3.5" />
                      {item.year}
                    </span>
                  </>
                )}
                {item.location && (
                  <>
                    <span className="text-border">•</span>
                    <span className="inline-flex items-center gap-1.5 text-muted-foreground normal-case tracking-normal">
                      <MapPin className="w-3.5 h-3.5" />
                      {item.location}
                    </span>
                  </>
                )}
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-foreground tracking-tight">
                {item.caption}
              </h1>

              {item.story ? (
                <div className="mt-6 prose prose-neutral max-w-none">
                  <p className="text-base text-foreground/85 leading-relaxed whitespace-pre-line">
                    {item.story}
                  </p>
                </div>
              ) : (
                <p className="mt-5 text-base text-muted-foreground leading-relaxed max-w-2xl">
                  Esta imagen forma parte del archivo audiovisual del CEIJA 19.
                </p>
              )}

              {item.tags && item.tags.length > 0 && (
                <div className="mt-6 flex flex-wrap items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-muted-foreground" />
                  {item.tags.map((t) => (
                    <span
                      key={t}
                      className="text-xs px-2.5 py-1 rounded-full bg-secondary text-secondary-foreground border border-border"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-8 p-5 rounded-lg bg-secondary/40 border border-border">
                <p className="text-sm text-foreground/80 leading-relaxed">
                  ¿Reconocés a alguien, recordás el momento o tenés más información sobre esta foto?
                  Sumá tu testimonio al archivo del museo.
                </p>
                <Link
                  to="/aportar"
                  className="mt-4 inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Aportar información
                </Link>
              </div>
            </div>

            {/* Sidebar with metadata */}
            <aside className="lg:sticky lg:top-24 space-y-5">
              {item.people && item.people.length > 0 && (
                <div className="rounded-lg border border-border bg-card p-5">
                  <h2 className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary mb-3">
                    <Users className="w-3.5 h-3.5" />
                    Quiénes aparecen
                  </h2>
                  <ul className="space-y-1.5">
                    {item.people.map((p) => (
                      <li key={p} className="text-sm text-foreground/85">{p}</li>
                    ))}
                  </ul>
                </div>
              )}

              {item.photographer && (
                <div className="rounded-lg border border-border bg-card p-5">
                  <h2 className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary mb-3">
                    <User className="w-3.5 h-3.5" />
                    Autoría / Procedencia
                  </h2>
                  <p className="text-sm text-foreground/85">{item.photographer}</p>
                </div>
              )}

              <div className="rounded-lg border border-border bg-card p-5">
                <h2 className="text-xs uppercase tracking-[0.2em] text-primary mb-3">Ficha</h2>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted-foreground">Tipo</dt>
                    <dd className="text-foreground/85 capitalize">{item.type}</dd>
                  </div>
                  {item.year && (
                    <div className="flex justify-between gap-3">
                      <dt className="text-muted-foreground">Año</dt>
                      <dd className="text-foreground/85">{item.year}</dd>
                    </div>
                  )}
                  {item.location && (
                    <div className="flex justify-between gap-3">
                      <dt className="text-muted-foreground">Ubicación</dt>
                      <dd className="text-foreground/85 text-right">{item.location}</dd>
                    </div>
                  )}
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted-foreground">ID archivo</dt>
                    <dd className="text-foreground/85 font-mono text-xs">{item.id}</dd>
                  </div>
                </dl>
              </div>
            </aside>
          </div>

          {/* Prev / next */}
          <nav className="mt-14 pt-8 border-t border-border flex items-center justify-between gap-4">
            {prev ? (
              <Link
                to="/galeria/$id"
                params={{ id: prev.id }}
                className="group flex items-center gap-3 text-left flex-1 min-w-0"
              >
                <img src={prev.src} alt="" className="w-14 h-14 object-cover rounded-md border border-border" />
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Anterior</p>
                  <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                    {prev.caption}
                  </p>
                </div>
              </Link>
            ) : <span />}
            {next ? (
              <Link
                to="/galeria/$id"
                params={{ id: next.id }}
                className="group flex items-center gap-3 text-right flex-1 min-w-0 justify-end"
              >
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Siguiente</p>
                  <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                    {next.caption}
                  </p>
                </div>
                <img src={next.src} alt="" className="w-14 h-14 object-cover rounded-md border border-border" />
              </Link>
            ) : <span />}
          </nav>
        </section>
      </main>
      <Footer />
    </>
  );
}
