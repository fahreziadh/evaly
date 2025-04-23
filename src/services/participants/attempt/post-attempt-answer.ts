import { eq, sql } from "drizzle-orm/sql";
import db from "../../../lib/db";
import { question, testAttemptAnswer } from "../../../lib/db/schema";
import { UpdateTestAttemptAnswer } from "../../../types/test.attempt";

export async function postAttemptAnswer(data: UpdateTestAttemptAnswer) {
  // For option based questions, we need to check if the answer is correct
  if (data.answerOptions && data.answerOptions?.length > 0) {
    if (!data.questionId) {
      throw new Error("Question ID is required");
    }

    const findQuestion = await db.query.question.findFirst({
      where: eq(question.id, data.questionId),
    });

    if (!findQuestion || !findQuestion.options) {
      throw new Error("Question not found");
    }

    // Set isCorrect based on whether all selected answers are correct and all correct answers are selected
    const selectedOptionIds = new Set(data.answerOptions || []);
    const correctOptionIds = findQuestion.options
      .filter((o) => o.isCorrect)
      .map((o) => o.id);

    data.isCorrect = correctOptionIds.some((id) => selectedOptionIds.has(id));
  }

  const upsertAnswer = await db
    .insert(testAttemptAnswer)
    .values(data)
    .onConflictDoUpdate({
      target: [testAttemptAnswer.attemptId, testAttemptAnswer.questionId],
      set: {
        ...data,
        updatedAt: new Date().toISOString(),
        changeCount: sql`${testAttemptAnswer.changeCount} + 1`,
      },
    })
    .returning();

  const returnData = upsertAnswer[0];

  // Removing isCorrect from the response
  returnData.isCorrect = null;

  return returnData;
}
