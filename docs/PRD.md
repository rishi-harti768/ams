# Product Requirements Document (PRD)
## Academic Management System (AMS)

**Version:** 1.0 — MVP
**Date:** April 20, 2026
**Status:** Draft

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Goals & Success Metrics](#3-goals--success-metrics)
4. [Target Users](#4-target-users)
5. [Scope](#5-scope)
6. [User Stories](#6-user-stories)
7. [Functional Requirements](#7-functional-requirements)
8. [Non-Functional Requirements](#8-non-functional-requirements)
9. [System Architecture Overview](#9-system-architecture-overview)
10. [Data Models](#10-data-models)
11. [UI/UX Requirements](#11-uiux-requirements)
12. [Out of Scope (MVP)](#12-out-of-scope-mvp)
13. [Risks & Mitigations](#13-risks--mitigations)
14. [Timeline & Milestones](#14-timeline--milestones)
15. [Appendix](#15-appendix)

---

## 1. Executive Summary

The **Academic Management System (AMS)** is a free, web-based platform designed to help school and college students track, plan, and optimize their academic performance. Students can record past semester scores, input internal marks and end-semester exam scores per subject, set semester-level and overall CGPA targets, and receive a clear picture of how they are tracking toward their academic goals.

The MVP focuses on delivering a reliable, intuitive score tracking and CGPA planning experience — without AI guidance features — to validate core user value before expanding the product.

---

## 2. Problem Statement

Students frequently struggle to:

- Keep a structured record of past semester scores and internal marks across subjects.
- Understand exactly what scores they need in upcoming exams to hit their target CGPA.
- Plan proactively for both semester-level and cumulative CGPA goals.
- Access all their academic performance data in one centralized, easy-to-use place.

Existing tools (spreadsheets, notebooks, generic GPA calculators) are either too generic, too manual, or don't support the nuances of the CGPA system used in Indian schools and universities.

---

## 3. Goals & Success Metrics

### Product Goals

| Goal | Description |
|------|-------------|
| Core Tracking | Allow students to record and view internal + end-sem scores per subject per semester |
| CGPA Planning | Enable students to set and track semester & cumulative CGPA targets |
| Score Projection | Show students what end-sem score they need per subject to hit their target CGPA |
| Retention | Build a habit-forming tool students return to each semester |

### Success Metrics (MVP)

| Metric | Target (3 months post-launch) |
|--------|-------------------------------|
| Registered users | 500+ |
| Weekly active users | 40% of registered users |
| Avg. semesters entered per user | ≥ 2 |
| Target CGPA set | ≥ 70% of users set a target |
| Session duration | ≥ 3 minutes avg |
| D7 retention | ≥ 30% |

---

## 4. Target Users

### Primary Users
- **School students** (Grades 9–12) with subject-wise internal and final exam marks
- **College/University students** (UG & PG) following a CGPA-based semester system

### User Personas

**Persona 1 — Riya, 19, B.Tech Student**
> "I always lose track of my internal marks and panic before exams wondering what I need to pass or hit an 8.0 CGPA."

- Has 6–8 subjects per semester
- Cares about CGPA for placements
- Wants clarity on what score she needs in each final exam

**Persona 2 — Arjun, 16, Grade 11 Student**
> "I want to know how my class tests affect my final marks and what I need to score to get above 85%."

- Has 5–6 subjects
- Tracked by percentage internally but graded on CGPA scale
- Wants a simple dashboard to understand progress

---

## 5. Scope

### In Scope (MVP)

- User authentication (email & password)
- Academic profile setup (school/college, current semester/grade)
- Semester management (add past and current semesters)
- Subject management per semester (add subjects with credit hours)
- Score entry: internal marks and end-semester exam scores
- CGPA auto-calculation (10-point scale) per semester and cumulative
- Target CGPA setting — per semester AND overall cumulative
- Score projection: what end-sem score is needed per subject to hit target CGPA
- Dashboard: visual summary of CGPA trend across semesters
- Responsive web app (desktop-first)

### Out of Scope (MVP)

- AI-generated subject-wise guidance and motivation
- Mobile app (iOS/Android)
- Social or peer comparison features
- Faculty/admin access
- Institution-level data management
- Push notifications or email reminders
- Import from external systems (ERP, LMS)

---

## 6. User Stories

### Authentication

| ID | User Story | Priority |
|----|------------|----------|
| US-01 | As a new user, I want to sign up with my email and password so that I can create my account. | Must Have |
| US-02 | As a returning user, I want to log in with my email and password to access my data. | Must Have |
| US-03 | As a user, I want to reset my password via email if I forget it. | Must Have |

### Academic Profile

| ID | User Story | Priority |
|----|------------|----------|
| US-04 | As a user, I want to set up my academic profile (institution type, current semester) so the app is configured for me. | Must Have |
| US-05 | As a user, I want to edit my profile details at any time. | Should Have |

### Semester & Subject Management

| ID | User Story | Priority |
|----|------------|----------|
| US-06 | As a user, I want to add a new semester (e.g., Semester 3) and name it. | Must Have |
| US-07 | As a user, I want to add subjects to a semester along with their credit hours. | Must Have |
| US-08 | As a user, I want to edit or delete a subject from a semester. | Must Have |
| US-09 | As a user, I want to view all my past semesters and their subjects. | Must Have |

### Score Entry

| ID | User Story | Priority |
|----|------------|----------|
| US-10 | As a user, I want to enter my internal marks for each subject. | Must Have |
| US-11 | As a user, I want to enter my end-semester exam score for each subject. | Must Have |
| US-12 | As a user, I want to see the total marks and grade automatically calculated per subject. | Must Have |
| US-13 | As a user, I want to update scores at any time. | Must Have |

### CGPA Calculation

| ID | User Story | Priority |
|----|------------|----------|
| US-14 | As a user, I want to see my CGPA auto-calculated for each semester based on scores entered. | Must Have |
| US-15 | As a user, I want to see my cumulative CGPA across all semesters I've entered. | Must Have |

### Target Setting & Score Projection

| ID | User Story | Priority |
|----|------------|----------|
| US-16 | As a user, I want to set a target CGPA for the current semester. | Must Have |
| US-17 | As a user, I want to set an overall cumulative CGPA target. | Must Have |
| US-18 | As a user, I want to see what end-semester exam score I need in each subject to hit my target semester CGPA. | Must Have |
| US-19 | As a user, I want to see what overall semester CGPA I need to reach my cumulative CGPA target. | Must Have |

### Dashboard

| ID | User Story | Priority |
|----|------------|----------|
| US-20 | As a user, I want a dashboard that shows my CGPA trend across all semesters in a chart. | Must Have |
| US-21 | As a user, I want to see a summary card showing current CGPA vs. target CGPA at a glance. | Must Have |
| US-22 | As a user, I want to see a per-subject breakdown for the active semester. | Must Have |

---

## 7. Functional Requirements

### 7.1 Authentication Module

- **FR-01:** The system shall allow users to register with a valid email address and a password (minimum 8 characters, at least 1 uppercase, 1 number).
- **FR-02:** The system shall send a verification email upon registration.
- **FR-03:** The system shall allow login with registered email and password.
- **FR-04:** The system shall support password reset via a time-limited email link.
- **FR-05:** The system shall maintain authenticated sessions using JWT tokens (expiry: 7 days with refresh).

### 7.2 Academic Profile

- **FR-06:** On first login, users shall be prompted to complete their academic profile: institution type (School / College), current semester or grade, and institution name (optional).
- **FR-07:** Users shall be able to update their profile from a settings page.

### 7.3 Semester Management

- **FR-08:** Users can create semesters, each with a name (e.g., "Semester 3", "Class 11 - Term 1") and an academic year.
- **FR-09:** Users can mark a semester as "Active" (current) or "Past" (completed).
- **FR-10:** Users can delete a semester (with confirmation prompt); deletion cascades to subjects and scores.
- **FR-11:** Semesters shall be listed in reverse chronological order by default.

### 7.4 Subject Management

- **FR-12:** Users can add subjects to a semester, specifying: subject name, credit hours (or weightage), and maximum internal marks, maximum end-semester marks.
- **FR-13:** The system shall validate that credit hours are a positive integer.
- **FR-14:** Users can edit or delete any subject within a semester.

### 7.5 Score Entry

- **FR-15:** For each subject, users can enter internal marks scored (cannot exceed the configured maximum internal marks).
- **FR-16:** For each subject, users can enter end-semester exam marks scored (cannot exceed configured maximum end-sem marks).
- **FR-17:** The system shall auto-calculate the total score and convert it to a grade point on the 10-point CGPA scale using the standard grade mapping (see Appendix A).
- **FR-18:** Partial entry shall be supported — users can enter internal marks before end-sem results are available.

### 7.6 CGPA Calculation

- **FR-19:** Semester CGPA shall be calculated as:

  ```
  Semester CGPA = Σ (Grade Point of Subject × Credit Hours) / Σ (Credit Hours)
  ```

- **FR-20:** Cumulative CGPA shall be calculated as:

  ```
  Cumulative CGPA = Σ (Semester CGPA × Total Credits in Semester) / Σ (Total Credits across all Semesters)
  ```

- **FR-21:** CGPA values shall be displayed to two decimal places.
- **FR-22:** If a subject has only internal marks entered (no end-sem), it shall be excluded from CGPA calculation and marked as "Pending."

### 7.7 Target Setting & Score Projection

- **FR-23:** Users can set a target CGPA (0.0–10.0) per semester.
- **FR-24:** Users can set an overall cumulative CGPA target.
- **FR-25:** For the active semester, the system shall calculate and display the minimum end-semester score required in each subject to achieve the target semester CGPA, given the internal marks already entered.
- **FR-26:** If the target CGPA is mathematically unachievable given current internal scores, the system shall clearly display an "Unachievable" indicator and show the maximum possible CGPA instead.
- **FR-27:** The system shall calculate and display the minimum semester CGPA required in the upcoming semester to reach the overall CGPA target.

### 7.8 Dashboard

- **FR-28:** The dashboard shall display a line/bar chart of CGPA per semester across all semesters entered.
- **FR-29:** The dashboard shall display summary cards: Current Cumulative CGPA, Target Cumulative CGPA, Gap (difference), and Active Semester CGPA.
- **FR-30:** The dashboard shall display a subject-level table for the active semester showing: subject name, internal marks, end-sem marks (if entered), grade point, and required end-sem score to hit target.

---

## 8. Non-Functional Requirements

### 8.1 Performance

- **NFR-01:** All pages shall load in under 2 seconds on a standard broadband connection.
- **NFR-02:** CGPA calculations shall render in under 500ms after score entry.

### 8.2 Reliability

- **NFR-03:** The system shall target 99.5% uptime (measured monthly).
- **NFR-04:** All user data shall be persisted server-side; no critical data shall be stored only in browser local storage.

### 8.3 Security

- **NFR-05:** All API communication shall use HTTPS/TLS.
- **NFR-06:** Passwords shall be hashed using bcrypt (minimum cost factor 12).
- **NFR-07:** JWT tokens shall be stored in httpOnly cookies (not localStorage).
- **NFR-08:** The system shall implement rate limiting on auth endpoints (max 10 attempts per 15 minutes per IP).

### 8.4 Usability

- **NFR-09:** The UI shall be responsive for desktop and tablet screen sizes (minimum 768px width).
- **NFR-10:** Core user flows (score entry, CGPA view) shall be completable in under 3 clicks from the dashboard.
- **NFR-11:** Error messages shall be human-readable and actionable.

### 8.5 Scalability

- **NFR-12:** The architecture shall support horizontal scaling for the API layer.
- **NFR-13:** Database design shall support up to 20 semesters and 12 subjects per semester per user without performance degradation.

### 8.6 Accessibility

- **NFR-14:** The app shall meet WCAG 2.1 Level AA standards for color contrast and keyboard navigability.

---

## 9. System Architecture Overview

```
┌──────────────────────────────────────────────────────┐
│                    Web Browser                        │
│              (React / Next.js Frontend)               │
└───────────────────────┬──────────────────────────────┘
                        │ HTTPS
┌───────────────────────▼──────────────────────────────┐
│                  REST API Server                      │
│              (Node.js / Express or FastAPI)           │
│  - Auth routes        - Semester routes               │
│  - Profile routes     - Score routes                  │
│  - CGPA calculation   - Projection engine             │
└───────────────────────┬──────────────────────────────┘
                        │
┌───────────────────────▼──────────────────────────────┐
│               PostgreSQL Database                     │
│  users | profiles | semesters | subjects | scores    │
└──────────────────────────────────────────────────────┘
```

**Recommended Stack:**
- **Frontend:** React (Next.js), Tailwind CSS, Recharts (for CGPA trend chart)
- **Backend:** Node.js (Express) or Python (FastAPI)
- **Database:** PostgreSQL
- **Auth:** JWT with httpOnly cookies
- **Hosting:** Vercel (frontend) + Railway / Render (backend + DB)

---

## 10. Data Models

### Users Table

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary Key |
| email | VARCHAR(255) | Unique, required |
| password_hash | VARCHAR | bcrypt hash |
| is_verified | BOOLEAN | Email verified flag |
| created_at | TIMESTAMP | |

### Profiles Table

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary Key |
| user_id | UUID | FK → Users |
| institution_type | ENUM | 'school', 'college' |
| institution_name | VARCHAR | Optional |
| current_semester | INT | |
| target_cumulative_cgpa | DECIMAL(3,2) | 0.00–10.00 |

### Semesters Table

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary Key |
| user_id | UUID | FK → Users |
| name | VARCHAR | e.g., "Semester 3" |
| academic_year | VARCHAR | e.g., "2025-26" |
| is_active | BOOLEAN | Current semester flag |
| target_cgpa | DECIMAL(3,2) | Per-semester target |

### Subjects Table

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary Key |
| semester_id | UUID | FK → Semesters |
| name | VARCHAR | Subject name |
| credit_hours | INT | Weightage |
| max_internal_marks | INT | |
| max_endsem_marks | INT | |

### Scores Table

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary Key |
| subject_id | UUID | FK → Subjects |
| internal_marks | DECIMAL | Nullable until entered |
| endsem_marks | DECIMAL | Nullable until entered |
| grade_point | DECIMAL(3,2) | Auto-calculated |
| updated_at | TIMESTAMP | |

---

## 11. UI/UX Requirements

### Key Screens

| Screen | Description |
|--------|-------------|
| **Onboarding / Signup** | Email + password registration, profile setup wizard |
| **Login** | Email + password login, forgot password link |
| **Dashboard** | CGPA trend chart, summary cards, active semester subject table |
| **Semester List** | All semesters listed; ability to add new semester |
| **Semester Detail** | Subject list with score entry fields and projected required scores |
| **Target Settings** | Set semester CGPA target and cumulative CGPA target |
| **Profile / Settings** | Edit academic profile, change password |

### UX Principles

- **Progressive disclosure:** Show only what's needed at each step; don't overwhelm first-time users.
- **Inline editing:** Score entry should feel like filling a table, not navigating to a new page.
- **Visual clarity:** Clearly differentiate between "entered scores," "projected required scores," and "targets" using color coding.
- **Empty states:** Helpful prompts when no data is added yet (e.g., "Add your first semester to get started").

---

## 12. Out of Scope (MVP)

The following features are explicitly excluded from the MVP but are planned for future iterations:

| Feature | Rationale |
|---------|-----------|
| AI-generated subject guidance & motivation | Core tracking must be validated first |
| Mobile app (iOS/Android) | Web-first to reduce build time |
| Google / Social login | Email auth is sufficient for MVP |
| Push / email reminders | Nice-to-have; deferred post-MVP |
| Peer comparison / leaderboard | Privacy and trust concerns; post-MVP |
| Faculty / admin panel | B2B feature; out of MVP scope |
| Multiple grading systems (GPA 4.0, %) | CGPA 10-point only for MVP |
| PDF / report export | Post-MVP |
| LMS / ERP integrations | Complex; post-MVP |

---

## 13. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| CGPA calculation formula varies by institution | High | High | Provide a configurable grade-point mapping; document the default formula used |
| Low retention after initial data entry | Medium | High | Design for recurring use (semester start → mid → end cycle); reminder emails post-MVP |
| Users enter incorrect max marks and get wrong projections | Medium | Medium | Validate inputs; show calculation breakdown for transparency |
| Data loss due to server issues | Low | High | Daily database backups; user-facing export option (CSV) post-MVP |
| Users abandon onboarding if too many steps | Medium | Medium | Keep onboarding to ≤ 3 steps; allow skipping and completing later |

---

## 14. Timeline & Milestones

| Phase | Milestone | Duration |
|-------|-----------|----------|
| **Phase 1** | Requirements finalized, tech stack decided, DB schema designed | Week 1 |
| **Phase 2** | Auth module + profile setup complete | Week 2 |
| **Phase 3** | Semester & subject management complete | Week 3 |
| **Phase 4** | Score entry + CGPA calculation engine complete | Week 4 |
| **Phase 5** | Target setting + score projection complete | Week 5 |
| **Phase 6** | Dashboard + charts complete | Week 6 |
| **Phase 7** | QA, bug fixes, UX polish | Week 7 |
| **Phase 8** | Beta launch (closed group of 50 students) | Week 8 |
| **Phase 9** | Feedback incorporation, public MVP launch | Week 10 |

---

## 15. Appendix

### Appendix A — Default Grade Point Mapping (10-point CGPA Scale)

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

> **Note:** This is the default UGC-recommended mapping. The system should allow institutions or users to override this mapping in future iterations.

### Appendix B — CGPA Projection Formula

Given:
- `IM` = Internal Marks scored
- `ES_required` = Required End-Sem score
- `Max_IM` = Maximum Internal Marks
- `Max_ES` = Maximum End-Sem Marks
- `Target_GP` = Grade Point required for target CGPA

```
Total % = ((IM + ES_required) / (Max_IM + Max_ES)) × 100
ES_required = ((Target_GP_min_percentage / 100) × (Max_IM + Max_ES)) - IM
```

The system solves for `ES_required` for each subject given the user's target semester CGPA.

---

*Document prepared for AMS MVP v1.0. All requirements are subject to revision based on user research and technical feasibility assessments.*