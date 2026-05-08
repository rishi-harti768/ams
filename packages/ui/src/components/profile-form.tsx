"use client";

import { useForm } from "@tanstack/react-form";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";

export interface ProfileFormValues {
	targetCumulativeCGPA?: number;
}

interface ProfileFormProps {
	initialValues?: Partial<ProfileFormValues>;
	isLoading?: boolean;
	onSubmit: (values: ProfileFormValues) => void;
}

export function ProfileForm({
	initialValues,
	onSubmit,
	isLoading,
}: ProfileFormProps) {
	const form = useForm({
		defaultValues: {
			targetCumulativeCGPA: initialValues?.targetCumulativeCGPA ?? 8.0,
		} as ProfileFormValues,
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
			<div className="grid gap-4">
				<form.Field
					name="targetCumulativeCGPA"
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
								Target Cumulative CGPA
							</Label>
							<Input
								className="h-10"
								id={field.name}
								max="10"
								min="0"
								onBlur={field.handleBlur}
								onChange={(e) =>
									field.handleChange(
										e.target.value === ""
											? undefined
											: Number.parseFloat(e.target.value)
									)
								}
								placeholder="e.g. 8.50"
								step="0.01"
								type="number"
								value={field.state.value ?? ""}
							/>
							{field.state.meta.errors.length > 0 && (
								<p className="font-medium text-[10px] text-rose-500">
									{field.state.meta.errors.join(", ")}
								</p>
							)}
							<p className="text-[11px] text-muted-foreground">
								Enter the cumulative CGPA you aim to achieve by graduation.
							</p>
						</div>
					)}
				</form.Field>
			</div>

			<Button
				className="h-12 w-full font-semibold text-sm"
				disabled={isLoading}
				type="submit"
			>
				{isLoading ? "Saving Profile…" : "Save Preferences"}
			</Button>
		</form>
	);
}
