"use client";

import { cn } from "@ams/ui/lib/utils";
import { useForm } from "@tanstack/react-form";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";

export interface SubjectFormValues {
	creditHours: number;
	maxEndsemMarks: number;
	maxInternalMarks: number;
	name: string;
}

interface SubjectFormProps {
	initialValues?: Partial<SubjectFormValues>;
	isLoading?: boolean;
	onCancel?: () => void;
	onSubmit: (values: SubjectFormValues) => void;
}

export function SubjectForm({
	initialValues,
	onSubmit,
	onCancel,
	isLoading,
}: SubjectFormProps) {
	const form = useForm({
		defaultValues: {
			name: initialValues?.name ?? "",
			creditHours: initialValues?.creditHours ?? 3,
			maxInternalMarks: initialValues?.maxInternalMarks ?? 40,
			maxEndsemMarks: initialValues?.maxEndsemMarks ?? 60,
		} as SubjectFormValues,
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
							Subject Name
						</Label>
						<Input
							aria-invalid={!!field.state.meta.errors.length}
							className={cn(
								"h-10 px-3 text-sm",
								field.state.meta.errors.length > 0 &&
									"border-destructive focus-visible:ring-destructive/20"
							)}
							id={field.name}
							name={field.name}
							onBlur={field.handleBlur}
							onChange={(e) => field.handleChange(e.target.value)}
							placeholder="e.g. Advanced Calculus"
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

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
				<form.Field
					name="creditHours"
					validators={{
						onChange: ({ value }) =>
							value <= 0 ? "Must be at least 1" : undefined,
					}}
				>
					{(field) => (
						<div className="grid gap-2">
							<Label
								className="font-semibold text-[11px] uppercase"
								htmlFor={field.name}
							>
								Credits
							</Label>
							<Input
								className="h-10"
								id={field.name}
								min="1"
								onBlur={field.handleBlur}
								onChange={(e) =>
									field.handleChange(Number.parseInt(e.target.value, 10))
								}
								type="number"
								value={field.state.value}
							/>
						</div>
					)}
				</form.Field>

				<form.Field
					name="maxInternalMarks"
					validators={{
						onChange: ({ value }) =>
							value <= 0 ? "Must be at least 1" : undefined,
					}}
				>
					{(field) => (
						<div className="grid gap-2">
							<Label
								className="font-semibold text-[11px] uppercase"
								htmlFor={field.name}
							>
								Max Internal
							</Label>
							<Input
								className="h-10"
								id={field.name}
								min="1"
								onBlur={field.handleBlur}
								onChange={(e) =>
									field.handleChange(Number.parseInt(e.target.value, 10))
								}
								type="number"
								value={field.state.value}
							/>
						</div>
					)}
				</form.Field>

				<form.Field
					name="maxEndsemMarks"
					validators={{
						onChange: ({ value }) =>
							value <= 0 ? "Must be at least 1" : undefined,
					}}
				>
					{(field) => (
						<div className="grid gap-2">
							<Label
								className="font-semibold text-[11px] uppercase"
								htmlFor={field.name}
							>
								Max EndSem
							</Label>
							<Input
								className="h-10"
								id={field.name}
								min="1"
								onBlur={field.handleBlur}
								onChange={(e) =>
									field.handleChange(Number.parseInt(e.target.value, 10))
								}
								type="number"
								value={field.state.value}
							/>
						</div>
					)}
				</form.Field>
			</div>

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
					{isLoading ? "Saving..." : "Save Subject"}
				</Button>
			</div>
		</form>
	);
}
