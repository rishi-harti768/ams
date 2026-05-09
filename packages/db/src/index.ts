import { env } from "@ams/env/server";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import {
	academicProfile,
	academicProfileRelations,
	score,
	scoreRelations,
	semester,
	semesterRelations,
	semesterTarget,
	semesterTargetRelations,
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

const schema = {
	academicProfile,
	academicProfileRelations,
	score,
	scoreRelations,
	semester,
	semesterRelations,
	semesterTarget,
	semesterTargetRelations,
	subject,
	subjectRelations,
	account,
	accountRelations,
	session,
	sessionRelations,
	user,
	userRelations,
	verification,
};

const globalForDb = global as unknown as {
	pool: pg.Pool | undefined;
};

const pool =
	globalForDb.pool ??
	new pg.Pool({
		connectionString: env.DATABASE_URL,
		max: 10, // Limit connections
	});

if (process.env.NODE_ENV !== "production") {
	globalForDb.pool = pool;
}

export const db = drizzle(pool, { schema });
