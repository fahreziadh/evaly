import { and, count, eq, isNull } from "drizzle-orm/sql";
import db from "../../../lib/db";
import { question, testSession } from "../../../lib/db/schema";

export async function getAllSessionByTestId(testId: string) {
  const data = await db
    .select({
      testSession,
      numOfQuestions: count(question.id),
    })
    .from(testSession)
    .where(and(eq(testSession.testId, testId), isNull(testSession.deletedAt)))
    .leftJoin(
      question, 
      and(
        eq(testSession.id, question.referenceId),
        isNull(question.deletedAt)
      )
    )
    .groupBy(testSession.id)
    .orderBy(testSession.order);

  const finalData = data.map((item) => {
    return {
      ...item.testSession,
      numOfQuestions: item.numOfQuestions,
    };
  });
  return {
    sessions: finalData,
  };
}
