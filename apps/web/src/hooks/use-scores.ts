import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { orpc } from "@/utils/orpc";

/**
 * Hook to fetch the score for a specific subject
 */
export function useScore(subjectId: string) {
	return useQuery(
		orpc.score.scoreGet.queryOptions({
			input: { subjectId },
			enabled: !!subjectId,
		})
	);
}

/**
 * Hook to update internal marks for a subject
 */
export function useUpdateInternalMarks() {
	const queryClient = useQueryClient();

	return useMutation(
		orpc.score.scoreUpdateInternal.mutationOptions({
			onSuccess: (data) => {
				toast.success("Internal marks updated");
				if (data) {
					queryClient.invalidateQueries({
						queryKey: orpc.score.scoreGet.queryKey({
							input: { subjectId: data.subjectId },
						}),
					});
					// Also invalidate subject list and CGPA data
					queryClient.invalidateQueries({ queryKey: orpc.cgpa.key() });
					queryClient.invalidateQueries({ queryKey: orpc.subject.key() });
				}
			},
			onError: (error) => {
				toast.error(`Failed to update internal marks: ${error.message}`);
			},
		})
	);
}

/**
 * Hook to update end-semester marks for a subject
 */
export function useUpdateEndsemMarks() {
	const queryClient = useQueryClient();

	return useMutation(
		orpc.score.scoreUpdateEndsem.mutationOptions({
			onSuccess: (data) => {
				toast.success("End-semester marks updated");
				if (data) {
					queryClient.invalidateQueries({
						queryKey: orpc.score.scoreGet.queryKey({
							input: { subjectId: data.subjectId },
						}),
					});
					// Also invalidate subject list and CGPA data
					queryClient.invalidateQueries({ queryKey: orpc.cgpa.key() });
					queryClient.invalidateQueries({ queryKey: orpc.subject.key() });
				}
			},
			onError: (error) => {
				toast.error(`Failed to update end-semester marks: ${error.message}`);
			},
		})
	);
}
