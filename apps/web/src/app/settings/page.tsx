import { auth } from "@ams/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Settings from "./settings";

export const metadata = {
	title: "Settings | AMS",
	description: "Manage your academic profile and application preferences.",
};

export default async function SettingsPage() {
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
