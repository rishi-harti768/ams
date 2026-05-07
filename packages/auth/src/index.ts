import { createDb } from "@ams/db";
import { account, session, user, verification } from "@ams/db/schema/auth";
import { env } from "@ams/env/server";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins/admin";

export function createAuth() {
	const db = createDb();

	return betterAuth({
		database: drizzleAdapter(db, {
			provider: "pg",

			schema: {
				user,
				session,
				account,
				verification,
			},
		}),
		trustedOrigins: [env.CORS_ORIGIN],
		emailAndPassword: {
			enabled: true,
		},
		plugins: [nextCookies(), admin()],
	});
}

export const auth = createAuth();
