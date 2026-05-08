import { db } from "@ams/db";
import { semester } from "@ams/db/schema/ams";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { o, protectedProcedure } from "../index";

export const semesterRouter = o.router({
	semesterList: protectedProcedure
		.input(z.object({}))
		.handler(async ({ context }) => {
			const semesters = await db.query.semester.findMany({
				orderBy: [desc(semester.createdAt)],
				with: {
					targets: {
						where: (target, { eq }) =>
							eq(target.userId, context.session.user.id),
					},
				},
			});

			const now = new Date();

			return semesters.map((s) => ({
				...s,
				isActive: now >= s.startDate && now <= s.endDate,
				isLocked: now < s.startDate,
			}));
		}),

	semesterGet: protectedProcedure
		.input(z.object({ id: z.string().uuid() }))
		.handler(async ({ input, context }) => {
			const item = await db.query.semester.findFirst({
				where: eq(semester.id, input.id),
				with: {
					subjects: {
						with: {
							scores: {
								where: (score, { eq }) =>
									eq(score.userId, context.session.user.id),
							},
						},
					},
					targets: {
						where: (target, { eq }) =>
							eq(target.userId, context.session.user.id),
					},
				},
			});

			if (!item) {
				return null;
			}

			const now = new Date();

			return {
				...item,
				isActive: now >= item.startDate && now <= item.endDate,
				isLocked: now < item.startDate,
			};
		}),
});
