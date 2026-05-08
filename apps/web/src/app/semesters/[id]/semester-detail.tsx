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
import { ScoreInput } from "@ams/ui/components/score-input";
import { Skeleton } from "@ams/ui/components/skeleton";
import { cn } from "@ams/ui/lib/utils";
import {
	AlertCircle,
	ArrowLeft,
	Calculator,
	CheckCircle2,
	Lock,
	Target,
	TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useCGPAProjection } from "@/hooks/use-cgpa";
import {
	useUpdateEndsemMarks,
	useUpdateInternalMarks,
} from "@/hooks/use-scores";
import { useSemester } from "@/hooks/use-semesters";
import { useSubjects } from "@/hooks/use-subjects";

interface SemesterDetailProps {
	id: string;
}

export default function SemesterDetail({ id }: SemesterDetailProps) {
	const { data: semester, isLoading: isSemesterLoading } = useSemester(id);
	const { data: subjects, isLoading: isSubjectsLoading } = useSubjects(id);
	const { data: projections } = useCGPAProjection(id);

	const { mutate: updateInternal } = useUpdateInternalMarks();
	const { mutate: updateEndsem } = useUpdateEndsemMarks();

	const targetSGPA = semester?.targets?.[0]?.targetSGPA ?? null;

	if (isSemesterLoading || isSubjectsLoading) {
		return <SemesterDetailSkeleton />;
	}

	if (!semester) {
		return (
			<div className="flex h-[400px] flex-col items-center justify-center text-center">
				<AlertCircle className="mb-4 h-12 w-12 text-muted-foreground" />
				<h2 className="font-bold text-2xl">Semester not found</h2>
				<p className="mt-2 text-muted-foreground">
					The semester you're looking for doesn't exist or you don't have
					access.
				</p>
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
			{/* Header Section */}
			<div className="flex flex-col gap-6 border-b pb-8 md:flex-row md:items-end md:justify-between">
				<div className="flex flex-col gap-2">
					<Button
						className="-ml-2 h-8 text-muted-foreground"
						nativeButton={false}
						render={<Link href="/semesters" />}
						size="sm"
						variant="ghost"
					>
						<ArrowLeft data-icon="inline-start" /> Back to Semesters
					</Button>
					<div className="flex items-center gap-3">
						<h1 className="font-bold text-4xl tracking-tight">
							{semester.name}
						</h1>
						{semester.isActive ? (
							<Badge className="h-6 border-primary/20 bg-primary/10 text-primary hover:bg-primary/20">
								Active
							</Badge>
						) : null}
						{semester.isLocked ? (
							<Badge className="h-6" variant="secondary">
								<Lock className="mr-1 h-3 w-3" /> Locked (Read-Only)
							</Badge>
						) : null}
					</div>
					<p className="text-muted-foreground">
						{semester.academicYear || "No academic year set"}
					</p>
				</div>

				<div className="flex items-center gap-4">
					<Card className="border-primary/10 bg-primary/5 px-6 py-3">
						<div className="flex flex-col items-end">
							<span className="font-bold text-[10px] text-primary/70 uppercase tracking-wider">
								Semester CGPA
							</span>
							<span className="font-black text-3xl text-primary">
								{semester.subjects
									? calculateSemesterCGPA(semester.subjects)
									: "0.00"}
							</span>
						</div>
					</Card>
				</div>
			</div>

			{/* Content Grid */}
			<div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
				{/* Main Subjects List */}
				<div className="flex flex-col gap-6 lg:col-span-3">
					{!subjects || subjects.length === 0 ? (
						<Card className="border-dashed py-20 text-center">
							<Calculator
								className="mx-auto mb-4 text-muted-foreground opacity-20"
								data-icon="inline"
							/>
							<h3 className="font-semibold text-lg">No subjects added yet</h3>
							<p className="mt-1 text-muted-foreground">
								Add your subjects to start tracking scores.
							</p>
						</Card>
					) : (
						<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
							{subjects.map((subject: SemesterSubject) => (
								<SubjectCard
									isLocked={!!semester.isLocked}
									key={subject.id}
									projection={projections?.find(
										(p: { subjectId: string }) => p.subjectId === subject.id
									)}
									subject={subject}
									updateEndsem={updateEndsem}
									updateInternal={updateInternal}
								/>
							))}
						</div>
					)}
				</div>

				{/* Sidebar / Stats */}
				<div className="flex flex-col gap-6">
					<Card className="overflow-hidden border-primary/20 shadow-sm">
						<CardHeader className="bg-primary/5 pb-4">
							<div className="flex items-center gap-2">
								<Target className="text-primary" data-icon="inline-start" />
								<CardTitle className="text-sm uppercase tracking-wider">
									Targets & Goals
								</CardTitle>
							</div>
						</CardHeader>
						<CardContent className="flex flex-col gap-6 pt-6">
							<div className="flex flex-col gap-1.5">
								<div className="flex items-center justify-between font-medium text-muted-foreground text-xs uppercase tracking-wider">
									<span>Semester Goal</span>
									<span className="text-foreground">
										{targetSGPA ? Number(targetSGPA).toFixed(2) : "N/A"}
									</span>
								</div>
								<div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
									<div
										className="h-full bg-primary transition-all duration-1000"
										style={{
											width: `${(targetSGPA ? Number(targetSGPA) : 0) * 10}%`,
										}}
									/>
								</div>
							</div>

							<div className="pt-2">
								<div className="mb-3 flex items-center gap-2">
									<TrendingUp
										className="text-emerald-500"
										data-icon="inline-start"
									/>
									<span className="font-bold text-xs uppercase tracking-wider">
										Performance Index
									</span>
								</div>
								<div className="flex flex-col gap-3">
									<div className="flex items-center justify-between text-sm">
										<span className="text-muted-foreground">Completion</span>
										<span className="font-semibold">
											{calculateCompletion(subjects)}%
										</span>
									</div>
									<div className="flex items-center justify-between text-sm">
										<span className="text-muted-foreground">
											Total Subjects
										</span>
										<span className="font-semibold">
											{subjects?.length || 0}
										</span>
									</div>
									<div className="flex items-center justify-between text-sm">
										<span className="text-muted-foreground">
											Active Credits
										</span>
										<span className="font-semibold">
											{subjects?.reduce(
												(sum: number, s: SemesterSubject) =>
													sum + s.creditHours,
												0
											) || 0}
										</span>
									</div>
								</div>
							</div>
						</CardContent>
						<CardFooter className="border-t bg-slate-50/50 py-4">
							<p className="text-[10px] text-muted-foreground italic leading-relaxed">
								* Required marks are calculated based on your target CGPA of{" "}
								{targetSGPA || "8.00"}.
							</p>
						</CardFooter>
					</Card>

					{semester.isActive ? (
						<div className="flex gap-4 rounded-xl border border-emerald-100 bg-emerald-50 p-5">
							<CheckCircle2
								className="shrink-0 text-emerald-500"
								data-icon="inline-start"
							/>
							<div>
								<h4 className="font-bold text-emerald-900 text-sm">
									Current Semester
								</h4>
								<p className="mt-1 text-emerald-700 text-xs leading-relaxed">
									This is your active semester. All dashboard calculations and
									trend charts will prioritize these scores.
								</p>
							</div>
						</div>
					) : null}

					{semester.isLocked ? (
						<div className="flex gap-4 rounded-xl border border-amber-100 bg-amber-50 p-5">
							<Lock
								className="shrink-0 text-amber-500"
								data-icon="inline-start"
							/>
							<div>
								<h4 className="font-bold text-amber-900 text-sm">
									Future Semester
								</h4>
								<p className="mt-1 text-amber-700 text-xs leading-relaxed">
									This semester hasn't started yet. You can view subjects and
									goals, but score editing is disabled until the start date.
								</p>
							</div>
						</div>
					) : null}
				</div>
			</div>
		</div>
	);
}

interface Projection {
	achievable: boolean;
	maxAchievableGP: number;
	maxAchievablePercentage: number;
	required: number;
}

interface SubjectCardProps {
	isLocked?: boolean;
	projection?: Projection;
	subject: SemesterSubject;
	updateEndsem: (val: {
		subjectId: string;
		endsemMarks: number | null;
	}) => void;
	updateInternal: (val: {
		subjectId: string;
		internalMarks: number | null;
	}) => void;
}

function SubjectCard({
	subject,
	projection,
	updateInternal,
	updateEndsem,
	isLocked,
}: SubjectCardProps) {
	const score = subject.scores[0];

	return (
		<Card
			className="group relative overflow-hidden border-slate-200/60 transition-all hover:shadow-lg"
			key={subject.id}
		>
			<CardHeader className="flex flex-row items-start justify-between gap-0 pb-3">
				<div className="flex flex-col gap-1">
					<CardTitle className="text-lg leading-tight transition-colors group-hover:text-primary">
						{subject.name}
					</CardTitle>
					<CardDescription className="font-medium">
						{subject.creditHours} Credits
					</CardDescription>
				</div>
			</CardHeader>
			<CardContent className="flex flex-col gap-6">
				<div className="grid grid-cols-2 gap-4">
					<ScoreInput
						disabled={isLocked}
						label="Internal"
						max={subject.maxInternalMarks}
						onValueChange={(val) =>
							updateInternal({
								subjectId: subject.id,
								internalMarks: val,
							})
						}
						value={score?.internalMarks ? Number(score.internalMarks) : null}
					/>
					<ScoreInput
						disabled={isLocked}
						label="End-Sem"
						max={subject.maxEndsemMarks}
						onValueChange={(val) =>
							updateEndsem({
								subjectId: subject.id,
								endsemMarks: val,
							})
						}
						value={score?.endsemMarks ? Number(score.endsemMarks) : null}
					/>
				</div>

				{/* Result Summary */}
				<div className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50/80 p-3">
					<div className="flex items-center gap-2">
						<div
							className={cn(
								"flex size-8 items-center justify-center rounded-full font-bold text-xs",
								score?.gradePoint && Number(score.gradePoint) >= 4
									? "bg-emerald-500/10 text-emerald-600"
									: "bg-slate-200 text-slate-500"
							)}
						>
							{score?.gradePoint ? Number(score.gradePoint).toFixed(0) : "—"}
						</div>
						<div className="flex flex-col">
							<span className="font-bold text-[10px] text-muted-foreground uppercase tracking-wider">
								Grade Point
							</span>
							<span className="font-semibold text-xs">
								{score?.gradePoint
									? getGradeLabel(Number(score.gradePoint))
									: "Pending"}
							</span>
						</div>
					</div>

					{projection && !score?.endsemMarks ? (
						<div className="text-right">
							<p className="font-bold text-[10px] text-primary/70 uppercase tracking-wider">
								Target Need
							</p>
							<div
								className={cn(
									"font-bold text-xs",
									projection.achievable ? "text-emerald-500" : "text-rose-500"
								)}
							>
								{projection.achievable ? (
									`${projection.required.toFixed(1)} marks`
								) : (
									<div className="flex flex-col items-end text-[10px]">
										<span>Unachievable</span>
										<span className="font-normal opacity-70">
											(Max GP: {projection.maxAchievableGP})
										</span>
									</div>
								)}
							</div>
						</div>
					) : null}
				</div>
			</CardContent>
		</Card>
	);
}

interface SemesterSubject {
	creditHours: number;
	id: string;
	maxEndsemMarks: number;
	maxInternalMarks: number;
	name: string;
	scores: {
		endsemMarks: string | null;
		gradePoint: string | null;
		internalMarks: string | null;
	}[];
}

function calculateSemesterCGPA(
	subjects: { creditHours: number; scores: { gradePoint: string | null }[] }[]
) {
	const completed = subjects.filter((s) => s.scores[0]?.gradePoint !== null);
	if (completed.length === 0) {
		return "0.00";
	}

	const totalPoints = completed.reduce(
		(sum, s) => sum + Number(s.scores[0]?.gradePoint) * s.creditHours,
		0
	);
	const totalCredits = completed.reduce((sum, s) => sum + s.creditHours, 0);

	return (totalPoints / totalCredits).toFixed(2);
}

function calculateCompletion(
	subjects: { scores: { endsemMarks: string | null }[] }[] | undefined
) {
	if (!subjects || subjects.length === 0) {
		return 0;
	}
	const completed = subjects.filter(
		(s) => s.scores[0]?.endsemMarks !== null
	).length;
	return Math.round((completed / subjects.length) * 100);
}

function getGradeLabel(gp: number) {
	if (gp >= 10) {
		return "O (Outstanding)";
	}
	if (gp >= 9) {
		return "A+ (Excellent)";
	}
	if (gp >= 8) {
		return "A (Very Good)";
	}
	if (gp >= 7) {
		return "B+ (Good)";
	}
	if (gp >= 6) {
		return "B (Above Average)";
	}
	if (gp >= 5) {
		return "C (Average)";
	}
	if (gp >= 4) {
		return "P (Pass)";
	}
	return "F (Fail)";
}

function SemesterDetailSkeleton() {
	return (
		<div className="flex flex-col gap-8">
			<div className="flex flex-col gap-4 border-b pb-8">
				<Skeleton className="h-6 w-32" />
				<div className="flex items-end justify-between">
					<Skeleton className="h-12 w-64" />
					<div className="flex gap-4">
						<Skeleton className="h-16 w-32" />
						<Skeleton className="h-12 w-40" />
					</div>
				</div>
			</div>
			<div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:col-span-3">
					{[1, 2, 3, 4].map((i) => (
						<Skeleton className="h-64 w-full rounded-xl" key={i} />
					))}
				</div>
				<Skeleton className="h-[400px] w-full rounded-xl" />
			</div>
		</div>
	);
}
