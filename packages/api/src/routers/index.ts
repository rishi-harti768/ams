import type { RouterClient } from "@orpc/server";

import { o, protectedProcedure, publicProcedure } from "../index";
import { cgpaRouter } from "./cgpa";
import { profileRouter } from "./profile";
import { scoreRouter } from "./score";
import { semesterRouter } from "./semester";
import { subjectRouter } from "./subject";

export const appRouter = o.router({
	healthCheck: publicProcedure.handler(() => "OK"),
	privateData: protectedProcedure.handler(({ context }) => ({
		message: "This is private",
		user: context.session?.user,
	})),
	profile: profileRouter,
	semester: semesterRouter,
	subject: subjectRouter,
	score: scoreRouter,
	cgpa: cgpaRouter,
});
export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
