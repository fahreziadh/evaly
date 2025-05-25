import { eq } from 'drizzle-orm/sql'

import db from '../../../lib/db'
import { testAttemptAnswer } from '../../../lib/db/schema'

export async function getAttemptAnswers(attemptId: string) {
  const answers = await db.query.testAttemptAnswer.findMany({
    columns: {
      id: true,
      questionId: true,
      answerOptions: true,
      answerMediaUrl: true,
      answerMediaType: true,
      changeCount: true,
      answerText: true
    },
    where: eq(testAttemptAnswer.attemptId, attemptId)
  })

  return answers
}
