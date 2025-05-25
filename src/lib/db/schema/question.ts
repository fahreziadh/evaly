import { relations, sql } from 'drizzle-orm'
import {
  boolean,
  index,
  jsonb,
  pgTable,
  smallint,
  text,
  timestamp,
  varchar
} from 'drizzle-orm/pg-core'
import { ulid } from 'ulidx'

import { MediaType } from '../../../types/media'
import { QUESTION_TYPES } from '../../../types/question-types'
import { questionTemplate } from './question.template'
import { testSection } from './test.section'

// Main question table
export const question = pgTable(
  'question',
  {
    id: varchar('id', { length: 255 })
      .primaryKey()
      .$defaultFn(() => 'qst-' + ulid()),
    question: text('question'),
    referenceId: varchar('reference_id', { length: 255 }).notNull(),
    organizationId: varchar('organization_id', { length: 255 }), // Owner of the question
    order: smallint('order').default(1).notNull(),
    type: varchar('type', {
      length: 20,
      enum: QUESTION_TYPES
    }).default('multiple-choice'),
    pointValue: smallint('point_value'),
    options: jsonb('options')
      .$type<
        {
          id: string
          text: string
          isCorrect: boolean
          mediaUrl?: string
          mediaType?: MediaType
          pointValue?: number
        }[]
      >()
      .default([]),
    allowMultipleAnswers: boolean('allow_multiple_answers').default(false).notNull(),
    createdAt: timestamp('created_at', {
      mode: 'string',
      withTimezone: true
    })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp('updated_at', {
      mode: 'string',
      withTimezone: true
    })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => new Date().toISOString()),
    deletedAt: timestamp('deleted_at', {
      mode: 'string',
      withTimezone: true
    })
  },
  table => ({
    referenceIdIndex: index('reference_idx').on(table.referenceId)
  })
).enableRLS()

// Text field configuration (for text-field type questions)
// export const textFieldConfig = pgTable(
//   "text_field_config",
//   {
//     id: varchar("id", { length: 255 })
//       .primaryKey()
//       .$defaultFn(() => "txt-" + ulid()),
//     questionId: varchar("question_id", { length: 255 })
//       .notNull()
//       .references(() => question.id, { onDelete: "cascade" }),
//     modelAnswer: text("model_answer"),
//     minLength: integer("min_length"),
//     maxLength: integer("max_length"),
//     placeholder: text("placeholder"),
//     createdAt: timestamp("created_at", {
//       mode: "string",
//       withTimezone: true,
//     })
//       .notNull()
//       .default(sql`CURRENT_TIMESTAMP`),
//     updatedAt: timestamp("updated_at", {
//       mode: "string",
//       withTimezone: true,
//     })
//       .notNull()
//       .default(sql`CURRENT_TIMESTAMP`)
//       .$onUpdate(() => new Date().toISOString()),
//   },
//   (table) => ({
//     questionIdIndex: index("textfield_question_idx").on(table.questionId),
//     uniqueQuestion: unique().on(table.questionId), // One config per question
//   })
// ).enableRLS()

// Fill-the-blank segments (for fill-the-blank questions)
// export const fillBlankSegment = pgTable(
//   "fill_blank_segment",
//   {
//     id: varchar("id", { length: 255 })
//       .primaryKey()
//       .$defaultFn(() => "blk-" + ulid()),
//     questionId: varchar("question_id", { length: 255 })
//       .notNull()
//       .references(() => question.id, { onDelete: "cascade" }),
//     segmentOrder: integer("segment_order").notNull(),
//     segmentText: text("segment_text"),
//     isBlank: boolean("is_blank").notNull(),
//     expectedAnswer: text("expected_answer"),
//     createdAt: timestamp("created_at", {
//       mode: "string",
//       withTimezone: true,
//     })
//       .notNull()
//       .default(sql`CURRENT_TIMESTAMP`),
//     updatedAt: timestamp("updated_at", {
//       mode: "string",
//       withTimezone: true,
//     })
//       .notNull()
//       .default(sql`CURRENT_TIMESTAMP`)
//       .$onUpdate(() => new Date().toISOString()),
//   },
//   (table) => ({
//     questionIdIndex: index("blank_question_idx").on(table.questionId),
//     orderIndex: index("blank_order_idx").on(
//       table.questionId,
//       table.segmentOrder
//     ),
//   })
// ).enableRLS()

