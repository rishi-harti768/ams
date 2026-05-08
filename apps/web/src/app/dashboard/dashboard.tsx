"use client";

import { Button } from "@ams/ui/components/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@ams/ui/components/card";
import { CGPACard } from "@ams/ui/components/cgpa-card";
import { CGPAChart } from "@ams/ui/components/cgpa-chart";
import { Skeleton } from "@ams/ui/components/skeleton";
import {
	ArrowRight,
	BookOpen,
	Calculator,
	Target,
	TrendingUp,
	Trophy,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import {
	useCGPAProjection,
	useCumulativeCGPAProjection,
	useDashboardData,
} from "@/hooks/use-cgpa";

export default function Dashboard() {
	const router = useRouter();
	const { data, isLoading, isFetching } = useDashboardData();
	const { data: cumulativeProjection } = useCumulativeCGPAProjection();
	const activeSemesterId = data?.activeSemester?.id;
	const { data: projectionData } = useCGPAProjection(activeSemesterId || "");

	// Guard: Redirect to onboarding if profile is missing
	useEffect(() => {
		if (!isLoading && !isFetching && data && !data.profile) {
			router.replace("/onboarding");
		}
	}, [data, isLoading, isFetching, router]);

	if (isLoading) {
		return <DashboardSkeleton />;
	}

	if (!data) {
		return <DashboardEmptyState />;
	}

	const { profile, currentCumulativeCGPA, semesters, activeSemester } = data;
	const targetCumulative = profile?.targetCumulativeCGPA
		? Number(profile.targetCumulativeCGPA)
		: 8.5;
	const gap = targetCumulative - currentCumulativeCGPA;

	return (
		<div className="fade-in flex animate-in flex-col gap-8 duration-500">
			{/* Summary Grid */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<CGPACard
					description="Your overall academic standing"
					target={targetCumulative}
					title="Cumulative CGPA"
					value={currentCumulativeCGPA || "N/A"}
				/>
				<CGPACard
					description="Your set goal for the degree"
					title="Target CGPA"
					value={targetCumulative}
				/>
				<CGPACard
					className={gap > 0 ? "bg-amber-500/5" : "bg-emerald-500/5"}
					description={gap > 0 ? "Needed to hit target" : "Above your target"}
					title="Current Gap"
					value={Math.abs(gap).toFixed(2)}
				/>
				<CGPACard
					description={activeSemester?.name || "No active semester"}
					target={activeSemester?.targetCGPA || undefined}
					title="Active Semester"
					value={activeSemester?.cgpa || "Pending"}
				/>
			</div>

			<DashboardAlerts
				currentCumulativeCGPA={currentCumulativeCGPA}
				projection={cumulativeProjection}
			/>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
				{/* Chart Section */}
				<div className="lg:col-span-2">
					<CGPAChart
						data={semesters
							.map((s) => ({
								name: s.name,
								cgpa: s.cgpa,
							}))
							.reverse()}
						targetCGPA={targetCumulative}
					/>
				</div>

				{/* Active Semester Breakdown */}
				<div className="lg:col-span-1">
					<ActiveSemesterBreakdown
						activeSemester={activeSemester}
						projectionData={projectionData}
					/>
				</div>
			</div>
		</div>
	);
}

function DashboardEmptyState() {
	return (
		<div className="flex h-[400px] flex-col items-center justify-center rounded-lg border border-dashed text-center">
			<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
				<Target className="h-6 w-6 text-muted-foreground" />
			</div>
			<h3 className="mt-4 font-semibold text-lg">No academic data found</h3>
			<p className="mt-2 max-w-[280px] text-muted-foreground text-sm">
				Start by adding your first semester to begin tracking your performance.
			</p>
			<Button
				className="mt-6"
				nativeButton={false}
				render={<Link href="/semesters" />}
			>
				Get Started
			</Button>
		</div>
	);
}

function DashboardAlerts({
	projection,
	currentCumulativeCGPA,
}: {
	projection: ReturnType<typeof useCumulativeCGPAProjection>["data"];
	currentCumulativeCGPA: number;
}) {
	if (!projection) {
		return null;
	}

	if (!projection.achievable && projection.remainingSemesters > 0) {
		return (
			<div className="flex gap-4 rounded-xl border border-rose-100 bg-rose-50 p-6">
				<Calculator
					className="shrink-0 text-rose-500"
					data-icon="inline-start"
				/>
				<div className="flex flex-col gap-1">
					<h4 className="font-bold text-rose-900 text-sm">
						Cumulative Goal at Risk
					</h4>
					<p className="text-rose-700 text-xs leading-relaxed">
						To reach your target of {projection.targetCumulativeCGPA.toFixed(2)}
						, you would need an average of{" "}
						<span className="font-black">{projection.required.toFixed(2)}</span>{" "}
						CGPA in the remaining {projection.remainingSemesters} semesters,
						which is mathematically unachievable.
					</p>
				</div>
			</div>
		);
	}

	if (projection.achievable && projection.required > currentCumulativeCGPA) {
		return (
			<div className="flex gap-4 rounded-xl border border-blue-100 bg-blue-50 p-6">
				<TrendingUp
					className="shrink-0 text-blue-500"
					data-icon="inline-start"
				/>
				<div className="flex flex-col gap-1">
					<h4 className="font-bold text-blue-900 text-sm">Road to Target</h4>
					<p className="text-blue-700 text-xs leading-relaxed">
						You need to maintain an average of{" "}
						<span className="font-black">{projection.required.toFixed(2)}</span>{" "}
						CGPA across the remaining {projection.remainingSemesters} semesters
						to hit your goal.
					</p>
				</div>
			</div>
		);
	}

	return null;
}

function ActiveSemesterBreakdown({
	activeSemester,
	projectionData,
}: {
	activeSemester: NonNullable<
		ReturnType<typeof useDashboardData>["data"]
	>["activeSemester"];
	projectionData:
		| NonNullable<ReturnType<typeof useCGPAProjection>["data"]>
		| null
		| undefined;
}) {
	return (
		<Card className="h-full">
			<CardHeader className="flex flex-row items-center justify-between pb-2">
				<div className="flex flex-col gap-1">
					<CardTitle className="font-semibold text-base">
						Active Semester
					</CardTitle>
					<CardDescription className="text-xs">
						{activeSemester?.name || "No active semester set"}
					</CardDescription>
				</div>
				<Button
					nativeButton={false}
					render={
						<Link
							href={
								activeSemester
									? `/semesters/${activeSemester.id}`
									: "/semesters"
							}
						/>
					}
					size="icon"
					variant="ghost"
				>
					<ArrowRight data-icon="inline" />
				</Button>
			</CardHeader>
			<CardContent>
				{activeSemester ? (
					<div className="flex flex-col gap-4 pt-2">
						<div className="grid grid-cols-2 gap-4">
							<div className="rounded-lg bg-muted/40 p-3">
								<p className="font-semibold text-[10px] text-muted-foreground uppercase tracking-wider">
									Total Credits
								</p>
								<p className="mt-1 font-bold text-xl">
									{activeSemester.totalCredits}
								</p>
							</div>
							<div className="rounded-lg bg-primary/5 p-3">
								<p className="font-semibold text-[10px] text-primary/70 uppercase tracking-wider">
									Target
								</p>
								<p className="mt-1 font-bold text-xl">
									{activeSemester.targetCGPA?.toFixed(2) || "N/A"}
								</p>
							</div>
						</div>

						<div className="flex flex-col gap-3">
							<p className="mt-4 font-semibold text-[11px] text-muted-foreground uppercase tracking-wider">
								Subject Performance
							</p>
							{projectionData && projectionData.length > 0 ? (
								<div className="flex flex-col gap-2">
									{projectionData.slice(0, 4).map((subject) => (
										<div
											className="flex items-center justify-between rounded-md border p-2 text-sm transition-colors hover:bg-muted/30"
											key={subject.subjectId}
										>
											<div className="flex flex-col">
												<span className="max-w-30 truncate font-medium">
													{subject.name}
												</span>
												<span className="text-[10px] text-muted-foreground">
													{subject.achievable ? (
														<>
															Need:{" "}
															<span className="font-semibold text-emerald-500">
																{subject.required.toFixed(1)}
															</span>
														</>
													) : (
														<span className="font-semibold text-rose-500">
															Unachievable (Max GP: {subject.maxAchievableGP})
														</span>
													)}
												</span>
											</div>
											<div className="flex items-center gap-2">
												{subject.achievable ? (
													<Trophy
														className="text-emerald-500"
														data-icon="inline"
													/>
												) : (
													<span className="font-bold text-[10px] text-rose-500 uppercase">
														Hard
													</span>
												)}
											</div>
										</div>
									))}
									{projectionData.length > 4 ? (
										<Button
											className="w-full text-xs"
											nativeButton={false}
											render={<Link href={`/semesters/${activeSemester.id}`} />}
											variant="ghost"
										>
											View all {projectionData.length} subjects
										</Button>
									) : null}
								</div>
							) : (
								<div className="rounded-lg border border-dashed py-8 text-center">
									<BookOpen
										className="mx-auto mb-4 text-muted-foreground opacity-20"
										data-icon="inline"
									/>
									<p className="mt-2 text-muted-foreground text-xs">
										No subjects added yet
									</p>
								</div>
							)}
						</div>
					</div>
				) : (
					<div className="flex h-50 flex-col items-center justify-center text-center">
						<Calculator
							className="mx-auto mb-4 text-muted-foreground opacity-20"
							data-icon="inline"
						/>
						<p className="mt-2 text-muted-foreground text-sm">
							Set a semester as active to see breakdown
						</p>
					</div>
				)}
			</CardContent>
		</Card>
	);
}

function DashboardSkeleton() {
	return (
		<div className="flex flex-col gap-8">
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{[1, 2, 3, 4].map((i) => (
					<Skeleton className="h-32 w-full rounded-xl" key={i} />
				))}
			</div>
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
				<Skeleton className="h-100 rounded-xl lg:col-span-2" />
				<Skeleton className="h-100 rounded-xl lg:col-span-1" />
			</div>
		</div>
	);
}
