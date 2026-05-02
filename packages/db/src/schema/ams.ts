import { relations } from "drizzle-orm";
import {
	boolean,
	decimal,
	index,
	integer,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import { user } from "./auth";

// Academic Profile - one per user
export const academicProfile = pgTable(
	"academic_profile",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		institutionType: text("institution_type", {
			enum: ["school", "college"],
		}).notNull(),
		institutionName: text("institution_name"),
		currentSemester: integer("current_semester").notNull().default(1),
		targetCumulativeCGPA: decimal("target_cumulative_cgpa", {
			precision: 3,
			scale: 2,
		}),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
	},
	(table) => [index("academicProfile_userId_idx").on(table.userId)]
);

// Semester - belongs to user
export const semester = pgTable(
	"semester",
	{
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
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
	},
	(table) => [index("semester_userId_idx").on(table.userId)]
);

// Subject - belongs to semester
export const subject = pgTable(
	"subject",
	{
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
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
	},
	(table) => [index("subject_semesterId_idx").on(table.semesterId)]
);

// Score - belongs to subject
export const score = pgTable(
	"score",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		subjectId: uuid("subject_id")
			.notNull()
			.references(() => subject.id, { onDelete: "cascade" }),
		internalMarks: decimal("internal_marks", { precision: 5, scale: 2 }),
		endsemMarks: decimal("endsem_marks", { precision: 5, scale: 2 }),
		gradePoint: decimal("grade_point", { precision: 3, scale: 2 }),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
	},
	(table) => [index("score_subjectId_idx").on(table.subjectId)]
);

// Relations
export const academicProfileRelations = relations(
	academicProfile,
	({ one }) => ({
		user: one(user, {
			fields: [academicProfile.userId],
			references: [user.id],
		}),
	})
);

export const semesterRelations = relations(semester, ({ one, many }) => ({
	user: one(user, { fields: [semester.userId], references: [user.id] }),
	subjects: many(subject),
}));

export const subjectRelations = relations(subject, ({ one, many }) => ({
	semester: one(semester, {
		fields: [subject.semesterId],
		references: [semester.id],
	}),
	scores: many(score),
}));

export const scoreRelations = relations(score, ({ one }) => ({
	subject: one(subject, {
		fields: [score.subjectId],
		references: [subject.id],
	}),
}));
