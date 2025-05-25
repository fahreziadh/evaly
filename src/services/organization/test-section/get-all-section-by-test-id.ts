import { and, count, eq, isNull } from 'drizzle-orm/sql'

import db from '../../../lib/db'
import { question, testSection } from '../../../lib/db/schema'

export async function getAllSectionByTestId(testId: string) {
  const data = await db
    .select({
      testSection,
      numOfQuestions: count(question.id)
    })
    .from(testSection)
    .where(and(eq(testSection.testId, testId), isNull(testSection.deletedAt)))
    .leftJoin(
      question,
      and(eq(testSection.id, question.referenceId), isNull(question.deletedAt))
    )
    .groupBy(testSection.id)
    .orderBy(testSection.order)

  const finalData = data.map(item => {
    return {
      ...item.testSection,
      numOfQuestions: item.numOfQuestions
    }
  })
  return finalData
}
