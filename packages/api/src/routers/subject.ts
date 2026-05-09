import { db } from "@ams/db";
import { semester, subject } from "@ams/db/schema/ams";
import { ORPCError } from "@orpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { o, protectedProcedure } from "../index";

export const subjectRouter = o.router({
	subjectList: protectedProcedure
		.input(z.object({ semesterId: z.string().uuid() }))
		.handler(async ({ input, context }) => {
			const userId = context.session.user.id;

			// Verify semester exists
			const sem = await db.query.semester.findFirst({
				where: eq(semester.id, input.semesterId),
			});

			if (!sem) {
				throw new ORPCError("NOT_FOUND", {
					message: "Semester not found",
				});
			}

			const subjects = await db.query.subject.findMany({
				where: eq(subject.semesterId, input.semesterId),
				with: {
					scores: {
						where: (score, { eq }) => eq(score.userId, userId),
					},
				},
			});
			return subjects;
		}),
});
