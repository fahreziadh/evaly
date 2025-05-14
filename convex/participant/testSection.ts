import { v } from "convex/values";
import { query } from "../_generated/server";

export const getByTestId = query({
    args: {
      testId: v.id("test"),
    },
    handler: async (ctx, args) => {
      const data = await ctx.db
        .query("testSection")
        .withIndex("by_test_id", (q) => q.eq("testId", args.testId))
        .filter((q) => q.lte(q.field("deletedAt"), 0))
        .collect();
      
      const dataWithNumOfQuestions = await Promise.all(data.map(async (e) => {
        const questions = await ctx.db
        .query("question")
        .withIndex("by_reference_id", (q) => q.eq("referenceId", e._id))
        .filter((q) => q.lte(q.field("deletedAt"), 0))
        .collect();
  
        return {
          ...e,
          numOfQuestions: questions.length,
        };
      }));
  
      return dataWithNumOfQuestions;
    },
  });