// Media response configuration (for audio/video/file upload questions)
// export const mediaConfig = pgTable(
//   "media_config",
//   {
//     id: varchar("id", { length: 255 })
//       .primaryKey()
//       .$defaultFn(() => "med-" + ulid()),
//     questionId: varchar("question_id", { length: 255 })
//       .notNull()
//       .references(() => question.id, { onDelete: "cascade" }),
//     mediaType: varchar("media_type", {
//       length: 10,
//       enum: MEDIA_TYPES,
//     }).notNull(),
//     maxFileSizeMb: integer("max_file_size_mb"),
//     sampleResponseUrl: text("sample_response_url"),
//     instructions: text("instructions"),
//     createdAt: timestamp("created_at", {
//       mode: "string",
//       withTimezone: true,
//     })
//       .notNull()
//       .default(sql`CURRENT_TIMESTAMP`),
//     updatedAt: timestamp("updated_at", {
//       mode: "string",
//       withTimezone: true,
//     })
//       .notNull()
//       .default(sql`CURRENT_TIMESTAMP`)
//       .$onUpdate(() => new Date().toISOString()),
//   },
//   (table) => ({
//     questionIdIndex: index("media_question_idx").on(table.questionId),
//     uniqueQuestion: unique().on(table.questionId), // One media config per question
//   })
// ).enableRLS()

// Slider configuration (for slider-scale questions)
// export const sliderConfig = pgTable(
//   "slider_config",
//   {
//     id: varchar("id", { length: 255 })
//       .primaryKey()
//       .$defaultFn(() => "sld-" + ulid()),
//     questionId: varchar("question_id", { length: 255 })
//       .notNull()
//       .references(() => question.id, { onDelete: "cascade" }),
//     minValue: integer("min_value").notNull(),
//     maxValue: integer("max_value").notNull(),
//     step: integer("step").default(1),
//     defaultValue: integer("default_value"),
//     minLabel: text("min_label"),
//     maxLabel: text("max_label"),
//     createdAt: timestamp("created_at", {
//       mode: "string",
//       withTimezone: true,
//     })
//       .notNull()
//       .default(sql`CURRENT_TIMESTAMP`),
//     updatedAt: timestamp("updated_at", {
//       mode: "string",
//       withTimezone: true,
//     })
//       .notNull()
//       .default(sql`CURRENT_TIMESTAMP`)
//       .$onUpdate(() => new Date().toISOString()),
//   },
//   (table) => ({
//     questionIdIndex: index("slider_question_idx").on(table.questionId),
//     uniqueQuestion: unique().on(table.questionId), // One slider config per question
//   })
// ).enableRLS()

// Matching pairs (for matching-pairs questions)
// export const matchingPair = pgTable(
//   "matching_pair",
//   {
//     id: varchar("id", { length: 255 })
//       .primaryKey()
//       .$defaultFn(() => "mpr-" + ulid()),
//     questionId: varchar("question_id", { length: 255 })
//       .notNull()
//       .references(() => question.id, { onDelete: "cascade" }),
//     leftItem: text("left_item").notNull(),
//     rightItem: text("right_item").notNull(),
//     order: smallint("order"),
//     createdAt: timestamp("created_at", {
//       mode: "string",
//       withTimezone: true,
//     })
//       .notNull()
//       .default(sql`CURRENT_TIMESTAMP`),
//     updatedAt: timestamp("updated_at", {
//       mode: "string",
//       withTimezone: true,
//     })
//       .notNull()
//       .default(sql`CURRENT_TIMESTAMP`)
//       .$onUpdate(() => new Date().toISOString()),
//   },
//   (table) => ({
//     questionIdIndex: index("matching_question_idx").on(table.questionId),
//   })
// ).enableRLS()

// Matrix configuration (for matrix questions)
// export const matrixConfig = pgTable(
//   "matrix_config",
//   {
//     id: varchar("id", { length: 255 })
//       .primaryKey()
//       .$defaultFn(() => "mtx-" + ulid()),
//     questionId: varchar("question_id", { length: 255 })
//       .notNull()
//       .references(() => question.id, { onDelete: "cascade" }),
//     rows: text("rows").array().notNull(),
//     columns: text("columns").array().notNull(),
//     matrixType: varchar("matrix_type", { length: 20 }).notNull(), // e.g., "likert", "rating", "checkboxes"
//     createdAt: timestamp("created_at", {
//       mode: "string",
//       withTimezone: true,
//     })
//       .notNull()
//       .default(sql`CURRENT_TIMESTAMP`),
//     updatedAt: timestamp("updated_at", {
//       mode: "string",
//       withTimezone: true,
//     })
//       .notNull()
//       .default(sql`CURRENT_TIMESTAMP`)
//       .$onUpdate(() => new Date().toISOString()),
//   },
//   (table) => ({
//     questionIdIndex: index("matrix_question_idx").on(table.questionId),
//     uniqueQuestion: unique().on(table.questionId), // One matrix config per question
//   })
// ).enableRLS()

