"use client";

import {
	CartesianGrid,
	Line,
	LineChart,
	ReferenceLine,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./card";

interface CGPAChartProps {
	data: {
		name: string;
		cgpa: number | null;
	}[];
	targetCGPA?: number | null;
}

export function CGPAChart({ data, targetCGPA }: CGPAChartProps) {
	const chartData = data.map((item) => ({
		...item,
		cgpa: item.cgpa ?? undefined,
	}));

	return (
		<Card className="col-span-full">
			<CardHeader>
				<CardTitle className="font-semibold text-base">CGPA Trend</CardTitle>
				<CardDescription className="text-xs">
					Your academic performance trajectory across semesters.
				</CardDescription>
			</CardHeader>
			<CardContent className="h-[300px] w-full pt-4">
				<ResponsiveContainer height="100%" width="100%">
					<LineChart
						data={chartData}
						margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
					>
						<CartesianGrid
							stroke="var(--border)"
							strokeDasharray="3 3"
							vertical={false}
						/>
						<XAxis
							axisLine={false}
							dataKey="name"
							dy={10}
							fontSize={11}
							stroke="var(--muted-foreground)"
							tickLine={false}
						/>
						<YAxis
							axisLine={false}
							domain={[0, 10]}
							fontSize={11}
							stroke="var(--muted-foreground)"
							tickLine={false}
							ticks={[0, 2, 4, 6, 8, 10]}
						/>
						<Tooltip
							contentStyle={{
								backgroundColor: "var(--card)",
								borderColor: "var(--border)",
								borderRadius: "var(--radius)",
								fontSize: "11px",
								boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
							}}
							cursor={{ stroke: "var(--border)", strokeWidth: 1 }}
							itemStyle={{
								color: "var(--foreground)",
								fontWeight: "bold",
							}}
						/>
						{targetCGPA && (
							<ReferenceLine
								label={{
									value: `Target: ${targetCGPA.toFixed(2)}`,
									position: "insideBottomRight",
									fill: "var(--primary)",
									fontSize: 10,
									fontWeight: "bold",
									dy: -10,
								}}
								stroke="var(--primary)"
								strokeDasharray="4 4"
								strokeWidth={1.5}
								y={targetCGPA}
							/>
						)}
						<Line
							activeDot={{
								fill: "var(--primary)",
								stroke: "var(--background)",
								strokeWidth: 2,
								r: 6,
							}}
							animationDuration={1000}
							dataKey="cgpa"
							dot={{
								fill: "var(--background)",
								stroke: "var(--primary)",
								strokeWidth: 2,
								r: 4,
							}}
							stroke="var(--primary)"
							strokeWidth={3}
							type="monotone"
						/>
					</LineChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
}
