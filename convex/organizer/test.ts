import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

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
      .collect();

    return tests;
  },
});

export const deleteTest = mutation({
  args: {
    testId: v.id("test"),
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
    if (!organizationId) {
      throw new Error("Organization not found");
    }

    const test = await ctx.db.get(args.testId);
    if (!test) {
      throw new Error("Test not found");
    }

    if (test.organizationId !== organizationId) {
      throw new Error("You are not allowed to delete this test");
    }

    await ctx.db.patch(args.testId, {
      deletedAt: Date.now(),
    });
  },
});
