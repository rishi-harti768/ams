"use client";

import { Badge } from "@ams/ui/components/badge";
import { Button } from "@ams/ui/components/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@ams/ui/components/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@ams/ui/components/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@ams/ui/components/dropdown-menu";
import {
	SemesterForm,
	type SemesterFormValues,
} from "@ams/ui/components/semester-form";
import { Skeleton } from "@ams/ui/components/skeleton";
import { cn } from "@ams/ui/lib/utils";
import {
	Calendar,
	CheckCircle2,
	ExternalLink,
	MoreVertical,
	Plus,
	Trash2,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
	useCreateSemester,
	useDeleteSemester,
	useSemesters,
	useSetActiveSemester,
} from "@/hooks/use-semesters";

export default function SemesterList() {
	const { data: semesters, isLoading } = useSemesters();
	const { mutate: createSemester, isPending: isCreating } = useCreateSemester();
	const { mutate: setActive } = useSetActiveSemester();
	const { mutate: deleteSemester } = useDeleteSemester();
	const [isOpen, setIsOpen] = useState(false);

	const handleCreate = (values: SemesterFormValues) => {
		createSemester(values, {
			onSuccess: () => {
				setIsOpen(false);
			},
		});
	};

	if (isLoading) {
		return <SemesterListSkeleton />;
	}

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="font-bold text-3xl tracking-tight">Semesters</h1>
					<p className="text-muted-foreground">
						Manage your academic terms and track progress.
					</p>
				</div>
				<Dialog onOpenChange={setIsOpen} open={isOpen}>
					<DialogTrigger render={<Button />}>
						<Plus className="mr-2 h-4 w-4" /> Add Semester
					</DialogTrigger>
					<DialogContent className="sm:max-w-[425px]">
						<DialogHeader>
							<DialogTitle>Add New Semester</DialogTitle>
							<DialogDescription>
								Enter the details for your new academic term.
							</DialogDescription>
						</DialogHeader>
						<SemesterForm
							isLoading={isCreating}
							onCancel={() => setIsOpen(false)}
							onSubmit={handleCreate}
						/>
					</DialogContent>
				</Dialog>
			</div>

			{!semesters || semesters.length === 0 ? (
				<Card className="flex flex-col items-center justify-center border-dashed p-12 text-center">
					<div className="mb-4 rounded-full bg-muted p-4">
						<Calendar className="h-8 w-8 text-muted-foreground" />
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
								semester.isActive && "border-primary ring-1 ring-primary/20"
							)}
							key={semester.id}
						>
							<CardHeader className="pb-3">
								<div className="flex items-start justify-between">
									<div className="space-y-1">
										<div className="flex items-center gap-2">
											<CardTitle className="text-xl">{semester.name}</CardTitle>
											{semester.isActive && (
												<Badge className="border-primary/20 bg-primary/10 text-primary hover:bg-primary/20">
													Active
												</Badge>
											)}
										</div>
										<CardDescription className="flex items-center gap-1.5">
											<Calendar className="h-3 w-3" />
											{semester.academicYear || "Year not set"}
										</CardDescription>
									</div>
									<DropdownMenu>
										<DropdownMenuTrigger
											render={
												<Button
													className="h-8 w-8"
													size="icon"
													variant="ghost"
												/>
											}
										>
											<MoreVertical className="h-4 w-4" />
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											<DropdownMenuItem
												onClick={() => setActive({ id: semester.id })}
											>
												<CheckCircle2 className="mr-2 h-4 w-4" /> Set as Active
											</DropdownMenuItem>
											<DropdownMenuItem
												className="text-destructive focus:text-destructive"
												onClick={() => deleteSemester({ id: semester.id })}
											>
												<Trash2 className="mr-2 h-4 w-4" /> Delete
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</div>
							</CardHeader>
							<CardContent>
								<div className="flex items-center justify-between rounded-lg bg-muted/30 p-4">
									<div className="space-y-0.5">
										<p className="font-bold text-[10px] text-muted-foreground uppercase tracking-wider">
											Target CGPA
										</p>
										<p className="font-bold text-lg">
											{semester.targetCGPA
												? Number(semester.targetCGPA).toFixed(2)
												: "N/A"}
										</p>
									</div>
									<div className="h-8 w-[1px] bg-border" />
									<div className="space-y-0.5 text-right">
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
									View Details <ExternalLink className="ml-2 h-4 w-4" />
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
	targetCGPA: string | null;
}

function SemesterListSkeleton() {
	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div className="space-y-2">
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
