import { getAuthSessionId, getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "../_generated/server";
import { type Id } from "../_generated/dataModel";
import { v } from "convex/values";

export const isAuthenticated = query({
  args: {},
  handler: async (ctx) => {
    const sessionId = await getAuthSessionId(ctx);
    return sessionId;
  },
});

export const getProfile = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return undefined;
    }
    const user = await ctx.db
      .query("users")
      .withIndex("by_id", (q) => q.eq("_id", userId))
      .first();
    
    let organizer;
    let organization;

    if (user?.selectedOrganizerId) {
      organizer = await ctx.db
        .query("organizer")
        .withIndex("by_id", (q) => q.eq("_id", user?.selectedOrganizerId as Id<"organizer">))
        .first();
    }

    if (user?.selectedOrganizationId) {
      organization = await ctx.db
        .query("organization")
        .withIndex("by_id", (q) => q.eq("_id", user?.selectedOrganizationId as Id<"organization">))
        .first();
    }

    return {
      ...user,
      organizer,
      organization,
    };
  },
});

export const updateProfile = mutation({
  args: {
    name: v.string(),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return undefined;
    }

    await ctx.db.patch(userId, {
      name: args.name,
      image: args.image,
    });

    return {
      success: true,
    };
  },
});

export const createInitialOrganization = mutation({
  args: {
    fullName: v.string(),
    organizationName: v.string(),
    organizationType: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return undefined;
    }

    // Create organization
    const organization = await ctx.db.insert("organization", {
      name: args.organizationName,
      type: args.organizationType,
    });

    // Create organizer
    const organizer = await ctx.db.insert("organizer", {
      userId,
      organizationId: organization,
      level: "owner",
      organizationRole: "admin",
    });

    // Update user
    await ctx.db.patch(userId, {
      name: args.fullName,
      selectedOrganizationId: organization,
      selectedOrganizerId: organizer,
    });

    return organization;
  },
});
