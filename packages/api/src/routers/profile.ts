import { db } from "@ams/db";
import { academicProfile } from "@ams/db/schema/ams";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { o, protectedProcedure } from "../index";

export const profileRouter = o.router({
	profile: protectedProcedure
		.input(z.object({}))
		.handler(async ({ context }) => {
			const profile = await db.query.academicProfile.findFirst({
				where: eq(academicProfile.userId, context.session.user.id),
			});
			return profile;
		}),

	profileCreate: protectedProcedure
		.input(
			z.object({
				institutionType: z.enum(["school", "college"]),
				institutionName: z.string().optional(),
				currentSemester: z.number().min(1).max(20),
				totalSemesters: z.number().min(1).max(20).default(8),
				targetCumulativeCGPA: z.number().min(0).max(10).optional(),
			})
		)
		.handler(async ({ input, context }) => {
			const [newProfile] = await db
				.insert(academicProfile)
				.values({
					userId: context.session.user.id,
					institutionType: input.institutionType,
					institutionName: input.institutionName,
					currentSemester: input.currentSemester,
					totalSemesters: input.totalSemesters,
					targetCumulativeCGPA: input.targetCumulativeCGPA?.toString(),
				})
				.returning();
			return newProfile;
		}),

	profileUpdate: protectedProcedure
		.input(
			z.object({
				institutionType: z.enum(["school", "college"]).optional(),
				institutionName: z.string().optional(),
				currentSemester: z.number().min(1).max(20).optional(),
				totalSemesters: z.number().min(1).max(20).optional(),
				targetCumulativeCGPA: z.number().min(0).max(10).optional(),
			})
		)
		.handler(async ({ input, context }) => {
			const [updatedProfile] = await db
				.update(academicProfile)
				.set({
					...(input.institutionType && {
						institutionType: input.institutionType,
					}),
					...(input.institutionName !== undefined && {
						institutionName: input.institutionName,
					}),
					...(input.currentSemester && {
						currentSemester: input.currentSemester,
					}),
					...(input.totalSemesters && {
						totalSemesters: input.totalSemesters,
					}),
					...(input.targetCumulativeCGPA !== undefined && {
						targetCumulativeCGPA: input.targetCumulativeCGPA?.toString(),
					}),
				})
				.where(eq(academicProfile.userId, context.session.user.id))
				.returning();
			return updatedProfile;
		}),
});
