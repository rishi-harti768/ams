import { db } from "@ams/db";
import { score, semester, subject } from "@ams/db/schema/ams";
import { ORPCError } from "@orpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { protectedProcedure } from "../index";

export const subjectRouter = {
	subjectList: protectedProcedure
		.input(z.object({ semesterId: z.string().uuid() }))
		.handler(async ({ input, context }) => {
			// Verify semester belongs to user
			const sem = await db.query.semester.findFirst({
				where: and(
					eq(semester.id, input.semesterId),
					eq(semester.userId, context.session.user.id)
				),
			});

			if (!sem) {
				throw new ORPCError("FORBIDDEN", {
					message: "Semester not found or access denied",
				});
			}

			const subjects = await db.query.subject.findMany({
				where: eq(subject.semesterId, input.semesterId),
				with: {
					scores: true,
				},
			});
			return subjects;
		}),

	subjectCreate: protectedProcedure
		.input(
			z.object({
				semesterId: z.string().uuid(),
				name: z.string().min(1),
				creditHours: z.number().int().positive(),
				maxInternalMarks: z.number().int().positive(),
				maxEndsemMarks: z.number().int().positive(),
			})
		)
		.handler(async ({ input, context }) => {
			// Verify semester belongs to user
			const sem = await db.query.semester.findFirst({
				where: and(
					eq(semester.id, input.semesterId),
					eq(semester.userId, context.session.user.id)
				),
			});

			if (!sem) {
				throw new ORPCError("FORBIDDEN", {
					message: "Semester not found or access denied",
				});
			}

			return await db.transaction(async (tx) => {
				const [newSubject] = await tx
					.insert(subject)
					.values({
						semesterId: input.semesterId,
						name: input.name,
						creditHours: input.creditHours,
						maxInternalMarks: input.maxInternalMarks,
						maxEndsemMarks: input.maxEndsemMarks,
					})
					.returning();

				// Initialize score record
				await tx.insert(score).values({
					subjectId: newSubject.id,
				});

				return newSubject;
			});
		}),

	subjectUpdate: protectedProcedure
		.input(
			z.object({
				id: z.string().uuid(),
				name: z.string().min(1).optional(),
				creditHours: z.number().int().positive().optional(),
				maxInternalMarks: z.number().int().positive().optional(),
				maxEndsemMarks: z.number().int().positive().optional(),
			})
		)
		.handler(async ({ input, context }) => {
			// Verify subject belongs to user via semester
			const item = await db.query.subject.findFirst({
				where: eq(subject.id, input.id),
				with: {
					semester: true,
				},
			});

			if (!item || item.semester.userId !== context.session.user.id) {
				throw new ORPCError("FORBIDDEN", {
					message: "Subject not found or access denied",
				});
			}

			const [updatedSubject] = await db
				.update(subject)
				.set({
					...(input.name && { name: input.name }),
					...(input.creditHours && { creditHours: input.creditHours }),
					...(input.maxInternalMarks && {
						maxInternalMarks: input.maxInternalMarks,
					}),
					...(input.maxEndsemMarks && { maxEndsemMarks: input.maxEndsemMarks }),
				})
				.where(eq(subject.id, input.id))
				.returning();

			return updatedSubject;
		}),

	subjectDelete: protectedProcedure
		.input(z.object({ id: z.string().uuid() }))
		.handler(async ({ input, context }) => {
			// Verify subject belongs to user via semester
			const item = await db.query.subject.findFirst({
				where: eq(subject.id, input.id),
				with: {
					semester: true,
				},
			});

			if (!item || item.semester.userId !== context.session.user.id) {
				throw new ORPCError("FORBIDDEN", {
					message: "Subject not found or access denied",
				});
			}

			const [deletedSubject] = await db
				.delete(subject)
				.where(eq(subject.id, input.id))
				.returning();

			return deletedSubject;
		}),
};
