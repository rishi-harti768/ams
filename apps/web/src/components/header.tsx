"use client";
import { Separator } from "@ams/ui/components/separator";
import type { Route } from "next";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { ModeToggle } from "./mode-toggle";
import UserMenu from "./user-menu";

export default function Header() {
	const { data: session } = authClient.useSession();

	const links = [
		{ to: "/", label: "Home" },
		{ to: "/dashboard", label: "Dashboard" },
		...(session?.user.role === "admin"
			? [{ to: "/admin", label: "Admin" }]
			: []),
		{ to: "/semesters", label: "Semesters" },
		{ to: "/settings", label: "Settings" },
	] as const;

	return (
		<div>
			<div className="flex flex-row items-center justify-between px-2 py-1">
				<nav className="flex gap-4 text-lg">
					{links.map(({ to, label }) => (
						<Link href={to as Route} key={to}>
							{label}
						</Link>
					))}
				</nav>
				<div className="flex items-center gap-2">
					<ModeToggle />
					<UserMenu />
				</div>
			</div>
			<Separator />
		</div>
	);
}
