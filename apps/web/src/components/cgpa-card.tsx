import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@ams/ui/components/card";
import { cn } from "@ams/ui/lib/utils";
import { Minus, TrendingDown, TrendingUp } from "lucide-react";
import type * as React from "react";

interface CGPACardProps extends React.ComponentProps<typeof Card> {
	description?: string;
	target?: number;
	title: string;
	value: string | number;
}

export function CGPACard({
	title,
	value,
	target,
	description,
	className,
	...props
}: CGPACardProps) {
	const numericValue =
		typeof value === "number" ? value : Number.parseFloat(value);
	const isPending = Number.isNaN(numericValue);

	let status: "success" | "warning" | "error" | "neutral" = "neutral";
	if (!isPending && target !== undefined) {
		if (numericValue >= target) {
			status = "success";
		} else if (numericValue >= target - 0.5) {
			status = "warning";
		} else {
			status = "error";
		}
	}

	const statusColors = {
		success: "text-emerald-500 dark:text-emerald-400",
		warning: "text-amber-500 dark:text-amber-400",
		error: "text-rose-500 dark:text-rose-400",
		neutral: "text-muted-foreground",
	};

	const statusBg = {
		success: "bg-emerald-500/10 dark:bg-emerald-500/20",
		warning: "bg-amber-500/10 dark:bg-amber-500/20",
		error: "bg-rose-500/10 dark:bg-rose-500/20",
		neutral: "bg-muted/10",
	};

	return (
		<Card
			className={cn(
				"relative overflow-hidden transition-all hover:ring-2 hover:ring-foreground/5",
				className
			)}
			{...props}
		>
			<CardHeader className="pb-2">
				<CardTitle className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
					{title}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="flex items-baseline gap-2">
					<span className="font-bold text-3xl tracking-tight">
						{isPending ? value : numericValue.toFixed(2)}
					</span>
					{target !== undefined && !isPending && (
						<span className="font-medium text-muted-foreground text-sm">
							/ {target.toFixed(2)}
						</span>
					)}
				</div>
				{description && (
					<p className="mt-1 text-muted-foreground text-xs">{description}</p>
				)}
				{!isPending && target !== undefined && (
					<div
						className={cn(
							"mt-4 flex w-fit items-center gap-1 rounded-full px-2 py-0.5 font-medium text-[10px] uppercase tracking-wide",
							statusBg[status],
							statusColors[status]
						)}
					>
						{status === "success" && <TrendingUp className="size-3" />}
						{status === "error" && <TrendingDown className="size-3" />}
						{status === "warning" && <Minus className="size-3" />}
						{status === "success" && "Above Target"}
						{status === "error" && "Below Target"}
						{status === "warning" && "Near Target"}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
