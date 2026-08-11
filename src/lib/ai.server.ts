export type AiMessage = {
  role: "system" | "user" | "assistant";
  content: string | Array<Record<string, unknown>>;
};

export async function callAi(messages: AiMessage[], model = "google/gemini-2.5-flash") {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("AI is not configured");

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ model, messages }),
  });

  if (res.status === 429) throw new Error("AI is busy right now. Please try again in a minute.");
  if (res.status === 402) throw new Error("AI credits are exhausted for this workspace.");
  if (!res.ok) {
    const detail = await res.text();
    console.error("[ai] gateway error", res.status, detail);
    throw new Error("AI request failed");
  }

  const json = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  return json.choices?.[0]?.message?.content?.trim() ?? "";
}
