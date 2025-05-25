import { and, eq } from 'drizzle-orm'

import db from '../../../lib/db'
import { questionTemplate } from '../../../lib/db/schema/question.template'

export const deleteQuestionTemplate = async (
  templateId: string,
  organizationId: string
) => {
  await db
    .update(questionTemplate)
    .set({
      deletedAt: new Date().toISOString()
    })
    .where(
      and(
        eq(questionTemplate.id, templateId),
        eq(questionTemplate.organizationId, organizationId)
      )
    )
    .returning()

  return {
    success: true,
    message: 'Question template deleted successfully'
  }
}
