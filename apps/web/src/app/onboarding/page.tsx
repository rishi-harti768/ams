import { auth } from "@ams/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Onboarding from "./onboarding";

export const metadata = {
	title: "Setup Your Profile | AMS",
	description:
		"Complete your academic profile to start tracking your performance.",
};

export default async function OnboardingPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		redirect("/login");
	}

	return <Onboarding />;
}
