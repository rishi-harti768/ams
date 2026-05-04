import { db } from "@ams/db";
import { semester } from "@ams/db/schema/ams";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { o, protectedProcedure } from "../index";

export const semesterRouter = o.router({
	semesterList: protectedProcedure
		.input(z.object({}))
		.handler(async ({ context }) => {
			const semesters = await db.query.semester.findMany({
				where: eq(semester.userId, context.session.user.id),
				orderBy: [desc(semester.createdAt)],
			});
			return semesters;
		}),

	semesterGet: protectedProcedure
		.input(z.object({ id: z.string().uuid() }))
		.handler(async ({ input, context }) => {
			const item = await db.query.semester.findFirst({
				where: and(
					eq(semester.id, input.id),
					eq(semester.userId, context.session.user.id)
				),
				with: {
					subjects: {
						with: {
							scores: true,
						},
					},
				},
			});
			return item;
		}),

	semesterCreate: protectedProcedure
		.input(
			z.object({
				name: z.string().min(1),
				academicYear: z.string().optional(),
				isActive: z.boolean().default(false),
				targetCGPA: z.number().min(0).max(10).optional(),
			})
		)
		.handler(
			async ({ input, context }) =>
				await db.transaction(async (tx) => {
					if (input.isActive) {
						await tx
							.update(semester)
							.set({ isActive: false })
							.where(eq(semester.userId, context.session.user.id));
					}

					const [newSemester] = await tx
						.insert(semester)
						.values({
							userId: context.session.user.id,
							name: input.name,
							academicYear: input.academicYear,
							isActive: input.isActive,
							targetCGPA: input.targetCGPA?.toString(),
						})
						.returning();
					return newSemester;
				})
		),

	semesterUpdate: protectedProcedure
		.input(
			z.object({
				id: z.string().uuid(),
				name: z.string().min(1).optional(),
				academicYear: z.string().optional(),
				isActive: z.boolean().optional(),
				targetCGPA: z.number().min(0).max(10).optional(),
			})
		)
		.handler(
			async ({ input, context }) =>
				await db.transaction(async (tx) => {
					if (input.isActive) {
						await tx
							.update(semester)
							.set({ isActive: false })
							.where(eq(semester.userId, context.session.user.id));
					}

					const [updatedSemester] = await tx
						.update(semester)
						.set({
							...(input.name && { name: input.name }),
							...(input.academicYear !== undefined && {
								academicYear: input.academicYear,
							}),
							...(input.isActive !== undefined && { isActive: input.isActive }),
							...(input.targetCGPA !== undefined && {
								targetCGPA: input.targetCGPA?.toString(),
							}),
						})
						.where(
							and(
								eq(semester.id, input.id),
								eq(semester.userId, context.session.user.id)
							)
						)
						.returning();
					return updatedSemester;
				})
		),

	semesterDelete: protectedProcedure
		.input(z.object({ id: z.string().uuid() }))
		.handler(async ({ input, context }) => {
			const [deletedSemester] = await db
				.delete(semester)
				.where(
					and(
						eq(semester.id, input.id),
						eq(semester.userId, context.session.user.id)
					)
				)
				.returning();
			return deletedSemester;
		}),

	semesterSetActive: protectedProcedure
		.input(z.object({ id: z.string().uuid() }))
		.handler(
			async ({ input, context }) =>
				await db.transaction(async (tx) => {
					await tx
						.update(semester)
						.set({ isActive: false })
						.where(eq(semester.userId, context.session.user.id));

					const [updatedSemester] = await tx
						.update(semester)
						.set({ isActive: true })
						.where(
							and(
								eq(semester.id, input.id),
								eq(semester.userId, context.session.user.id)
							)
						)
						.returning();
					return updatedSemester;
				})
		),
});
