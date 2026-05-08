"use client";

import { Badge } from "@ams/ui/components/badge";
import { Button } from "@ams/ui/components/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@ams/ui/components/card";
import { Skeleton } from "@ams/ui/components/skeleton";
import { cn } from "@ams/ui/lib/utils";
import { Calendar, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useSemesters } from "@/hooks/use-semesters";

export default function SemesterList() {
	const { data: semesters, isLoading } = useSemesters();

	if (isLoading) {
		return <SemesterListSkeleton />;
	}

	return (
		<div className="flex flex-col gap-6">
			<div className="flex items-center justify-between">
				<div className="flex flex-col gap-1">
					<h1 className="font-bold text-3xl tracking-tight">Semesters</h1>
					<p className="text-muted-foreground">
						View your academic terms and track progress.
					</p>
				</div>
			</div>

			{!semesters || semesters.length === 0 ? (
				<Card className="flex flex-col items-center justify-center border-dashed p-12 text-center">
					<div className="mb-4 rounded-full bg-muted p-4">
						<Calendar data-icon="inline" />
					</div>
					<h3 className="font-semibold text-xl">No semesters found</h3>
					<p className="mt-2 max-w-xs text-muted-foreground">
						You haven't added any semesters yet. Click the button above to add
						your first one.
					</p>
				</Card>
			) : (
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
					{semesters.map((semester: SemesterSummary) => (
						<Card
							className={cn(
								"relative transition-all hover:shadow-md",
								semester.isActive ? "border-primary ring-1 ring-primary/20" : ""
							)}
							key={semester.id}
						>
							<CardHeader className="pb-3">
								<div className="flex items-start justify-between">
									<div className="flex flex-col gap-1">
										<div className="flex items-center gap-2">
											<CardTitle className="text-xl">{semester.name}</CardTitle>
											{semester.isActive ? (
												<Badge className="border-primary/20 bg-primary/10 text-primary hover:bg-primary/20">
													Active
												</Badge>
											) : null}
										</div>
									</div>
								</div>
							</CardHeader>
							<CardContent>
								<div className="flex items-center justify-between rounded-lg bg-muted/30 p-4">
									<div className="flex flex-col gap-0.5">
										<p className="font-bold text-[10px] text-muted-foreground uppercase tracking-wider">
											Target CGPA
										</p>
										<p className="font-bold text-lg">
											{semester.targets?.[0]?.targetSGPA
												? Number(semester.targets[0].targetSGPA).toFixed(2)
												: "N/A"}
										</p>
									</div>
									<div className="h-8 w-[1px] bg-border" />
									<div className="flex flex-col gap-0.5 text-right">
										<p className="font-bold text-[10px] text-muted-foreground uppercase tracking-wider">
											Status
										</p>
										<p className="font-medium text-muted-foreground text-sm">
											{semester.isActive ? "In Progress" : "Completed"}
										</p>
									</div>
								</div>
							</CardContent>
							<CardFooter className="pt-0">
								<Button
									className="w-full"
									nativeButton={false}
									render={<Link href={`/semesters/${semester.id}`} />}
									variant="outline"
								>
									View Details <ExternalLink data-icon="inline-end" />
								</Button>
							</CardFooter>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}

interface SemesterSummary {
	academicYear: string | null;
	id: string;
	isActive: boolean;
	name: string;
	targets: {
		targetSGPA: string | null;
	}[];
}

function SemesterListSkeleton() {
	return (
		<div className="flex flex-col gap-6">
			<div className="flex items-center justify-between">
				<div className="flex flex-col gap-2">
					<Skeleton className="h-10 w-48" />
					<Skeleton className="h-4 w-64" />
				</div>
				<Skeleton className="h-10 w-32" />
			</div>
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
				{[1, 2, 3].map((i) => (
					<Skeleton className="h-64 w-full rounded-xl" key={i} />
				))}
			</div>
		</div>
	);
}
