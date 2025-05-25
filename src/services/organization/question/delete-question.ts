import { and, eq, gte, ne, sql } from 'drizzle-orm'

import db from '../../../lib/db'
import { question } from '../../../lib/db/schema/question'

export async function deleteQuestion(questionId: string) {
  const currentQuestionOrder = (
    await db.query.question.findFirst({
      columns: {
        order: true
      },
      where(fields, operators) {
        return operators.eq(fields.id, questionId)
      }
    })
  )?.order

  const deleteQuestion = await db
    .update(question)
    .set({ deletedAt: new Date().toISOString() })
    .where(eq(question.id, questionId))
    .returning()

  // Change the order of the questions
  if (deleteQuestion[0] && currentQuestionOrder) {
    await db
      .update(question)
      .set({ order: sql`${question.order} - 1` })
      .where(
        and(
          eq(question.referenceId, deleteQuestion[0].referenceId),
          ne(question.id, questionId),
          gte(question.order, currentQuestionOrder)
        )
      )
  }
}
