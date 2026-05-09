"use client";

import { Badge } from "@ams/ui/components/badge";
import { Button } from "@ams/ui/components/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@ams/ui/components/card";
import { Skeleton } from "@ams/ui/components/skeleton";
import { cn } from "@ams/ui/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
	ArrowUpRight,
	Calendar,
	Lock,
	RefreshCcw,
	Target,
	TrendingUp,
	Zap,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { useSemesters } from "@/hooks/use-semesters";
import { orpc } from "@/utils/orpc";

export default function SemesterList() {
	const queryClient = useQueryClient();
	const { data, isLoading } = useSemesters();

	const { mutate: syncTargets, isPending: isSyncing } = useMutation(
		orpc.semester.semesterSyncTargets.mutationOptions({
			onSuccess: (data) => {
				toast.success(
					`Successfully synced targets for ${data.count} semesters`
				);
				queryClient.invalidateQueries({
					queryKey: orpc.semester.semesterList.key(),
				});
			},
			onError: () => {
				toast.error("Failed to sync targets");
			},
		})
	);

	if (isLoading) {
		return <SemesterListSkeleton />;
	}

	const semesters = data?.semesters || [];
	const projection = data?.projection;

	const handleSync = () => {
		if (!projection) {
			return;
		}
		const targetSGPA = Math.min(10, projection.required);
		syncTargets({ targetSGPA });
	};

	return (
		<div className="flex flex-col gap-8">
			<div className="flex flex-col gap-4">
				<div className="flex items-center justify-between">
					<div className="flex flex-col gap-1">
						<h1 className="font-bold text-3xl tracking-tight">Semesters</h1>
						<p className="text-muted-foreground">
							Track your academic performance and targets.
						</p>
					</div>
				</div>

				<TargetTrackerBanner
					isSyncing={isSyncing}
					onSync={handleSync}
					projection={projection}
				/>
			</div>

			{!semesters || semesters.length === 0 ? (
				<EmptyState />
			) : (
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
					{semesters.map((semester) => (
						<SemesterCard key={semester.id} semester={semester} />
					))}
				</div>
			)}
		</div>
	);
}

