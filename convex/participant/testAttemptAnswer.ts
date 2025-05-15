import { ConvexError, v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const setAnswer = mutation({
  args: {
    testAttemptId: v.id("testAttempt"),
    questionId: v.id("question"),
    answerOptions: v.optional(v.array(v.string())),
    answerText: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Unauthorized");
    }

    const question = await ctx.db.get(args.questionId);
    if (!question) {
      throw new ConvexError("Question not found");
    }

    const existingAnswer = await ctx.db
      .query("testAttemptAnswer")
      .withIndex("by_attempt_and_question", (q) =>
        q
          .eq("testAttemptId", args.testAttemptId)
          .eq("questionId", args.questionId)
      )
      .first();

    if (existingAnswer) {
      await ctx.db.patch(existingAnswer._id, {
        answerOptions: args.answerOptions,
        answerText: args.answerText,
      });
    } else {
      await ctx.db.insert("testAttemptAnswer", {
        testAttemptId: args.testAttemptId,
        questionId: args.questionId,
        answerOptions: args.answerOptions,
        answerText: args.answerText,
      });
    }
  },
});

export const getByAttemptId = query({
  args: {
    testAttemptId: v.id("testAttempt"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("testAttemptAnswer")
      .withIndex("by_attempt", (q) => q.eq("testAttemptId", args.testAttemptId))
      .collect();
  },
});
