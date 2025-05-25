import db from '../../../lib/db'

export async function getAttempts({
  testId,
  email
}: {
  testId: string
  email: string
}) {
  const resultAttempts = await db.query.testAttempt.findMany({
    where(fields, { and, eq }) {
      return and(eq(fields.testId, testId), eq(fields.participantEmail, email))
    }
  })

  return resultAttempts
}
