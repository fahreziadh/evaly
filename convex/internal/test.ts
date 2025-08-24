import { internalMutation } from "../_generated/server";
import { v } from "convex/values";

/**
 * Internal function to activate a scheduled test
 * Called by Convex scheduler at the scheduled start time
 */
export const activateTest = internalMutation({
  args: { testId: v.id("test") },
  handler: async (ctx, { testId }) => {
    const test = await ctx.db.get(testId);
    
    // If test is not found or deleted, silently return
    if (!test || test.deletedAt) {
      console.warn(`Scheduled activation for test ${testId} skipped - test not found or deleted`);
      return;
    }

    // Activate the test and clear the activation job ID
    await ctx.db.patch(testId, { 
      isPublished: true,
      activationJobId: undefined // Clear job ID since it's executed
    });
  }
});

/**
 * Internal function to finish a scheduled test
 * Called by Convex scheduler at the scheduled end time
 */
export const finishTest = internalMutation({
  args: { testId: v.id("test") },
  handler: async (ctx, { testId }) => {
    const test = await ctx.db.get(testId);
    
    // If test is not found or deleted, silently return
    if (!test || test.deletedAt) {
      console.warn(`Scheduled finish for test ${testId} skipped - test not found or deleted`);
      return;
    }

    // Only finish if the test is currently published and not already finished
    if (test.isPublished && !test.finishedAt) {
      await ctx.db.patch(testId, { 
        finishedAt: Date.now(),
        finishJobId: undefined // Clear job ID since it's executed
      });
    }
  }
});