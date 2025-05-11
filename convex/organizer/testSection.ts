import { v } from "convex/values";
import { mutation, query } from "../_generated/server";

export const getByTestId = query({
  args: {
    testId: v.id("test"),
  },
  handler: async (ctx, args) => {
    const data = await ctx.db
    .query("testSection")
    .withIndex("by_test_id", (q) => q.eq("testId", args.testId))
    .collect()

    const questions = await ctx.db.query("question").withIndex("by_reference_id", (q) => q.eq("referenceId", args.testId)).collect()

    return data.map((e) => ({...e, numOfQuestions: questions.length}))
  },
});

export const remove = mutation({
  args: {
    sectionId: v.id("testSection"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.sectionId, {
      deletedAt: Date.now(),
    });
  },
});

export const getById = query({
  args: {
    sectionId: v.id("testSection"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.sectionId);
  },
});