import { defineTable } from "convex/server";
import { v } from "convex/values";

export const organizer = defineTable({
  userId: v.id("users"),
  organizationId: v.id("organization"),
  level: v.union(v.literal("owner"), v.literal("admin")),
  organizationRole: v.union(v.literal("teacher"), v.literal("hr"), v.literal("admin"), v.literal("other")),
  deletedAt: v.optional(v.number()),
});