import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { checkTestOwnership } from "./test";

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

    const sortedData = data.sort((a, b) => a.order - b.order);
    
    const dataWithNumOfQuestions = await Promise.all(sortedData.map(async (e) => {
      const questions = await ctx.db
      .query("question")
      .withIndex("by_reference_id", (q) => q.eq("referenceId", e._id))
      .filter((q) => q.lte(q.field("deletedAt"), 0))
      .collect();

      const sortedQuestions = questions.sort((a, b) => a.order - b.order);

      return {
        ...e,
        questions: questions,
        numOfQuestions: questions.length,
      };
    }));

    return dataWithNumOfQuestions;
  },
});

export const remove = mutation({
  args: {
    sectionId: v.id("testSection"),
  },
  handler: async (ctx, args) => {
    const section = await ctx.db.get(args.sectionId);
    if (!section) {
      throw new Error("Section not found");
    }

    if (section.deletedAt) {
      throw new Error("Section already deleted");
    }

    await ctx.db.patch(args.sectionId, {
      deletedAt: Date.now(),
      order: 0,
    });

    // update the order of the other sections
    const sections = await ctx.db
      .query("testSection")
      .withIndex("by_test_id", (q) => q.eq("testId", section.testId))
      .filter((q) => q.lte(q.field("deletedAt"), 0))
      .collect();

    for (const s of sections) {
      if (s._id === args.sectionId || s.order <= section.order) continue;

      await ctx.db.patch(s._id, {
        order: s.order - 1,
      });
    }
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

export const create = mutation({
  args: {
    testId: v.id("test"),
  },
  handler: async (ctx, args) => {
    const { isOwner } = await checkTestOwnership(ctx, args.testId);
    if (!isOwner) {
      throw new Error("You are not allowed to create a section for this test");
    }

    const lastSection = await ctx.db
      .query("testSection")
      .withIndex("by_test_id", (q) => q.eq("testId", args.testId))
      .filter((q) => q.lte(q.field("deletedAt"), 0))
      .collect();

    return await ctx.db.insert("testSection", {
      testId: args.testId,
      title: "",
      order: lastSection.length + 1,
    });
  },
});

export const update = mutation({
  args: {
    sectionId: v.id("testSection"),
    data: v.object({
      title: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.sectionId, args.data);
  },
});
