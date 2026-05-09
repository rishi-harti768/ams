"use client";

import { Button } from "@ams/ui/components/button";
import { Checkbox } from "@ams/ui/components/checkbox";
import { Input } from "@ams/ui/components/input";
import { Label } from "@ams/ui/components/label";
import { useForm } from "@tanstack/react-form";

export interface SemesterFormValues {
	academicYear?: string;
	isActive: boolean;
	name: string;
	targetCGPA?: number;
}

interface SemesterFormProps {
	initialValues?: Partial<SemesterFormValues>;
	isLoading?: boolean;
	onCancel?: () => void;
	onSubmit: (values: SemesterFormValues) => void;
}

export function SemesterForm({
	initialValues,
	onSubmit,
	onCancel,
	isLoading,
}: SemesterFormProps) {
	const form = useForm({
		defaultValues: {
			name: initialValues?.name ?? "",
			academicYear: initialValues?.academicYear ?? "",
			isActive: initialValues?.isActive ?? false,
			targetCGPA: initialValues?.targetCGPA ?? 8.0,
		} as SemesterFormValues,
		onSubmit: ({ value }) => {
			onSubmit(value);
		},
	});

	return (
		<form
			className="grid gap-6"
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
		>
			<form.Field
				name="name"
				validators={{
					onChange: ({ value }) => (value ? undefined : "Name is required"),
				}}
			>
				{(field) => (
					<div className="grid gap-2">
						<Label
							className="font-semibold text-[11px] uppercase"
							htmlFor={field.name}
						>
							Semester Name
						</Label>
						<Input
							className="h-10 px-3 text-sm"
							id={field.name}
							name={field.name}
							onBlur={field.handleBlur}
							onChange={(e) => field.handleChange(e.target.value)}
							placeholder="e.g. Fall 2025"
							value={field.state.value}
						/>
						{field.state.meta.errors.length > 0 && (
							<p className="px-1 font-medium text-[10px] text-rose-500">
								{field.state.meta.errors.join(", ")}
							</p>
						)}
					</div>
				)}
			</form.Field>

			<div className="grid grid-cols-2 gap-4">
				<form.Field name="academicYear">
					{(field) => (
						<div className="grid gap-2">
							<Label
								className="font-semibold text-[11px] uppercase"
								htmlFor={field.name}
							>
								Academic Year
							</Label>
							<Input
								className="h-10"
								id={field.name}
								name={field.name}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								placeholder="e.g. 2025-26"
								value={field.state.value}
							/>
						</div>
					)}
				</form.Field>

				<form.Field
					name="targetCGPA"
					validators={{
						onChange: ({ value }) =>
							value && (value < 0 || value > 10)
								? "Must be between 0 and 10"
								: undefined,
					}}
				>
					{(field) => (
						<div className="grid gap-2">
							<Label
								className="font-semibold text-[11px] uppercase"
								htmlFor={field.name}
							>
								Target CGPA
							</Label>
							<Input
								className="h-10"
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
							{field.state.meta.errors.length > 0 && (
								<p className="font-medium text-[10px] text-rose-500">
									{field.state.meta.errors.join(", ")}
								</p>
							)}
						</div>
					)}
				</form.Field>
			</div>

			<form.Field name="isActive">
				{(field) => (
					<div className="flex items-center space-x-2">
						<Checkbox
							checked={field.state.value}
							id={field.name}
							onCheckedChange={(checked) => field.handleChange(!!checked)}
						/>
						<Label
							className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
							htmlFor={field.name}
						>
							Set as Active Semester
						</Label>
					</div>
				)}
			</form.Field>

			<div className="flex items-center justify-end gap-3 border-t pt-6">
				{onCancel && (
					<Button
						className="h-10 px-6"
						disabled={isLoading}
						onClick={onCancel}
						type="button"
						variant="outline"
					>
						Cancel
					</Button>
				)}
				<Button className="h-10 px-10" disabled={isLoading} type="submit">
					{isLoading ? "Saving..." : "Save Semester"}
				</Button>
			</div>
		</form>
	);
}
