import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Nome muito curto").max(80, "Nome muito longo"),
  email: z.string().trim().email("Email inválido").max(120),
  message: z.string().trim().min(10, "Mensagem muito curta").max(1500, "Mensagem muito longa"),
});

export type ContactInput = z.infer<typeof contactSchema>;

export type ContactResult =
  | { ok: true; provider: "supabase" }
  | { ok: false; error: string };

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
 * Persiste o lead direto no Supabase (tabela public.contact_leads) via server fn pública.
 */
export async function sendContactMessage(input: ContactInput): Promise<ContactResult> {
  const validated = validateContactForm(input);
  if (!validated.ok) return { ok: false, error: "Dados inválidos." };
  try {
    const { submitContact } = await import("@/lib/portfolio.functions");
    await submitContact({ data: validated.data });
    return { ok: true, provider: "supabase" };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Erro inesperado." };
  }
}
