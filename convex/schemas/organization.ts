import { defineTable } from "convex/server";
import { v } from "convex/values";

export const organization = defineTable({
  name: v.string(),
  image: v.optional(v.string()),
  type: v.string(),
  deletedAt: v.optional(v.number()),
});
