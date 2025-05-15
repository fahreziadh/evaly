import { defineTable } from "convex/server";
import { v } from "convex/values";

export const whistlist = defineTable({
  email: v.string(),
})
