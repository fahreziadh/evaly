import { defineTable } from "convex/server";
import { v } from "convex/values";

export const test = defineTable({
  title: v.string(),
  type: v.union(v.literal("live"), v.literal("self-paced")),
  access: v.union(v.literal("public"), v.literal("private")),
  organizationId: v.id("organization"),
  showResultImmediately: v.boolean(),
  isPublished: v.boolean(),
  description: v.optional(v.string()),
  createdByOrganizerId: v.id("organizer"),
  heldAt: v.optional(v.string()),
  finishedAt: v.optional(v.number()),
  deletedAt: v.optional(v.number()),
}).index("by_organization_id", ["organizationId"]);