// Hotspot configuration (for hotspot questions)
// export const hotspotConfig = pgTable(
//   "hotspot_config",
//   {
//     id: varchar("id", { length: 255 })
//       .primaryKey()
//       .$defaultFn(() => "hsp-" + ulid()),
//     questionId: varchar("question_id", { length: 255 })
//       .notNull()
//       .references(() => question.id, { onDelete: "cascade" }),
//     imageUrl: text("image_url").notNull(),
//     hotspots: jsonb("hotspots").notNull(), // Array of {x, y, width, height, isCorrect, label}
//     createdAt: timestamp("created_at", {
//       mode: "string",
//       withTimezone: true,
//     })
//       .notNull()
//       .default(sql`CURRENT_TIMESTAMP`),
//     updatedAt: timestamp("updated_at", {
//       mode: "string",
//       withTimezone: true,
//     })
//       .notNull()
//       .default(sql`CURRENT_TIMESTAMP`)
//       .$onUpdate(() => new Date().toISOString()),
//   },
//   (table) => ({
//     questionIdIndex: index("hotspot_question_idx").on(table.questionId),
//     uniqueQuestion: unique().on(table.questionId), // One hotspot config per question
//   })
// ).enableRLS()

// Code editor configuration (for code-editor questions)
// export const codeEditorConfig = pgTable(
//   "code_editor_config",
//   {
//     id: varchar("id", { length: 255 })
//       .primaryKey()
//       .$defaultFn(() => "code-" + ulid()),
//     questionId: varchar("question_id", { length: 255 })
//       .notNull()
//       .references(() => question.id, { onDelete: "cascade" }),
//     language: varchar("language", { length: 50 }).notNull(), // e.g., "javascript", "python"
//     initialCode: text("initial_code"),
//     solutionCode: text("solution_code"),
//     testCases: jsonb("test_cases"), // Array of test cases to validate code
//     createdAt: timestamp("created_at", {
//       mode: "string",
//       withTimezone: true,
//     })
//       .notNull()
//       .default(sql`CURRENT_TIMESTAMP`),
//     updatedAt: timestamp("updated_at", {
//       mode: "string",
//       withTimezone: true,
//     })
//       .notNull()
//       .default(sql`CURRENT_TIMESTAMP`)
//       .$onUpdate(() => new Date().toISOString()),
//   },
//   (table) => ({
//     questionIdIndex: index("code_question_idx").on(table.questionId),
//     uniqueQuestion: unique().on(table.questionId), // One code config per question
//   })
// ).enableRLS()

// Date-time picker configuration (for date-picker and time-picker questions)
// export const dateTimeConfig = pgTable(
//   "date_time_config",
//   {
//     id: varchar("id", { length: 255 })
//       .primaryKey()
//       .$defaultFn(() => "dt-" + ulid()),
//     questionId: varchar("question_id", { length: 255 })
//       .notNull()
//       .references(() => question.id, { onDelete: "cascade" }),
//     minDate: timestamp("min_date", { mode: "string", withTimezone: true }),
//     maxDate: timestamp("max_date", { mode: "string", withTimezone: true }),
//     correctDate: timestamp("correct_date", {
//       mode: "string",
//       withTimezone: true,
//     }),
//     format: varchar("format", { length: 50 }), // Format string (e.g., "YYYY-MM-DD")
//     allowTimeSelection: boolean("allow_time_selection").default(false),
//     createdAt: timestamp("created_at", {
//       mode: "string",
//       withTimezone: true,
//     })
//       .notNull()
//       .default(sql`CURRENT_TIMESTAMP`),
//     updatedAt: timestamp("updated_at", {
//       mode: "string",
//       withTimezone: true,
//     })
//       .notNull()
//       .default(sql`CURRENT_TIMESTAMP`)
//       .$onUpdate(() => new Date().toISOString()),
//   },
//   (table) => ({
//     questionIdIndex: index("date_question_idx").on(table.questionId),
//     uniqueQuestion: unique().on(table.questionId), // One date/time config per question
//   })
// ).enableRLS()

