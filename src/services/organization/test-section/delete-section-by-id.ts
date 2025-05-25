import { and, eq, gte, ne, sql } from 'drizzle-orm'

import db from '../../../lib/db'
import { question, testSection } from '../../../lib/db/schema'

export async function deleteSectionById(sectionId: string) {
  const sectionOrder = (
    await db.query.testSection.findFirst({
      columns: {
        order: true
      },
      where(fields, operators) {
        return operators.eq(fields.id, sectionId)
      }
    })
  )?.order

  const deleteSection = await db
    .update(testSection)
    .set({
      deletedAt: new Date().toISOString(),
      order: null
    })
    .where(eq(testSection.id, sectionId))
    .returning()

  const deleteQuestions = await db
    .update(question)
    .set({
      deletedAt: new Date().toISOString()
    })
    .where(eq(question.referenceId, sectionId))
    .returning()

  // Change the order of the sections
  if (deleteSection[0] && sectionOrder) {
    await db
      .update(testSection)
      .set({
        order: sql`${testSection.order} - 1`
      })
      .where(
        and(
          eq(testSection.testId, deleteSection[0].testId),
          ne(testSection.id, sectionId),
          gte(testSection.order, sectionOrder)
        )
      )
  }

  return {
    sectionRowChanges: deleteSection.length,
    questionRowChanges: deleteQuestions.length
  }
}
