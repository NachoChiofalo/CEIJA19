import { Outlet, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";

import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: "CEIJA 19 — Museo Digital" },
      { name: "description", content: "Museo Digital del CEIJA 19. Preservamos la historia, las promociones y la memoria viva de nuestra escuela." },
      { name: "author", content: "CEIJA 19" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFound,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <HeadContent />
      </head>
      <body className="paper-grain">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <>
      <div className="animate-page-enter min-h-screen flex flex-col">
        <Outlet />
      </div>
      <Toaster position="top-center" />
    </>
  );
}

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground mb-4">Error 404</p>
      <h1 className="font-serif text-4xl font-semibold text-foreground">Página no encontrada</h1>
      <p className="text-muted-foreground mt-3 max-w-md">
        Esta página no existe en nuestro archivo. Volvé al inicio para seguir explorando el museo.
      </p>
      <a href="/" className="mt-8 inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
        Volver al inicio
      </a>
    </div>
  );
}
