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
			return profile ?? null;
		}),

	profileCreate: protectedProcedure
		.input(
			z.object({
				targetCumulativeCGPA: z.number().min(0).max(10).optional(),
			})
		)
		.handler(async ({ input, context }) => {
			const [newProfile] = await db
				.insert(academicProfile)
				.values({
					userId: context.session.user.id,
					targetCumulativeCGPA: input.targetCumulativeCGPA?.toString(),
				})
				.returning();
			return newProfile ?? null;
		}),

	profileUpdate: protectedProcedure
		.input(
			z.object({
				targetCumulativeCGPA: z.number().min(0).max(10).optional(),
			})
		)
		.handler(async ({ input, context }) => {
			const userId = context.session.user.id;

			const existingProfile = await db.query.academicProfile.findFirst({
				where: eq(academicProfile.userId, userId),
			});

			if (existingProfile) {
				const [updated] = await db
					.update(academicProfile)
					.set({
						targetCumulativeCGPA: input.targetCumulativeCGPA?.toString(),
						updatedAt: new Date(),
					})
					.where(eq(academicProfile.userId, userId))
					.returning();
				return updated ?? null;
			}

			const [inserted] = await db
				.insert(academicProfile)
				.values({
					userId,
					targetCumulativeCGPA: input.targetCumulativeCGPA?.toString(),
				})
				.returning();
			return inserted ?? null;
		}),
});
