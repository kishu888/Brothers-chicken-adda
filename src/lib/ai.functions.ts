import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { callAi, type AiMessage } from "@/lib/ai.server";

const insightsInput = z.object({
  from: z.string(),
  to: z.string(),
  summary: z.record(z.string(), z.union([z.number(), z.string()])),
  categories: z.array(z.object({ name: z.string(), amount: z.number() })).max(30),
});

export const getInsights = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => insightsInput.parse(data))
  .handler(async ({ data }) => {
    const messages: AiMessage[] = [
      {
        role: "system",
        content:
          "You are a shrewd advisor to a small retail chicken shop in Bengaluru, India. Give short, concrete, rupee-denominated advice a shopkeeper can act on tomorrow. Never invent numbers that are not in the data. Reply in plain text with 4 to 6 bullet points, each one line, starting with '- '.",
      },
      {
        role: "user",
        content: `Period ${data.from} to ${data.to}. Figures: ${JSON.stringify(
          data.summary,
        )}. Expense categories: ${JSON.stringify(data.categories)}.`,
      },
    ];
    const text = await callAi(messages);
    return { text };
  });

const scanInput = z.object({
  imageDataUrl: z.string().max(8_000_000),
});

export const scanBill = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => scanInput.parse(data))
  .handler(async ({ data }) => {
    const messages: AiMessage[] = [
      {
        role: "system",
        content:
          "You read Indian supplier bills for a chicken shop. Reply with ONLY compact JSON: {\"supplier\":string|null,\"invoice_number\":string|null,\"date\":\"YYYY-MM-DD\"|null,\"gross_weight_kg\":number|null,\"tare_weight_kg\":number|null,\"net_weight_kg\":number|null,\"rate_per_kg\":number|null,\"amount\":number|null,\"notes\":string|null}. Use null when unsure. No markdown fences.",
      },
      {
        role: "user",
        content: [
          { type: "text", text: "Extract the bill details." },
          { type: "image_url", image_url: { url: data.imageDataUrl } },
        ],
      },
    ];
    const text = await callAi(messages);
    const cleaned = text.replace(/```json|```/g, "").trim();
    try {
      const parsed = JSON.parse(cleaned) as Record<string, string | number | null>;
      return { ok: true, fields: parsed, raw: cleaned };
    } catch {
      return { ok: false, fields: {} as Record<string, string | number | null>, raw: cleaned };
    }
  });
