import db from '../../../lib/db'

export async function getAllQuestionByReferenceId(referenceId: string) {
  const questions = await db.query.question.findMany({
    orderBy(fields, { asc }) {
      return asc(fields.order)
    },
    where(fields, { and, eq, isNull }) {
      return and(eq(fields.referenceId, referenceId), isNull(fields.deletedAt))
    }
  })

  return questions
}
