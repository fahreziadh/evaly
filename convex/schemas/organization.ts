import { defineTable } from "convex/server";
import { v } from "convex/values";

export const organization = defineTable({
  name: v.string(),
  image: v.optional(v.string()),
  type: v.union(v.literal("school"), v.literal("company"), v.literal("other")),
  deletedAt: v.optional(v.number()),
});
