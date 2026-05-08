import { db } from "@ams/db";
import { account, session, user, verification } from "@ams/db/schema/auth";
import { env } from "@ams/env/server";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin } from "better-auth/plugins/admin";

export function createAuth() {
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
		databaseHooks: {
			user: {
				create: {
					before: async (userValues) => {
						const users = await db.select().from(user).limit(1);
						if (users.length === 0) {
							return {
								data: {
									...userValues,
									role: "admin",
								},
							};
						}
					},
				},
			},
		},
	});
}

export const auth = createAuth();
