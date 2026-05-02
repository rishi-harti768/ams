import { env } from "@ams/env/server";
import { drizzle } from "drizzle-orm/node-postgres";

import {
	account,
	accountRelations,
	session,
	sessionRelations,
	user,
	userRelations,
	verification,
} from "./schema/auth";

export function createDb() {
	return drizzle(env.DATABASE_URL, {
		schema: {
			user,
			session,
			account,
			verification,
			userRelations,
			sessionRelations,
			accountRelations,
		},
	});
}

export const db = createDb();
