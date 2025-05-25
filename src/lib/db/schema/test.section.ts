import { relations, sql } from 'drizzle-orm'
import { index, pgTable, smallint, timestamp, varchar } from 'drizzle-orm/pg-core'
import { ulid } from 'ulidx'

import { question } from './question'
import { test } from './test'
import { testAttempt } from './test.attempt'

export const testSection = pgTable(
  'test_section',
  {
    id: varchar('id', { length: 255 })
      .primaryKey()
      .$defaultFn(() => 'ss-' + ulid()),
    title: varchar('title', { length: 255 }),
    duration: smallint('duration').default(0),
    order: smallint('order'),
    testId: varchar('test_id', { length: 255 }).notNull(),
    description: varchar('description', { length: 1000 }),
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
  t => ({
    testSectionTestIdIdx: index('test_section_test_id_idx').on(t.testId)
  })
).enableRLS()

//Relations
export const testSectionRelation = relations(testSection, ({ many, one }) => ({
  question: many(question),
  test: one(test, {
    fields: [testSection.testId],
    references: [test.id]
  }),
  attempt: many(testAttempt)
}))
