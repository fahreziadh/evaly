import { and, eq } from 'drizzle-orm'

import db from '../../../lib/db'
import { questionTemplate } from '../../../lib/db/schema'

export const updateQuestionTemplate = async (
  templateId: string,
  organizationId: string,
  data: Partial<typeof questionTemplate.$inferInsert>
) => {
  const updateQuestionTemplate = await db
    .update(questionTemplate)
    .set(data)
    .where(
      and(
        eq(questionTemplate.id, templateId),
        eq(questionTemplate.organizationId, organizationId)
      )
    )
    .returning()

  return updateQuestionTemplate[0]
}
