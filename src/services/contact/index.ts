import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Nome muito curto").max(80, "Nome muito longo"),
  email: z.string().trim().email("Email inválido").max(120),
  message: z.string().trim().min(10, "Mensagem muito curta").max(1500, "Mensagem muito longa"),
});

export type ContactInput = z.infer<typeof contactSchema>;

export type ContactResult =
  | { ok: true; provider: ContactProvider }
  | { ok: false; error: string };

export type ContactProvider = "mock" | "emailjs" | "resend" | "supabase";

/**
 * Valida os dados do formulário de contato.
 * Camada pura — fácil de testar e reutilizar.
 */
export function validateContactForm(input: unknown):
  | { ok: true; data: ContactInput }
  | { ok: false; errors: Partial<Record<keyof ContactInput, string>> } {
  const parsed = contactSchema.safeParse(input);
  if (parsed.success) return { ok: true, data: parsed.data };
  const errors: Partial<Record<keyof ContactInput, string>> = {};
  for (const issue of parsed.error.issues) {
    const k = issue.path[0] as keyof ContactInput;
    if (k && !errors[k]) errors[k] = issue.message;
  }
  return { ok: false, errors };
}

/**
 * Persiste um lead localmente (versão mock).
 * Quando o Supabase estiver conectado, substituir por insert em `public.contact_leads`.
 */
export async function saveContactLead(data: ContactInput): Promise<void> {
  if (typeof window === "undefined") return;
  const KEY = "stvx.contact.leads.v1";
  try {
    const raw = localStorage.getItem(KEY);
    const list = raw ? (JSON.parse(raw) as Array<ContactInput & { createdAt: string }>) : [];
    list.unshift({ ...data, createdAt: new Date().toISOString() });
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, 50)));
  } catch {
    /* noop */
  }
}

/**
 * Envia a mensagem.
 * Hoje opera em modo mock (sempre OK após 800ms).
 * Pontos de integração futuros:
 *   - EmailJS: emailjs.send(SERVICE_ID, TEMPLATE_ID, data, PUBLIC_KEY)
 *   - Resend: server fn -> https://api.resend.com/emails
 *   - Supabase: server fn -> insert em `contact_leads` + edge function de notificação
 */
export async function sendContactMessage(input: ContactInput): Promise<ContactResult> {
  const validated = validateContactForm(input);
  if (!validated.ok) {
    return { ok: false, error: "Dados inválidos." };
  }
  try {
    await saveContactLead(validated.data);
    await new Promise((r) => setTimeout(r, 800));
    return { ok: true, provider: "mock" };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Erro inesperado." };
  }
}
