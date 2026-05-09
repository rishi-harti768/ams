import { Button } from "@ams/ui/components/button";
import { Lock } from "lucide-react";
import Link from "next/link";

export default function LockedSemester() {
	return (
		<div className="container flex min-h-[60vh] flex-col items-center justify-center space-y-6 text-center">
			<div className="rounded-full bg-muted p-6">
				<Lock className="h-12 w-12 text-muted-foreground" />
			</div>
			<div className="space-y-2">
				<h1 className="font-bold text-3xl tracking-tighter sm:text-4xl">
					Semester Locked
				</h1>
				<p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
					This semester hasn't started yet. You'll be able to access it once the
					academic term begins.
				</p>
			</div>
			<Button
				nativeButton={false}
				render={<Link href="/semesters" />}
				variant="outline"
			>
				Back to Semesters
			</Button>
		</div>
	);
}
