import { db } from "@ams/db";
import { semester, subject } from "@ams/db/schema/ams";
import { eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { adminProcedure, o } from "../index";

export const adminRouter = o.router({
	// Semester Management
	semesterList: adminProcedure.handler(async () => {
		const semesters = await db.query.semester.findMany({
			with: {
				subjects: true,
			},
			orderBy: (semester, { desc }) => [desc(semester.createdAt)],
		});

		return semesters.map((s) => ({
			...s,
			totalCredits: s.subjects.reduce((acc, sub) => acc + sub.creditHours, 0),
		}));
	}),

	semesterCreate: adminProcedure
		.input(
			z.object({
				name: z.string().min(1),
				academicYear: z.string().optional(),
				isActive: z.boolean().default(false),
			})
		)
		.handler(async ({ input }) => {
			const [newSemester] = await db
				.insert(semester)
				.values({
					name: input.name,
					academicYear: input.academicYear,
					isActive: input.isActive,
				})
				.returning();
			return newSemester;
		}),

	semesterUpdate: adminProcedure
		.input(
			z.object({
				id: z.string().uuid(),
				name: z.string().min(1).optional(),
				academicYear: z.string().optional(),
				isActive: z.boolean().optional(),
			})
		)
		.handler(async ({ input }) => {
			const [updatedSemester] = await db
				.update(semester)
				.set({
					...(input.name && { name: input.name }),
					...(input.academicYear !== undefined && {
						academicYear: input.academicYear,
					}),
					...(input.isActive !== undefined && { isActive: input.isActive }),
				})
				.where(eq(semester.id, input.id))
				.returning();
			return updatedSemester;
		}),

	semesterDelete: adminProcedure
		.input(z.object({ id: z.string().uuid() }))
		.handler(async ({ input }) => {
			const [deletedSemester] = await db
				.delete(semester)
				.where(eq(semester.id, input.id))
				.returning();
			return deletedSemester;
		}),

	semesterSetActive: adminProcedure
		.input(z.object({ ids: z.array(z.string().uuid()), active: z.boolean() }))
		.handler(async ({ input }) => {
			await db
				.update(semester)
				.set({ isActive: input.active })
				.where(inArray(semester.id, input.ids));
			return { success: true };
		}),

	// Subject Management
	subjectCreate: adminProcedure
		.input(
			z.object({
				semesterId: z.string().uuid(),
				subjectCode: z.string().min(1),
				name: z.string().min(1),
				creditHours: z.number().int().min(1),
				maxInternalMarks: z.number().int().min(0).default(50),
				maxEndsemMarks: z.number().int().min(0).default(50),
			})
		)
		.handler(async ({ input }) => {
			const [newSubject] = await db
				.insert(subject)
				.values({
					semesterId: input.semesterId,
					subjectCode: input.subjectCode,
					name: input.name,
					creditHours: input.creditHours,
					maxInternalMarks: input.maxInternalMarks,
					maxEndsemMarks: input.maxEndsemMarks,
				})
				.returning();
			return newSubject;
		}),

	subjectUpdate: adminProcedure
		.input(
			z.object({
				id: z.string().uuid(),
				subjectCode: z.string().min(1).optional(),
				name: z.string().min(1).optional(),
				creditHours: z.number().int().min(1).optional(),
				maxInternalMarks: z.number().int().min(0).optional(),
				maxEndsemMarks: z.number().int().min(0).optional(),
			})
		)
		.handler(async ({ input }) => {
			const [updatedSubject] = await db
				.update(subject)
				.set({
					...(input.subjectCode && { subjectCode: input.subjectCode }),
					...(input.name && { name: input.name }),
					...(input.creditHours !== undefined && {
						creditHours: input.creditHours,
					}),
					...(input.maxInternalMarks !== undefined && {
						maxInternalMarks: input.maxInternalMarks,
					}),
					...(input.maxEndsemMarks !== undefined && {
						maxEndsemMarks: input.maxEndsemMarks,
					}),
				})
				.where(eq(subject.id, input.id))
				.returning();
			return updatedSubject;
		}),

	subjectDelete: adminProcedure
		.input(z.object({ id: z.string().uuid() }))
		.handler(async ({ input }) => {
			const [deletedSubject] = await db
				.delete(subject)
				.where(eq(subject.id, input.id))
				.returning();
			return deletedSubject;
		}),
});
