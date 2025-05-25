import { and, eq } from 'drizzle-orm'

import db from '../../../lib/db'
import { testSection } from '../../../lib/db/schema'

export async function updateOrderSection(testId: string, sectionIds: string[]) {
  await Promise.all(
    sectionIds.map(async (id, index) => {
      await db
        .update(testSection)
        .set({
          order: index + 1 // +1 because order is 1-based
        })
        .where(and(eq(testSection.id, id), eq(testSection.testId, testId)))
    })
  )
}