// Formula configuration (for formula-input questions)
// export const formulaConfig = pgTable(
//   "formula_config",
//   {
//     id: varchar("id", { length: 255 })
//       .primaryKey()
//       .$defaultFn(() => "frm-" + ulid()),
//     questionId: varchar("question_id", { length: 255 })
//       .notNull()
//       .references(() => question.id, { onDelete: "cascade" }),
//     correctFormula: text("correct_formula"),
//     variables: jsonb("variables"), // Array of allowed variables with descriptions
//     allowedFunctions: text("allowed_functions").array().notNull(),
//     tolerance: text("tolerance"), // For numeric answers, how close is considered correct
//     caseSensitive: boolean("case_sensitive").default(false),
//     createdAt: timestamp("created_at", {
//       mode: "string",
//       withTimezone: true,
//     })
//       .notNull()
//       .default(sql`CURRENT_TIMESTAMP`),
//     updatedAt: timestamp("updated_at", {
//       mode: "string",
//       withTimezone: true,
//     })
//       .notNull()
//       .default(sql`CURRENT_TIMESTAMP`)
//       .$onUpdate(() => new Date().toISOString()),
//   },
//   (table) => ({
//     questionIdIndex: index("formula_question_idx").on(table.questionId),
//     uniqueQuestion: unique().on(table.questionId), // One formula config per question
//   })
// ).enableRLS()

//Relations
export const questionRelation = relations(question, ({ one }) => ({
  testSection: one(testSection, {
    fields: [question.referenceId],
    references: [testSection.id]
  }),
  // textFieldConfig: one(textFieldConfig),
  // fillBlankSegments: many(fillBlankSegment),
  // mediaConfig: one(mediaConfig),
  // sliderConfig: one(sliderConfig),
  // matchingPairs: many(matchingPair),
  // matrixConfig: one(matrixConfig),
  // hotspotConfig: one(hotspotConfig),
  // codeEditorConfig: one(codeEditorConfig),
  // dateTimeConfig: one(dateTimeConfig),
  // formulaConfig: one(formulaConfig),
  questionTemplate: one(questionTemplate, {
    fields: [question.referenceId],
    references: [questionTemplate.id],
    relationName: 'question.questionTemplate'
  })
}))

// export const textFieldConfigRelation = relations(
//   textFieldConfig,
//   ({ one }) => ({
//     question: one(question, {
//       fields: [textFieldConfig.questionId],
//       references: [question.id],
//       relationName: "question.textFieldConfig",
//     }),
//   })
// );

// export const fillBlankSegmentRelation = relations(
//   fillBlankSegment,
//   ({ one }) => ({
//     question: one(question, {
//       fields: [fillBlankSegment.questionId],
//       references: [question.id],
//       relationName: "question.fillBlankSegments",
//     }),
//   })
// );

// export const mediaConfigRelation = relations(mediaConfig, ({ one }) => ({
//   question: one(question, {
//     fields: [mediaConfig.questionId],
//     references: [question.id],
//     relationName: "question.mediaConfig",
//   }),
// }));

// export const sliderConfigRelation = relations(sliderConfig, ({ one }) => ({
//   question: one(question, {
//     fields: [sliderConfig.questionId],
//     references: [question.id],
//     relationName: "question.sliderConfig",
//   }),
// }));

// export const matchingPairRelation = relations(matchingPair, ({ one }) => ({
//   question: one(question, {
//     fields: [matchingPair.questionId],
//     references: [question.id],
//     relationName: "question.matchingPairs",
//   }),
// }));

// export const matrixConfigRelation = relations(matrixConfig, ({ one }) => ({
//   question: one(question, {
//     fields: [matrixConfig.questionId],
//     references: [question.id],
//     relationName: "question.matrixConfig",
//   }),
// }));

// export const hotspotConfigRelation = relations(hotspotConfig, ({ one }) => ({
//   question: one(question, {
//     fields: [hotspotConfig.questionId],
//     references: [question.id],
//     relationName: "question.hotspotConfig",
//   }),
// }));

// export const codeEditorConfigRelation = relations(
//   codeEditorConfig,
//   ({ one }) => ({
//     question: one(question, {
//       fields: [codeEditorConfig.questionId],
//       references: [question.id],
//       relationName: "question.codeEditorConfig",
//     }),
//   })
// );

// export const dateTimeConfigRelation = relations(dateTimeConfig, ({ one }) => ({
//   question: one(question, {
//     fields: [dateTimeConfig.questionId],
//     references: [question.id],
//     relationName: "question.dateTimeConfig",
//   }),
// }));

// export const formulaConfigRelation = relations(formulaConfig, ({ one }) => ({
//   question: one(question, {
//     fields: [formulaConfig.questionId],
//     references: [question.id],
//     relationName: "question.formulaConfig",
//   }),
// }));
