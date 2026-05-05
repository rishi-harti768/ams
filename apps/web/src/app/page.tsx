"use client";
import { useQuery } from "@tanstack/react-query";

import { orpc } from "@/utils/orpc";

export default function Home() {
	const healthCheck = useQuery(orpc.healthCheck.queryOptions());
	let statusText = "Disconnected";
	if (healthCheck.isLoading) {
		statusText = "Checking...";
	} else if (healthCheck.data) {
		statusText = "Connected";
	}

	return (
		<div className="container mx-auto flex min-h-screen flex-col items-center justify-center px-4">
			<div className="text-center">
				<h1 className="font-bold text-6xl tracking-tight">
					Academic Management System
				</h1>
				<div className="mt-8 rounded-lg border p-4">
					<h2 className="mb-2 font-medium">API Status</h2>
					<div className="flex items-center justify-center gap-2">
						<div
							className={`h-2 w-2 rounded-full ${healthCheck.data ? "bg-green-500" : "bg-red-500"}`}
						/>
						<span className="text-muted-foreground text-sm">{statusText}</span>
					</div>
				</div>
			</div>
		</div>
	);
}
