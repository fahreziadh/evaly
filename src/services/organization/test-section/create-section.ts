import { and, eq, isNull, sql } from 'drizzle-orm/sql'

import db from '../../../lib/db'
import { testSection } from '../../../lib/db/schema'

export async function createSection(testId: string) {
  const [{ count }] = await db
    .select({
      count: sql<number>`count(*)`
    })
    .from(testSection)
    .where(and(eq(testSection.testId, testId), isNull(testSection.deletedAt)))

  const sections = await db
    .insert(testSection)
    .values({ testId, order: Number(count) + 1 })
    .returning()

  return { sections }
}
