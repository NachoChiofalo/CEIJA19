import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Heart, Send, Loader2, CheckCircle2 } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { Navbar } from "@/components/museum/Navbar";
import { Footer } from "@/components/museum/Footer";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/aportar")({
  component: AportarPage,
  head: () => ({
    meta: [
      { title: "Aportar al museo — CEIJA 19" },
      { name: "description", content: "Sumá tu recuerdo al Museo Digital del CEIJA 19. Fotos, anécdotas y documentos de la historia de nuestra escuela." },
      { property: "og:title", content: "Aportar al Museo Digital del CEIJA 19" },
      { property: "og:description", content: "Sumá tu recuerdo, foto o anécdota al archivo histórico de la escuela." },
    ],
  }),
});

const contributionSchema = z.object({
  full_name: z.string().trim().min(2, "Ingresá tu nombre completo").max(200),
  relationship: z.string().trim().min(2, "Indicá tu vínculo con la escuela").max(200),
  contact_phone: z
    .string()
    .trim()
    .min(7, "Telefono demasiado corto")
    .max(50, "Telefono demasiado largo")
    .optional()
    .or(z.literal("")),
  story: z.string().trim().min(10, "Contanos al menos un poquito (mínimo 10 caracteres)").max(5000),
});

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || process.env.EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || process.env.EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || process.env.EMAILJS_PUBLIC_KEY;
const EMAILJS_SEND_URL = "https://api.emailjs.com/api/v1.0/email/send";

type ContributionEmailParams = {
  fullName: string;
  relationship: string;
  contactPhone: string | null;
  story: string;
  pageUrl: string;
  submittedAt: string;
};

async function sendContributionEmail(params: ContributionEmailParams) {
  if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
    throw new Error("Missing EmailJS environment variables.");
  }

  const response = await fetch(EMAILJS_SEND_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      service_id: EMAILJS_SERVICE_ID,
      template_id: EMAILJS_TEMPLATE_ID,
      user_id: EMAILJS_PUBLIC_KEY,
      template_params: {
        full_name: params.fullName,
        relationship: params.relationship,
        contact_phone: params.contactPhone || "",
        story: params.story,
        page_url: params.pageUrl,
        submitted_at: params.submittedAt,
      },
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "EmailJS request failed.");
  }
}

function AportarPage() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;

    const form = e.currentTarget;
    const formData = new FormData(form);

    const parsed = contributionSchema.safeParse({
      full_name: formData.get("full_name"),
      relationship: formData.get("relationship"),
      contact_phone: formData.get("contact_phone") || "",
      story: formData.get("story"),
    });

    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Revisá los datos del formulario");
      return;
    }

    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
      toast.error("Falta configurar EmailJS para enviar el aporte.");
      return;
    }

    setSubmitting(true);

    try {
      const contactPhone = parsed.data.contact_phone?.trim() || null;

      await sendContributionEmail({
        fullName: parsed.data.full_name,
        relationship: parsed.data.relationship,
        contactPhone,
        story: parsed.data.story,
        pageUrl: typeof window !== "undefined" ? window.location.href : "",
        submittedAt: new Date().toISOString(),
      });

      // Email enviado con éxito — mostrar estado de éxito inmediatamente
      setSuccess(true);
      form.reset();
      toast.success("¡Gracias! Tu aporte fue recibido.");

      // Guardar en Supabase de forma no-bloqueante (fallo silencioso)
      supabase.from("museum_contributions").insert({
        full_name: parsed.data.full_name,
        relationship: parsed.data.relationship,
        contact_phone: contactPhone,
        story: parsed.data.story,
      }).then(({ error }) => {
        if (error) console.warn("[Supabase] No se pudo guardar el aporte:", error.message);
      });
    } catch (err) {
      console.error(err);
      //toast.error("No pudimos enviar tu aporte. Intentá nuevamente en un momento.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="max-w-3xl mx-auto px-5 sm:px-8 pt-16 sm:pt-24 pb-10">
          <p className="text-xs uppercase tracking-[0.25em] text-sepia-deep mb-4 inline-flex items-center gap-2">
            <Heart className="w-3.5 h-3.5" />
            Sumá tu recuerdo
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-semibold text-foreground tracking-tight">
            Aportá al Museo Digital
          </h1>
          <p className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed">
            ¿Sos exalumno, familiar o parte de la comunidad del CEIJA 19? Tu memoria es
            parte de nuestra historia. Compartí una foto, una anécdota o un documento que
            ayude a preservar lo que vivimos juntos.
          </p>
        </section>

        <section className="max-w-3xl mx-auto px-5 sm:px-8 pb-20">
          {success ? (
            <div className="rounded-lg bg-card border border-border p-10 text-center animate-fade-up">
              <span className="inline-flex w-14 h-14 rounded-full bg-accent/40 items-center justify-center mb-5">
                <CheckCircle2 className="w-7 h-7 text-sepia-deep" />
              </span>
              <h2 className="font-serif text-2xl font-semibold text-foreground">
                ¡Gracias por tu aporte!
              </h2>
              <p className="mt-3 text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                Recibimos tu mensaje y lo vamos a revisar pronto. Si dejaste tu telefono, nos
                pondremos en contacto si necesitamos mas detalles.
              </p>
              <button
                onClick={() => setSuccess(false)}
                className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-md text-sm font-medium text-foreground border border-border hover:bg-secondary transition-colors"
              >
                Enviar otro aporte
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="rounded-lg bg-card border border-border p-6 sm:p-8 space-y-5">
              <div>
                <label htmlFor="full_name" className="block text-sm font-medium text-foreground mb-2">
                  Nombre completo <span className="text-destructive">*</span>
                </label>
                <input
                  id="full_name"
                  name="full_name"
                  type="text"
                  required
                  maxLength={200}
                  className="w-full rounded-md border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                  placeholder="Tu nombre y apellido"
                />
              </div>

              <div>
                <label htmlFor="relationship" className="block text-sm font-medium text-foreground mb-2">
                  Año de egreso o vínculo con la escuela <span className="text-destructive">*</span>
                </label>
                <input
                  id="relationship"
                  name="relationship"
                  type="text"
                  required
                  maxLength={200}
                  className="w-full rounded-md border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                  placeholder="Ej: Promoción 2005, docente, familiar de egresado..."
                />
              </div>

              <div>
                <label htmlFor="contact_phone" className="block text-sm font-medium text-foreground mb-2">
                  Telefono de contacto <span className="text-muted-foreground font-normal">(opcional)</span>
                </label>
                <input
                  id="contact_phone"
                  name="contact_phone"
                  type="tel"
                  inputMode="tel"
                  maxLength={50}
                  className="w-full rounded-md border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                  placeholder="Tu telefono"
                />
              </div>

              <div>
                <label htmlFor="story" className="block text-sm font-medium text-foreground mb-2">
                  Tu anécdota o aporte <span className="text-destructive">*</span>
                </label>
                <textarea
                  id="story"
                  name="story"
                  required
                  rows={6}
                  maxLength={5000}
                  className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all resize-y"
                  placeholder="Contanos lo que recordas: una historia, un nombre, un momento que valga la pena preservar..."
                />
                <p className="mt-2 text-xs text-muted-foreground">
                  Si queres compartir un archivo, pega el link dentro del texto.
                </p>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3.5 rounded-md text-sm font-medium hover:bg-primary/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Enviando…
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Enviar mi aporte
                  </>
                )}
              </button>

              <p className="text-xs text-muted-foreground text-center">
                Al enviar, aceptás que tu aporte pueda ser revisado e incorporado al archivo del museo.
              </p>
            </form>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
