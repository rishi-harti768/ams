import { calculateGradePoint, calculateTotalPercentage } from "@ams/ams";
import { db } from "@ams/db";
import { score, subject } from "@ams/db/schema/ams";
import { ORPCError } from "@orpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { o, protectedProcedure } from "../index";

export const scoreRouter = o.router({
	scoreGet: protectedProcedure
		.input(z.object({ subjectId: z.string().uuid() }))
		.handler(async ({ input, context }) => {
			const item = await db.query.score.findFirst({
				where: eq(score.subjectId, input.subjectId),
				with: {
					subject: {
						with: {
							semester: true,
						},
					},
				},
			});

			if (!item || item.subject.semester.userId !== context.session.user.id) {
				throw new ORPCError("FORBIDDEN", {
					message: "Score not found or access denied",
				});
			}

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
				with: {
					semester: true,
					scores: true,
				},
			});

			if (!sub || sub.semester.userId !== context.session.user.id) {
				throw new ORPCError("FORBIDDEN", {
					message: "Subject not found or access denied",
				});
			}

			if (
				input.internalMarks !== null &&
				input.internalMarks > sub.maxInternalMarks
			) {
				throw new ORPCError("BAD_REQUEST", {
					message: `Internal marks cannot exceed ${sub.maxInternalMarks}`,
				});
			}

			const currentScore = sub.scores[0];
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
				.update(score)
				.set({
					internalMarks: input.internalMarks?.toString(),
					gradePoint: gradePoint?.toString(),
				})
				.where(eq(score.subjectId, input.subjectId))
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
				with: {
					semester: true,
					scores: true,
				},
			});

			if (!sub || sub.semester.userId !== context.session.user.id) {
				throw new ORPCError("FORBIDDEN", {
					message: "Subject not found or access denied",
				});
			}

			if (
				input.endsemMarks !== null &&
				input.endsemMarks > sub.maxEndsemMarks
			) {
				throw new ORPCError("BAD_REQUEST", {
					message: `End-sem marks cannot exceed ${sub.maxEndsemMarks}`,
				});
			}

			const currentScore = sub.scores[0];
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
				.update(score)
				.set({
					endsemMarks: input.endsemMarks?.toString(),
					gradePoint: gradePoint?.toString(),
				})
				.where(eq(score.subjectId, input.subjectId))
				.returning();

			return updatedScore;
		}),
});
