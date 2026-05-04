import { auth } from "@ams/auth";
import { Skeleton } from "@ams/ui/components/skeleton";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import SemesterList from "./semester-list";

export const metadata = {
	title: "Semesters | AMS",
	description:
		"Manage your academic terms and track progress across all semesters.",
};

export default function SemestersPage() {
	return (
		<Suspense fallback={<SemestersSkeleton />}>
			<SemestersContent />
		</Suspense>
	);
}

async function SemestersContent() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		redirect("/login");
	}

	return (
		<main className="container mx-auto px-4 py-8 lg:px-8">
			<SemesterList />
		</main>
	);
}

function SemestersSkeleton() {
	return (
		<main className="container mx-auto px-4 py-8 lg:px-8">
			<div className="flex flex-col gap-8">
				<div className="flex items-center justify-between">
					<Skeleton className="h-10 w-48" />
					<Skeleton className="h-10 w-32" />
				</div>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
					{[1, 2, 3].map((i) => (
						<Skeleton className="h-48 w-full rounded-xl" key={i} />
					))}
				</div>
			</div>
		</main>
	);
}
