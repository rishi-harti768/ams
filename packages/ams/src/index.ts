/**
 * Grade Point Mapping (10-point Scale)
 * | Marks Range (%) | Grade | Grade Point |
 * |-----------------|-------|-------------|
 * | 90 – 100         | O     | 10          |
 * | 80 – 89          | A+    | 9           |
 * | 70 – 79          | A     | 8           |
 * | 60 – 69          | B+    | 7           |
 * | 55 – 59          | B     | 6           |
 * | 50 – 54          | C     | 5           |
 * | 45 – 49          | P     | 4           |
 * | < 45             | F     | 0           |
 */

export type SemesterStatus = "completed" | "ongoing" | "upcoming";

export function calculateSemesterStatus(
	startDate: Date,
	endDate: Date
): SemesterStatus {
	const now = new Date();
	if (now < startDate) {
		return "upcoming";
	}
	if (now > endDate) {
		return "completed";
	}
	return "ongoing";
}

export function calculateGradePoint(totalPercentage: number): number {
	if (totalPercentage >= 90) {
		return 10;
	}
	if (totalPercentage >= 80) {
		return 9;
	}
	if (totalPercentage >= 70) {
		return 8;
	}
	if (totalPercentage >= 60) {
		return 7;
	}
	if (totalPercentage >= 55) {
		return 6;
	}
	if (totalPercentage >= 50) {
		return 5;
	}
	if (totalPercentage >= 40) {
		return 4;
	}
	return 0;
}

export function calculateTotalPercentage(
	internalMarks: number | null,
	endsemMarks: number | null,
	maxInternalMarks: number,
	maxEndsemMarks: number
): number | null {
	if (internalMarks === null || endsemMarks === null) {
		return null;
	}
	return (
		((internalMarks + endsemMarks) / (maxInternalMarks + maxEndsemMarks)) * 100
	);
}

export interface SubjectWithScore {
	creditHours: number;
	endsemMarks: number | null;
	internalMarks: number | null;
	maxEndsemMarks: number;
	maxInternalMarks: number;
}

export function calculateSemesterCGPA(
	subjects: SubjectWithScore[]
): number | null {
	const completedSubjects = subjects.filter(
		(s) => s.internalMarks !== null && s.endsemMarks !== null
	);

	if (completedSubjects.length === 0) {
		return null;
	}

	let totalWeightedGradePoints = 0;
	let totalCredits = 0;

	for (const subject of completedSubjects) {
		const percentage = calculateTotalPercentage(
			subject.internalMarks,
			subject.endsemMarks,
			subject.maxInternalMarks,
			subject.maxEndsemMarks
		);
		if (percentage !== null) {
			const gradePoint = calculateGradePoint(percentage);
			totalWeightedGradePoints += gradePoint * subject.creditHours;
			totalCredits += subject.creditHours;
		}
	}

	if (totalCredits === 0) {
		return null;
	}

	return Number((totalWeightedGradePoints / totalCredits).toFixed(2));
}

export interface SemesterWithCGPA {
	cgpa: number | null;
	totalCredits: number;
}

export function calculateCumulativeCGPA(semesters: SemesterWithCGPA[]): number {
	const completedSemesters = semesters.filter((s) => s.cgpa !== null);

	if (completedSemesters.length === 0) {
		return 0;
	}

	let totalWeightedCGPA = 0;
	let totalCredits = 0;

	for (const semester of completedSemesters) {
		const cgpa = semester.cgpa ?? 0;
		totalWeightedCGPA += cgpa * semester.totalCredits;
		totalCredits += semester.totalCredits;
	}

	if (totalCredits === 0) {
		return 0;
	}

	return Number((totalWeightedCGPA / totalCredits).toFixed(2));
}

export function getMinPercentageForGradePoint(gp: number): number {
	const thresholds = [
		{ gp: 10, min: 90 },
		{ gp: 9, min: 80 },
		{ gp: 8, min: 70 },
		{ gp: 7, min: 60 },
		{ gp: 6, min: 55 },
		{ gp: 5, min: 50 },
		{ gp: 4, min: 45 },
		{ gp: 0, min: 0 },
	];
	return thresholds.find((t) => gp >= t.gp)?.min ?? 0;
}

export function calculateRequiredEndsem(
	internalMarks: number,
	maxInternalMarks: number,
	maxEndsemMarks: number,
	targetCGPA: number
): {
	required: number;
	achievable: boolean;
	maxAchievableGP: number;
	maxAchievablePercentage: number;
} {
	const minPercentage = getMinPercentageForGradePoint(targetCGPA);
	const totalMax = maxInternalMarks + maxEndsemMarks;

	const requiredTotalMarks = (minPercentage / 100) * totalMax;
	const requiredEndsem = requiredTotalMarks - internalMarks;

	const achievable = requiredEndsem <= maxEndsemMarks;

	const maxAchievableTotalMarks = internalMarks + maxEndsemMarks;
	const maxAchievablePercentage = (maxAchievableTotalMarks / totalMax) * 100;
	const maxAchievableGP = calculateGradePoint(maxAchievablePercentage);

	return {
		required: Math.max(0, Number(requiredEndsem.toFixed(2))),
		achievable,
		maxAchievableGP,
		maxAchievablePercentage: Number(maxAchievablePercentage.toFixed(2)),
	};
}

export function calculateRequiredSemesterCGPA(
	currentCumulativeCGPA: number,
	currentTotalCredits: number,
	targetCumulativeCGPA: number,
	remainingSemesters: number,
	averageCreditsPerSemester: number
): { required: number; achievable: boolean; maxPossibleCGPA: number } {
	if (currentCumulativeCGPA >= targetCumulativeCGPA) {
		const targetTotalCredits =
			currentTotalCredits + remainingSemesters * averageCreditsPerSemester;
		const maxPossibleWeightedCGPA =
			currentTotalCredits * currentCumulativeCGPA +
			remainingSemesters * averageCreditsPerSemester * 10;
		const maxPossibleCGPA = maxPossibleWeightedCGPA / targetTotalCredits;

		return {
			required: 0,
			achievable: true,
			maxPossibleCGPA: Number(maxPossibleCGPA.toFixed(2)),
		};
	}

	const targetTotalCredits =
		currentTotalCredits + remainingSemesters * averageCreditsPerSemester;
	const requiredTotalWeightedCGPA = targetCumulativeCGPA * targetTotalCredits;
	const currentWeightedCGPA = currentCumulativeCGPA * currentTotalCredits;

	const requiredFutureWeightedCGPA =
		requiredTotalWeightedCGPA - currentWeightedCGPA;
	const requiredSemesterCGPA =
		requiredFutureWeightedCGPA /
		(remainingSemesters * averageCreditsPerSemester);

	// Calculate maximum possible CGPA assuming straight 10.0s in all remaining credits
	const maxPossibleWeightedCGPA =
		currentWeightedCGPA + remainingSemesters * averageCreditsPerSemester * 10;
	const maxPossibleCGPA = maxPossibleWeightedCGPA / targetTotalCredits;

	return {
		required: Number(requiredSemesterCGPA.toFixed(2)),
		achievable: requiredSemesterCGPA <= 10,
		maxPossibleCGPA: Number(maxPossibleCGPA.toFixed(2)),
	};
}
