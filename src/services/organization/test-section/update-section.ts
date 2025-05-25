import { eq } from 'drizzle-orm'

import db from '../../../lib/db'
import { testSection } from '../../../lib/db/schema'
import { UpdateTestSection } from '../../../types/test'

export async function updateSection(sectionId: string, data: UpdateTestSection) {
  const section = await db
    .update(testSection)
    .set(data)
    .where(eq(testSection.id, sectionId))
    .returning()

  return section
}
