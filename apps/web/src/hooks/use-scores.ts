import { toast } from "sonner";
import { orpc } from "@/utils/orpc";

/**
 * Hook to fetch the score for a specific subject
 */
export function useScore(subjectId: string) {
	return orpc.score.scoreGet.useQuery(
		{ subjectId },
		{
			enabled: !!subjectId,
		}
	);
}

/**
 * Hook to update internal marks for a subject
 */
export function useUpdateInternalMarks() {
	const utils = orpc.useUtils();

	return orpc.score.scoreUpdateInternal.useMutation({
		onSuccess: (data) => {
			toast.success("Internal marks updated");
			if (data) {
				utils.score.scoreGet.invalidate({ subjectId: data.subjectId });
				// Also invalidate subject list as it might contain score data
				utils.invalidate();
			}
		},
		onError: (error) => {
			toast.error(`Failed to update internal marks: ${error.message}`);
		},
	});
}

/**
 * Hook to update end-semester marks for a subject
 */
export function useUpdateEndsemMarks() {
	const utils = orpc.useUtils();

	return orpc.score.scoreUpdateEndsem.useMutation({
		onSuccess: (data) => {
			toast.success("End-semester marks updated");
			if (data) {
				utils.score.scoreGet.invalidate({ subjectId: data.subjectId });
				// Also invalidate subject list and CGPA data
				utils.invalidate();
			}
		},
		onError: (error) => {
			toast.error(`Failed to update end-semester marks: ${error.message}`);
		},
	});
}
