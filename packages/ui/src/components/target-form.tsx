"use client";

import { cn } from "@ams/ui/lib/utils";
import { useForm } from "@tanstack/react-form";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";

interface TargetFormProps {
	description?: string;
	initialValue: number | null;
	isLoading?: boolean;
	label: string;
	onSubmit: (value: number) => void;
}

export function TargetForm({
	label,
	description,
	initialValue,
	onSubmit,
	isLoading,
}: TargetFormProps) {
	const form = useForm({
		defaultValues: {
			target: initialValue ?? 8.0,
		},
		onSubmit: ({ value }) => {
			onSubmit(value.target);
		},
	});

	return (
		<form
			className="grid gap-4"
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
		>
			<form.Field
				name="target"
				validators={{
					onChange: ({ value }) => {
						if (value < 0 || value > 10) {
							return "Target must be between 0 and 10";
						}
						return;
					},
				}}
			>
				{(field) => (
					<div className="grid gap-2">
						<div className="flex flex-col gap-0.5">
							<Label
								className="font-semibold text-[11px] uppercase"
								htmlFor={field.name}
							>
								{label}
							</Label>
							{description && (
								<p className="text-[10px] text-muted-foreground">
									{description}
								</p>
							)}
						</div>
						<div className="flex gap-2">
							<Input
								className={cn(
									"h-10 text-sm",
									field.state.meta.errors.length > 0 &&
										"border-destructive focus-visible:ring-destructive/20"
								)}
								id={field.name}
								max="10"
								min="0"
								onBlur={field.handleBlur}
								onChange={(e) =>
									field.handleChange(Number.parseFloat(e.target.value))
								}
								step="0.01"
								type="number"
								value={field.state.value}
							/>
							<Button className="h-10 px-6" disabled={isLoading} type="submit">
								{isLoading ? "..." : "Set"}
							</Button>
						</div>
						{field.state.meta.errors.length > 0 && (
							<p className="px-1 font-medium text-[10px] text-rose-500">
								{field.state.meta.errors.join(", ")}
							</p>
						)}
					</div>
				)}
			</form.Field>
		</form>
	);
}
