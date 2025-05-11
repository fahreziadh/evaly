import { v } from "convex/values";
import { mutation, query, QueryCtx } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { Id } from "../_generated/dataModel";

export const createTest = mutation({
  args: {
    type: v.union(v.literal("live"), v.literal("self-paced")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not found");
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const organizationId = user.selectedOrganizationId;
    const organizerId = user.selectedOrganizerId;
    if (!organizationId || !organizerId) {
      throw new Error("Organization or organizer not found");
    }

    const test = await ctx.db.insert("test", {
      title: "",
      access: "public",
      createdByOrganizerId: organizerId,
      organizationId,
      isPublished: false,
      showResultImmediately: false,
      type: args.type,
    });

    await ctx.db.insert("testSection", {
      order: 1,
      testId: test,
      title: "",
    });

    return test;
  },
});

export const getTests = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      return [];
    }

    const organizationId = user.selectedOrganizationId;
    if (!organizationId) {
      return [];
    }

    const tests = await ctx.db
      .query("test")
      .withIndex("by_organization_id", (q) =>
        q.eq("organizationId", organizationId)
      )
      .filter((q) => q.eq(q.field("deletedAt"), undefined))
      .order("desc")
      .collect();

    return tests;
  },
});

export const deleteTest = mutation({
  args: {
    testId: v.id("test"),
  },
  handler: async (ctx, args) => {
    await checkAccess(ctx, args.testId);

    await ctx.db.patch(args.testId, {
      deletedAt: Date.now(),
    });
  },
});

export const getTestById = query({
  args: {
    testId: v.id("test"),
  },
  handler: async (ctx, args) => {
    await checkAccess(ctx, args.testId);

    const test = await ctx.db.get(args.testId);

    if (!test) {
      return null;
    }

    return test;
  },
});

export const updateTest = mutation({
  args: {
    testId: v.id("test"),
    data: v.object({
      title: v.string(),
      access: v.union(v.literal("public"), v.literal("private")),
      showResultImmediately: v.boolean(),
      isPublished: v.boolean(),
      type: v.union(v.literal("live"), v.literal("self-paced")),
      description: v.string(),
    }),
  },
  handler: async (ctx, args) => {
    await checkAccess(ctx, args.testId);

    await ctx.db.patch(args.testId, {
      title: args.data.title,
      access: args.data.access,
      showResultImmediately: args.data.showResultImmediately,
      isPublished: args.data.isPublished,
      type: args.data.type,
      description: args.data.description,
    });
  },
});

async function checkAccess(ctx: QueryCtx, testId: Id<"test">) {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error("User not found");
  }

  const user = await ctx.db.get(userId);
  if (!user) {
    throw new Error("User not found");
  }

  // check if the test is available
  const test = await ctx.db.get(testId);
  if (!test) {
    throw new Error("Test not found");
  }

  const organizationId = user.selectedOrganizationId;
  if (!organizationId) {
    throw new Error("Organization not found");
  }

  // check if the user is the owner of the test
  if (test.organizationId !== organizationId) {
    throw new Error("You are not allowed to access this test");
  }

  return true;
}
