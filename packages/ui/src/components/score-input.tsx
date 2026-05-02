"use client";

import { cn } from "@ams/ui/lib/utils";
import { useEffect, useState } from "react";
import { Input } from "./input";
import { Label } from "./label";

interface ScoreInputProps
	extends Omit<React.ComponentProps<typeof Input>, "value" | "onChange"> {
	error?: string;
	label?: string;
	max: number;
	onValueChange: (value: number | null) => void;
	value: number | null;
}

export function ScoreInput({
	label,
	max,
	value,
	onValueChange,
	error,
	className,
	...props
}: ScoreInputProps) {
	const [inputValue, setInputValue] = useState(
		value === null ? "" : value.toString()
	);

	// Sync local state with prop value when it changes externally
	useEffect(() => {
		const stringValue = value === null ? "" : value.toString();
		if (stringValue !== inputValue) {
			setInputValue(stringValue);
		}
	}, [value, inputValue]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const val = e.target.value;
		setInputValue(val);

		if (val === "") {
			onValueChange(null);
			return;
		}

		const num = Number.parseFloat(val);
		if (!Number.isNaN(num)) {
			onValueChange(num);
		}
	};

	const isOverMax = value !== null && value > max;
	const currentError =
		error || (isOverMax ? `Cannot exceed ${max}` : undefined);

	return (
		<div className={cn("grid w-full gap-1.5", className)}>
			{label && (
				<div className="flex items-center justify-between px-0.5">
					<Label
						className={cn("text-[11px]", currentError && "text-destructive")}
					>
						{label}
					</Label>
					<span className="font-medium text-[10px] text-muted-foreground uppercase tracking-tight">
						Max: {max}
					</span>
				</div>
			)}
			<Input
				aria-invalid={!!currentError}
				className={cn(
					"h-9 px-3",
					currentError && "border-destructive focus-visible:ring-destructive/20"
				)}
				max={max}
				min="0"
				onChange={handleChange}
				step="0.01"
				type="number"
				value={inputValue}
				{...props}
			/>
			{currentError && (
				<p className="fade-in slide-in-from-top-1 animate-in px-1 font-medium text-[10px] text-rose-500">
					{currentError}
				</p>
			)}
		</div>
	);
}
