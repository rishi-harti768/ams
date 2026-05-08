"use client";

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@ams/ui/components/accordion";
import { Badge } from "@ams/ui/components/badge";
import { Button } from "@ams/ui/components/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@ams/ui/components/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@ams/ui/components/dialog";
import { Input } from "@ams/ui/components/input";
import { Label } from "@ams/ui/components/label";
import { Switch } from "@ams/ui/components/switch";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@ams/ui/components/table";
import { useForm } from "@tanstack/react-form";
import { Edit2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
	useAdminCreateSemester,
	useAdminCreateSubject,
	useAdminDeleteSemester,
	useAdminDeleteSubject,
	useAdminSemesters,
	useAdminSetActiveSemesters,
	useAdminUpdateSemester,
	useAdminUpdateSubject,
} from "@/hooks/use-admin";

interface Subject {
	creditHours: number;
	id: string;
	maxEndsemMarks: number;
	maxInternalMarks: number;
	name: string;
	semesterId: string;
	subjectCode: string;
}

interface Semester {
	academicYear: string | null;
	id: string;
	isActive: boolean;
	name: string;
	subjects: Subject[];
	totalCredits: number;
}

export default function AdminDashboard() {
	const { data: semesters, isLoading } = useAdminSemesters();
	const [isSemesterDialogOpen, setIsSemesterDialogOpen] = useState(false);
	const [editingSemester, setEditingSemester] = useState<Semester | null>(null);

	const createSemester = useAdminCreateSemester();
	const updateSemester = useAdminUpdateSemester();
	const deleteSemester = useAdminDeleteSemester();
	const setActiveSemesters = useAdminSetActiveSemesters();

	if (isLoading) {
		return <div>Loading...</div>;
	}

	const handleSaveSemester = async (values: {
		name: string;
		academicYear?: string;
		isActive: boolean;
	}) => {
		try {
			if (editingSemester) {
				await updateSemester.mutateAsync({ id: editingSemester.id, ...values });
				toast.success("Semester updated successfully");
			} else {
				await createSemester.mutateAsync(values);
				toast.success("Semester created successfully");
			}
			setIsSemesterDialogOpen(false);
			setEditingSemester(null);
		} catch {
			toast.error("Failed to save semester");
		}
	};

	const handleDeleteSemester = async (id: string) => {
		try {
			await deleteSemester.mutateAsync({ id });
			toast.success("Semester deleted successfully");
		} catch {
			toast.error("Failed to delete semester");
		}
	};

	const handleToggleActive = async (id: string, currentStatus: boolean) => {
		try {
			await setActiveSemesters.mutateAsync({
				ids: [id],
				active: !currentStatus,
			});
			toast.success(`Semester ${currentStatus ? "deactivated" : "activated"}`);
		} catch {
			toast.error("Failed to update status");
		}
	};

	return (
		<div className="flex flex-col gap-6">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0">
					<div>
						<CardTitle>Academic Semesters</CardTitle>
						<CardDescription>
							Manage the structural semesters for the system.
						</CardDescription>
					</div>
					<Button
						onClick={() => {
							setEditingSemester(null);
							setIsSemesterDialogOpen(true);
						}}
					>
						<Plus className="mr-2 h-4 w-4" /> Add Semester
					</Button>
				</CardHeader>
				<CardContent>
					<Accordion className="w-full">
						{semesters?.map((sem) => (
							<AccordionItem key={sem.id} value={sem.id}>
								<AccordionTrigger className="hover:no-underline">
									<div className="flex w-full items-center justify-between pr-4">
										<div className="flex items-center gap-4">
											<span className="font-semibold">{sem.name}</span>
											{sem.academicYear && (
												<Badge variant="outline">{sem.academicYear}</Badge>
											)}
											<Badge variant={sem.isActive ? "default" : "secondary"}>
												{sem.isActive ? "Active" : "Inactive"}
											</Badge>
										</div>
										<div className="flex items-center gap-2 text-muted-foreground text-sm">
											<span>{sem.subjects.length} Subjects</span>
											<span>•</span>
											<span>{sem.totalCredits} Credits</span>
										</div>
									</div>
								</AccordionTrigger>
								<AccordionContent>
									<div className="flex flex-col gap-4 pt-4">
										<div className="flex items-center justify-between">
											<h4 className="font-medium text-sm">
												Subjects for {sem.name}
											</h4>
											<div className="flex items-center gap-2">
												<div className="mr-4 flex items-center gap-2">
													<Label
														className="text-xs"
														htmlFor={`active-${sem.id}`}
													>
														Active
													</Label>
													<Switch
														checked={sem.isActive}
														id={`active-${sem.id}`}
														onCheckedChange={() =>
															handleToggleActive(sem.id, sem.isActive)
														}
													/>
												</div>
												<Button
													onClick={() => {
														setEditingSemester(sem);
														setIsSemesterDialogOpen(true);
													}}
													size="sm"
													variant="outline"
												>
													<Edit2 className="h-3 w-3" />
												</Button>
												<Button
													className="text-destructive hover:bg-destructive/10"
													onClick={() => handleDeleteSemester(sem.id)}
													size="sm"
													variant="ghost"
												>
													<Trash2 className="h-3 w-3" />
												</Button>
											</div>
										</div>

										<SubjectList semesterId={sem.id} subjects={sem.subjects} />
									</div>
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</CardContent>
			</Card>

			<Dialog
				onOpenChange={setIsSemesterDialogOpen}
				open={isSemesterDialogOpen}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							{editingSemester ? "Edit Semester" : "Add New Semester"}
						</DialogTitle>
						<DialogDescription>
							Define the semester name and academic year.
						</DialogDescription>
					</DialogHeader>
					<SemesterForm
						initialValues={editingSemester}
						isLoading={createSemester.isPending || updateSemester.isPending}
						onCancel={() => setIsSemesterDialogOpen(false)}
						onSubmit={handleSaveSemester}
					/>
				</DialogContent>
			</Dialog>
		</div>
	);
}

function SemesterForm({
	initialValues,
	onSubmit,
	onCancel,
	isLoading,
}: {
	initialValues: Semester | null;
	onSubmit: (values: {
		name: string;
		academicYear?: string;
		isActive: boolean;
	}) => void;
	onCancel: () => void;
	isLoading: boolean;
}) {
	const form = useForm({
		defaultValues: {
			name: initialValues?.name ?? "",
			academicYear: initialValues?.academicYear ?? "",
			isActive: initialValues?.isActive ?? false,
		},
		onSubmit: ({ value }) => onSubmit(value),
	});

	return (
		<form
			className="space-y-4"
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
		>
			<div className="space-y-2">
				<Label htmlFor="name">Semester Name</Label>
				<form.Field
					name="name"
					validators={{
						onChange: ({ value }) => (value ? undefined : "Required"),
					}}
				>
					{(field) => (
						<>
							<Input
								id="name"
								onChange={(e) => field.handleChange(e.target.value)}
								placeholder="e.g. Semester 1"
								value={field.state.value}
							/>
							{field.state.meta.errors.length > 0 && (
								<p className="text-destructive text-xs">
									{field.state.meta.errors.join(", ")}
								</p>
							)}
						</>
					)}
				</form.Field>
			</div>
			<div className="space-y-2">
				<Label htmlFor="academicYear">Academic Year</Label>
				<form.Field name="academicYear">
					{(field) => (
						<Input
							id="academicYear"
							onChange={(e) => field.handleChange(e.target.value)}
							placeholder="e.g. 2025-26"
							value={field.state.value}
						/>
					)}
				</form.Field>
			</div>
			<div className="flex items-center gap-2">
				<form.Field name="isActive">
					{(field) => (
						<>
							<Switch
								checked={field.state.value}
								id="isActive"
								onCheckedChange={(checked) => field.handleChange(checked)}
							/>
							<Label htmlFor="isActive">Active Semester</Label>
						</>
					)}
				</form.Field>
			</div>
			<div className="flex justify-end gap-2 pt-4">
				<Button onClick={onCancel} type="button" variant="outline">
					Cancel
				</Button>
				<Button disabled={isLoading} type="submit">
					{isLoading ? "Saving..." : "Save Semester"}
				</Button>
			</div>
		</form>
	);
}

function SubjectList({
	semesterId,
	subjects,
}: {
	semesterId: string;
	subjects: Subject[];
}) {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

	const createSubject = useAdminCreateSubject();
	const updateSubject = useAdminUpdateSubject();
	const deleteSubject = useAdminDeleteSubject();

	const handleSaveSubject = async (values: {
		subjectCode: string;
		name: string;
		creditHours: number;
		maxInternalMarks: number;
		maxEndsemMarks: number;
	}) => {
		try {
			if (editingSubject) {
				await updateSubject.mutateAsync({ id: editingSubject.id, ...values });
				toast.success("Subject updated");
			} else {
				await createSubject.mutateAsync({ semesterId, ...values });
				toast.success("Subject added");
			}
			setIsDialogOpen(false);
			setEditingSubject(null);
		} catch {
			toast.error("Failed to save subject");
		}
	};

	const handleDeleteSubject = async (id: string) => {
		try {
			await deleteSubject.mutateAsync({ id });
			toast.success("Subject deleted");
		} catch {
			toast.error("Failed to delete subject");
		}
	};

	return (
		<div className="space-y-4">
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-[120px]">Code</TableHead>
							<TableHead>Subject Name</TableHead>
							<TableHead>Credits</TableHead>
							<TableHead>Max Internal</TableHead>
							<TableHead>Max End-Sem</TableHead>
							<TableHead className="w-[100px]">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{subjects.length === 0 ? (
							<TableRow>
								<TableCell
									className="h-24 text-center text-muted-foreground"
									colSpan={6}
								>
									No subjects added yet.
								</TableCell>
							</TableRow>
						) : (
							subjects.map((sub) => (
								<TableRow key={sub.id}>
									<TableCell className="font-mono text-xs">
										{sub.subjectCode}
									</TableCell>
									<TableCell className="font-medium">{sub.name}</TableCell>
									<TableCell>{sub.creditHours}</TableCell>
									<TableCell>{sub.maxInternalMarks}</TableCell>
									<TableCell>{sub.maxEndsemMarks}</TableCell>
									<TableCell>
										<div className="flex gap-2">
											<Button
												onClick={() => {
													setEditingSubject(sub);
													setIsDialogOpen(true);
												}}
												size="sm"
												variant="ghost"
											>
												<Edit2 className="h-3 w-3" />
											</Button>
											<Button
												className="text-destructive hover:bg-destructive/10"
												onClick={() => handleDeleteSubject(sub.id)}
												size="sm"
												variant="ghost"
											>
												<Trash2 className="h-3 w-3" />
											</Button>
										</div>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>
			<Button
				className="w-full"
				onClick={() => {
					setEditingSubject(null);
					setIsDialogOpen(true);
				}}
				size="sm"
				variant="outline"
			>
				<Plus className="mr-2 h-4 w-4" /> Add Subject
			</Button>

			<Dialog onOpenChange={setIsDialogOpen} open={isDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							{editingSubject ? "Edit Subject" : "Add Subject"}
						</DialogTitle>
					</DialogHeader>
					<SubjectForm
						initialValues={editingSubject}
						isLoading={createSubject.isPending || updateSubject.isPending}
						onCancel={() => setIsDialogOpen(false)}
						onSubmit={handleSaveSubject}
					/>
				</DialogContent>
			</Dialog>
		</div>
	);
}

function SubjectForm({
	initialValues,
	onSubmit,
	onCancel,
	isLoading,
}: {
	initialValues: Subject | null;
	onSubmit: (values: {
		subjectCode: string;
		name: string;
		creditHours: number;
		maxInternalMarks: number;
		maxEndsemMarks: number;
	}) => void;
	onCancel: () => void;
	isLoading: boolean;
}) {
	const form = useForm({
		defaultValues: {
			subjectCode: initialValues?.subjectCode ?? "",
			name: initialValues?.name ?? "",
			creditHours: initialValues?.creditHours ?? 3,
			maxInternalMarks: initialValues?.maxInternalMarks ?? 50,
			maxEndsemMarks: initialValues?.maxEndsemMarks ?? 50,
		},
		onSubmit: ({ value }) => onSubmit(value),
	});

	return (
		<form
			className="space-y-4"
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
		>
			<div className="grid grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label htmlFor="sub-code">Subject Code</Label>
					<form.Field
						name="subjectCode"
						validators={{
							onChange: ({ value }) => (value ? undefined : "Required"),
						}}
					>
						{(field) => (
							<Input
								id="sub-code"
								onChange={(e) => field.handleChange(e.target.value)}
								placeholder="e.g. CS101"
								value={field.state.value}
							/>
						)}
					</form.Field>
				</div>
				<div className="space-y-2">
					<Label htmlFor="sub-name">Subject Name</Label>
					<form.Field
						name="name"
						validators={{
							onChange: ({ value }) => (value ? undefined : "Required"),
						}}
					>
						{(field) => (
							<Input
								id="sub-name"
								onChange={(e) => field.handleChange(e.target.value)}
								placeholder="e.g. Mathematics"
								value={field.state.value}
							/>
						)}
					</form.Field>
				</div>
			</div>
			<div className="grid grid-cols-3 gap-4">
				<div className="space-y-2">
					<Label htmlFor="credits">Credits</Label>
					<form.Field name="creditHours">
						{(field) => (
							<Input
								id="credits"
								onChange={(e) => field.handleChange(Number(e.target.value))}
								type="number"
								value={field.state.value}
							/>
						)}
					</form.Field>
				</div>
				<div className="space-y-2">
					<Label htmlFor="internal">Max Internal</Label>
					<form.Field name="maxInternalMarks">
						{(field) => (
							<Input
								id="internal"
								onChange={(e) => field.handleChange(Number(e.target.value))}
								type="number"
								value={field.state.value}
							/>
						)}
					</form.Field>
				</div>
				<div className="space-y-2">
					<Label htmlFor="endsem">Max End-Sem</Label>
					<form.Field name="maxEndsemMarks">
						{(field) => (
							<Input
								id="endsem"
								onChange={(e) => field.handleChange(Number(e.target.value))}
								type="number"
								value={field.state.value}
							/>
						)}
					</form.Field>
				</div>
			</div>
			<div className="flex justify-end gap-2 pt-4">
				<Button onClick={onCancel} type="button" variant="outline">
					Cancel
				</Button>
				<Button disabled={isLoading} type="submit">
					Save Subject
				</Button>
			</div>
		</form>
	);
}
