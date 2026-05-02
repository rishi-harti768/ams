# Requirements Document

## Introduction

The Academic Management System (AMS) is a web-based platform designed to help students track, plan, and optimize their academic performance. Students can record semester scores, input internal marks and end-semester exam scores per subject, set CGPA targets, and visualize their academic progress through a dashboard with CGPA trend charts.

This requirements document covers all functional requirements for the AMS feature, excluding authentication which already exists.

## Glossary

- **System**: The Academic Management System (AMS) application
- **User**: A student using AMS to track academic performance
- **Academic_Profile**: User's academic information including institution type and current semester
- **Semester**: An academic term containing multiple subjects
- **Subject**: A course within a semester with associated credit hours and marks configuration
- **Internal_Marks**: Marks scored in internal assessments (class tests, assignments)
- **EndSem_Marks**: Marks scored in end-semester examinations
- **Grade_Point**: Numeric value on 10-point scale corresponding to percentage marks
- **Semester_CGPA**: Grade Point Average for a single semester
- **Cumulative_CGPA**: Overall Grade Point Average across all completed semesters
- **Target_CGPA**: User-defined goal CGPA for a semester or cumulative
- **Required_EndSem**: Calculated end-semester marks needed to achieve target CGPA

## Requirements

### Requirement 1: Academic Profile Setup

**User Story:** As a new user, I want to set up my academic profile, so that the system is configured for my institution type and current semester.

#### Acceptance Criteria

1. WHEN a user first logs in without an academic profile, THE System SHALL prompt the user to complete their academic profile.
2. THE System SHALL accept institution type with values "School" or "College".
3. THE System SHALL accept current semester as a positive integer between 1 and 20.
4. THE System SHALL accept institution name as an optional text field.
5. WHERE a user has an existing profile, THE System SHALL display their current profile data for editing.
6. WHEN a user submits valid profile data, THE System SHALL persist the profile and return a success confirmation.

### Requirement 2: Semester Management - Create

**User Story:** As a user, I want to add a new semester, so that I can track scores for that academic term.

#### Acceptance Criteria

1. THE System SHALL allow users to create a new semester with a name.
2. THE System SHALL accept academic year as an optional text field (e.g., "2025-26").
3. THE System SHALL allow users to mark a semester as "Active" (current) or "Past" (completed).
4. THE System SHALL automatically set all other semesters to "Past" when a new semester is marked as "Active".
5. WHEN a semester is created successfully, THE System SHALL return the created semester object with a unique identifier.
6. THE System SHALL list semesters in reverse chronological order by default.

### Requirement 3: Semester Management - Edit and Delete

**User Story:** As a user, I want to edit or delete a semester, so that I can correct mistakes or remove unwanted data.

#### Acceptance Criteria

1. THE System SHALL allow users to update the name, academic year, and active status of a semester.
2. THE System SHALL allow users to delete a semester with a confirmation prompt.
3. WHEN a semester is deleted, THE System SHALL cascade delete all associated subjects and scores.
4. WHEN a semester is updated, THE System SHALL return the updated semester object.

### Requirement 4: Subject Management - Create

**User Story:** As a user, I want to add subjects to a semester, so that I can track scores for each course.

#### Acceptance Criteria

1. THE System SHALL allow users to add a subject to a specific semester.
2. THE System SHALL require subject name as a non-empty text field.
3. THE System SHALL require credit hours as a positive integer.
4. THE System SHALL require maximum internal marks as a positive integer.
5. THE System SHALL require maximum end-semester marks as a positive integer.
6. THE System SHALL validate that credit hours is a positive integer and reject invalid values.

### Requirement 5: Subject Management - Edit and Delete

**User Story:** As a user, I want to edit or delete a subject from a semester, so that I can correct mistakes or adjust my course load.

#### Acceptance Criteria

1. THE System SHALL allow users to update subject name, credit hours, max internal marks, and max end-sem marks.
2. THE System SHALL allow users to delete a subject from a semester.
3. WHEN a subject is deleted, THE System SHALL cascade delete all associated scores.
4. THE System SHALL return the updated subject object after successful edit.

### Requirement 6: Score Entry - Internal Marks

**User Story:** As a user, I want to enter my internal marks for each subject, so that I can track my assessment performance.

#### Acceptance Criteria

1. THE System SHALL allow users to enter internal marks for a subject.
2. THE System SHALL validate that internal marks do not exceed the configured maximum internal marks for that subject.
3. THE System SHALL allow internal marks to be null or empty (not yet entered).
4. WHEN internal marks are updated, THE System SHALL recalculate and update the grade point if end-sem marks are also entered.
5. THE System SHALL display an error message when internal marks exceed the maximum allowed.

