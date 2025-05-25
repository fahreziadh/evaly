import db from '@/lib/db'
import { questionTemplate } from '@/lib/db/schema'

export const createQuestionTemplate = async (
  body: typeof questionTemplate.$inferInsert
) => {
  const dataCreated = await db.insert(questionTemplate).values(body).returning()

  if (!dataCreated || dataCreated.length === 0) {
    throw new Error('Failed to create question template')
  }

  return dataCreated[0]
}
