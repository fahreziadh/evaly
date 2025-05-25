import db from '@/lib/db'
import { question } from '@/lib/db/schema'
import { and, count, eq, isNull } from 'drizzle-orm'

export const getAllQuestionTemplate = async (organizationId: string) => {
  const templates = await db.query.questionTemplate.findMany({
    where(fields, { and, eq, isNull }) {
      return and(eq(fields.organizationId, organizationId), isNull(fields.deletedAt))
    },
    with: {
      questions: {
        orderBy(fields, { asc }) {
          return asc(fields.order)
        },
        columns: {
          id: true,
          question: true
        },
        limit: 2,
        where(fields, { and, isNull }) {
          return and(isNull(fields.deletedAt))
        }
      }
    },
    orderBy(fields, { desc }) {
      return desc(fields.createdAt)
    }
  })

  // Get count of non-deleted questions for each template
  const templatesWithTotalQuestions = await Promise.all(
    templates.map(async template => {
      const questionCount = await db
        .select({ count: count() })
        .from(question)
        .where(and(eq(question.referenceId, template.id), isNull(question.deletedAt)))

      return {
        ...template,
        totalQuestions: questionCount[0].count
      }
    })
  )

  return templatesWithTotalQuestions
}
