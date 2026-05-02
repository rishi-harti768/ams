import { toast } from "sonner";
import { orpc } from "@/utils/orpc";

/**
 * Hook to fetch all subjects for a specific semester
 */
export function useSubjects(semesterId: string) {
	return orpc.subjectList.useQuery(
		{ semesterId },
		{
			enabled: !!semesterId,
		}
	);
}

/**
 * Hook to create a new subject
 */
export function useCreateSubject() {
	const utils = orpc.useUtils();

	return orpc.subjectCreate.useMutation({
		onSuccess: (data) => {
			toast.success("Subject added successfully");
			if (data) {
				utils.subjectList.invalidate({ semesterId: data.semesterId });
				utils.semesterGet.invalidate({ id: data.semesterId });
			}
		},
		onError: (error) => {
			toast.error(`Failed to add subject: ${error.message}`);
		},
	});
}

/**
 * Hook to update an existing subject
 */
export function useUpdateSubject() {
	const utils = orpc.useUtils();

	return orpc.subjectUpdate.useMutation({
		onSuccess: (data) => {
			toast.success("Subject updated successfully");
			if (data) {
				utils.subjectList.invalidate({ semesterId: data.semesterId });
				utils.semesterGet.invalidate({ id: data.semesterId });
			}
		},
		onError: (error) => {
			toast.error(`Failed to update subject: ${error.message}`);
		},
	});
}

/**
 * Hook to delete a subject
 */
export function useDeleteSubject() {
	const utils = orpc.useUtils();

	return orpc.subjectDelete.useMutation({
		onSuccess: (data) => {
			toast.success("Subject deleted successfully");
			if (data) {
				utils.subjectList.invalidate({ semesterId: data.semesterId });
				utils.semesterGet.invalidate({ id: data.semesterId });
			}
		},
		onError: (error) => {
			toast.error(`Failed to delete subject: ${error.message}`);
		},
	});
}
