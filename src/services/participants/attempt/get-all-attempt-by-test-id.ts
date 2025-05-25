import { and, eq } from 'drizzle-orm'

import db from '../../../lib/db'
import { testAttempt } from '../../../lib/db/schema/test.attempt'

export async function getAllAttemptByTestId(testId: string, email: string) {
  const attempts = await db.query.testAttempt.findMany({
    where: and(eq(testAttempt.testId, testId), eq(testAttempt.participantEmail, email))
  })

  return attempts
}
