# Design Document: Academic Management System (AMS)

## Overview

This document outlines the technical design for the Academic Management System (AMS), a web-based platform enabling students to track academic performance, calculate CGPA, set targets, and project required scores.

The design follows the existing codebase patterns:
- **Database**: Drizzle ORM with PostgreSQL
- **API**: oRPC (Open RPC) with protected procedures
- **Frontend**: React with shadcn/ui components
- **Authentication**: Already implemented via Better Auth

---

## Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Next.js Frontend                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │   Pages:     │  │ Components:  │  │    State:            │  │
│  │ - Dashboard  │  │ - CGPAChart  │  │ - React Query        │  │
│  │ - Semester   │  │ - ScoreTable │  │ - Server Actions     │  │
│  │ - Subjects   │  │ - TargetForm │  │                      │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │ oRPC
┌────────────────────────────▼────────────────────────────────────┐
│                        API Layer (oRPC)                          │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Routers:                                                  │   │
│  │ - profile: academic profile CRUD                         │   │
│  │ - semester: semester CRUD                                │   │
│  │ - subject: subject CRUD                                  │   │
│  │ - score: score entry & grade calculation                 │   │
│  │ - cgpa: CGPA calculations & projections                  │   │
│  └──────────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────────┘
                             │ Drizzle ORM
┌────────────────────────────▼────────────────────────────────────┐
│                    PostgreSQL Database                           │
└─────────────────────────────────────────────────────────────────┘
```

### Key Design Decisions

1. **Data Isolation**: All queries filter by `userId` from session to ensure user data privacy
2. **Computed Values**: Grade points and CGPAs are computed on-read rather than stored to ensure consistency
3. **Score Projection**: Calculated dynamically based on target CGPA and current internal marks
4. **Single Active Semester**: Setting a semester as active automatically marks others as past

---

## Components and Interfaces

### Database Schema Components

| Component | Responsibility |
|-----------|----------------|
| `academicProfile` | User's academic info (institution type, current semester, cumulative target) |
| `semester` | Academic term with name, year, active status, semester target |
| `subject` | Course within semester with credit hours and max marks configuration |
| `score` | Individual subject scores (internal + end-sem) with computed grade point |

### API Router Components

| Router | Endpoints |
|--------|-----------|
| `profile` | get, create, update |
| `semester` | list, get, create, update, delete, setActive |
| `subject` | list, get, create, update, delete |
| `score` | get, update (internal, end-sem), recalculate |
| `cgpa` | getSemesterCGPA, getCumulativeCGPA, getProjection, getDashboard |

### Frontend Components

| Component | Purpose |
|-----------|---------|
| `DashboardPage` | Main landing page with CGPA chart and summary cards |
| `SemesterListPage` | List all semesters with navigation |
| `SemesterDetailPage` | View/edit semester with subjects and scores |
| `SubjectForm` | Add/edit subject with validation |
| `ScoreInput` | Inline score entry with real-time validation |
| `CGPACard` | Summary card showing current vs target |
| `CGPAChart` | Line/bar chart of CGPA trend |
| `ScoreProjectionTable` | Shows required end-sem marks per subject |
| `TargetSettings` | Form to set semester and cumulative targets |

---

## Data Models

### Database Tables

```typescript
// packages/db/src/schema/ams.ts

import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, integer, decimal, boolean, index, uuid } from "drizzle-orm/pg-core";
import { user } from "./auth";

// Academic Profile - one per user
export const academicProfile = pgTable("academic_profile", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  institutionType: text("institution_type", { enum: ["school", "college"] }).notNull(),
  institutionName: text("institution_name"),
  currentSemester: integer("current_semester").notNull().default(1),
  targetCumulativeCGPADecimal(3, 2"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}, (table) => [
  index("academicProfile_userId_idx").on(table.userId),
]);

