import db from '../../../lib/db'

export const getQuestionTemplateById = async (id: string, organizationId: string) => {
  const data = await db.query.questionTemplate.findFirst({
    where(fields, { eq, and, isNull }) {
      return and(
        eq(fields.id, id),
        eq(fields.organizationId, organizationId),
        isNull(fields.deletedAt)
      )
    },
    with: {
      questions: {
        orderBy(fields, operators) {
          return operators.asc(fields.order)
        },
        where(fields, { isNull }) {
          return isNull(fields.deletedAt)
        }
      }
    }
  })

  return data
}
