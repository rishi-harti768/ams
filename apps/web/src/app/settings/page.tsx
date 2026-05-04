import { auth } from "@ams/auth";
import { Skeleton } from "@ams/ui/components/skeleton";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import Settings from "./settings";

export const metadata = {
	title: "Settings | AMS",
	description: "Manage your academic profile and application preferences.",
};

export default function SettingsPage() {
	return (
		<Suspense fallback={<SettingsSkeleton />}>
			<SettingsContent />
		</Suspense>
	);
}

async function SettingsContent() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		redirect("/login");
	}

	return (
		<main className="container mx-auto px-4 py-8 lg:px-8">
			<Settings />
		</main>
	);
}

function SettingsSkeleton() {
	return (
		<main className="container mx-auto px-4 py-8 lg:px-8">
			<div className="flex flex-col gap-8">
				<Skeleton className="h-10 w-48" />
				<div className="flex flex-col gap-6">
					<Skeleton className="h-12 w-full max-w-md" />
					<Skeleton className="h-[400px] w-full rounded-xl" />
				</div>
			</div>
		</main>
	);
}
