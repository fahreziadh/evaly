import { v } from "convex/values";
import { query } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { checkTestOwnership } from "./test";
import { DataModel, Id } from "../_generated/dataModel";

export const getProgress = query({
  args: {
    testId: v.id("test"),
  },
  async handler(ctx, args) {
    const user = await getAuthUserId(ctx);
    if (!user) {
      return null;
    }

    const { isOwner } = await checkTestOwnership(ctx, args.testId);
    if (!isOwner) {
      return null;
    }

    const testSections = await ctx.db
      .query("testSection")
      .withIndex("by_test_id", (q) => q.eq("testId", args.testId))
      .filter((q) => q.lte(q.field("deletedAt"), 0))
      .collect();

    // Show the the list of participants
    // Each participants generate the answers it should be as Map<questionId, testAttemptAnswer>
    const testAttempt = await ctx.db
      .query("testAttempt")
      .withIndex("by_test", (q) => q.eq("testId", args.testId))
      .filter((q) => q.lte(q.field("deletedAt"), 0))
      .collect();

    // Get Participants Details
    const participantsSet = new Set<Id<"users">>();

    for (const attempt of testAttempt) {
      participantsSet.add(attempt.participantId);
    }

    const participants = await Promise.all(
      [...participantsSet].map(ctx.db.get)
    );

    const sortedParticipants = participants
      .filter((e) => e !== null)
      .sort((a, b) => {
        const nameA = (a.name || "").toLowerCase();
        const nameB = (b.name || "").toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      });

    const participantsWithAttemptsAndAnswer = await Promise.all(
      sortedParticipants.map(async (e) => {
        const results: {
          [testSectionId: Id<"testSection">]: {
            [
              questionId: Id<"question">
            ]: DataModel["testAttemptAnswer"]["document"];
          };
        } = {};
        let completedAttempt = 0;
        let totalFinishedInSecond = 0;

        await Promise.all(
          testAttempt
            .filter(({ participantId }) => participantId === e._id)
            .map(async (e) => {
              if (e.finishedAt) {
                completedAttempt++;
                totalFinishedInSecond += (e.finishedAt - e.startedAt) / 1000;
              }

              const answers: {
                [
                  questionId: Id<"question">
                ]: DataModel["testAttemptAnswer"]["document"];
              } = {};

              await ctx.db
                .query("testAttemptAnswer")
                .withIndex("by_attempt", (q) => q.eq("testAttemptId", e._id))
                .collect()
                .then((e) => {
                  for (const answer of e) {
                    // answers.set(answer.questionId, answer)
                    answers[answer.questionId] = answer;
                  }
                });

              results[e.testSectionId] = answers;
            })
        );

        return {
          participant: e,
          results,
          isFinished: completedAttempt === testSections.length,
          totalFinishedInSecond
        };
      })
    );

    const sortedParticipantsByCorrectAnswer = participantsWithAttemptsAndAnswer.sort((a, b) => {
      const correctAnswerA = Object.values(a.results).reduce((acc, curr) => {
        return acc + Object.values(curr).filter((e) => e.isCorrect).length;
      }, 0);

      const correctAnswerB = Object.values(b.results).reduce((acc, curr) => {
        return acc + Object.values(curr).filter((e) => e.isCorrect).length;
      }, 0);

      return correctAnswerB - correctAnswerA;
    });

    return {
      progress: participantsWithAttemptsAndAnswer,
      leaderboard: sortedParticipantsByCorrectAnswer,
    };
  },
});