### Requirement 7: Score Entry - End-Semester Marks

**User Story:** As a user, I want to enter my end-semester exam scores, so that I can complete my score record for a subject.

#### Acceptance Criteria

1. THE System SHALL allow users to enter end-semester marks for a subject.
2. THE System SHALL validate that end-sem marks do not exceed the configured maximum end-sem marks.
3. THE System SHALL allow end-sem marks to be null or empty (results pending).
4. WHEN end-sem marks are entered, THE System SHALL calculate the total marks and grade point.
5. THE System SHALL display an error message when end-sem marks exceed the maximum allowed.

### Requirement 8: Grade Point Calculation

**User Story:** As a user, I want to see my grade points automatically calculated, so that I know my performance level.

#### Acceptance Criteria

1. THE System SHALL calculate grade point using the standard 10-point scale mapping.
2. THE System SHALL map marks 90-100% to grade point 10 (O - Outstanding).
3. THE System SHALL map marks 80-89% to grade point 9 (A+ - Excellent).
4. THE System SHALL map marks 70-79% to grade point 8 (A - Very Good).
5. THE System SHALL map marks 60-69% to grade point 7 (B+ - Good).
6. THE System SHALL map marks 55-59% to grade point 6 (B - Above Average).
7. THE System SHALL map marks 50-54% to grade point 5 (C - Average).
8. THE System SHALL map marks 45-49% to grade point 4 (P - Pass).
9. THE System SHALL map marks below 45% to grade point 0 (F - Fail).
10. THE System SHALL calculate total percentage as: (internal_marks + endsem_marks) / (max_internal_marks + max_endsem_marks) × 100.
11. THE System SHALL exclude subjects with only internal marks entered from CGPA calculation and mark them as "Pending".

### Requirement 9: Semester CGPA Calculation

**User Story:** As a user, I want to see my semester CGPA calculated automatically, so that I know my performance for that term.

#### Acceptance Criteria

1. THE System SHALL calculate Semester CGPA as: Σ (Grade Point × Credit Hours) / Σ (Credit Hours).
2. THE System SHALL calculate CGPA using only subjects with both internal and end-sem marks entered.
3. THE System SHALL display CGPA values rounded to two decimal places.
4. WHEN all subjects in a semester have pending scores, THE System SHALL display the semester CGPA as "N/A" or "Pending".

### Requirement 10: Cumulative CGPA Calculation

**User Story:** As a user, I want to see my cumulative CGPA across all semesters, so that I know my overall academic standing.

#### Acceptance Criteria

1. THE System SHALL calculate Cumulative CGPA as: Σ (Semester CGPA × Total Credits in Semester) / Σ (Total Credits across all Semesters).
2. THE System SHALL include only completed semesters in cumulative CGPA calculation.
3. THE System SHALL display cumulative CGPA rounded to two decimal places.
4. WHERE no completed semesters exist, THE System SHALL display cumulative CGPA as 0.00.

### Requirement 11: Target CGPA Setting - Semester

**User Story:** As a user, I want to set a target CGPA for a semester, so that I know what score I need to achieve.

#### Acceptance Criteria

1. THE System SHALL allow users to set a target CGPA for any semester.
2. THE System SHALL validate target CGPA is between 0.00 and 10.00.
3. THE System SHALL allow users to update their target CGPA at any time.
4. THE System SHALL store the target CGPA and associate it with the specific semester.

### Requirement 12: Target CGPA Setting - Cumulative

**User Story:** As a user, I want to set an overall cumulative CGPA target, so that I can plan my academic goals across all semesters.

#### Acceptance Criteria

1. THE System SHALL allow users to set a cumulative CGPA target.
2. THE System SHALL validate cumulative target CGPA is between 0.00 and 10.00.
3. THE System SHALL allow users to update their cumulative target at any time.
4. THE System SHALL store the cumulative target in the user's academic profile.

### Requirement 13: Score Projection - End-Sem Required

**User Story:** As a user, I want to see what end-semester score I need to hit my target CGPA, so that I can plan my exam preparation.

#### Acceptance Criteria

1. THE System SHALL calculate the minimum end-semester marks required per subject to achieve the target semester CGPA.
2. THE System SHALL display "Unachievable" when the target CGPA cannot be achieved even with maximum end-sem marks.
3. THE System SHALL display the maximum achievable CGPA when the target is unachievable.
4. THE System SHALL calculate projection using the formula: ES_required = ((Target_GP_percentage / 100) × (Max_IM + Max_ES)) - IM, where Target_GP_percentage is the minimum marks percentage needed for the target grade point.
5. WHERE internal marks are not entered, THE System SHALL display the required end-sem marks based on the target CGPA without internal marks component.

