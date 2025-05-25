import { eq } from 'drizzle-orm'

import db from '../../../lib/db'
import { testAttempt } from '../../../lib/db/schema/test.attempt'

export async function submitAttempt(attemptId: string) {
  const attempt = await db
    .update(testAttempt)
    .set({
      completedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
    .where(eq(testAttempt.id, attemptId))
    .returning()

  return attempt[0]
}
