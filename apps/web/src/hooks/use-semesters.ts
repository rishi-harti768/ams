import { toast } from "sonner";
import { orpc } from "@/utils/orpc";

/**
 * Hook to fetch all semesters for the current user
 */
export function useSemesters() {
	return orpc.semester.semesterList.useQuery();
}

/**
 * Hook to fetch a specific semester by ID
 */
export function useSemester(id: string) {
	return orpc.semester.semesterGet.useQuery(
		{ id },
		{
			enabled: !!id,
		}
	);
}

/**
 * Hook to create a new semester
 */
export function useCreateSemester() {
	const utils = orpc.useUtils();

	return orpc.semester.semesterCreate.useMutation({
		onSuccess: () => {
			toast.success("Semester created successfully");
			utils.semester.semesterList.invalidate();
		},
		onError: (error) => {
			toast.error(`Failed to create semester: ${error.message}`);
		},
	});
}

/**
 * Hook to update an existing semester
 */
export function useUpdateSemester() {
	const utils = orpc.useUtils();

	return orpc.semester.semesterUpdate.useMutation({
		onSuccess: (data) => {
			toast.success("Semester updated successfully");
			utils.semester.semesterList.invalidate();
			if (data) {
				utils.semester.semesterGet.invalidate({ id: data.id });
			}
		},
		onError: (error) => {
			toast.error(`Failed to update semester: ${error.message}`);
		},
	});
}

/**
 * Hook to delete a semester
 */
export function useDeleteSemester() {
	const utils = orpc.useUtils();

	return orpc.semester.semesterDelete.useMutation({
		onSuccess: () => {
			toast.success("Semester deleted successfully");
			utils.semester.semesterList.invalidate();
		},
		onError: (error) => {
			toast.error(`Failed to delete semester: ${error.message}`);
		},
	});
}

/**
 * Hook to set a semester as active
 */
export function useSetActiveSemester() {
	const utils = orpc.useUtils();

	return orpc.semester.semesterSetActive.useMutation({
		onSuccess: () => {
			toast.success("Active semester updated");
			utils.semester.semesterList.invalidate();
		},
		onError: (error) => {
			toast.error(`Failed to set active semester: ${error.message}`);
		},
	});
}