### Requirement 14: Score Projection - Cumulative Goal

**User Story:** As a user, I want to see what semester CGPA I need in future semesters to reach my cumulative target, so that I can plan my academic trajectory.

#### Acceptance Criteria

1. THE System SHALL calculate the minimum average semester CGPA required in remaining semesters to achieve cumulative target.
2. THE System SHALL display "Achievable" or "Unachievable" based on whether the target is mathematically possible.
3. THE System SHALL account for already-completed semesters in the calculation.
4. THE System SHALL display 0.00 as required semester CGPA when cumulative target is already achieved.

### Requirement 15: Dashboard - CGPA Trend Visualization

**User Story:** As a user, I want to see my CGPA trend across semesters in a chart, so that I can visualize my academic progress.

#### Acceptance Criteria

1. THE System SHALL display a line or bar chart showing CGPA for each semester.
2. THE System SHALL display semesters in chronological order on the X-axis.
3. THE System SHALL display CGPA values on the Y-axis with scale 0-10.
4. THE System SHALL show data points for each semester that has completed scores.
5. THE System SHALL display a comparison line for target CGPA if set.

### Requirement 16: Dashboard - Summary Cards

**User Story:** As a user, I want to see summary cards showing my current CGPA vs target, so that I can quickly assess my standing.

#### Acceptance Criteria

1. THE System SHALL display a summary card showing Current Cumulative CGPA.
2. THE System SHALL display a summary card showing Target Cumulative CGPA.
3. THE System SHALL display a summary card showing the Gap (difference between current and target).
4. THE System SHALL display a summary card showing Active Semester CGPA.
5. THE System SHALL color-code cards to indicate progress (e.g., green when exceeding target, red when below).

### Requirement 17: Dashboard - Subject Breakdown

**User Story:** As a user, I want to see a per-subject breakdown for the active semester, so that I can review my performance in detail.

#### Acceptance Criteria

1. THE System SHALL display a table for the active semester showing subject name.
2. THE System SHALL display internal marks for each subject (or "Pending" if not entered).
3. THE System SHALL display end-sem marks for each subject (or "Pending" if not entered).
4. THE System SHALL display grade point for each subject.
5. THE System SHALL display the required end-sem score to hit target CGPA for each subject where internal marks are entered.

### Requirement 18: Semester List View

**User Story:** As a user, I want to view all my semesters, so that I can navigate to details of any semester.

#### Acceptance Criteria

1. THE System SHALL display a list of all semesters belonging to the user.
2. THE System SHALL show semester name, academic year, and semester CGPA for each.
3. THE System SHALL indicate the active semester clearly.
4. THE System SHALL provide navigation to add new semester from the list view.
5. THE System SHALL provide navigation to each semester's detail page.

### Requirement 19: Semester Detail View

**User Story:** As a user, I want to view a semester's details including subjects and scores, so that I can manage my academic data for that term.

#### Acceptance Criteria

1. THE System SHALL display all subjects for the selected semester.
2. THE System SHALL display semester-level CGPA for the selected semester.
3. THE System SHALL display target CGPA for the selected semester.
4. THE System SHALL provide inline score entry fields for internal and end-sem marks.
5. THE System SHALL display required end-sem scores when a target is set.
6. THE System SHALL provide navigation to add new subjects to the semester.

### Requirement 20: Data Validation

**User Story:** As a user, I want the system to validate my inputs, so that I enter correct data and get meaningful results.

#### Acceptance Criteria

1. THE System SHALL reject credit hours that are zero or negative.
2. THE System SHALL reject max marks that are zero or negative.
3. THE System SHALL reject score values that exceed their maximum allowed.
4. THE System SHALL reject CGPA targets outside the range 0.00 to 10.00.
5. THE System SHALL display human-readable error messages for all validation failures.
6. THE System SHALL prevent form submission when validation errors exist.

### Requirement 21: User Data Isolation

**User Story:** As a user, I want to ensure my academic data is private and only accessible to me, so that my information is secure.

#### Acceptance Criteria

1. THE System SHALL ensure users can only access their own academic profiles.
2. THE System SHALL ensure users can only access their own semesters and subjects.
3. THE System SHALL ensure users can only modify their own data.
4. THE System SHALL reject any API requests with invalid or expired authentication tokens.

### Requirement 22: Performance Requirements

**User Story:** As a user, I want the system to respond quickly, so that my experience is smooth and efficient.

#### Acceptance Criteria

1. THE System SHALL load dashboard page in under 2 seconds on standard broadband.
2. THE System SHALL calculate and update CGPA values within 500ms of score entry.
3. THE System SHALL render CGPA trend chart within 1 second of page load.