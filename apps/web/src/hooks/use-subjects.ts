import { useQuery } from "@tanstack/react-query";
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
