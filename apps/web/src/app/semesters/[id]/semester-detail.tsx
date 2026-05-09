"use client";

import { calculateGradePoint, calculateTotalPercentage } from "@ams/ams";
import { Badge } from "@ams/ui/components/badge";
import { Button } from "@ams/ui/components/button";
import { Card, CardContent } from "@ams/ui/components/card";
import { Input } from "@ams/ui/components/input";
import { Skeleton } from "@ams/ui/components/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@ams/ui/components/table";
import { cn } from "@ams/ui/lib/utils";
import {
	AlertCircle,
	ArrowLeft,
	GraduationCap,
	RefreshCcw,
	Save,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useUpdateBatchScores } from "@/hooks/use-scores";
import { useSemester } from "@/hooks/use-semesters";
import { useSubjects } from "@/hooks/use-subjects";

interface SemesterDetailProps {
	id: string;
}

export default function SemesterDetail({ id }: SemesterDetailProps) {
	const { data: semester, isLoading: isSemesterLoading } = useSemester(id);
	const { data: subjects, isLoading: isSubjectsLoading } = useSubjects(id);
	const { mutate: updateBatch, isPending: isSaving } = useUpdateBatchScores();

	// Local state for live editing
	const [pendingMarks, setPendingMarks] = useState<
		Record<string, { internal: number | null; endsem: number | null }>
	>({});

	// Initialize local state when subjects load
	useEffect(() => {
		if (subjects) {
			const initial: Record<
				string,
				{ internal: number | null; endsem: number | null }
			> = {};
			for (const sub of subjects) {
				const score = sub.scores?.[0];
				initial[sub.id] = {
					internal: score?.internalMarks ? Number(score.internalMarks) : null,
					endsem: score?.endsemMarks ? Number(score.endsemMarks) : null,
				};
			}
			setPendingMarks(initial);
		}
	}, [subjects]);

	// Check if data is dirty
	const isDirty = useMemo(() => {
		if (!subjects || Object.keys(pendingMarks).length === 0) {
			return false;
		}
		return subjects.some((sub) => {
			const score = sub.scores?.[0];
			const current = pendingMarks[sub.id] || { internal: null, endsem: null };
			const originalInternal = score?.internalMarks
				? Number(score.internalMarks)
				: null;
			const originalEndsem = score?.endsemMarks
				? Number(score.endsemMarks)
				: null;
			return (
				current.internal !== originalInternal ||
				current.endsem !== originalEndsem
			);
		});
	}, [subjects, pendingMarks]);

	// Validation check
	const hasErrors = useMemo(() => {
		if (!subjects || Object.keys(pendingMarks).length === 0) {
			return false;
		}
		return subjects.some((sub) => {
			const current = pendingMarks[sub.id] || { internal: null, endsem: null };
			if (
				current.internal !== null &&
				current.internal > sub.maxInternalMarks
			) {
				return true;
			}
			if (current.endsem !== null && current.endsem > sub.maxEndsemMarks) {
				return true;
			}
			return false;
		});
	}, [subjects, pendingMarks]);

	// SGPA Calculation
	const sgpa = useMemo(() => {
		if (
			!subjects ||
			subjects.length === 0 ||
			Object.keys(pendingMarks).length === 0
		) {
			return null;
		}

		let totalWeightedGP = 0;
		let totalCredits = 0;
		let allFilled = true;

		for (const sub of subjects) {
			const current = pendingMarks[sub.id] || { internal: null, endsem: null };
			if (current.internal === null || current.endsem === null) {
				allFilled = false;
				break;
			}

			const percentage = calculateTotalPercentage(
				current.internal,
				current.endsem,
				sub.maxInternalMarks,
				sub.maxEndsemMarks
			);

			if (percentage === null) {
				allFilled = false;
				break;
			}

			const gp = calculateGradePoint(percentage);
			totalWeightedGP += gp * sub.creditHours;
			totalCredits += sub.creditHours;
		}

		if (!allFilled || totalCredits === 0) {
			return null;
		}
		return (totalWeightedGP / totalCredits).toFixed(2);
	}, [subjects, pendingMarks]);

	const handleSave = () => {
		const payload = Object.entries(pendingMarks).map(([subjectId, marks]) => ({
			subjectId,
			internalMarks: marks.internal,
			endsemMarks: marks.endsem,
		}));
		updateBatch(payload);
	};

	const handleReset = () => {
		if (subjects) {
			const initial: Record<
				string,
				{ internal: number | null; endsem: number | null }
			> = {};
			for (const sub of subjects) {
				const score = sub.scores?.[0];
				initial[sub.id] = {
					internal: score?.internalMarks ? Number(score.internalMarks) : null,
					endsem: score?.endsemMarks ? Number(score.endsemMarks) : null,
				};
			}
			setPendingMarks(initial);
		}
	};

	if (isSemesterLoading || isSubjectsLoading) {
		return <SemesterDetailSkeleton />;
	}

	if (!semester) {
		return (
			<div className="flex h-[400px] flex-col items-center justify-center text-center">
				<AlertCircle className="mb-4 h-12 w-12 text-muted-foreground" />
				<h2 className="font-bold text-2xl">Semester not found</h2>
				<Button
					className="mt-6"
					nativeButton={false}
					render={<Link href="/semesters" />}
					variant="outline"
				>
					<ArrowLeft className="mr-2 h-4 w-4" /> Back to Semesters
				</Button>
			</div>
		);
	}

	return (
		<div className="fade-in flex animate-in flex-col gap-8 duration-500">
			{/* Header */}
			<div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
				<div className="flex flex-col gap-2">
					<Button
						className="-ml-2 h-8 w-fit text-muted-foreground hover:text-foreground"
						nativeButton={false}
						render={<Link href="/semesters" />}
						size="sm"
						variant="ghost"
					>
						<ArrowLeft className="mr-2 h-4 w-4" /> Back to Semesters
					</Button>
					<div className="flex items-center gap-3">
						<h1 className="font-black text-4xl tracking-tight">
							{semester.name}
						</h1>
						<Badge
							className={cn(
								"h-6 px-3 font-bold text-[10px] uppercase tracking-wider",
								semester.status === "ongoing" &&
									"bg-emerald-500 hover:bg-emerald-600"
							)}
							variant={
								(
									{
										ongoing: "default",
										completed: "outline",
										upcoming: "secondary",
									} as const
								)[semester.status]
							}
						>
							{semester.status}
						</Badge>
					</div>
					<p className="text-muted-foreground/80">{semester.academicYear}</p>
				</div>

				{sgpa && (
					<div className="zoom-in-95 animate-in duration-300">
						<Card className="border-emerald-500/20 bg-emerald-500/5 shadow-none">
							<CardContent className="flex items-center gap-4 p-4">
								<div className="flex size-12 items-center justify-center rounded-full bg-emerald-500 text-white">
									<GraduationCap className="size-6" />
								</div>
								<div>
									<p className="font-bold text-[10px] text-emerald-600/70 uppercase tracking-widest">
										Semester GPA
									</p>
									<p className="font-black text-3xl text-emerald-700">{sgpa}</p>
								</div>
							</CardContent>
						</Card>
					</div>
				)}
			</div>

			{/* Main Table */}
			<Card className="overflow-hidden border-slate-200/60 shadow-sm">
				<Table>
					<TableHeader className="bg-slate-50/50">
						<TableRow>
							<TableHead className="w-[120px] font-bold text-[10px] uppercase tracking-wider">
								Subject Code
							</TableHead>
							<TableHead className="font-bold text-[10px] uppercase tracking-wider">
								Subject Name
							</TableHead>
							<TableHead className="w-[80px] text-center font-bold text-[10px] uppercase tracking-wider">
								Credits
							</TableHead>
							<TableHead className="w-[150px] font-bold text-[10px] uppercase tracking-wider">
								Internal Marks
							</TableHead>
							<TableHead className="w-[150px] font-bold text-[10px] uppercase tracking-wider">
								End Exam Marks
							</TableHead>
							<TableHead className="w-[100px] text-center font-bold text-[10px] uppercase tracking-wider">
								Total
							</TableHead>
							<TableHead className="w-[80px] text-center font-bold text-[10px] uppercase tracking-wider">
								Grade
							</TableHead>
							<TableHead className="w-[100px] text-center font-bold text-[10px] uppercase tracking-wider">
								GP
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{subjects?.map((sub) => (
							<SubjectRow
								current={
									pendingMarks[sub.id] || { internal: null, endsem: null }
								}
								key={sub.id}
								onMarksChange={(id, internal, endsem) => {
									setPendingMarks((prev) => ({
										...prev,
										[id]: { internal, endsem },
									}));
								}}
								sub={sub}
							/>
						))}
					</TableBody>
				</Table>
			</Card>

			{/* Floating Action Bar */}
			{isDirty && (
				<div className="slide-in-from-bottom-8 fixed bottom-8 left-1/2 z-50 flex -translate-x-1/2 animate-in items-center gap-4 rounded-full border border-emerald-500/20 bg-white p-2 pl-6 shadow-2xl duration-300">
					<p className="font-medium text-slate-600 text-sm">
						You have unsaved changes
					</p>
					<div className="flex gap-2">
						<Button
							className="rounded-full text-slate-500"
							disabled={isSaving}
							onClick={handleReset}
							size="sm"
							variant="ghost"
						>
							<RefreshCcw className="mr-2 size-4" /> Discard
						</Button>
						<Button
							className="rounded-full bg-emerald-500 px-6 hover:bg-emerald-600 disabled:opacity-50"
							disabled={hasErrors || isSaving}
							onClick={handleSave}
							size="sm"
						>
							{isSaving ? (
								"Saving..."
							) : (
								<>
									<Save className="mr-2 size-4" /> Save Changes
								</>
							)}
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}

function SubjectRow({
	sub,
	current,
	onMarksChange,
}: {
	sub: {
		id: string;
		subjectCode: string;
		name: string;
		creditHours: number;
		maxInternalMarks: number;
		maxEndsemMarks: number;
	};
	current: { internal: number | null; endsem: number | null };
	onMarksChange: (
		id: string,
		internal: number | null,
		endsem: number | null
	) => void;
}) {
	const percentage = calculateTotalPercentage(
		current.internal,
		current.endsem,
		sub.maxInternalMarks,
		sub.maxEndsemMarks
	);
	const gp = percentage === null ? null : calculateGradePoint(percentage);
	const grade = gp === null ? "—" : getGradeLabel(gp);
	const total = (current.internal ?? 0) + (current.endsem ?? 0);
	const isInternalError =
		current.internal !== null && current.internal > sub.maxInternalMarks;
	const isEndsemError =
		current.endsem !== null && current.endsem > sub.maxEndsemMarks;

	return (
		<TableRow
			className="group transition-colors hover:bg-slate-50/50"
			key={sub.id}
		>
			<TableCell className="font-medium font-mono text-slate-500 text-xs">
				{sub.subjectCode}
			</TableCell>
			<TableCell className="font-semibold">{sub.name}</TableCell>
			<TableCell className="text-center font-medium">
				{sub.creditHours}
			</TableCell>
			<TableCell>
				<div className="flex flex-col gap-1">
					<div className="relative">
						<Input
							className={cn(
								"h-9 focus-visible:ring-emerald-500/20",
								isInternalError &&
									"border-rose-500 focus-visible:ring-rose-500/20"
							)}
							onChange={(e) =>
								onMarksChange(
									sub.id,
									e.target.value === "" ? null : Number(e.target.value),
									current.endsem
								)
							}
							placeholder={`Max: ${sub.maxInternalMarks}`}
							type="number"
							value={current.internal === null ? "" : current.internal}
						/>
					</div>
				</div>
			</TableCell>
			<TableCell>
				<div className="flex flex-col gap-1">
					<Input
						className={cn(
							"h-9 focus-visible:ring-emerald-500/20",
							isEndsemError && "border-rose-500 focus-visible:ring-rose-500/20"
						)}
						onChange={(e) =>
							onMarksChange(
								sub.id,
								current.internal,
								e.target.value === "" ? null : Number(e.target.value)
							)
						}
						placeholder={`Max: ${sub.maxEndsemMarks}`}
						type="number"
						value={current.endsem === null ? "" : current.endsem}
					/>
				</div>
			</TableCell>
			<TableCell className="text-center">
				<span
					className={cn(
						"font-bold text-sm",
						percentage === null ? "text-slate-300" : "text-slate-700"
					)}
				>
					{percentage === null ? "—" : Math.round(total)}
				</span>
			</TableCell>
			<TableCell className="text-center">
				<Badge
					className={cn(
						"h-7 w-10 justify-center font-black",
						grade === "F" && "border-rose-200 bg-rose-50 text-rose-600",
						grade === "—" && "text-slate-300",
						grade !== "F" &&
							grade !== "—" &&
							"border-emerald-200 bg-emerald-50 text-emerald-600"
					)}
					variant="outline"
				>
					{grade}
				</Badge>
			</TableCell>
			<TableCell className="text-center">
				<div
					className={cn(
						"inline-flex size-8 items-center justify-center rounded-full font-bold text-xs",
						gp !== null && gp >= 4
							? "bg-emerald-500/10 text-emerald-600"
							: "bg-slate-100 text-slate-400"
					)}
				>
					{gp ?? "—"}
				</div>
			</TableCell>
		</TableRow>
	);
}

function getGradeLabel(gp: number) {
	if (gp >= 10) {
		return "O";
	}
	if (gp >= 9) {
		return "A+";
	}
	if (gp >= 8) {
		return "A";
	}
	if (gp >= 7) {
		return "B+";
	}
	if (gp >= 6) {
		return "B";
	}
	if (gp >= 5) {
		return "C";
	}
	if (gp >= 4) {
		return "P";
	}
	return "F";
}

function SemesterDetailSkeleton() {
	return (
		<div className="flex flex-col gap-8">
			<div className="flex flex-col gap-4">
				<Skeleton className="h-6 w-32" />
				<div className="flex items-center justify-between">
					<Skeleton className="h-12 w-64" />
					<Skeleton className="h-16 w-32 rounded-xl" />
				</div>
			</div>
			<Card className="p-0">
				<div className="flex flex-col gap-4 p-8">
					{[1, 2, 3, 4, 5].map((i) => (
						<Skeleton className="h-12 w-full" key={i} />
					))}
				</div>
			</Card>
		</div>
	);
}
