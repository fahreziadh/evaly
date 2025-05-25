import { createUpdateSchema } from 'drizzle-zod'

import { testAttempt } from '../lib/db/schema/test.attempt'
import { testAttemptAnswer } from '../lib/db/schema/test.attempt.answer'
import { TestSection } from './test'

export type TestAttempt = typeof testAttempt.$inferSelect
export type InsertTestAttempt = typeof testAttempt.$inferInsert
export type UpdateTestAttempt = Partial<InsertTestAttempt>

export type TestAttemptWithSection = TestAttempt & {
  testSection?: TestSection | null
}

export type TestAttemptAnswer = typeof testAttemptAnswer.$inferSelect
export type InsertTestAttemptAnswer = typeof testAttemptAnswer.$inferInsert
export type UpdateTestAttemptAnswer = Partial<InsertTestAttemptAnswer>

export const ValidatedInsertTestAttemptAnswer = createUpdateSchema(testAttemptAnswer)
