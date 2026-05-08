# Product Requirements Document (PRD)
## Academic Management System (AMS)

**Version:** 2.0 — MVP (Revised)
**Date:** May 7, 2026
**Status:** Draft

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Goals & Success Metrics](#3-goals--success-metrics)
4. [Target Users](#4-target-users)
5. [Roles & Permissions](#5-roles--permissions)
6. [Scope](#6-scope)
7. [User Flows](#7-user-flows)
8. [User Stories](#8-user-stories)
9. [Functional Requirements](#9-functional-requirements)
10. [Non-Functional Requirements](#10-non-functional-requirements)
11. [System Architecture Overview](#11-system-architecture-overview)
12. [Data Models](#12-data-models)
13. [SGPA & CGPA Calculation Logic](#13-sgpa--cgpa-calculation-logic)
14. [Target Redistribution Engine](#14-target-redistribution-engine)
15. [UI/UX Requirements](#15-uiux-requirements)
16. [Out of Scope (MVP)](#16-out-of-scope-mvp)
17. [Risks & Mitigations](#17-risks--mitigations)
18. [Timeline & Milestones](#18-timeline--milestones)
19. [Appendix](#19-appendix)

---

## 1. Executive Summary

The **Academic Management System (AMS)** is a free, web-based platform that helps school and college students track their semester-wise academic performance and intelligently plan toward a targeted CGPA. 

The system is built around a two-role model: an **Admin** who pre-configures courses, semesters, subjects, and grading structures; and a **Student** who logs in, sets their current semester and target CGPA, enters internal and end-semester marks, and receives a dynamic, mathematically accurate SGPA target for each remaining semester — automatically recalibrated every time an actual result differs from the plan.

The MVP is a web-only application using a 10-point CGPA scale with SGPA calculated as the simple average of all semester SGPAs.

---

## 2. Problem Statement

Students frequently struggle to:

- Maintain a structured, centralized record of marks across subjects and semesters.
- Understand exactly what SGPA they need in upcoming semesters to hit their overall CGPA goal.
- Dynamically adapt their targets when they perform better or worse than planned.
- Access pre-loaded, institution-accurate subject data instead of manually entering everything.

Existing tools — spreadsheets, generic GPA calculators, paper notes — are either too manual, too generic, or don't model the forward-looking "what do I need to score?" question that students actually care about.

---

## 3. Goals & Success Metrics

### Product Goals

| Goal | Description |
|------|-------------|
| Structured Tracking | Students can record internal + end-sem marks for every subject across all semesters |
| Smart Target Planning | System distributes and recalibrates SGPA targets for remaining semesters dynamically |
| Admin Control | Admin pre-loads all courses, semesters, and subjects — students don't configure structure |
| Goal Visibility | Students always know where they stand vs. their target CGPA |

### Success Metrics (3 months post-launch)

| Metric | Target |
|--------|--------|
| Registered students | 500+ |
| Weekly active users | 40% of registered users |
| Avg. semesters with marks entered per user | ≥ 2 |
| Target CGPA set by users | ≥ 80% of users |
| D7 retention rate | ≥ 30% |
| Avg. session duration | ≥ 3 minutes |

---

## 4. Target Users

### Primary Users
- **School students** (Grades 9–12) with term-based internal and final exam marks
- **College/University students** (UG & PG) on a CGPA-based semester system

### User Personas

**Persona 1 — Riya, 19, B.Tech 2nd Year**
> "I want to hit a 8.5 CGPA by the end of my degree. I've done okay in Sem 1 and 2, but I don't know what I need in the next 6 semesters to actually get there."

- Has 6–8 subjects per semester with pre-assigned subject codes and credits
- Wants to see dynamically updated SGPA targets for future semesters after each result
- Needs clarity when she underperforms — what does she need to compensate?

**Persona 2 — Arjun, 16, Grade 11 Student**
> "I have term exams coming up and I want to know what I need to score to stay on track for my target percentage."

- Has 5–6 subjects per term
- Wants a simple view: what did I score, what do I need to score next

---

## 5. Roles & Permissions

| Role | Description | Key Permissions |
|------|-------------|-----------------|
| **Admin** | Institution administrator who manages academic structure | Create/edit courses, semesters, subjects, subject codes & credits; manage grade-point mapping; view all students |
| **Student** | End user of the platform | Register/login, set profile (current semester, target CGPA), enter marks, view SGPA/CGPA and targets |

### Admin Responsibilities (Pre-launch Setup)
- Define course types (e.g., B.Tech = 8 semesters, BCA = 6 semesters)
- For each semester of each course, pre-load:
  - Subject name
  - Subject code
  - Credit hours
  - Maximum internal marks (default: 50)
  - Maximum end-semester marks (default: 50)
- Configure the grade-point mapping table (Appendix A)

> **Note:** Students cannot modify any course structure, semester definition, or subject data. They can only enter their own marks.

---

## 6. Scope

### In Scope (MVP)

- Admin panel: course, semester, and subject management
- Student authentication (email & password)
- Student profile setup: select course, set current semester, set target CGPA
- Semester list view with current semester highlighted
- Collapsible semester toggles showing pre-loaded subjects with codes & credits
- Per-subject mark entry: internal marks + end-semester marks (each out of 50)
- Auto-calculated SGPA per semester upon mark submission
- CGPA calculation as simple average of all completed semester SGPAs
- Dynamic SGPA target generation for all remaining semesters
- Gradual target redistribution when actual SGPA is above or below target
- Dashboard: CGPA trend, current vs. target summary, per-semester SGPA

### Out of Scope (MVP)
- AI-generated guidance or motivation
- Mobile app (iOS/Android)
- Google/Social login
- Push/email notifications
- Peer comparison or leaderboards
- PDF/report export
- Multiple grading systems
- LMS/ERP integrations

---

## 7. User Flows

### 7.1 Student Onboarding Flow

```
Register (Email + Password)
        ↓
Email Verification
        ↓
Profile Setup:
  → Select Course (e.g., B.Tech — admin-defined)
  → Current Semester (e.g., 4)
  → Target CGPA (e.g., 8.5)
        ↓
Dashboard
```

### 7.2 Mark Entry Flow

```
Dashboard
    ↓
Semester List (all 8 semesters visible, Sem 4 highlighted)
    ↓
Click on Semester Toggle (e.g., Sem 2)
    ↓
Subject List loads (pre-loaded by admin: name, code, credits)
    ↓
Click on a Subject
    ↓
Enter Internal Marks + End-Sem Marks (each out of 50)
    ↓
Save Subject
    ↓
Repeat for all subjects in semester
    ↓
Submit Semester → SGPA calculated & displayed on semester toggle
    ↓
Remaining semester targets recalibrated automatically
```

### 7.3 Target Recalibration Flow

```
Student submits Sem 4 marks
        ↓
System calculates Sem 4 actual SGPA
        ↓
Compare: Actual SGPA vs. Target SGPA for Sem 4
        ↓
     [Behind?]              [Ahead?]
Remaining targets        Remaining targets
gradually increase       gradually decrease
        ↓                       ↓
     Updated SGPA targets shown for Sem 5, 6, 7, 8
```

---

## 8. User Stories

### Authentication

| ID | User Story | Priority |
|----|------------|----------|
| US-01 | As a student, I want to register with email and password to create my account. | Must Have |
| US-02 | As a student, I want to log in with my email and password to access my dashboard. | Must Have |
| US-03 | As a student, I want to reset my password via email if I forget it. | Must Have |

### Profile Setup

| ID | User Story | Priority |
|----|------------|----------|
| US-04 | As a student, I want to select my course (e.g., B.Tech) from an admin-defined list so the correct semester and subject structure is loaded for me. | Must Have |
| US-05 | As a student, I want to enter my current semester number so the app highlights it correctly. | Must Have |
| US-06 | As a student, I want to enter my target CGPA so the system can calculate required SGPA targets for each remaining semester. | Must Have |
| US-07 | As a student, I want to edit my profile (current semester, target CGPA) at any time. | Should Have |

### Semester List View

| ID | User Story | Priority |
|----|------------|----------|
| US-08 | As a student, I want to see all semesters for my course listed on the dashboard, with my current semester highlighted. | Must Have |
| US-09 | As a student, I want to see the calculated SGPA displayed next to each completed semester in the list. | Must Have |
| US-10 | As a student, I want to see the target SGPA displayed next to each upcoming semester in the list. | Must Have |

### Subject & Mark Entry

| ID | User Story | Priority |
|----|------------|----------|
| US-11 | As a student, I want to click on any semester toggle to expand and see all pre-loaded subjects with their code and credits. | Must Have |
| US-12 | As a student, I want to click on a subject and enter my internal marks and end-semester marks. | Must Have |
| US-13 | As a student, I want the system to validate that my entered marks don't exceed the maximum (50 for each component). | Must Have |
| US-14 | As a student, I want to submit all subject marks for a semester and have the SGPA auto-calculated. | Must Have |
| US-15 | As a student, I want to update previously entered marks at any time. | Must Have |

### SGPA / CGPA & Target Engine

| ID | User Story | Priority |
|----|------------|----------|
| US-16 | As a student, I want to see my SGPA for each completed semester. | Must Have |
| US-17 | As a student, I want to see my current cumulative CGPA (average of completed SGPAs). | Must Have |
| US-18 | As a student, I want to see a dynamically calculated SGPA target for each remaining semester so I know exactly what to aim for. | Must Have |
| US-19 | As a student, when my actual SGPA is less than my target, I want to see the remaining semester targets gradually increase so I know the effort needed to compensate. | Must Have |
| US-20 | As a student, when my actual SGPA is more than my target, I want to see the remaining semester targets gradually decrease, reflecting that I have more room. | Must Have |
| US-21 | As a student, if a target SGPA for a remaining semester exceeds 10.0 (mathematically impossible), I want to be clearly warned that my overall CGPA target is no longer achievable. | Must Have |

### Admin Panel

| ID | User Story | Priority |
|----|------------|----------|
| US-22 | As an admin, I want to create a course and define the total number of semesters. | Must Have |
| US-23 | As an admin, I want to add subjects to each semester with name, subject code, and credit hours. | Must Have |
| US-24 | As an admin, I want to edit or remove a subject from any semester. | Must Have |
| US-25 | As an admin, I want to configure the grade-point mapping table used for SGPA calculation. | Should Have |
| US-26 | As an admin, I want to view a list of all registered students. | Should Have |

---

## 9. Functional Requirements

### 9.1 Authentication

- **FR-01:** Students register with email and password (min 8 chars, 1 uppercase, 1 number).
- **FR-02:** A verification email is sent on registration; login is blocked until verified.
- **FR-03:** Password reset is supported via a time-limited email link (expires in 1 hour).
- **FR-04:** Sessions are maintained via JWT stored in httpOnly cookies (7-day expiry with refresh).
- **FR-05:** Admin login is a separate, protected route not accessible to students.

### 9.2 Student Profile

- **FR-06:** On first login, students complete a 3-field profile: Course selection (from admin-defined list), Current Semester (integer, 1 to total semesters), and Target CGPA (0.00–10.00).
- **FR-07:** Profile data persists and is editable from settings at any time.
- **FR-08:** Changing the current semester re-triggers the target redistribution engine.

### 9.3 Semester List

- **FR-09:** All semesters for the student's course are displayed as a vertical list (e.g., Sem 1 through Sem 8 for B.Tech).
- **FR-10:** The current semester is visually highlighted (e.g., distinct border or badge).
- **FR-11:** Completed semesters (marks submitted) display their calculated SGPA next to the toggle.
- **FR-12:** Remaining semesters (no marks submitted) display the system-calculated target SGPA next to the toggle.

### 9.4 Semester Toggle & Subject View

- **FR-13:** Clicking a semester toggle expands it inline to show all pre-loaded subjects for that semester.
- **FR-14:** Each subject row displays: Subject Name, Subject Code, Credit Hours, Internal Marks field, End-Sem Marks field, and Status (Pending / Entered / Submitted).
- **FR-15:** Only one semester toggle can be expanded at a time (accordion behavior).

### 9.5 Mark Entry

- **FR-16:** Internal marks input field accepts values from 0 to the configured maximum (default: 50).
- **FR-17:** End-semester marks input field accepts values from 0 to the configured maximum (default: 50).
- **FR-18:** The system validates inputs on submission and displays inline errors for out-of-range values.
- **FR-19:** Partial entry is allowed — a student can save internal marks before end-sem results are available.
- **FR-20:** A "Submit Semester" action is available once all subjects in a semester have both internal and end-sem marks entered.
- **FR-21:** After submission, individual subject marks remain editable; re-submission recalculates SGPA and re-triggers target redistribution.

### 9.6 SGPA Calculation

- **FR-22:** Total marks per subject = Internal Marks + End-Sem Marks (out of 100 combined).
- **FR-23:** Percentage per subject = (Total Marks / 100) × 100.
- **FR-24:** Grade point per subject is derived from the admin-configured grade-point mapping table (see Appendix A for default).
- **FR-25:** SGPA per semester is calculated as:

  ```
  SGPA = Σ (Grade Point of Subject × Credit Hours of Subject)
         ÷ Σ (Credit Hours of all Subjects in Semester)
  ```

- **FR-26:** SGPA is displayed to two decimal places.
- **FR-27:** Subjects with incomplete marks (only internal entered, no end-sem) are excluded from SGPA calculation and marked "Pending."

### 9.7 CGPA Calculation

- **FR-28:** CGPA is calculated as the simple average of all completed semester SGPAs:

  ```
  CGPA = Σ (SGPA of each completed semester) ÷ Total number of completed semesters
  ```

- **FR-29:** CGPA updates automatically whenever a semester is submitted or re-submitted.
- **FR-30:** CGPA is displayed to two decimal places on the dashboard.

### 9.8 Target SGPA Generation & Redistribution Engine

- **FR-31:** On profile setup (or update), the system calculates an initial equal target SGPA for all semesters:

  ```
  Initial Target SGPA per semester = Target CGPA
  (since CGPA = simple average of all SGPAs, each semester needs to equal the target CGPA initially)
  ```

- **FR-32:** After a semester is submitted, the system recalculates the required SGPA for each remaining semester using:

  ```
  Required Total SGPA Points = Target CGPA × Total Semesters
  Remaining SGPA Points Needed = Required Total SGPA Points − Σ (Actual SGPAs of completed semesters)
  Remaining Semesters = Total Semesters − Completed Semesters
  ```

- **FR-33:** The remaining SGPA points are distributed **gradually** across remaining semesters:
  - If the student is **behind** (actual SGPA < semester target): targets increase progressively — nearer semesters get a slightly lower increase, farther semesters absorb more of the deficit. This models realistic gradual improvement.
  - If the student is **ahead** (actual SGPA > semester target): targets decrease progressively — nearer semesters decrease slightly, farther semesters get more relief.
  - The gradient is computed using a linear weight distribution across remaining semesters (see Appendix B for formula).

- **FR-34:** If any recalculated target SGPA for a remaining semester exceeds 10.0, the system:
  - Caps the display at 10.0 for that semester.
  - Shows a prominent warning: *"Your target CGPA of X.X is no longer mathematically achievable. The maximum possible CGPA is Y.Y."*
  - Calculates and displays the new maximum achievable CGPA assuming 10.0 in all remaining semesters.

- **FR-35:** Target SGPAs for remaining semesters are always displayed even if the student hasn't entered any marks yet (initialized from profile setup).

### 9.9 Admin Panel

- **FR-36:** Admin can create a Course with: name, short code, and total number of semesters.
- **FR-37:** For each semester of a course, admin can add subjects with: subject name, subject code, credit hours, max internal marks, and max end-sem marks.
- **FR-38:** Admin can edit or delete any subject (deletion is blocked if any student has already submitted marks for that subject — admin is shown a warning).
- **FR-39:** Admin can configure the grade-point mapping table (percentage range → grade point).
- **FR-40:** Admin can view a paginated list of all registered students with their course, current semester, target CGPA, and current CGPA.

---

## 10. Non-Functional Requirements

### 10.1 Performance

- **NFR-01:** All pages shall load within 2 seconds on standard broadband.
- **NFR-02:** SGPA and target recalculation shall complete within 500ms after submission.

### 10.2 Reliability

- **NFR-03:** System uptime target: 99.5% monthly.
- **NFR-04:** All student data is persisted server-side; no critical data is stored only in the browser.
- **NFR-05:** Daily automated database backups with 7-day retention.

### 10.3 Security

- **NFR-06:** All communication over HTTPS/TLS.
- **NFR-07:** Passwords hashed with bcrypt (minimum cost factor 12).
- **NFR-08:** JWT tokens stored in httpOnly cookies only (never localStorage).
- **NFR-09:** Auth endpoints rate-limited: max 10 attempts per 15 minutes per IP.
- **NFR-10:** Admin routes protected by role-based middleware; students cannot access admin endpoints.

### 10.4 Usability

- **NFR-11:** Responsive for desktop and tablet (minimum 768px width).
- **NFR-12:** Mark entry for an entire semester completable in under 5 minutes.
- **NFR-13:** All error messages are human-readable and actionable.
- **NFR-14:** Empty states include contextual guidance (e.g., "No marks entered yet — click to add marks for Semester 1").

### 10.5 Scalability

- **NFR-15:** Architecture supports horizontal scaling for the API layer.
- **NFR-16:** Database designed to support up to 10 courses, 10 semesters each, 12 subjects per semester, and 10,000 student records without degradation.

### 10.6 Accessibility

- **NFR-17:** WCAG 2.1 Level AA compliance for color contrast and keyboard navigability.

---

## 11. System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Web Browser                           │
│               React / Next.js (Student + Admin UI)           │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTPS / REST API
┌──────────────────────────▼──────────────────────────────────┐
│                      API Server                              │
│               Node.js (Express) / FastAPI                    │
│                                                              │
│  ┌─────────────────┐   ┌──────────────────────────────────┐ │
│  │  Auth Module    │   │  Academic Engine                 │ │
│  │  - Register     │   │  - SGPA Calculator               │ │
│  │  - Login        │   │  - CGPA Calculator               │ │
│  │  - JWT / Role   │   │  - Target Redistribution Engine  │ │
│  └─────────────────┘   └──────────────────────────────────┘ │
│                                                              │
│  ┌─────────────────┐   ┌──────────────────────────────────┐ │
│  │  Admin Module   │   │  Student Module                  │ │
│  │  - Courses      │   │  - Profile                       │ │
│  │  - Subjects     │   │  - Marks Entry                   │ │
│  │  - Grade Config │   │  - Dashboard Data                │ │
│  └─────────────────┘   └──────────────────────────────────┘ │
└──────────────────────────┬──────────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                    PostgreSQL Database                        │
│  users | profiles | courses | semesters | subjects           │
│  scores | grade_mappings | semester_targets                  │
└─────────────────────────────────────────────────────────────┘
```

**Recommended Stack:**
| Layer | Technology |
|-------|-----------|
| Frontend | React (Next.js), Tailwind CSS, Recharts |
| Backend | Node.js (Express) or Python (FastAPI) |
| Database | PostgreSQL |
| Auth | JWT with httpOnly cookies |
| Hosting | Vercel (frontend) + Railway / Render (backend + DB) |

---

## 12. Data Models

### users

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary Key |
| email | VARCHAR(255) | Unique, required |
| password_hash | VARCHAR | bcrypt hash |
| role | ENUM | `'student'`, `'admin'` |
| is_verified | BOOLEAN | Email verified flag |
| created_at | TIMESTAMP | |

### profiles

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary Key |
| user_id | UUID | FK → users |
| course_id | UUID | FK → courses |
| current_semester | INT | 1-indexed |
| target_cgpa | DECIMAL(3,2) | 0.00–10.00 |

### courses

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary Key |
| name | VARCHAR | e.g., "B.Tech Computer Science" |
| short_code | VARCHAR | e.g., "BTECH-CS" |
| total_semesters | INT | e.g., 8 |
| created_by | UUID | FK → users (admin) |

### course_semesters

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary Key |
| course_id | UUID | FK → courses |
| semester_number | INT | 1 to total_semesters |

### subjects

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary Key |
| course_semester_id | UUID | FK → course_semesters |
| name | VARCHAR | Subject name |
| subject_code | VARCHAR | e.g., "CS301" |
| credit_hours | INT | |
| max_internal_marks | INT | Default: 50 |
| max_endsem_marks | INT | Default: 50 |

### scores

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary Key |
| user_id | UUID | FK → users |
| subject_id | UUID | FK → subjects |
| internal_marks | DECIMAL | Nullable |
| endsem_marks | DECIMAL | Nullable |
| grade_point | DECIMAL(3,2) | Auto-calculated on submit |
| is_submitted | BOOLEAN | Locks semester for SGPA calc |
| updated_at | TIMESTAMP | |

### semester_results

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary Key |
| user_id | UUID | FK → users |
| course_semester_id | UUID | FK → course_semesters |
| sgpa | DECIMAL(4,2) | Calculated on submit |
| is_completed | BOOLEAN | True when semester submitted |
| submitted_at | TIMESTAMP | |

### semester_targets

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary Key |
| user_id | UUID | FK → users |
| course_semester_id | UUID | FK → course_semesters |
| target_sgpa | DECIMAL(4,2) | Recalculated by engine |
| is_achievable | BOOLEAN | False if target > 10.0 |
| updated_at | TIMESTAMP | |

### grade_mappings

| Column | Type | Notes |
|--------|------|-------|
| id | UUID | Primary Key |
| course_id | UUID | FK → courses (or global) |
| min_percentage | INT | Lower bound of range |
| max_percentage | INT | Upper bound of range |
| grade_label | VARCHAR | e.g., "O", "A+" |
| grade_point | DECIMAL(3,1) | e.g., 10.0 |

---

## 13. SGPA & CGPA Calculation Logic

### Step 1 — Total Marks per Subject
```
Total Marks = Internal Marks + End-Sem Marks
Max Total Marks = Max Internal + Max End-Sem = 50 + 50 = 100
Percentage = (Total Marks / Max Total Marks) × 100
```

### Step 2 — Grade Point Lookup
```
Grade Point = grade_mappings lookup by Percentage range
(See Appendix A for default mapping)
```

### Step 3 — SGPA
```
SGPA = Σ (Grade Point_i × Credit Hours_i)  for all subjects i in semester
       ÷ Σ (Credit Hours_i)
```

### Step 4 — CGPA
```
CGPA = Σ (SGPA_s)  for all completed semesters s
       ÷ Number of completed semesters
```

---

## 14. Target Redistribution Engine

This is the core intelligence of AMS. It runs automatically every time a semester is submitted or the student updates their target CGPA.

### Variables

```
T   = Target CGPA (user-defined)
N   = Total semesters in course
C   = Number of completed semesters
R   = Remaining semesters = N - C
S_i = Actual SGPA of completed semester i
```

### Step 1 — Remaining SGPA Points Needed

```
Total SGPA Points Required   = T × N
Earned SGPA Points           = Σ S_i  (i = 1 to C)
Remaining SGPA Points Needed = (T × N) − Earned SGPA Points
Average Required per Remaining Semester = Remaining SGPA Points Needed ÷ R
```

### Step 2 — Gradual Distribution (Linear Gradient)

Rather than distributing equally, targets are weighted linearly so nearer semesters carry slightly less burden and farther semesters carry slightly more (when behind), or nearer semesters get slightly less relief and farther semesters get more (when ahead).

**Weight for remaining semester j (j = 1 being the nearest remaining):**
```
Weight_j = (2j) ÷ (R × (R + 1))
```

> This produces weights that sum to 1.0 and increase linearly from the nearest to the farthest remaining semester.

**Target SGPA for remaining semester j:**
```
Target_SGPA_j = (Remaining SGPA Points Needed) × Weight_j  ×  R  +  Average Required
```

Simplified implementation:
```
Base  = Remaining SGPA Points Needed ÷ R
Delta = (Actual_SGPA_last_sem − Target_SGPA_last_sem)   ← deviation of last completed sem

Target_j = Base + (j × Delta_adjustment)
```
where `Delta_adjustment` is tuned so the sum of all Target_j = Remaining SGPA Points Needed exactly.

### Step 3 — Achievability Check

```
For each remaining semester j:
  IF Target_SGPA_j > 10.0:
    Mark semester as is_achievable = FALSE
    Cap display at 10.0
    Calculate max_possible_cgpa = (Earned SGPA Points + 10.0 × R) ÷ N
    Display warning to student
```

### Example Walkthrough

> Student: B.Tech (8 sems), Target CGPA = 8.5
> Results: Sem 1 = 8.0, Sem 2 = 7.5, Sem 3 = 8.0 (avg so far = 7.83)
> After Sem 3 submission:

```
Total Points Required     = 8.5 × 8 = 68.0
Earned Points             = 8.0 + 7.5 + 8.0 = 23.5
Remaining Points Needed   = 68.0 − 23.5 = 44.5
Remaining Semesters       = 5
Average Needed per Sem    = 44.5 ÷ 5 = 8.9

Graduated targets (student is behind):
  Sem 4 target = 8.7
  Sem 5 target = 8.8
  Sem 6 target = 8.9
  Sem 7 target = 9.0
  Sem 8 target = 9.1
  Total = 44.5 ✓
```

---

## 15. UI/UX Requirements

### Key Screens

| Screen | Description |
|--------|-------------|
| **Register / Login** | Clean auth forms; email + password; forgot password link |
| **Profile Setup** | 3-field wizard: Course → Current Semester → Target CGPA; progress indicator |
| **Dashboard** | Summary cards (Current CGPA, Target CGPA, Gap, Active Semester); CGPA trend line chart |
| **Semester List** | Vertical accordion list of all semesters; current highlighted; SGPA or target shown per sem |
| **Semester Detail (expanded toggle)** | Subject table: code, name, credits, internal marks field, end-sem marks field, grade point (auto), status badge |
| **Marks Entry Modal / Inline** | Input fields with validation; Save and Submit Semester button |
| **Target Warning Banner** | Prominent alert when target CGPA is no longer achievable; shows max possible CGPA |
| **Admin — Course Manager** | Create/edit courses and semesters |
| **Admin — Subject Manager** | Add/edit/delete subjects per semester |
| **Admin — Student List** | Paginated table of students with key stats |

### UX Principles

- **Accordion-first navigation:** The semester list is the core interaction surface. No deep page navigation needed for mark entry.
- **Inline validation:** Marks fields validate on blur; errors shown immediately without a full page refresh.
- **Clear status indicators:** Every subject and semester has a clear status — `Pending`, `Partial` (internal entered only), `Complete`, `Submitted`.
- **Target vs. Actual colour coding:**
  - 🟢 Green: Actual SGPA ≥ Target SGPA
  - 🟡 Amber: Actual SGPA within 0.5 of Target
  - 🔴 Red: Actual SGPA more than 0.5 below Target
- **Progressive disclosure:** First-time users are guided through profile setup with a simple 3-step wizard; the complexity of the target engine is surfaced gradually.
- **Empty state guidance:** Unopened semesters show: *"Click to view subjects and add marks."*

---

## 16. Out of Scope (MVP)

| Feature | Reason Deferred |
|---------|----------------|
| AI-generated subject guidance & motivation | Validate core tracking first |
| Mobile app (iOS/Android) | Web-first to reduce build time |
| Google / Social login | Email auth sufficient for MVP |
| Push/email reminders | Post-MVP engagement feature |
| Peer comparison / leaderboards | Privacy and trust concerns |
| PDF/report export | Nice-to-have; post-MVP |
| Multiple grading systems | CGPA 10-point only for MVP |
| LMS/ERP integrations | High complexity; post-MVP |
| Student ability to add/edit subjects | Admin-controlled for data integrity |

---

## 17. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Admin doesn't pre-load subjects before student signup | High | High | Block student dashboard until course has subjects loaded; show admin setup checklist |
| Grade-point mapping varies by institution | High | High | Admin configures mapping per course; default UGC mapping pre-loaded |
| Target redistribution produces SGPA > 10.0 | Medium | High | FR-34 handles this with achievability check and clear warning UI |
| Students enter wrong marks then re-submit, causing confusing SGPA changes | Medium | Medium | Show SGPA change delta on re-submission: "SGPA updated from 7.8 → 8.1" |
| Low engagement after first semester entry | Medium | High | Design for recurring touchpoints at semester start, mid-term, and results time |
| Admin panel misuse leads to wrong subject data for enrolled students | Low | High | Warn admin before editing subjects that have student scores; require confirmation |

---

## 18. Timeline & Milestones

| Phase | Milestone | Duration |
|-------|-----------|----------|
| **Phase 1** | Requirements finalized, DB schema designed, tech stack confirmed | Week 1 |
| **Phase 2** | Auth module (student + admin roles) complete | Week 2 |
| **Phase 3** | Admin panel: course, semester & subject management complete | Week 3 |
| **Phase 4** | Student profile setup + semester list view complete | Week 4 |
| **Phase 5** | Mark entry + SGPA calculation engine complete | Week 5 |
| **Phase 6** | CGPA calculation + target redistribution engine complete | Week 6 |
| **Phase 7** | Dashboard (charts, summary cards, target warnings) complete | Week 7 |
| **Phase 8** | QA, edge case testing (target > 10.0, re-submission, partial marks), UX polish | Week 8 |
| **Phase 9** | Beta launch with 50 students; admin pre-loads 1 course | Week 9 |
| **Phase 10** | Feedback incorporation, public MVP launch | Week 11 |

---

## 19. Appendix

### Appendix A — Default Grade-Point Mapping (UGC 10-Point Scale)

| Marks Range (%) | Grade Label | Grade Point |
|-----------------|-------------|-------------|
| 90 – 100 | O (Outstanding) | 10 |
| 80 – 89 | A+ (Excellent) | 9 |
| 70 – 79 | A (Very Good) | 8 |
| 60 – 69 | B+ (Good) | 7 |
| 55 – 59 | B (Above Average) | 6 |
| 50 – 54 | C (Average) | 5 |
| 45 – 49 | P (Pass) | 4 |
| < 45 | F (Fail) | 0 |

> Admin can override this table per course from the Admin Panel.

---

### Appendix B — Gradual Target Distribution Formula

Given `R` remaining semesters and `P` total remaining SGPA points to distribute:

**Linear weight for semester j (j = 1 = nearest, j = R = farthest):**

```
Weight_j = (2 × j) ÷ (R × (R + 1))

Σ Weight_j = 1  for j = 1 to R  ✓

Target_SGPA_j = P × Weight_j
```

**Example (R = 5, P = 44.5, student is behind):**

```
Weights: 2/30, 4/30, 6/30, 8/30, 10/30
         = 0.067, 0.133, 0.200, 0.267, 0.333

Targets: 44.5 × 0.067 = 2.98  → Sem 4: but this needs to be ≥ base
```

> In implementation, the engine blends this gradient with the flat average to produce targets that are readable and not too extreme. A blending factor α (default 0.5) can be tuned:
> ```
> Target_j = α × (P × Weight_j) + (1 − α) × (P ÷ R)
> ```
> This ensures smooth, motivating targets rather than jarring jumps.

---

### Appendix C — Achievability Warning Logic

```
If any Target_SGPA_j > 10.0:
  max_possible_cgpa = (Earned SGPA Points + 10.0 × R) ÷ N
  Display: "⚠️ Your target CGPA of {T} is no longer achievable.
            The maximum CGPA you can now achieve is {max_possible_cgpa}.
            Consider updating your target."
```

---

*Document prepared for AMS MVP v2.0. All requirements subject to revision based on user research and technical feasibility.*
