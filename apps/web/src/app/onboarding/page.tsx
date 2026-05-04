import { auth } from "@ams/auth";
import { Skeleton } from "@ams/ui/components/skeleton";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import Onboarding from "./onboarding";

export const metadata = {
	title: "Setup Your Profile | AMS",
	description:
		"Complete your academic profile to start tracking your performance.",
};

export default function OnboardingPage() {
	return (
		<Suspense fallback={<OnboardingSkeleton />}>
			<OnboardingContent />
		</Suspense>
	);
}

async function OnboardingContent() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		redirect("/login");
	}

	return <Onboarding />;
}

function OnboardingSkeleton() {
	return (
		<main className="container mx-auto px-4 py-8 lg:px-8">
			<div className="flex flex-col gap-8">
				<Skeleton className="h-10 w-64" />
				<Skeleton className="h-[400px] w-full rounded-xl" />
			</div>
		</main>
	);
}
