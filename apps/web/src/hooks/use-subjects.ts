import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { orpc } from "@/utils/orpc";

/**
 * Hook to fetch all subjects for a specific semester
 */
export function useSubjects(semesterId: string) {
	return useQuery(
		orpc.subject.subjectList.queryOptions({
			input: { semesterId },
			enabled: !!semesterId,
		})
	);
}

/**
 * Hook to create a new subject
 */
export function useCreateSubject() {
	const queryClient = useQueryClient();

	return useMutation(
		orpc.subject.subjectCreate.mutationOptions({
			onSuccess: (data) => {
				toast.success("Subject added successfully");
				if (data) {
					queryClient.invalidateQueries({
						queryKey: orpc.subject.subjectList.queryKey({
							input: { semesterId: data.semesterId },
						}),
					});
					queryClient.invalidateQueries({
						queryKey: orpc.semester.semesterGet.queryKey({
							input: { id: data.semesterId },
						}),
					});
				}
			},
			onError: (error) => {
				toast.error(`Failed to add subject: ${error.message}`);
			},
		})
	);
}

/**
 * Hook to update an existing subject
 */
export function useUpdateSubject() {
	const queryClient = useQueryClient();

	return useMutation(
		orpc.subject.subjectUpdate.mutationOptions({
			onSuccess: (data) => {
				toast.success("Subject updated successfully");
				if (data) {
					queryClient.invalidateQueries({
						queryKey: orpc.subject.subjectList.queryKey({
							input: { semesterId: data.semesterId },
						}),
					});
					queryClient.invalidateQueries({
						queryKey: orpc.semester.semesterGet.queryKey({
							input: { id: data.semesterId },
						}),
					});
				}
			},
			onError: (error) => {
				toast.error(`Failed to update subject: ${error.message}`);
			},
		})
	);
}

/**
 * Hook to delete a subject
 */
export function useDeleteSubject() {
	const queryClient = useQueryClient();

	return useMutation(
		orpc.subject.subjectDelete.mutationOptions({
			onSuccess: (data) => {
				toast.success("Subject deleted successfully");
				if (data) {
					queryClient.invalidateQueries({
						queryKey: orpc.subject.subjectList.queryKey({
							input: { semesterId: data.semesterId },
						}),
					});
					queryClient.invalidateQueries({
						queryKey: orpc.semester.semesterGet.queryKey({
							input: { id: data.semesterId },
						}),
					});
				}
			},
			onError: (error) => {
				toast.error(`Failed to delete subject: ${error.message}`);
			},
		})
	);
}
