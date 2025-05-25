import db from '@/lib/db'
import { question } from '@/lib/db/schema'
import { and, eq, or } from 'drizzle-orm'

export async function checkQuestionOwner(
  questionIds: string[],
  organizationId: string
) {
  const questionIdsCondition = questionIds.map(id => eq(question.id, id))

  const questions = await db.query.question.findMany({
    where: and(or(...questionIdsCondition), eq(question.organizationId, organizationId))
  })

  if (questions.length !== questionIds.length) {
    throw new Error('Some questions are not owned by the organization')
  }

  return questions
}
