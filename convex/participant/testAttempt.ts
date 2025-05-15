import { ConvexError, v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const start = mutation({
  args: {
    testSectionId: v.id("testSection"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Unauthorized");
    }

    // Check Test Section
    const testSection = await ctx.db.get(args.testSectionId);
    if (!testSection) {
      throw new ConvexError("Test section not found");
    }

    const test = await ctx.db.get(testSection.testId);
    if (!test) {
      throw new ConvexError("Test not found");
    }

    // If the user has already started the test, return the current test attempt
    const currentTestAttempt = await ctx.db
      .query("testAttempt")
      .withIndex("by_participant_test_section", (q) =>
        q.eq("participantId", userId).eq("testSectionId", args.testSectionId)
      )
      .first();

    if (currentTestAttempt) {
      return currentTestAttempt;
    }

    // If not, create a new test attempt
    const newTestAttemptId = await ctx.db.insert("testAttempt", {
      participantId: userId,
      startedAt: Date.now(),
      testId: test._id,
      testSectionId: testSection._id,
    });

    const newTestAttempt = await ctx.db.get(newTestAttemptId);

    if (!newTestAttempt) {
      throw new ConvexError("Failed to create test attempt");
    }

    return newTestAttempt;
  },
});

export const getByTestIdAndParticipantId = query({
  args: {
    testId: v.id("test"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const testAttempt = await ctx.db
      .query("testAttempt")
      .withIndex("by_participant_test", (q) =>
        q.eq("participantId", userId).eq("testId", args.testId)
      )
      .collect();

    return testAttempt;
  },
});
