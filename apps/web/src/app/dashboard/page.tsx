import { auth } from "@ams/auth";
import { Skeleton } from "@ams/ui/components/skeleton";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import Dashboard from "./dashboard";

export const metadata = {
	title: "Dashboard | AMS",
	description: "Track your academic performance and CGPA trend.",
};

export default async function DashboardPage() {
	return (
		<main className="container mx-auto px-4 py-8 lg:px-8">
			<div className="mb-8 flex items-center justify-between">
				<div className="flex flex-col gap-1">
					<h1 className="font-bold text-3xl tracking-tight">Dashboard</h1>
					<Suspense fallback={<Skeleton className="h-4 w-48" />}>
						<WelcomeMessage />
					</Suspense>
				</div>
			</div>
			<Suspense fallback={<DashboardLoadingSkeleton />}>
				<Dashboard />
			</Suspense>
		</main>
	);
}

async function WelcomeMessage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		redirect("/login");
	}

	return (
		<p className="text-muted-foreground">
			Welcome back, {session.user.name.split(" ")[0]}! Here's your academic
			overview.
		</p>
	);
}

function DashboardLoadingSkeleton() {
	return (
		<div className="flex flex-col gap-8">
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{[1, 2, 3, 4].map((i) => (
					<Skeleton className="h-32 w-full rounded-xl" key={i} />
				))}
			</div>
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
				<Skeleton className="h-100 rounded-xl lg:col-span-2" />
				<Skeleton className="h-100 rounded-xl lg:col-span-1" />
			</div>
		</div>
	);
}
