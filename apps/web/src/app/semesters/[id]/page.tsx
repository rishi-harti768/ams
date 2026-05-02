import { auth } from "@ams/auth";
import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";
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

export default async function SemesterPage({
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

	return (
		<main className="container mx-auto px-4 py-8 lg:px-8">
			<SemesterDetail id={id} />
		</main>
	);
}
