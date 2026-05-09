import {
	calculateCumulativeCGPA,
	calculateRequiredSemesterCGPA,
	calculateSemesterCGPA,
	calculateSemesterStatus,
} from "@ams/ams";
import { db } from "@ams/db";
import { academicProfile, semester, semesterTarget } from "@ams/db/schema/ams";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { o, protectedProcedure } from "../index";

export const semesterRouter = o.router({
	semesterList: protectedProcedure
		.input(z.object({}))
		.handler(async ({ context }) => {
			const userId = context.session.user.id;

			const semesters = await db.query.semester.findMany({
				orderBy: [desc(semester.startDate)],
				with: {
					subjects: {
						with: {
							scores: {
								where: (score, { eq }) => eq(score.userId, userId),
							},
						},
					},
					targets: {
						where: (target, { eq }) => eq(target.userId, userId),
					},
				},
			});

			const profile = await db.query.academicProfile.findFirst({
				where: eq(academicProfile.userId, userId),
			});

			const semesterData = semesters.map((sem) => {
				const subjects = sem.subjects.map((sub) => ({
					creditHours: sub.creditHours,
					maxInternalMarks: sub.maxInternalMarks,
					maxEndsemMarks: sub.maxEndsemMarks,
					internalMarks: sub.scores[0]?.internalMarks
						? Number(sub.scores[0].internalMarks)
						: null,
					endsemMarks: sub.scores[0]?.endsemMarks
						? Number(sub.scores[0].endsemMarks)
						: null,
				}));

				const sgpa = calculateSemesterCGPA(subjects);
				const totalCredits = sem.subjects.reduce(
					(sum, s) => sum + s.creditHours,
					0
				);

				const target = sem.targets[0];
				const status = calculateSemesterStatus(sem.startDate, sem.endDate);

				return {
					...sem,
					status,
					sgpa,
					totalCredits,
					targetSGPA: target?.targetSGPA ? Number(target.targetSGPA) : null,
				};
			});

			// Calculate global projection
			const currentCumulativeCGPA = calculateCumulativeCGPA(
				semesterData.map((s) => ({
					cgpa: s.sgpa,
					totalCredits: s.totalCredits,
				}))
			);

			const currentTotalCredits = semesterData.reduce(
				(sum, s) => sum + s.totalCredits,
				0
			);

			const totalSemestersCount = semesters.length;
			const activeIndex = semesterData.findIndex((s) => s.status === "ongoing");
			const currentSemesterIndex = activeIndex === -1 ? 1 : activeIndex + 1;

			const remainingSemesters = Math.max(
				0,
				totalSemestersCount - currentSemesterIndex + 1
			);

			const averageCredits =
				semesterData.length > 0
					? currentTotalCredits / semesterData.length
					: 20;

			const projection = profile?.targetCumulativeCGPA
				? calculateRequiredSemesterCGPA(
						currentCumulativeCGPA,
						currentTotalCredits,
						Number(profile.targetCumulativeCGPA),
						Math.max(1, remainingSemesters),
						averageCredits
					)
				: null;

			return {
				semesters: semesterData,
				projection: projection
					? {
							...projection,
							currentCumulativeCGPA,
							targetCumulativeCGPA: Number(profile?.targetCumulativeCGPA),
							remainingSemesters,
						}
					: null,
			};
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

			return {
				...item,
				status: calculateSemesterStatus(item.startDate, item.endDate),
			};
		}),
	semesterSyncTargets: protectedProcedure
		.input(z.object({ targetSGPA: z.number().min(0).max(10) }))
		.handler(async ({ input, context }) => {
			const userId = context.session.user.id;

			const semesters = await db.query.semester.findMany();

			const targetSemesterIds = semesters
				.filter((s) => {
					const status = calculateSemesterStatus(s.startDate, s.endDate);
					return status === "ongoing" || status === "upcoming";
				})
				.map((s) => s.id);

			if (targetSemesterIds.length === 0) {
				return { count: 0 };
			}

			for (const semesterId of targetSemesterIds) {
				const existing = await db.query.semesterTarget.findFirst({
					where: and(
						eq(semesterTarget.userId, userId),
						eq(semesterTarget.semesterId, semesterId)
					),
				});

				if (existing) {
					await db
						.update(semesterTarget)
						.set({ targetSGPA: input.targetSGPA.toString() })
						.where(eq(semesterTarget.id, existing.id));
				} else {
					await db.insert(semesterTarget).values({
						userId,
						semesterId,
						targetSGPA: input.targetSGPA.toString(),
					});
				}
			}

			return { count: targetSemesterIds.length };
		}),
});
