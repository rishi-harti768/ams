# Tasks: Academic Management System (AMS)

## Overview

Implementation tasks for the Academic Management System feature, derived from the design document.

## Implementation Order

### Phase 1: Database & Schema

- [x] 1.1 Create `packages/db/src/schema/ams.ts` with all AMS tables (academicProfile, semester, subject, score)
- [x] 1.2 Export AMS schema in `packages/db/src/schema/index.ts`
- [x] 1.3 Run database migrations to create tables
- [x] 1.4 Add AMS relations to user in auth schema (optional, for queries)

### Phase 2: API Layer

- [x] 2.1 Create profile router in `packages/api/src/routers/profile.ts`
- [x] 2.2 Create semester router in `packages/api/src/routers/semester.ts`
- [x] 2.3 Create subject router in `packages/api/src/routers/subject.ts`
- [x] 2.4 Create score router in `packages/api/src/routers/score.ts`
- [x] 2.5 Create cgpa router in `packages/api/src/routers/cgpa.ts`
- [x] 2.6 Register all routers in `packages/api/src/routers/index.ts`

### Phase 3: CGPA Calculation Utilities

- [x] 3.1 Create `packages/ams/src/calculations.ts` with grade point function
- [x] 3.2 Create calculation functions for semester and cumulative CGPA
- [x] 3.3 Create score projection utilities
- [x] 3.4 Export types and functions from `packages/ams/src/index.ts`

### Phase 4: Frontend - Core Components

- [x] 4.1 Create `CGPACard` component in `packages/ui/src/components/cgpa-card.tsx`
- [x] 4.2 Create `CGPAChart` component in `packages/ui/src/components/cgpa-chart.tsx`
- [x] 4.3 Create `ScoreInput` component in `packages/ui/src/components/score-input.tsx`
- [x] 4.4 Create `SubjectForm` component in `packages/ui/src/components/subject-form.tsx`
- [x] 4.5 Create `TargetForm` component in `packages/ui/src/components/target-form.tsx`

### Phase 5: Frontend - API Hooks

- [x] 5.1 Create React Query hooks for profile operations
- [x] 5.2 Create React Query hooks for semester operations
- [x] 5.3 Create React Query hooks for subject operations
- [x] 5.4 Create React Query hooks for score operations
- [x] 5.5 Create React Query hooks for CGPA/dashboard operations

### Phase 6: Frontend - Pages

- [x] 6.1 Create Dashboard page at `app/dashboard/page.tsx`
- [x] 6.2 Create Semester List page at `app/semesters/page.tsx`
- [x] 6.3 Create Semester Detail page at `app/semesters/[id]/page.tsx`
- [x] 6.4 Create Profile/Settings page at `app/settings/page.tsx`
- [x] 6.5 Create Onboarding page for new users at `app/onboarding/page.tsx`

### Phase 7: Validation & Polish

- [x] 7.1 Add Zod validation schemas to all API inputs
- [x] 7.2 Add error handling and user-friendly error messages
- [x] 7.3 Run biome formatting on all new files
- [x] 7.4 Verify all acceptance criteria are met

## Notes

- All API routes must use `protectedProcedure` for authentication
- Database queries must filter by `context.session.user.id` for data isolation
- Frontend should use optimistic updates where appropriate
- CGPA calculations should handle edge cases (null scores, zero subjects)