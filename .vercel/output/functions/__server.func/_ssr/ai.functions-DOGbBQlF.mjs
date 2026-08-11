import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { O as isRedirect, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as getServerFnById, r as createServerFn, t as TSS_SERVER_FUNCTION } from "./server-CXYILzRT2.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-C821fTnm.mjs";
import { a as stringType, i as recordType, n as numberType, o as unionType, r as objectType, t as arrayType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai.functions-DOGbBQlF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
function useServerFn(serverFn) {
	const router = useRouter();
	return import_react.useCallback(async (...args) => {
		try {
			const res = await serverFn(...args);
			if (isRedirect(res)) throw res;
			return res;
		} catch (err) {
			if (isRedirect(err)) {
				err.options._fromLocation = router.stores.location.get();
				return router.navigate(router.resolveRedirect(err).options);
			}
			throw err;
		}
	}, [router, serverFn]);
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var insightsInput = objectType({
	from: stringType(),
	to: stringType(),
	summary: recordType(stringType(), unionType([numberType(), stringType()])),
	categories: arrayType(objectType({
		name: stringType(),
		amount: numberType()
	})).max(30)
});
var getInsights = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => insightsInput.parse(data)).handler(createSsrRpc("d969bde13fa3c120e27657fd9cef9e6d37f3a9067fad18c1554b5b554dbf35d1"));
var scanInput = objectType({ imageDataUrl: stringType().max(8e6) });
var scanBill = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => scanInput.parse(data)).handler(createSsrRpc("2ccac917cb159d7e387f8bf9cfc6eac2253e9dc461363b9684e84ab56009fd43"));
//#endregion
export { scanBill as n, useServerFn as r, getInsights as t };
