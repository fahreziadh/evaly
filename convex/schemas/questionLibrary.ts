import { defineTable } from "convex/server";
import { v } from "convex/values";

export const questionLibrary = defineTable({
  title: v.string(),
  description: v.optional(v.string()),
  organizationId: v.id("organization"),
  tags: v.optional(v.array(v.string())), // for categorization like "Math", "Science", etc.
  isPublic: v.optional(v.boolean()), // if this library can be shared across organizations
  questionCount: v.number(), // cached count for performance
  createdBy: v.id("users"), // track who created this library
  deletedAt: v.optional(v.number()),
}).index("by_organization_id", ["organizationId"])
  .index("by_created_by", ["createdBy"]);