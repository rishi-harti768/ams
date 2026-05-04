import { useQuery } from "@tanstack/react-query";
import { orpc } from "@/utils/orpc";

/**
 * Hook to fetch dashboard data (summary, trend chart, active semester)
 */
export function useDashboardData() {
	return useQuery(orpc.cgpa.cgpaDashboard.queryOptions({ input: {} }));
}

/**
 * Hook to fetch CGPA for a specific semester
 */
export function useSemesterCGPA(semesterId: string) {
	return useQuery(
		orpc.cgpa.cgpaSemester.queryOptions({
			input: { semesterId },
			enabled: !!semesterId,
		})
	);
}

/**
 * Hook to fetch current cumulative CGPA
 */
export function useCumulativeCGPA() {
	return useQuery(orpc.cgpa.cgpaCumulative.queryOptions({ input: {} }));
}

/**
 * Hook to fetch score projections for a semester based on its target CGPA
 */
export function useCGPAProjection(semesterId: string) {
	return useQuery(
		orpc.cgpa.cgpaProjection.queryOptions({
			input: { semesterId },
			enabled: !!semesterId,
		})
	);
}

/**
 * Hook to fetch cumulative goal projection
 */
export function useCumulativeCGPAProjection() {
	return useQuery(
		orpc.cgpa.cgpaCumulativeProjection.queryOptions({ input: {} })
	);
}
