import { test } from '../lib/db/schema/test'
import { testInvitation } from '../lib/db/schema/test.invitation'
import { testSection } from '../lib/db/schema/test.section'

export type Test = typeof test.$inferSelect & {
  duration?: number | null
  invitations?: number | null
}
export type InsertTest = typeof test.$inferInsert
export type UpdateTest = Partial<InsertTest>

export type TestSection = typeof testSection.$inferSelect & {
  numOfQuestions?: number
}
export type InsertTestSection = typeof testSection.$inferInsert
export type UpdateTestSection = Partial<InsertTestSection>

export type TestInvitation = typeof testInvitation.$inferSelect & {
  name?: string | null
  image?: string | null
}
export type InsertTestInvitation = typeof testInvitation.$inferInsert
export type UpdateTestInvitation = Partial<InsertTestInvitation>

export type TestType = Test['type']
