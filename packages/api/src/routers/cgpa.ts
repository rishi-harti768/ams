import {
	calculateCumulativeCGPA,
	calculateRequiredEndsem,
	calculateRequiredSemesterCGPA,
	calculateSemesterCGPA,
	type SubjectWithScore,
} from "@ams/ams";
import { db } from "@ams/db";
import { academicProfile, semester } from "@ams/db/schema/ams";
import { ORPCError } from "@orpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { o, protectedProcedure } from "../index";

export const cgpaRouter = o.router({
	cgpaDashboard: protectedProcedure
		.input(z.object({}))
		.handler(async ({ context }) => {
			const userId = context.session.user.id;

			const profile = await db.query.academicProfile.findFirst({
				where: eq(academicProfile.userId, userId),
			});

			const semesters = await db.query.semester.findMany({
				where: eq(semester.userId, userId),
				with: {
					subjects: {
						with: {
							scores: true,
						},
					},
				},
				orderBy: (semester, { desc }) => [desc(semester.createdAt)],
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

				const cgpa = calculateSemesterCGPA(subjects);
				const totalCredits = sem.subjects.reduce(
					(sum, s) => sum + s.creditHours,
					0
				);

				return {
					id: sem.id,
					name: sem.name,
					isActive: sem.isActive,
					cgpa,
					totalCredits,
					targetCGPA: sem.targetCGPA ? Number(sem.targetCGPA) : null,
				};
			});

			const currentCumulativeCGPA = calculateCumulativeCGPA(
				semesterData.map((s) => ({
					cgpa: s.cgpa,
					totalCredits: s.totalCredits,
				}))
			);

			const activeSemester = semesterData.find((s) => s.isActive);

			return {
				profile,
				currentCumulativeCGPA,
				semesters: semesterData,
				activeSemester: activeSemester || null,
			};
		}),

	cgpaSemester: protectedProcedure
		.input(z.object({ semesterId: z.string().uuid() }))
		.handler(async ({ input, context }) => {
			const sem = await db.query.semester.findFirst({
				where: and(
					eq(semester.id, input.semesterId),
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

			if (!sem) {
				throw new ORPCError("NOT_FOUND", {
					message: "Semester not found",
				});
			}

			const subjects: SubjectWithScore[] = sem.subjects.map((sub) => ({
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

			const cgpa = calculateSemesterCGPA(subjects);
			return { cgpa };
		}),

	cgpaCumulative: protectedProcedure
		.input(z.object({}))
		.handler(async ({ context }) => {
			const semesters = await db.query.semester.findMany({
				where: eq(semester.userId, context.session.user.id),
				with: {
					subjects: {
						with: {
							scores: true,
						},
					},
				},
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

				return {
					cgpa: calculateSemesterCGPA(subjects),
					totalCredits: sem.subjects.reduce((sum, s) => sum + s.creditHours, 0),
				};
			});

			return {
				cgpa: calculateCumulativeCGPA(semesterData),
			};
		}),

	cgpaProjection: protectedProcedure
		.input(z.object({ semesterId: z.string().uuid() }))
		.handler(async ({ input, context }) => {
			const sem = await db.query.semester.findFirst({
				where: and(
					eq(semester.id, input.semesterId),
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

			if (!sem?.targetCGPA) {
				throw new ORPCError("BAD_REQUEST", {
					message: "Semester not found or no target CGPA set",
				});
			}

			const targetCGPA = Number(sem.targetCGPA);

			const projections = sem.subjects.map((sub) => {
				const internalMarks = sub.scores[0]?.internalMarks
					? Number(sub.scores[0].internalMarks)
					: 0;

				return {
					subjectId: sub.id,
					name: sub.name,
					...calculateRequiredEndsem(
						internalMarks,
						sub.maxInternalMarks,
						sub.maxEndsemMarks,
						targetCGPA
					),
				};
			});

			return projections;
		}),
	cgpaCumulativeProjection: protectedProcedure
		.input(z.object({}))
		.handler(async ({ context }) => {
			const userId = context.session.user.id;

			const profile = await db.query.academicProfile.findFirst({
				where: eq(academicProfile.userId, userId),
			});

			if (!profile?.targetCumulativeCGPA) {
				throw new ORPCError("BAD_REQUEST", {
					message: "No cumulative target CGPA set",
				});
			}

			const semesters = await db.query.semester.findMany({
				where: eq(semester.userId, userId),
				with: {
					subjects: {
						with: {
							scores: true,
						},
					},
				},
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

				return {
					cgpa: calculateSemesterCGPA(subjects),
					totalCredits: sem.subjects.reduce((sum, s) => sum + s.creditHours, 0),
				};
			});

			const currentCumulativeCGPA = calculateCumulativeCGPA(semesterData);
			const currentTotalCredits = semesterData.reduce(
				(sum, s) => sum + s.totalCredits,
				0
			);

			const remainingSemesters =
				profile.totalSemesters - profile.currentSemester + 1;

			// Estimate average credits per semester from existing ones, or default to 20
			const averageCredits =
				semesterData.length > 0
					? semesterData.reduce((sum, s) => sum + s.totalCredits, 0) /
						semesterData.length
					: 20;

			const projection = calculateRequiredSemesterCGPA(
				currentCumulativeCGPA,
				currentTotalCredits,
				Number(profile.targetCumulativeCGPA),
				Math.max(1, remainingSemesters),
				averageCredits
			);

			return {
				...projection,
				currentCumulativeCGPA,
				targetCumulativeCGPA: Number(profile.targetCumulativeCGPA),
				remainingSemesters,
			};
		}),
});
