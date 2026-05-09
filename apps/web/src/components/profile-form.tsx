"use client";

import { Button } from "@ams/ui/components/button";
import { Label } from "@ams/ui/components/label";
import { Slider } from "@ams/ui/components/slider";
import { useForm } from "@tanstack/react-form";

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
						<div className="grid gap-6">
							<div className="flex items-center justify-between">
								<Label
									className="font-semibold text-[11px] text-slate-500 uppercase tracking-wider"
									htmlFor={field.name}
								>
									Target Cumulative CGPA
								</Label>
								<span className="font-bold text-2xl text-primary tabular-nums">
									{(field.state.value ?? 8.0).toFixed(1)}
								</span>
							</div>

							<div className="px-1">
								<Slider
									max={10}
									min={0}
									onValueChange={(val) => {
										const num = Array.isArray(val) ? val[0] : val;
										if (typeof num === "number") {
											field.handleChange(num);
										}
									}}
									step={0.1}
									value={[field.state.value ?? 8.0]}
								/>
							</div>

							<div className="flex justify-between px-1 font-medium text-[10px] text-slate-400">
								<span>0.0</span>
								<span>2.5</span>
								<span>5.0</span>
								<span>7.5</span>
								<span>10.0</span>
							</div>

							{field.state.meta.errors.length > 0 && (
								<p className="font-medium text-[10px] text-rose-500">
									{field.state.meta.errors.join(", ")}
								</p>
							)}
							<p className="text-pretty text-[12px] text-slate-500 leading-relaxed">
								Drag the slider to set your graduation goal. This target will
								drive your semester-by-semester grade projections.
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
