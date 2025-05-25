import { eq } from 'drizzle-orm'

import db from '../../../lib/db'
import { question } from '../../../lib/db/schema'

/* 
    Important: Please validate the owner of the question before using this service
    This function will update the order of the questions
    It will take an array of question ids and the new order
    It will then update the order of the questions in the database
*/
export async function updateOrderBetweenQuestions(
  questions: { questionId: string; order: number }[]
) {
  const isUpdated = await Promise.all(
    questions.map(async q => {
      return await db
        .update(question)
        .set({
          order: q.order
        })
        .where(eq(question.id, q.questionId))
        .returning()
    })
  )

  return isUpdated.every(isUpdated => isUpdated.length > 0)
}
