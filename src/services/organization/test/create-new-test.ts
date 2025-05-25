import db from '../../../lib/db'
import { test, testSection } from '../../../lib/db/schema'

export async function createNewTest(data: typeof test.$inferInsert) {
  const insertTest = await db.insert(test).values(data).returning()
  const testId = insertTest.at(0)?.id

  if (testId) {
    await db.insert(testSection).values({ testId, order: 1 })
  }

  return insertTest.at(0)
}
