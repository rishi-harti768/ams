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
import {
	useCGPAProjection,
	useCumulativeCGPAProjection,
	useDashboardData,
} from "@/hooks/use-cgpa";

export default function Dashboard() {
	const { data, isLoading } = useDashboardData();
	const activeSemesterId = data?.activeSemester?.id;
	const { data: projectionData } = useCGPAProjection(activeSemesterId || "");
	const { data: cumulativeProjection } = useCumulativeCGPAProjection();

	if (isLoading) {
		return <DashboardSkeleton />;
	}

	if (!data) {
		return (
			<div className="flex h-[400px] flex-col items-center justify-center rounded-lg border border-dashed text-center">
				<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
					<Target className="h-6 w-6 text-muted-foreground" />
				</div>
				<h3 className="mt-4 font-semibold text-lg">No academic data found</h3>
				<p className="mt-2 max-w-[280px] text-muted-foreground text-sm">
					Start by adding your first semester to begin tracking your
					performance.
				</p>
				<Button render={<Link href="/semesters" />} nativeButton={false} className="mt-6">
					Get Started
				</Button>
			</div>
		);
	}

	const { profile, currentCumulativeCGPA, semesters, activeSemester } = data;
	const targetCumulative = profile?.targetCumulativeCGPA
		? Number(profile.targetCumulativeCGPA)
		: 8.5;
	const gap = targetCumulative - currentCumulativeCGPA;

	return (
		<div className="fade-in animate-in space-y-8 duration-500">
			{/* Summary Grid */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<CGPACard
					description="Your overall academic standing"
					status="neutral"
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

			{/* Cumulative Goal Projection Alert */}
			{cumulativeProjection &&
				!cumulativeProjection.achievable &&
				cumulativeProjection.remainingSemesters > 0 && (
					<div className="flex gap-4 rounded-xl border border-rose-100 bg-rose-50 p-6">
						<Calculator className="size-6 shrink-0 text-rose-500" />
						<div className="space-y-1">
							<h4 className="font-bold text-rose-900 text-sm">
								Cumulative Goal at Risk
							</h4>
							<p className="text-rose-700 text-xs leading-relaxed">
								To reach your target of{" "}
								{cumulativeProjection.targetCumulativeCGPA.toFixed(2)}, you
								would need an average of{" "}
								<span className="font-black">
									{cumulativeProjection.required.toFixed(2)}
								</span>{" "}
								CGPA in the remaining {cumulativeProjection.remainingSemesters}{" "}
								semesters, which is mathematically unachievable.
							</p>
						</div>
					</div>
				)}

			{cumulativeProjection?.achievable &&
				cumulativeProjection.required > currentCumulativeCGPA && (
					<div className="flex gap-4 rounded-xl border border-blue-100 bg-blue-50 p-6">
						<TrendingUp className="size-6 shrink-0 text-blue-500" />
						<div className="space-y-1">
							<h4 className="font-bold text-blue-900 text-sm">
								Road to Target
							</h4>
							<p className="text-blue-700 text-xs leading-relaxed">
								You need to maintain an average of{" "}
								<span className="font-black">
									{cumulativeProjection.required.toFixed(2)}
								</span>{" "}
								CGPA across the remaining{" "}
								{cumulativeProjection.remainingSemesters} semesters to hit your
								goal.
							</p>
						</div>
					</div>
				)}

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
					<Card className="h-full">
						<CardHeader className="flex flex-row items-center justify-between pb-2">
							<div className="space-y-1">
								<CardTitle className="font-semibold text-base">
									Active Semester
								</CardTitle>
								<CardDescription className="text-xs">
									{activeSemester?.name || "No active semester set"}
								</CardDescription>
							</div>
							<Button render={<Link
									href={
										activeSemester
											? `/semesters/${activeSemester.id}`
											: "/semesters"
									}
								/>} nativeButton={false} size="icon" variant="ghost">
									<ArrowRight className="h-4 w-4" />
							</Button>
						</CardHeader>
						<CardContent>
							{activeSemester ? (
								<div className="space-y-4 pt-2">
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

									<div className="space-y-3">
										<p className="mt-4 font-semibold text-[11px] text-muted-foreground uppercase tracking-wider">
											Subject Performance
										</p>
										{projectionData && projectionData.length > 0 ? (
											<div className="space-y-2">
												{projectionData.slice(0, 4).map((subject) => (
													<div
														className="flex items-center justify-between rounded-md border p-2 text-sm transition-colors hover:bg-muted/30"
														key={subject.subjectId}
													>
														<div className="flex flex-col">
															<span className="max-w-[120px] truncate font-medium">
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
																		Unachievable (Max GP:{" "}
																		{subject.maxAchievableGP})
																	</span>
																)}
															</span>
														</div>
														<div className="flex items-center gap-2">
															{subject.achievable ? (
																<Trophy className="h-3 w-3 text-emerald-500" />
															) : (
																<span className="font-bold text-[10px] text-rose-500 uppercase">
																	Hard
																</span>
															)}
														</div>
													</div>
												))}
												{projectionData.length > 4 && (
													<Button
														render={<Link href={`/semesters/${activeSemester.id}`} />}
														nativeButton={false}
														className="w-full text-xs"
														variant="ghost"
													>
															View all {projectionData.length} subjects
													</Button>
												)}
											</div>
										) : (
											<div className="rounded-lg border border-dashed py-8 text-center">
												<BookOpen className="mx-auto h-8 w-8 text-muted-foreground opacity-20" />
												<p className="mt-2 text-muted-foreground text-xs">
													No subjects added yet
												</p>
											</div>
										)}
									</div>
								</div>
							) : (
								<div className="flex h-[200px] flex-col items-center justify-center text-center">
									<Calculator className="h-8 w-8 text-muted-foreground opacity-20" />
									<p className="mt-2 text-muted-foreground text-sm">
										Set a semester as active to see breakdown
									</p>
								</div>
							)}
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}

function DashboardSkeleton() {
	return (
		<div className="space-y-8">
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{[1, 2, 3, 4].map((i) => (
					<Skeleton className="h-32 w-full rounded-xl" key={i} />
				))}
			</div>
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
				<Skeleton className="h-[400px] rounded-xl lg:col-span-2" />
				<Skeleton className="h-[400px] rounded-xl lg:col-span-1" />
			</div>
		</div>
	);
}
