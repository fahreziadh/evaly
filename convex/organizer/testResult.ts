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

    const progress = {
      workingInProgress: 0,
      submissions: 0,
      averageTime: 0, //in second
      completitionRate: 0, //in perentage
    };

    // Get All of the attempt grouped by participants
    const attemptByParticipant = new Map<
      Id<"users">,
      DataModel["testAttempt"]["document"][]
    >();
    for (const attempt of testAttempt) {
      const existings = attemptByParticipant.get(attempt.participantId);
      if (existings && existings.length > 0) {
        attemptByParticipant.set(attempt.participantId, [
          ...existings,
          attempt,
        ]);
      } else {
        attemptByParticipant.set(attempt.participantId, [attempt]);
      }
    }

    // Get Progress
    for (const [participantId, attempts] of attemptByParticipant) {
      const isCompleted = attempts
        .map((e) => e.finishedAt !== undefined && e.finishedAt > 0)
        .filter((e) => e);

      if (isCompleted.length === testSections.length) {
        progress.submissions += 1;

        const finishedTime = attempts
          .map((e) => {
            if (!e.finishedAt) {
              return 0;
            }
            return e.finishedAt - e.startedAt;
          })
          .reduce((prev, curr) => prev + curr);

        progress.averageTime += finishedTime / 1000;
      } else {
        progress.workingInProgress += 1;
      }
    }

    // Calculate completion rate
    if (progress.submissions > 0) {
      progress.completitionRate = Math.round(
        (progress.submissions / attemptByParticipant.size) * 100
      );
    }

    return progress;
  },
});

export const getSummary = query({
  args: {
    testId: v.id("test"),
    testSectionId: v.id("testSection"),
  },
  async handler(ctx, { testId, testSectionId }) {
    const user = await getAuthUserId(ctx);
    if (!user) {
      return null;
    }

    const { isOwner } = await checkTestOwnership(ctx, testId);
    if (!isOwner) {
      return null;
    }

    const testSection = await ctx.db.get(testSectionId);
    if (testSection?.testId !== testId) return null;

    const questions = await ctx.db
      .query("question")
      .withIndex("by_reference_id", (q) => q.eq("referenceId", testSectionId))
      .filter((q) => q.lte(q.field("deletedAt"), 0))
      .collect();

    const questionsOrdered = await questions.sort((a, b) => a.order - b.order);

    // Get all answers
    const answers = await ctx.db
      .query("testAttemptAnswer")
      .withIndex("by_section", (q) => q.eq("testSectionId", testSectionId))
      .filter((q) => q.lte(q.field("deletedAt"), 0))
      .collect();

    const summary: {
      [questionId: Id<"question">]: {
        optionsAnswer: { [optionId: string]: number };
      };
    } = {};

    for (const question of questionsOrdered) {
      // Initialize the question entry in summary first
      summary[question._id] = {
        optionsAnswer: {}
      };

      const answer = answers.filter((e) => e.questionId === question._id);
      
      if (question.options) {
        for (const option of question.options) {
          const total = answer.filter((f) => f.answerOptions?.includes(option.id)).length;
          summary[question._id].optionsAnswer[option.id] = total;
        }
      }
    }

    return summary;
  },
});
