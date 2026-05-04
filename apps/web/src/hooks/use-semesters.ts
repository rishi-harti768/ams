import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { orpc } from "@/utils/orpc";

/**
 * Hook to fetch all semesters for the current user
 */
export function useSemesters() {
	return useQuery(orpc.semester.semesterList.queryOptions({ input: {} }));
}

/**
 * Hook to fetch a specific semester by ID
 */
export function useSemester(id: string) {
	return useQuery(
		orpc.semester.semesterGet.queryOptions({
			input: { id },
			enabled: !!id,
		})
	);
}

/**
 * Hook to create a new semester
 */
export function useCreateSemester() {
	const queryClient = useQueryClient();

	return useMutation(
		orpc.semester.semesterCreate.mutationOptions({
			onSuccess: () => {
				toast.success("Semester created successfully");
				queryClient.invalidateQueries({ queryKey: orpc.semester.key() });
			},
			onError: (error) => {
				toast.error(`Failed to create semester: ${error.message}`);
			},
		})
	);
}

/**
 * Hook to update an existing semester
 */
export function useUpdateSemester() {
	const queryClient = useQueryClient();

	return useMutation(
		orpc.semester.semesterUpdate.mutationOptions({
			onSuccess: (data) => {
				toast.success("Semester updated successfully");
				queryClient.invalidateQueries({ queryKey: orpc.semester.key() });
				if (data) {
					queryClient.invalidateQueries({
						queryKey: orpc.semester.semesterGet.queryKey({
							input: { id: data.id },
						}),
					});
				}
			},
			onError: (error) => {
				toast.error(`Failed to update semester: ${error.message}`);
			},
		})
	);
}

/**
 * Hook to delete a semester
 */
export function useDeleteSemester() {
	const queryClient = useQueryClient();

	return useMutation(
		orpc.semester.semesterDelete.mutationOptions({
			onSuccess: () => {
				toast.success("Semester deleted successfully");
				queryClient.invalidateQueries({ queryKey: orpc.semester.key() });
			},
			onError: (error) => {
				toast.error(`Failed to delete semester: ${error.message}`);
			},
		})
	);
}

/**
 * Hook to set a semester as active
 */
export function useSetActiveSemester() {
	const queryClient = useQueryClient();

	return useMutation(
		orpc.semester.semesterSetActive.mutationOptions({
			onSuccess: () => {
				toast.success("Active semester updated");
				queryClient.invalidateQueries({ queryKey: orpc.semester.key() });
			},
			onError: (error) => {
				toast.error(`Failed to set active semester: ${error.message}`);
			},
		})
	);
}