function TargetTrackerBanner({
	projection,
	isSyncing,
	onSync,
}: {
	projection:
		| NonNullable<ReturnType<typeof useSemesters>["data"]>["projection"]
		| undefined;
	isSyncing: boolean;
	onSync: () => void;
}) {
	if (!projection) {
		return null;
	}

	return (
		<Card
			className={cn(
				"overflow-hidden border-2 transition-all duration-500",
				projection.achievable
					? "border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background"
					: "border-amber-500/20 bg-gradient-to-br from-amber-500/5 via-background to-background shadow-amber-500/5 shadow-lg"
			)}
		>
			<CardContent className="p-6">
				<div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
					<div className="grid flex-1 grid-cols-1 gap-6 sm:grid-cols-3">
						<div className="flex items-center gap-4">
							<div className="rounded-full bg-primary/10 p-3 text-primary">
								<Target className="h-6 w-6" />
							</div>
							<div className="flex flex-col">
								<p className="font-medium text-muted-foreground text-sm">
									Target CGPA
								</p>
								<p className="font-bold text-2xl">
									{projection.targetCumulativeCGPA.toFixed(2)}
								</p>
							</div>
						</div>
						<div className="flex items-center gap-4">
							<div className="rounded-full bg-blue-500/10 p-3 text-blue-500">
								<TrendingUp className="h-6 w-6" />
							</div>
							<div className="flex flex-col">
								<p className="font-medium text-muted-foreground text-sm">
									Current CGPA
								</p>
								<p className="font-bold text-2xl">
									{projection.currentCumulativeCGPA.toFixed(2)}
								</p>
							</div>
						</div>
						<div
							className={cn(
								"flex items-center gap-4 rounded-xl p-4 ring-1 transition-colors duration-500",
								projection.achievable
									? "bg-primary/10 ring-primary/20"
									: "bg-amber-500/10 ring-amber-500/20"
							)}
						>
							<div
								className={cn(
									"rounded-full p-2 text-white shadow-sm",
									projection.achievable ? "bg-primary" : "bg-amber-500"
								)}
							>
								{projection.achievable ? (
									<ArrowUpRight className="h-5 w-5" />
								) : (
									<Zap className="h-5 w-5 fill-current" />
								)}
							</div>
							<div className="flex flex-col">
								<p
									className={cn(
										"font-bold text-xs uppercase tracking-wider",
										projection.achievable ? "text-primary/80" : "text-amber-600"
									)}
								>
									{projection.achievable
										? "Aim SGPA Next Term"
										: "Max Possible CGPA"}
								</p>
								<p
									className={cn(
										"font-black text-2xl",
										projection.achievable ? "text-primary" : "text-amber-600"
									)}
								>
									{projection.achievable
										? projection.required.toFixed(2)
										: projection.maxPossibleCGPA.toFixed(2)}
								</p>
							</div>
						</div>
					</div>

					<div className="flex min-w-[200px] flex-col gap-2">
						<Button
							className={cn(
								"w-full font-bold shadow-sm transition-all active:scale-95",
								!projection.achievable && "bg-amber-600 hover:bg-amber-700"
							)}
							disabled={isSyncing}
							onClick={onSync}
						>
							{isSyncing ? (
								<RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
							) : (
								<Zap className="mr-2 h-4 w-4 fill-current" />
							)}
							Sync All Targets
						</Button>
						{!projection.achievable && (
							<p className="text-center font-bold text-[10px] text-amber-600 uppercase tracking-tight">
								Capping targets at 10.0
							</p>
						)}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

function SemesterCard({
	semester,
}: {
	semester: NonNullable<
		ReturnType<typeof useSemesters>["data"]
	>["semesters"][number];
}) {
	const isUpcoming = semester.status === "upcoming";
	const isOngoing = semester.status === "ongoing";

	if (isUpcoming) {
		return (
			<div
				className={cn(
					"group relative block opacity-80 grayscale-[0.5] transition-all duration-300"
				)}
			>
				<Card className="h-full overflow-hidden border-2 border-transparent transition-colors">
					<SemesterCardBody semester={semester} />
				</Card>
			</div>
		);
	}

	return (
		<Link
			className={cn(
				"group relative block transition-all duration-300 hover:-translate-y-1 hover:shadow-xl active:scale-[0.98]"
			)}
			href={`/semesters/${semester.id}`}
		>
			<Card
				className={cn(
					"h-full overflow-hidden border-2 transition-colors",
					isOngoing
						? "border-primary/50 shadow-md shadow-primary/5"
						: "border-transparent",
					"group-hover:border-primary/30"
				)}
			>
				<SemesterCardBody semester={semester} />
			</Card>
		</Link>
	);
}

function SemesterCardBody({
	semester,
}: {
	semester: NonNullable<
		ReturnType<typeof useSemesters>["data"]
	>["semesters"][number];
}) {
	const isUpcoming = semester.status === "upcoming";
	const isOngoing = semester.status === "ongoing";

	const badgeVariant =
		(
			{
				upcoming: "secondary",
				ongoing: "default",
				completed: "outline",
			} as const
		)[semester.status] || "outline";

	const sgpaLabel =
		(
			{
				ongoing: "Projected SGPA",
				upcoming: "Target SGPA",
				completed: "Final SGPA",
			} as const
		)[semester.status] || "SGPA";

	return (
		<>
			<CardHeader className="pb-2">
				<div className="flex items-start justify-between">
					<div className="space-y-1">
						<CardTitle className="font-bold text-xl transition-colors group-hover:text-primary">
							{semester.name}
						</CardTitle>
						<p className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
							{semester.academicYear || "Academic Year"}
						</p>
					</div>
					<Badge
						className={cn(
							"px-2.5 py-0.5 font-bold text-[10px] uppercase tracking-tight",
							isOngoing &&
								"animate-pulse-subtle bg-primary text-primary-foreground",
							!(isUpcoming || isOngoing) &&
								"border-green-500/50 bg-green-50 text-green-600"
						)}
						variant={badgeVariant}
					>
						{isUpcoming && <Lock className="mr-1 h-3 w-3" />}
						{semester.status}
					</Badge>
				</div>
			</CardHeader>
			<CardContent className="pt-4">
				<div className="relative flex items-center justify-between rounded-2xl bg-muted/40 p-5 ring-1 ring-border/50 transition-colors group-hover:bg-muted/60">
					<div className="flex flex-col">
						<p className="font-black text-[10px] text-muted-foreground uppercase tracking-widest">
							{sgpaLabel}
						</p>
						<p
							className={cn(
								"font-black text-3xl tabular-nums tracking-tighter",
								!isUpcoming && "text-foreground",
								isUpcoming && "text-muted-foreground/50"
							)}
						>
							{isUpcoming
								? semester.targetSGPA?.toFixed(2) || "N/A"
								: semester.sgpa?.toFixed(2) || "0.00"}
						</p>
					</div>

					{!isUpcoming && semester.targetSGPA && (
						<div className="flex flex-col items-end">
							<p className="font-bold text-[10px] text-muted-foreground uppercase">
								Target
							</p>
							<p className="font-bold text-primary/60">
								{semester.targetSGPA.toFixed(2)}
							</p>
						</div>
					)}

					{isUpcoming && (
						<div className="rounded-full bg-background/80 p-2 shadow-sm">
							<Lock className="h-5 w-5 text-muted-foreground/40" />
						</div>
					)}
				</div>

				{!isUpcoming && (
					<div className="mt-4 flex translate-y-2 transform items-center justify-center gap-1.5 font-bold text-primary text-xs opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
						View Details <ArrowUpRight className="h-3.5 w-3.5" />
					</div>
				)}
			</CardContent>
		</>
	);
}

function EmptyState() {
	return (
		<Card className="flex flex-col items-center justify-center border-dashed p-12 text-center">
			<div className="mb-4 rounded-full bg-muted p-4">
				<Calendar className="h-8 w-8 text-muted-foreground" />
			</div>
			<h3 className="font-semibold text-xl">No semesters found</h3>
			<p className="mt-2 max-w-xs text-muted-foreground">
				Contact your administrator to add semesters to your profile.
			</p>
		</Card>
	);
}

function SemesterListSkeleton() {
	return (
		<div className="flex flex-col gap-8">
			<div className="space-y-4">
				<div className="flex flex-col gap-2">
					<Skeleton className="h-10 w-48" />
					<Skeleton className="h-4 w-64" />
				</div>
				<Skeleton className="h-32 w-full rounded-xl" />
			</div>
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
				{[1, 2, 3].map((i) => (
					<Skeleton className="h-56 w-full rounded-2xl" key={i} />
				))}
			</div>
		</div>
	);
}
