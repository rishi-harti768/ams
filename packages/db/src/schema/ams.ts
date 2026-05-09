import { relations } from "drizzle-orm";
import {
	decimal,
	index,
	integer,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
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
		targetCumulativeCGPA: decimal("target_cumulative_cgpa", {
			precision: 4,
			scale: 2,
		}),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
	},
	(table) => [uniqueIndex("academicProfile_userId_idx").on(table.userId)]
);

// Semester - Global (Admin managed)
export const semester = pgTable("semester", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: text("name").notNull(),
	academicYear: text("academic_year"),
	startDate: timestamp("start_date", { withTimezone: true }).notNull(),
	endDate: timestamp("end_date", { withTimezone: true }).notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull(),
});

// Subject - belongs to semester
export const subject = pgTable(
	"subject",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		semesterId: uuid("semester_id")
			.notNull()
			.references(() => semester.id, { onDelete: "cascade" }),
		subjectCode: text("subject_code").notNull(),
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
	(table) => [
		index("subject_semesterId_idx").on(table.semesterId),
		uniqueIndex("subject_subject_code_idx").on(table.subjectCode),
	]
);

// Score - belongs to subject and user
export const score = pgTable(
	"score",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		subjectId: uuid("subject_id")
			.notNull()
			.references(() => subject.id, { onDelete: "cascade" }),
		internalMarks: decimal("internal_marks", { precision: 5, scale: 2 }),
		endsemMarks: decimal("endsem_marks", { precision: 5, scale: 2 }),
		gradePoint: decimal("grade_point", { precision: 4, scale: 2 }),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
	},
	(table) => [
		index("score_userId_idx").on(table.userId),
		index("score_subjectId_idx").on(table.subjectId),
		uniqueIndex("score_user_subject_idx").on(table.userId, table.subjectId),
	]
);

// Semester Target - per user
export const semesterTarget = pgTable(
	"semester_target",
	{
		id: uuid("id").primaryKey().defaultRandom(),
		userId: text("user_id")
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		semesterId: uuid("semester_id")
			.notNull()
			.references(() => semester.id, { onDelete: "cascade" }),
		targetSGPA: decimal("target_sgpa", { precision: 4, scale: 2 }),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
	},
	(table) => [
		index("semesterTarget_userId_idx").on(table.userId),
		index("semesterTarget_semesterId_idx").on(table.semesterId),
	]
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

export const semesterRelations = relations(semester, ({ many }) => ({
	subjects: many(subject),
	targets: many(semesterTarget),
}));

export const subjectRelations = relations(subject, ({ one, many }) => ({
	semester: one(semester, {
		fields: [subject.semesterId],
		references: [semester.id],
	}),
	scores: many(score),
}));

export const scoreRelations = relations(score, ({ one }) => ({
	user: one(user, { fields: [score.userId], references: [user.id] }),
	subject: one(subject, {
		fields: [score.subjectId],
		references: [subject.id],
	}),
}));

export const semesterTargetRelations = relations(semesterTarget, ({ one }) => ({
	user: one(user, { fields: [semesterTarget.userId], references: [user.id] }),
	semester: one(semester, {
		fields: [semesterTarget.semesterId],
		references: [semester.id],
	}),
}));
