import { r as createServerFn, t as TSS_SERVER_FUNCTION } from "./server-CXYILzRT2.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-C821fTnm.mjs";
import { a as stringType, i as recordType, n as numberType, o as unionType, r as objectType, t as arrayType } from "../_libs/zod.mjs";
import processModule from "node:process";
//#region node_modules/.nitro/vite/services/ssr/assets/ai.functions-CqzZ1RC9.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
async function callAi(messages, model = "google/gemini-2.5-flash") {
	const key = processModule.env["LOVABLE_API_KEY"];
	if (!key) throw new Error("AI is not configured");
	const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${key}`,
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			model,
			messages
		})
	});
	if (res.status === 429) throw new Error("AI is busy right now. Please try again in a minute.");
	if (res.status === 402) throw new Error("AI credits are exhausted for this workspace.");
	if (!res.ok) {
		const detail = await res.text();
		console.error("[ai] gateway error", res.status, detail);
		throw new Error("AI request failed");
	}
	return (await res.json()).choices?.[0]?.message?.content?.trim() ?? "";
}
var insightsInput = objectType({
	from: stringType(),
	to: stringType(),
	summary: recordType(stringType(), unionType([numberType(), stringType()])),
	categories: arrayType(objectType({
		name: stringType(),
		amount: numberType()
	})).max(30)
});
var getInsights_createServerFn_handler = createServerRpc({
	id: "d969bde13fa3c120e27657fd9cef9e6d37f3a9067fad18c1554b5b554dbf35d1",
	name: "getInsights",
	filename: "src/lib/ai.functions.ts"
}, (opts) => getInsights.__executeServer(opts));
var getInsights = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => insightsInput.parse(data)).handler(getInsights_createServerFn_handler, async ({ data }) => {
	return { text: await callAi([{
		role: "system",
		content: "You are a shrewd advisor to a small retail chicken shop in Bengaluru, India. Give short, concrete, rupee-denominated advice a shopkeeper can act on tomorrow. Never invent numbers that are not in the data. Reply in plain text with 4 to 6 bullet points, each one line, starting with '- '."
	}, {
		role: "user",
		content: `Period ${data.from} to ${data.to}. Figures: ${JSON.stringify(data.summary)}. Expense categories: ${JSON.stringify(data.categories)}.`
	}]) };
});
var scanInput = objectType({ imageDataUrl: stringType().max(8e6) });
var scanBill_createServerFn_handler = createServerRpc({
	id: "2ccac917cb159d7e387f8bf9cfc6eac2253e9dc461363b9684e84ab56009fd43",
	name: "scanBill",
	filename: "src/lib/ai.functions.ts"
}, (opts) => scanBill.__executeServer(opts));
var scanBill = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => scanInput.parse(data)).handler(scanBill_createServerFn_handler, async ({ data }) => {
	const cleaned = (await callAi([{
		role: "system",
		content: "You read Indian supplier bills for a chicken shop. Reply with ONLY compact JSON: {\"supplier\":string|null,\"invoice_number\":string|null,\"date\":\"YYYY-MM-DD\"|null,\"gross_weight_kg\":number|null,\"tare_weight_kg\":number|null,\"net_weight_kg\":number|null,\"rate_per_kg\":number|null,\"amount\":number|null,\"notes\":string|null}. Use null when unsure. No markdown fences."
	}, {
		role: "user",
		content: [{
			type: "text",
			text: "Extract the bill details."
		}, {
			type: "image_url",
			image_url: { url: data.imageDataUrl }
		}]
	}])).replace(/```json|```/g, "").trim();
	try {
		return {
			ok: true,
			fields: JSON.parse(cleaned),
			raw: cleaned
		};
	} catch {
		return {
			ok: false,
			fields: {},
			raw: cleaned
		};
	}
});
//#endregion
export { getInsights_createServerFn_handler, scanBill_createServerFn_handler };
