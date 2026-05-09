import { createContext } from "@ams/api/context";
import { appRouter } from "@ams/api/routers/index";
import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { OpenAPIReferencePlugin } from "@orpc/openapi/plugins";
import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/fetch";
import { ZodToJsonSchemaConverter } from "@orpc/zod/zod4";
import type { NextRequest } from "next/server";

const rpcHandler = new RPCHandler(appRouter, {
	interceptors: [
		onError((error) => {
			console.error(error);
		}),
	],
});
const apiHandler = new OpenAPIHandler(appRouter, {
	plugins: [
		new OpenAPIReferencePlugin({
			schemaConverters: [new ZodToJsonSchemaConverter()],
		}),
	],
	interceptors: [
		onError((error) => {
			console.error(error);
		}),
	],
});

async function handleRequest(req: NextRequest) {
	const start = Date.now();
	console.log(`[RPC] Starting ${req.method} ${req.nextUrl.pathname}`);

	try {
		console.log("[RPC] Creating context...");
		const context = await createContext(req);
		console.log(`[RPC] Context created in ${Date.now() - start}ms`);

		const rpcResult = await rpcHandler.handle(req, {
			prefix: "/api/rpc",
			context,
		});
		if (rpcResult.response) {
			console.log(`[RPC] RPC handled in ${Date.now() - start}ms`);
			return rpcResult.response;
		}

		const apiResult = await apiHandler.handle(req, {
			prefix: "/api/rpc/api-reference",
			context,
		});
		if (apiResult.response) {
			console.log(`[RPC] API Reference handled in ${Date.now() - start}ms`);
			return apiResult.response;
		}

		console.log(`[RPC] Not found in ${Date.now() - start}ms`);
		return new Response("Not found", { status: 404 });
	} catch (error) {
		console.error(`[RPC] Critical error in ${Date.now() - start}ms:`, error);
		return new Response("Internal Server Error", { status: 500 });
	}
}

export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;
