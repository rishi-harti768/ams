import type { RouterClient } from "@orpc/server";

import { protectedProcedure, publicProcedure } from "../index";
import { cgpaRouter } from "./cgpa";
import { profileRouter } from "./profile";
import { scoreRouter } from "./score";
import { semesterRouter } from "./semester";
import { subjectRouter } from "./subject";

export const appRouter = {
	healthCheck: publicProcedure.handler(() => "OK"),
	privateData: protectedProcedure.handler(({ context }) => ({
		message: "This is private",
		user: context.session?.user,
	})),
	...profileRouter,
	...semesterRouter,
	...subjectRouter,
	...scoreRouter,
	...cgpaRouter,
};
export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
