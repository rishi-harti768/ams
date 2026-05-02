import { auth } from "@ams/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Dashboard from "./dashboard";

export const metadata = {
	title: "Dashboard | AMS",
	description: "Track your academic performance and CGPA trend.",
};

export default async function DashboardPage() {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (!session?.user) {
		redirect("/login");
	}

	return (
		<main className="container mx-auto px-4 py-8 lg:px-8">
			<div className="mb-8 flex items-center justify-between">
				<div>
					<h1 className="font-bold text-3xl tracking-tight">Dashboard</h1>
					<p className="text-muted-foreground">
						Welcome back, {session.user.name.split(" ")[0]}! Here's your
						academic overview.
					</p>
				</div>
			</div>
			<Dashboard />
		</main>
	);
}
