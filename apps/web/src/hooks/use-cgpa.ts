import { orpc } from "@/utils/orpc";

/**
 * Hook to fetch dashboard data (summary, trend chart, active semester)
 */
export function useDashboardData() {
	return orpc.cgpa.cgpaDashboard.useQuery();
}

/**
 * Hook to fetch CGPA for a specific semester
 */
export function useSemesterCGPA(semesterId: string) {
	return orpc.cgpa.cgpaSemester.useQuery(
		{ semesterId },
		{
			enabled: !!semesterId,
		}
	);
}

/**
 * Hook to fetch current cumulative CGPA
 */
export function useCumulativeCGPA() {
	return orpc.cgpa.cgpaCumulative.useQuery();
}

/**
 * Hook to fetch score projections for a semester based on its target CGPA
 */
export function useCGPAProjection(semesterId: string) {
	return orpc.cgpa.cgpaProjection.useQuery(
		{ semesterId },
		{
			enabled: !!semesterId,
		}
	);
}

/**
 * Hook to fetch cumulative goal projection
 */
export function useCumulativeCGPAProjection() {
	return orpc.cgpa.cgpaCumulativeProjection.useQuery();
}