// Semester - belongs to user
export const semester = pgTable("semester", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  academicYear: text("academic_year"),
  isActive: boolean("is_active").default(false).notNull(),
  targetCGPA: decimal("target_cgpa", { precision: 3, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}, (table) => [
  index("semester_userId_idx").on(table.userId),
]);

// Subject - belongs to semester
export const subject = pgTable("subject", {
  id: uuid("id").primaryKey().defaultRandom(),
  semesterId: uuid("semester_id")
    .notNull()
    .references(() => semester.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  creditHours: integer("credit_hours").notNull(),
  maxInternalMarks: integer("max_internal_marks").notNull(),
  maxEndsemMarks: integer("max_endsem_marks").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}, (table) => [
  index("subject_semesterId_idx").on(table.semesterId),
]);

// Score - belongs to subject
export const score = pgTable("score", {
  id: uuid("id").primaryKey().defaultRandom(),
  subjectId: uuid("subject_id")
    .notNull()
    .references(() => subject.id, { onDelete: "cascade" }),
  internalMarks: decimal("internal_marks", { precision: 5, scale: 2 }),
  endsemMarks: decimal("endsem_marks", { precision: 5, scale: 2 }),
  gradePoint: decimal("grade_point", { precision: 3, scale: 2 }),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}, (table) => [
  index("score_subjectId_idx").on(table.subjectId),
]);

// Relations
export const academicProfileRelations = relations(academicProfile, ({ many }) => ({
  semesters: many(semester),
}));

export const semesterRelations = relations(semester, ({ one, many }) => ({
  user: one(user, { fields: [semester.userId], references: [user.id] }),
  subjects: many(subject),
}));

export const subjectRelations = relations(subject, ({ one, many }) => ({
  semester: one(semester, { fields: [subject.semesterId], references: [semester.id] }),
  scores: many(score),
}));

export const scoreRelations = relations(score, ({ one }) => ({
  subject: one(subject, { fields: [score.subjectId], references: [subject.id] }),
}));
```

### Grade Point Mapping (10-point Scale)

| Marks Range (%) | Grade | Grade Point |
|-----------------|-------|-------------|
| 90 – 100 | O (Outstanding) | 10 |
| 80 – 89 | A+ (Excellent) | 9 |
| 70 – 79 | A (Very Good) | 8 |
| 60 – 69 | B+ (Good) | 7 |
| 55 – 59 | B (Above Average) | 6 |
| 50 – 54 | C (Average) | 5 |
| 45 – 49 | P (Pass) | 4 |
| < 45 | F (Fail) | 0 |

---

## Correctness Properties

This section defines formal correctness properties derived from acceptance criteria. These properties are suitable for property-based testing.

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Grade Point Calculation

*For any* valid percentage score between 0-100, the grade point calculation function SHALL return the correct grade point according to the standard 10-point scale mapping.

**Validates: Requirements 8.1–8.9**

### Property 2: Grade Point Round Trip

*For any* computed grade point value, converting the corresponding minimum marks percentage back through the grade point function SHALL return a grade point less than or equal to the original.

**Validates: Requirements 8.1–8.9**

### Property 3: Semester CGPA Formula

*For any* semester with at least one subject that has both internal and end-sem marks entered, the calculated Semester CGPA SHALL equal Σ (Grade Point × Credit Hours) / Σ (Credit Hours).

**Validates: Requirements 9.1, 9.2**

### Property 4: Cumulative CGPA Formula

*For any* user with multiple completed semesters, the calculated Cumulative CGPA SHALL equal Σ (Semester CGPA × Total Credits in Semester) / Σ (Total Credits across all Semesters).

**Validates: Requirements 10.1**

### Property 5: CGPA Rounding

*For any* calculated CGPA value, the displayed CGPA SHALL be rounded to exactly two decimal places.

**Validates: Requirements 9.3, 10.3**

### Property 6: Score Validation (Internal Marks)

*For any* subject with configured maxInternalMarks, when internal marks are entered, they SHALL be rejected if they exceed maxInternalMarks.

**Validates: Requirements 6.2, 20.3**

### Property 7: Score Validation (End-Sem Marks)

*For any* subject with configured maxEndsemMarks, when end-sem marks are entered, they SHALL be rejected if they exceed maxEndsemMarks.

**Validates: Requirements 7.2, 20.3**

### Property 8: Active Semester Exclusivity

*For any* user, when a semester is set to active, all other semesters SHALL be set to inactive.

**Validates: Requirements 2.4**

### Property 9: Score Projection Calculation

*For any* subject with internal marks entered and a target CGPA, the required end-sem marks SHALL be calculated as: ES_required = ((Target_GP_percentage / 100) × (Max_IM + Max_ES)) - IM

**Validates: Requirements 13.4**

### Property 10: Cascading Deletion (Semester)

*For any* semester deletion, all associated subjects and their scores SHALL be deleted.

**Validates: Requirements 3.3**

### Property 11: Cascading Deletion (Subject)

*For any* subject deletion, all associated scores SHALL be deleted.

**Validates: Requirements 5.3**

### Property 12: User Data Isolation

*For any* API query, results SHALL only include data belonging to the authenticated user.

**Validates: Requirements 21.1–21.4**

### Property 13: Target CGPA Range Validation

*For any* target CGPA value submitted, values outside the range 0.00–10.00 SHALL be rejected.

**Validates: Requirements 11.2, 12.2, 20.4**

### Property 14: Credit Hours Validation

*For any* subject creation, credit hours with non-positive integers SHALL be rejected.

**Validates: Requirements 4.3, 20.1**

---

## Error Handling

### API Error Codes

| Error Code | HTTP Status | Description |
|------------|-------------|-------------|
| `NOT_FOUND` | 404 | Resource not found |
| `UNAUTHORIZED` | 401 | User not authenticated |
| `FORBIDDEN` | 403 | User does not own resource |
| `VALIDATION_ERROR` | 400 | Invalid input data |
| `INTERNAL_ERROR` | 500 | Server error |

### Validation Error Messages

- `"Credit hours must be a positive integer"`
- `"Maximum marks must be a positive integer"`
- `"Internal marks cannot exceed {max}"`
- `"End-sem marks cannot exceed {max}"`
- `"Target CGPA must be between 0.00 and 10.00"`
- `"Semester name is required"`
- `"Subject name is required"`

### Client-Side Error Handling

- Form fields show inline validation errors
- Toast notifications for successful operations
- Loading states during API calls
- Optimistic updates where safe

---

## Testing Strategy

### Unit Tests

Focus areas:
- Grade point mapping function
- CGPA calculation functions
- Score validation logic
- Target projection calculations

### Property-Based Tests

The following properties should be tested with 100+ iterations each:
- Grade point calculation accuracy across all percentage ranges
- CGPA formula correctness with random subject/credit combinations
- Score projection formula accuracy
- Input validation boundary conditions

### Integration Tests

- End-to-end flow: Create semester → Add subject → Enter scores → Verify CGPA
- Target setting and projection flow
- Dashboard data aggregation

### Test Tag Format

```typescript
// Feature: academic-management-system, Property 1: Grade Point Calculation
```

### Libraries

- **Testing**: Vitest with @writing-holdings/fast-check (or @fast-check/vitest)
- **API Testing**: @orpc/testing
- **Database**: Test containers or mock database

---

## API Endpoints

### Profile Router

```typescript
// Get current user's academic profile
profile: protectedProcedure.handler(({ context }) => {...})

// Create academic profile
profileCreate: protectedProcedure
  .input(z.object({
    institutionType: z.enum(["school", "college"]),
    institutionName: z.string().optional(),
    currentSemester: z.number().min(1).max(20),
    targetCumulativeCGPA: z.number().min(0).max(10).optional(),
  }))
  .handler(...)

// Update academic profile
profileUpdate: protectedProcedure
  .input(z.object({
    institutionType: z.enum(["school", "college"]).optional(),
    institutionName: z.string().optional(),
    currentSemester: z.number().min(1).max(20).optional(),
    targetCumulativeCGPA: z.number().min(0).max(10).optional(),
  }))
  .handler(...)
```

### Semester Router

```typescript
// List all semesters for user (reverse chronological)
semesterList: protectedProcedure.handler(...)

// Get single semester with subjects
semesterGet: protectedProcedure
  .input(z.object({ id: z.string().uuid() }))
  .handler(...)

// Create semester
semesterCreate: protectedProcedure
  .input(z.object({
    name: z.string().min(1),
    academicYear: z.string().optional(),
    isActive: z.boolean().default(false),
    targetCGPA: z.number().min(0).max(10).optional(),
  }))
  .handler(...)

// Update semester
semesterUpdate: protectedProcedure
  .input(z.object({
    id: z.string().uuid(),
    name: z.string().min(1).optional(),
    academicYear: z.string().optional(),
    isActive: z.boolean().optional(),
    targetCGPA: z.number().min(0).max(10).optional(),
  }))
  .handler(...)

// Delete semester (cascades to subjects and scores)
semesterDelete: protectedProcedure
  .input(z.object({ id: z.string().uuid() }))
  .handler(...)
```

### Subject Router

```typescript
// List subjects for a semester
subjectList: protectedProcedure
  .input(z.object({ semesterId: z.string().uuid() }))
  .handler(...)

// Create subject
subjectCreate: protectedProcedure
  .input(z.object({
    semesterId: z.string().uuid(),
    name: z.string().min(1),
    creditHours: z.number().int().positive(),
    maxInternalMarks: z.number().int().positive(),
    maxEndsemMarks: z.number().int().positive(),
  }))
  .handler(...)

// Update subject
subjectUpdate: protectedProcedure
  .input(z.object({
    id: z.string().uuid(),
    name: z.string().min(1).optional(),
    creditHours: z.number().int().positive().optional(),
    maxInternalMarks: z.number().int().positive().optional(),
    maxEndsemMarks: z.number().int().positive().optional(),
  }))
  .handler(...)

// Delete subject (cascades to scores)
subjectDelete: protectedProcedure
  .input(z.object({ id: z.string().uuid() }))
  .handler(...)
```

### Score Router

```typescript
// Get score for a subject
scoreGet: protectedProcedure
  .input(z.object({ subjectId: z.string().uuid() }))
  .handler(...)

// Update internal marks
scoreUpdateInternal: protectedProcedure
  .input(z.object({
    subjectId: z.string().uuid(),
    internalMarks: z.number().min(0).nullable(),
  }))
  .handler(...)

// Update end-sem marks
scoreUpdateEndsem: protectedProcedure
  .input(z.object({
    subjectId: z.string().uuid(),
    endsemMarks: z.number().min(0).nullable(),
  }))
  .handler(...)
```

### CGPA Router

```typescript
// Get dashboard data (CGPA chart data, summary cards, active semester breakdown)
cgpaDashboard: protectedProcedure.handler(...)

// Get semester CGPA
cgpaSemester: protectedProcedure
  .input(z.object({ semesterId: z.string().uuid() }))
  .handler(...)

// Get cumulative CGPA
cgpaCumulative: protectedProcedure.handler(...)

// Get score projection for a semester
cgpaProjection: protectedProcedure
  .input(z.object({ semesterId: z.string().uuid() }))
  .handler(...)
```

---

## Frontend Architecture

### Pages

| Page | Route | Description |
|------|-------|-------------|
| Dashboard | `/dashboard` | Main view with CGPA chart and summary |
| Semesters | `/semesters` | List all semesters |
| Semester Detail | `/semesters/[id]` | View semester with subjects/scores |
| Settings | `/settings` | Profile and target settings |

### Page Flow

```
┌─────────────┐
│  Dashboard  │◄──────────────────────────┐
│  - CGPA     │                           │
│    Chart    │                           │
│  - Summary  │                           │
│    Cards    │                           │
│  - Active   │                           │
│    Semester │                           │
│    Table    │                           │
└──────┬──────┘                           │
       │                                  │
       ▼                                  │
┌──────────────┐    ┌────────────┐         │
│  Semester    │───►│  Subject   │         │
│  List        │    │  Detail    │         │
│  - Add New   │    │  - Scores  │         │
│  - Navigate  │    │  - Target  │         │
└──────────────┘    └──────┬─────┘         │
                           │                │
                           ▼                │
                    ┌──────────────┐        │
                    │  Score       │        │
                    │  Entry       │────────┘
                    │  Form        │
                    └──────────────┘
```

### State Management

- **Server State**: React Query (TanStack Query) for API data caching
- **Form State**: React Hook Form with Zod validation
- **UI State**: Local component state for modals, loading states

### Component Hierarchy

```
DashboardPage
├── CGPAChart (recharts)
├── SummaryCards
│   ├── CGPACard (current)
│   ├── CGPACard (target)
│   ├── CGPACard (gap)
│   └── CGPACard (semester)
├── ActiveSemesterTable
│   └── ScoreRow (per subject)
└── SemesterList (navigation)

SemesterDetailPage
├── SemesterHeader (name, year, CGPA, target)
├── TargetForm (set semester target)
├── SubjectList
│   └── SubjectCard
│       ├── SubjectInfo (name, credits)
│       ├── ScoreInput (internal)
│       ├── ScoreInput (end-sem)
│       ├── GradeDisplay
│       └── ProjectionDisplay (if target set)
└── AddSubjectButton → SubjectFormModal
```

---

## CGPA Calculation Logic

### Grade Point Function

```typescript
function calculateGradePoint(totalPercentage: number): number {
  if (totalPercentage >= 90) return 10;  // O - Outstanding
  if (totalPercentage >= 80) return 9;   // A+ - Excellent
  if (totalPercentage >= 70) return 8;   // A - Very Good
  if (totalPercentage >= 60) return 7;   // B+ - Good
  if (totalPercentage >= 55) return 6;   // B - Above Average
  if (totalPercentage >= 50) return 5;   // C - Average
  if (totalPercentage >= 45) return 4;   // P - Pass
  return 0;                              // F - Fail
}
```

### Total Percentage Calculation

```typescript
function calculateTotalPercentage(
  internalMarks: number | null,
  endsemMarks: number | null,
  maxInternalMarks: number,
  maxEndsemMarks: number
): number | null {
  if (internalMarks === null || endsemMarks === null) {
    return null; // Pending
  }
  return ((internalMarks + endsemMarks) / (maxInternalMarks + maxEndsemMarks)) * 100;
}
```

### Semester CGPA

```typescript
function calculateSemesterCGPA(subjects: SubjectWithScores[]): number | null {
  const completedSubjects = subjects.filter(
    (s) => s.score.internalMarks !== null && s.score.endsemMarks !== null
  );
  
  if (completedSubjects.length === 0) return null;
  
  const totalWeightedGradePoints = completedSubjects.reduce((sum, subject) => {
    const percentage = calculateTotalPercentage(
      Number(subject.score.internalMarks),
      Number(subject.score.endsemMarks),
      subject.maxInternalMarks,
      subject.maxEndsemMarks
    );
    const gradePoint = calculateGradePoint(percentage!);
    return sum + (gradePoint * subject.creditHours);
  }, 0);
  
  const totalCredits = completedSubjects.reduce((sum, s) => sum + s.creditHours, 0);
  
  return totalWeightedGradePoints / totalCredits;
}
```

### Cumulative CGPA

```typescript
function calculateCumulativeCGPA(semesters: SemesterWithCGPA[]): number {
  const completedSemesters = semesters.filter((s) => s.cgpa !== null);
  
  if (completedSemesters.length === 0) return 0;
  
  const totalWeightedCGPA = completedSemesters.reduce((sum, semester) => {
    return sum + (semester.cgpa! * semester.totalCredits);
  }, 0);
  
  const totalCredits = completedSemesters.reduce((sum, s) => sum + s.totalCredits, 0);
  
  return totalWeightedCGPA / totalCredits;
}
```

---

## Score Projection Logic

### End-Sem Required Calculation

To achieve a target CGPA for a semester, we need to find the required end-sem marks for each subject.

Given:
- `IM` = Internal Marks scored
- `ES_required` = Required End-Sem score
- `Max_IM` = Maximum Internal Marks
- `Max_ES` = Maximum End-Sem Marks
- `Target_CGPA` = Target semester CGPA

Step 1: Calculate minimum grade point needed
```typescript
function getMinGradePointForTarget(targetCGPA: number): number {
  return targetCGPA; // Direct mapping on 10-point scale
}
```

Step 2: Calculate minimum percentage needed for that grade point
```typescript
function getMinPercentageForGradePoint(gp: number): number {
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
  return thresholds.find((t) => gp >= t.gp)!.min;
}
```

Step 3: Calculate required end-sem marks
```typescript
function calculateRequiredEndsem(
  internalMarks: number,
  maxInternalMarks: number,
  maxEndsemMarks: number,
  targetCGPA: number
): { required: number; achievable: boolean } {
  const minPercentage = getMinPercentageForGradePoint(targetCGPA);
  const totalMax = maxInternalMarks + maxEndsemMarks;
  
  const requiredTotalMarks = (minPercentage / 100) * totalMax;
  const requiredEndsem = requiredTotalMarks - internalMarks;
  
  const achievable = requiredEndsem <= maxEndsemMarks;
  
  return {
    required: Math.max(0, requiredEndsem),
    achievable,
  };
}
```

### Cumulative Goal Projection

```typescript
function calculateRequiredSemesterCGPA(
  currentCumulativeCGPA: number,
  currentTotalCredits: number,
  targetCumulativeCGPA: number,
  remainingSemesters: number,
  averageCreditsPerSemester: number
): { required: number; achievable: boolean } {
  // If target already achieved
  if (currentCumulativeCGPA >= targetCumulativeCGPA) {
    return { required: 0, achievable: true };
  }
  
  // Calculate total credits needed for target
  const targetTotalCredits = currentTotalCredits + (remainingSemesters * averageCreditsPerSemester);
  const requiredTotalWeightedCGPA = targetCumulativeCGPA * targetTotalCredits;
  const currentWeightedCGPA = currentCumulativeCGPA * currentTotalCredits;
  
  const requiredFutureWeightedCGPA = requiredTotalWeightedCGPA - currentWeightedCGPA;
  const requiredSemesterCGPA = requiredFutureWeightedCGPA / (remainingSemesters * averageCreditsPerSemester);
  
  return {
    required: requiredSemesterCGPA,
    achievable: requiredSemesterCGPA <= 10,
  };
}
```

---

## UI/UX Design

### Dashboard Screen

```
┌─────────────────────────────────────────────────────────────┐
│  AMS                                    [Profile] [Logout]  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │            CGPA Trend Across Semesters              │   │
│  │  10 ┤                    ┌──                        │   │
│  │     │              ┌──┐  │                          │   │
│  │   8 ┤        ┌──┐  │  │  │     ●──●──● Target: 8.5 │   │
│  │     │  ┌──┐  │  │  │  │                          │   │
│  │   6 ┤  │  │  │  │  │  │                          │   │
│  │     │  │  │  │  │  │  │                          │   │
│  │   4 ┤  │  │  │  │  │  │                          │   │
│  │     └──┴──┴──┴──┴──┴──┴──                        │   │
│  │      S1   S2   S3   S4   S5 (Active)             │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │ Current  │ │ Target   │ │   Gap    │ │ Semester │       │
│  │  7.85    │ │  8.50    │ │  +0.65   │ │   8.20   │       │
│  │ CGPA     │ │ CGPA     │ │          │ │ CGPA     │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
│   (green)    (blue)      (yellow)    (green)               │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Active Semester: Semester 5                        │   │
│  │  ┌────────────────────────────────────────────────┐ │   │
│  │  │ Subject    │Internal│EndSem│Grade│Req'd│Status │ │   │
│  │  ├────────────────────────────────────────────────┤ │   │
│  │  │ Math       │  85/100│  --  │  -- │ 78  │Pending│ │   │
│  │  │ Physics    │  78/100│  82/100│ 8  │  -- │  ✓   │ │   │
│  │  │ Chemistry  │  92/100│  88/100│ 10 │  -- │  ✓   │ │   │
│  │  │ ...        │        │      │     │     │       │ │   │
│  │  └────────────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Color Coding

| State | Color | Usage |
|-------|-------|-------|
| Above Target | Green | CGPA exceeds target |
| At Target | Blue | CGPA meets target |
| Below Target | Yellow/Orange | CGPA below target |
| Unachievable | Red | Target cannot be met |
| Pending | Gray | Scores not yet entered |

### Key UX Principles

1. **Progressive Disclosure**: First-time users see onboarding; returning users see dashboard
2. **Inline Editing**: Scores editable directly in table without page navigation
3. **Real-time Calculations**: CGPA updates immediately on score entry
4. **Visual Feedback**: Clear indicators for above/below target, achievable/unachievable
5. **Helpful Empty States**: Prompts to add first semester/subject when no data exists

---

## Implementation Tasks

The following tasks should be completed in order:

1. **Database Schema**: Create `ams.ts` schema file with all tables and relations
2. **Schema Export**: Add AMS tables to `schema/index.ts`
3. **API Routers**: Implement all oRPC routers (profile, semester, subject, score, cgpa)
4. **CGPA Utilities**: Create shared functions for calculations in a separate package
5. **Frontend Hooks**: Create React Query hooks for each API endpoint
6. **Dashboard Page**: Build main dashboard with chart and summary cards
7. **Semester Management**: Pages for list and detail views
8. **Score Entry Components**: Inline score input with validation
9. **Projection UI**: Display required end-sem marks
10. **Target Settings**: Form for setting semester/cumulative targets
11. **Profile Setup**: Onboarding flow for new users

---

## Appendix: API Request/Response Examples

### Dashboard Response

```json
{
  "cumulativeCGPA": 7.85,
  "targetCumulativeCGPA": 8.5,
  "gap": -0.65,
  "semesters": [
    {
      "id": "uuid-1",
      "name": "Semester 1",
      "academicYear": "2023-24",
      "cgpa": 7.2,
      "totalCredits": 20
    },
    {
      "id": "uuid-2",
      "name": "Semester 5",
      "academicYear": "2025-26",
      "isActive": true,
      "cgpa": 8.2,
      "targetCGPA": 8.5,
      "subjects": [
        {
          "id": "uuid-s1",
          "name": "Mathematics",
          "creditHours": 4,
          "maxInternalMarks": 100,
          "maxEndsemMarks": 100,
          "score": {
            "internalMarks": 85,
            "endsemMarks": null,
            "gradePoint": null,
            "status": "pending"
          },
          "projection": {
            "requiredEndsem": 78,
            "achievable": true
          }
        }
      ]
    }
  ]
}
```

### Score Projection Response

```json
{
  "semesterId": "uuid-5",
  "targetCGPA": 8.5,
  "currentCGPA": 8.2,
  "subjects": [
    {
      "subjectId": "uuid-s1",
      "subjectName": "Mathematics",
      "internalMarks": 85,
      "maxInternalMarks": 100,
      "maxEndsemMarks": 100,
      "requiredEndsem": 78,
      "achievable": true
    },
    {
      "subjectId": "uuid-s2",
      "subjectName": "Physics",
      "internalMarks": null,
      "maxInternalMarks": 100,
      "maxEndsemMarks": 100,
      "requiredEndsem": 85,
      "achievable": true,
      "note": "Enter internal marks to see projection"
    }
  ],
  "maxAchievableCGPA": 9.1,
  "isTargetAchievable": true
}
```