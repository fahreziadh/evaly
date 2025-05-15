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

export const testPresence = defineTable({
  testId: v.id("test"),
  participantId: v.string(),
  currentSectionId: v.optional(v.id("testSection")),
  currentQuestionId: v.optional(v.id("question")),
  latestJoinedAt: v.number(),
  present: v.boolean(),
  deletedAt: v.optional(v.number()),
  data: v.any()
})
  .index("by_test_id_present_join", [
    "testId",
    "present",
    "latestJoinedAt",
  ])
  .index("by_test_id_present_particiapnt", ["testId", "participantId"]);

export const testPresenceHeartbeats = defineTable({
  participantId: v.string(),
  testId: v.id("test"),
  markAsGone: v.id("_scheduled_functions"),
}).index("by_participant_test", ["participantId", "testId"]);

