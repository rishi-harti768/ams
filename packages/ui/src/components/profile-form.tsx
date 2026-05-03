"use client";

import { cn } from "@ams/ui/lib/utils";
import { useForm } from "@tanstack/react-form";
import { Button } from "./button";
import { Input } from "./input";
import { Label } from "./label";

export interface ProfileFormValues {
	currentSemester: number;
	institutionName?: string;
	institutionType: "school" | "college";
	targetCumulativeCGPA?: number;
	totalSemesters: number;
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
			institutionType: initialValues?.institutionType ?? "college",
			institutionName: initialValues?.institutionName ?? "",
			currentSemester: initialValues?.currentSemester ?? 1,
			totalSemesters: initialValues?.totalSemesters ?? 8,
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
				<form.Field name="institutionType">
					{(field) => (
						<div className="grid gap-3">
							<Label className="font-semibold text-[11px] uppercase">
								Institution Type
							</Label>
							<div className="flex gap-4">
								<label
									className={cn(
										"flex flex-1 cursor-pointer items-center justify-center rounded-md border bg-popover p-3 hover:bg-accent hover:text-accent-foreground",
										field.state.value === "school" &&
											"border-primary ring-1 ring-primary"
									)}
								>
									<input
										className="sr-only"
										name={field.name}
										onBlur={field.handleBlur}
										onChange={() => field.handleChange("school")}
										type="radio"
										value="school"
									/>
									<span className="font-medium text-sm">School</span>
								</label>
								<label
									className={cn(
										"flex flex-1 cursor-pointer items-center justify-center rounded-md border bg-popover p-3 hover:bg-accent hover:text-accent-foreground",
										field.state.value === "college" &&
											"border-primary ring-1 ring-primary"
									)}
								>
									<input
										className="sr-only"
										name={field.name}
										onBlur={field.handleBlur}
										onChange={() => field.handleChange("college")}
										type="radio"
										value="college"
									/>
									<span className="font-medium text-sm">College</span>
								</label>
							</div>
						</div>
					)}
				</form.Field>

				<form.Field name="institutionName">
					{(field) => (
						<div className="grid gap-2">
							<Label
								className="font-semibold text-[11px] uppercase"
								htmlFor={field.name}
							>
								Institution Name (Optional)
							</Label>
							<Input
								className="h-10"
								id={field.name}
								name={field.name}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								placeholder="e.g. Stanford University"
								value={field.state.value}
							/>
						</div>
					)}
				</form.Field>

				<div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
					<form.Field
						name="currentSemester"
						validators={{
							onChange: ({ value }) =>
								value < 1 || value > 20
									? "Must be between 1 and 20"
									: undefined,
						}}
					>
						{(field) => (
							<div className="grid gap-2">
								<Label
									className="font-semibold text-[11px] uppercase"
									htmlFor={field.name}
								>
									Current Semester
								</Label>
								<Input
									className="h-10"
									id={field.name}
									max="20"
									min="1"
									onBlur={field.handleBlur}
									onChange={(e) =>
										field.handleChange(Number.parseInt(e.target.value, 10))
									}
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

					<form.Field
						name="totalSemesters"
						validators={{
							onChange: ({ value }) =>
								value < 1 || value > 20
									? "Must be between 1 and 20"
									: undefined,
						}}
					>
						{(field) => (
							<div className="grid gap-2">
								<Label
									className="font-semibold text-[11px] uppercase"
									htmlFor={field.name}
								>
									Total Semesters
								</Label>
								<Input
									className="h-10"
									id={field.name}
									max="20"
									min="1"
									onBlur={field.handleBlur}
									onChange={(e) =>
										field.handleChange(Number.parseInt(e.target.value, 10))
									}
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
			</div>

			<Button
				className="h-12 w-full font-semibold text-sm"
				disabled={isLoading}
				type="submit"
			>
				{isLoading ? "Saving Profile..." : "Complete Setup"}
			</Button>
		</form>
	);
}
