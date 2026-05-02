import { auth } from "@ams/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import SemesterList from "./semester-list";

export const metadata = {
	title: "Semesters | AMS",
	description:
		"Manage your academic terms and track progress across all semesters.",
};

export default async function SemestersPage() {
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
