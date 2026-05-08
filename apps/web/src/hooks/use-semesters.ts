import { useQuery } from "@tanstack/react-query";
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
