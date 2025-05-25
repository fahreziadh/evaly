import { eq } from 'drizzle-orm'

import db from '../../../lib/db'
import { question } from '../../../lib/db/schema/question'
import { UpdateQuestion } from '../../../types/question'

export async function updateQuestion(questionId: string, data: UpdateQuestion) {
  const updatedQuestion = await db
    .update(question)
    .set({ ...data, updatedAt: new Date().toISOString() })
    .where(eq(question.id, questionId))
    .returning()

  return { updatedQuestion: updatedQuestion[0] }
}
