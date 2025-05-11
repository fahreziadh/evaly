import { getAuthSessionId, getAuthUserId, } from "@convex-dev/auth/server";
import { mutation, query } from "../_generated/server";

export const isAuthenticated = query({
  args: {},
  handler: async (ctx) => {
    const sessionId = await getAuthSessionId(ctx);
    return sessionId
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

    return user;
  },
});

export const createInitialOrganization = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return undefined;
    }

    // Create organization
    const organization = await ctx.db.insert("organization", {
      name: "My Organization",
      type: "other",
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
      selectedOrganizationId: organization,
      selectedOrganizerId: organizer,
    });

    return organization;
  },
});
