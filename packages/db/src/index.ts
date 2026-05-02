import { env } from "@ams/env/server";
import { drizzle } from "drizzle-orm/node-postgres";

import {
	academicProfile,
	academicProfileRelations,
	score,
	scoreRelations,
	semester,
	semesterRelations,
	subject,
	subjectRelations,
} from "./schema/ams";
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
			academicProfile,
			academicProfileRelations,
			score,
			scoreRelations,
			semester,
			semesterRelations,
			subject,
			subjectRelations,
			account,
			accountRelations,
			session,
			sessionRelations,
			user,
			userRelations,
			verification,
		},
	});
}

export const db = createDb();
