import { calculateGradePoint, calculateTotalPercentage } from "@ams/ams";
import { db } from "@ams/db";
import { score, subject } from "@ams/db/schema/ams";
import { ORPCError } from "@orpc/server";
import { and, eq, inArray, sql } from "drizzle-orm";
import { z } from "zod";
import { o, protectedProcedure } from "../index";

export const scoreRouter = o.router({
	scoreGet: protectedProcedure
		.input(z.object({ subjectId: z.string().uuid() }))
		.handler(async ({ input, context }) => {
			const item = await db.query.score.findFirst({
				where: and(
					eq(score.subjectId, input.subjectId),
					eq(score.userId, context.session.user.id)
				),
				with: {
					subject: {
						with: {
							semester: true,
						},
					},
				},
			});

			return item;
		}),

	scoreUpdateInternal: protectedProcedure
		.input(
			z.object({
				subjectId: z.string().uuid(),
				internalMarks: z.number().min(0).nullable(),
			})
		)
		.handler(async ({ input, context }) => {
			const sub = await db.query.subject.findFirst({
				where: eq(subject.id, input.subjectId),
			});

			if (!sub) {
				throw new ORPCError("NOT_FOUND", { message: "Subject not found" });
			}

			if (
				input.internalMarks !== null &&
				input.internalMarks > sub.maxInternalMarks
			) {
				throw new ORPCError("BAD_REQUEST", {
					message: `Internal marks cannot exceed ${sub.maxInternalMarks}`,
				});
			}

			const currentScore = await db.query.score.findFirst({
				where: and(
					eq(score.subjectId, input.subjectId),
					eq(score.userId, context.session.user.id)
				),
			});

			const endsemMarks = currentScore?.endsemMarks
				? Number(currentScore.endsemMarks)
				: null;

			const percentage = calculateTotalPercentage(
				input.internalMarks,
				endsemMarks,
				sub.maxInternalMarks,
				sub.maxEndsemMarks
			);

			const gradePoint =
				percentage === null ? null : calculateGradePoint(percentage);

			const [updatedScore] = await db
				.insert(score)
				.values({
					userId: context.session.user.id,
					subjectId: input.subjectId,
					internalMarks: input.internalMarks?.toString(),
					gradePoint: gradePoint?.toString(),
				})
				.onConflictDoUpdate({
					target: [score.userId, score.subjectId],
					set: {
						internalMarks: input.internalMarks?.toString(),
						gradePoint: gradePoint?.toString(),
					},
				})
				.returning();

			return updatedScore;
		}),

	scoreUpdateEndsem: protectedProcedure
		.input(
			z.object({
				subjectId: z.string().uuid(),
				endsemMarks: z.number().min(0).nullable(),
			})
		)
		.handler(async ({ input, context }) => {
			const sub = await db.query.subject.findFirst({
				where: eq(subject.id, input.subjectId),
			});

			if (!sub) {
				throw new ORPCError("NOT_FOUND", { message: "Subject not found" });
			}

			if (
				input.endsemMarks !== null &&
				input.endsemMarks > sub.maxEndsemMarks
			) {
				throw new ORPCError("BAD_REQUEST", {
					message: `End-sem marks cannot exceed ${sub.maxEndsemMarks}`,
				});
			}

			const currentScore = await db.query.score.findFirst({
				where: and(
					eq(score.subjectId, input.subjectId),
					eq(score.userId, context.session.user.id)
				),
			});

			const internalMarks = currentScore?.internalMarks
				? Number(currentScore.internalMarks)
				: null;

			const percentage = calculateTotalPercentage(
				internalMarks,
				input.endsemMarks,
				sub.maxInternalMarks,
				sub.maxEndsemMarks
			);

			const gradePoint =
				percentage === null ? null : calculateGradePoint(percentage);

			const [updatedScore] = await db
				.insert(score)
				.values({
					userId: context.session.user.id,
					subjectId: input.subjectId,
					endsemMarks: input.endsemMarks?.toString(),
					gradePoint: gradePoint?.toString(),
				})
				.onConflictDoUpdate({
					target: [score.userId, score.subjectId],
					set: {
						endsemMarks: input.endsemMarks?.toString(),
						gradePoint: gradePoint?.toString(),
					},
				})
				.returning();

			return updatedScore;
		}),

	scoreUpdateBatch: protectedProcedure
		.input(
			z.array(
				z.object({
					subjectId: z.string().uuid(),
					internalMarks: z.number().min(0).nullable(),
					endsemMarks: z.number().min(0).nullable(),
				})
			)
		)
		.handler(async ({ input, context }) => {
			if (input.length === 0) {
				return [];
			}

			// Fetch all relevant subjects using core API
			const subjectIds = input.map((i) => i.subjectId);
			const subjects = await db
				.select()
				.from(subject)
				.where(inArray(subject.id, subjectIds));

			const subjectMap = new Map(subjects.map((s) => [s.id, s]));

			const valuesToUpsert = input
				.map((item) => {
					const sub = subjectMap.get(item.subjectId);
					if (!sub) {
						return null;
					}

					const percentage = calculateTotalPercentage(
						item.internalMarks,
						item.endsemMarks,
						sub.maxInternalMarks,
						sub.maxEndsemMarks
					);

					const gradePoint =
						percentage === null ? null : calculateGradePoint(percentage);

					return {
						userId: context.session.user.id,
						subjectId: item.subjectId,
						internalMarks: item.internalMarks?.toString() ?? null,
						endsemMarks: item.endsemMarks?.toString() ?? null,
						gradePoint: gradePoint?.toString() ?? null,
					};
				})
				.filter((v): v is NonNullable<typeof v> => v !== null);

			if (valuesToUpsert.length === 0) {
				return [];
			}

			const results = await db
				.insert(score)
				.values(valuesToUpsert)
				.onConflictDoUpdate({
					target: [score.userId, score.subjectId],
					set: {
						internalMarks: sql`excluded.internal_marks`,
						endsemMarks: sql`excluded.endsem_marks`,
						gradePoint: sql`excluded.grade_point`,
						updatedAt: new Date(),
					},
				})
				.returning();

			return results;
		}),
});
