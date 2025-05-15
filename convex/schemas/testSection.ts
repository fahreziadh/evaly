import { v } from "convex/values";
import { defineTable } from "convex/server";

export const testSection = defineTable({
  title: v.string(),
  duration: v.optional(v.number()),
  order: v.number(),
  testId: v.id("test"),
  description: v.optional(v.string()),
  deletedAt: v.optional(v.number()),
}).index("by_test_id", ["testId"]);
