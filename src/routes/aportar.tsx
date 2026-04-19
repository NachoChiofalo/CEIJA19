import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Heart, Send, Paperclip, Loader2, CheckCircle2 } from "lucide-react";
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
  contact_email: z
    .string()
    .trim()
    .email("Email inválido")
    .max(320)
    .optional()
    .or(z.literal("")),
  story: z.string().trim().min(10, "Contanos al menos un poquito (mínimo 10 caracteres)").max(5000),
});

function AportarPage() {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submitting) return;

    const form = e.currentTarget;
    const formData = new FormData(form);

    const parsed = contributionSchema.safeParse({
      full_name: formData.get("full_name"),
      relationship: formData.get("relationship"),
      contact_email: formData.get("contact_email") || "",
      story: formData.get("story"),
    });

    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Revisá los datos del formulario");
      return;
    }

    setSubmitting(true);

    try {
      // Note: file attachments are noted in the message for now (no storage bucket configured).
      const file = formData.get("attachment") as File | null;
      const attachmentNote = file && file.size > 0
        ? `[Adjunto pendiente de subir: ${file.name} — ${(file.size / 1024).toFixed(1)} KB]`
        : null;

      const { error } = await supabase.from("museum_contributions").insert({
        full_name: parsed.data.full_name,
        relationship: parsed.data.relationship,
        contact_email: parsed.data.contact_email || null,
        attachment_url: attachmentNote,
        story: parsed.data.story,
      });

      if (error) throw error;

      setSuccess(true);
      form.reset();
      setFileName(null);
      toast.success("¡Gracias! Tu aporte fue recibido.");
    } catch (err) {
      console.error(err);
      toast.error("No pudimos enviar tu aporte. Intentá nuevamente en un momento.");
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
                Recibimos tu mensaje y lo vamos a revisar pronto. Si dejaste tu email, nos
                pondremos en contacto si necesitamos más detalles.
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
                <label htmlFor="contact_email" className="block text-sm font-medium text-foreground mb-2">
                  Email de contacto <span className="text-muted-foreground font-normal">(opcional)</span>
                </label>
                <input
                  id="contact_email"
                  name="contact_email"
                  type="email"
                  maxLength={320}
                  className="w-full rounded-md border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                  placeholder="tunombre@email.com"
                />
              </div>

              <div>
                <label htmlFor="attachment" className="block text-sm font-medium text-foreground mb-2">
                  Archivo adjunto <span className="text-muted-foreground font-normal">(foto o documento, opcional)</span>
                </label>
                <label
                  htmlFor="attachment"
                  className="flex items-center gap-3 px-4 py-3 rounded-md border-2 border-dashed border-border hover:border-accent hover:bg-secondary/40 cursor-pointer transition-all"
                >
                  <Paperclip className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {fileName || "Elegí un archivo (JPG, PNG, PDF...)"}
                  </span>
                </label>
                <input
                  id="attachment"
                  name="attachment"
                  type="file"
                  accept="image/*,application/pdf"
                  className="sr-only"
                  onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
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
                  placeholder="Contanos lo que recordás: una historia, un nombre, un momento que valga la pena preservar..."
                />
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
