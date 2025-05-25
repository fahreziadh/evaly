import db from '@/lib/db'
import { question } from '@/lib/db/schema'
import { and, eq, gte, ne, sql } from 'drizzle-orm'

export async function transferBetweenReference(params: {
  fromReferenceId: string
  toReferenceId: string
  order: number
  organizationId: string
}) {
  const { fromReferenceId, toReferenceId, order, organizationId } = params

  // get all questions from source
  const sourceQuestions = await db.query.question.findMany({
    where(e, { and, eq, isNull }) {
      return and(eq(e.referenceId, fromReferenceId), isNull(e.deletedAt))
    },
    orderBy(fields, { asc }) {
      return asc(fields.order)
    }
  })

  // save questions to target reference
  const createdQuestions = await db
    .insert(question)
    .values(
      sourceQuestions.map((e, index) => ({
        ...e,
        id: undefined,
        order: order + index,
        referenceId: toReferenceId,
        organizationId,
        deletedAt: null
      }))
    )
    .returning()

  if (createdQuestions.length !== sourceQuestions.length) {
    throw new Error('Failed when importing questions!')
  }

  // update the other questions order
  await db
    .update(question)
    .set({
      order: sql`${question.order}+${createdQuestions.length}`
    })
    .where(
      and(
        ...createdQuestions.map(e => ne(question.id, e.id)),
        gte(question.order, order),
        eq(question.referenceId, toReferenceId)
      )
    )

  return createdQuestions
}
