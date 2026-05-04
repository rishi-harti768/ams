"use client";

import { cn } from "@ams/ui/lib/utils";
import { useEffect, useRef, useState } from "react";
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

	const prevValueRef = useRef(value);

	// Sync local state with prop value when it changes externally
	useEffect(() => {
		if (value !== prevValueRef.current) {
			prevValueRef.current = value;
			const parsedInput =
				inputValue === "" ? null : Number.parseFloat(inputValue);
			if (parsedInput !== value) {
				setInputValue(value === null ? "" : value.toString());
			}
		}
	}, [value, inputValue]);

	// Debounce value changes to avoid race conditions and jumping cursors
	useEffect(() => {
		const timer = setTimeout(() => {
			if (inputValue === "") {
				if (value !== null) {
					onValueChange(null);
				}
			} else {
				const num = Number.parseFloat(inputValue);
				if (!Number.isNaN(num) && num !== value) {
					onValueChange(num);
				}
			}
		}, 400);
		return () => clearTimeout(timer);
	}, [inputValue, value, onValueChange]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value);
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
