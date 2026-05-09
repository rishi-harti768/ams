import { auth } from "@ams/auth";
import { toNextJsHandler } from "better-auth/next-js";

const handler = toNextJsHandler(auth);

export const GET = async (req: Request) => {
	const start = Date.now();
	console.log(`[AUTH] Starting GET ${new URL(req.url).pathname}`);
	const res = await handler.GET(req);
	console.log(`[AUTH] GET finished in ${Date.now() - start}ms`);
	return res;
};

export const POST = async (req: Request) => {
	const start = Date.now();
	console.log(`[AUTH] Starting POST ${new URL(req.url).pathname}`);
	const res = await handler.POST(req);
	console.log(`[AUTH] POST finished in ${Date.now() - start}ms`);
	return res;
};
