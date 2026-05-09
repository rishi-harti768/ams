import { calculateSemesterStatus } from "@ams/ams";
import { auth } from "@ams/auth";
import { db } from "@ams/db";
import { semester } from "@ams/db/schema/ams";
import { Skeleton } from "@ams/ui/components/skeleton";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import LockedSemester from "./locked-semester";
import SemesterDetail from "./semester-detail";

export async function generateMetadata({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	await params;
	return {
		title: "Semester Details | AMS",
		description: "View and manage subjects and scores for this semester.",
	};
}

export default function SemesterPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	return (
		<Suspense fallback={<SemesterDetailSkeleton />}>
			<SemesterContent params={params} />
		</Suspense>
	);
}

async function SemesterContent({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;

	if (!id) {
		notFound();
	}

	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		redirect("/login");
	}

	const sem = await db.query.semester.findFirst({
		where: eq(semester.id, id),
	});

	if (!sem) {
		notFound();
	}

	const status = calculateSemesterStatus(sem.startDate, sem.endDate);

	if (status === "upcoming") {
		return <LockedSemester />;
	}

	return (
		<main className="container mx-auto px-4 py-8 lg:px-8">
			<SemesterDetail id={id} />
		</main>
	);
}

function SemesterDetailSkeleton() {
	return (
		<main className="container mx-auto px-4 py-8 lg:px-8">
			<div className="flex flex-col gap-8">
				<div className="flex flex-col gap-2">
					<Skeleton className="h-10 w-64" />
					<Skeleton className="h-4 w-48" />
				</div>
				<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
					<Skeleton className="h-[600px] rounded-xl lg:col-span-2" />
					<Skeleton className="h-[400px] rounded-xl lg:col-span-1" />
				</div>
			</div>
		</main>
	);
}
