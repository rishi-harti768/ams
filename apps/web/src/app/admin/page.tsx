import { auth } from "@ams/auth";
import { Skeleton } from "@ams/ui/components/skeleton";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import AdminDashboard from "./admin-dashboard";

export const metadata = {
	title: "Admin Dashboard | AMS",
	description: "Manage semesters and subjects.",
};

export default function AdminPage() {
	return (
		<main className="container mx-auto px-4 py-8 lg:px-8">
			<div className="mb-8 flex items-center justify-between">
				<div className="flex flex-col gap-1">
					<h1 className="font-bold text-3xl tracking-tight">Admin Dashboard</h1>
					<p className="text-muted-foreground">
						Manage academic semesters and subjects for all students.
					</p>
				</div>
			</div>
			<Suspense fallback={<AdminLoadingSkeleton />}>
				<AdminContent />
			</Suspense>
		</main>
	);
}

async function AdminContent() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session || session.user.role !== "admin") {
		redirect("/dashboard");
	}

	return <AdminDashboard />;
}

function AdminLoadingSkeleton() {
	return (
		<div className="flex flex-col gap-8">
			<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
				{[1, 2].map((i) => (
					<Skeleton className="h-64 w-full rounded-xl" key={i} />
				))}
			</div>
		</div>
	);
}
