import { question } from '@/lib/db/schema'
import { and, eq, gte, ne, sql } from 'drizzle-orm'

import { InsertQuestion } from '@/types/question'

import db from '../../../lib/db'

export async function createQuestion(
  referenceId: string,
  listQuestion: InsertQuestion[]
) {
  const insertedQuestions = await db
    .insert(question)
    .values(
      listQuestion.map(item => ({
        ...item,
        referenceId
      }))
    )
    .returning()

  const firstOrder = listQuestion.at(0)?.order || 1
  const totalInsertedQuestions = insertedQuestions.length

  // Update order of other questions
  await db
    .update(question)
    .set({
      order: sql`${question.order}+${totalInsertedQuestions.toString()}`
    })
    .where(
      and(
        ...insertedQuestions.map(item => ne(question.id, item.id)),
        eq(question.referenceId, referenceId),
        gte(question.order, firstOrder)
      )
    )

  return insertedQuestions
}
