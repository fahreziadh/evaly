import { defineTable } from "convex/server";
import { v } from "convex/values";

export const testAttempt = defineTable({
  testSectionId: v.id("testSection"),
  testId: v.id("test"),
  participantId: v.id("users"),
  startedAt: v.number(),
  finishedAt: v.optional(v.number()),
  deletedAt: v.optional(v.number()),
}).index("by_participant_test_section", ["participantId", "testSectionId"]).index("by_participant_test", ["participantId", "testId"]);

export const testAttemptAnswer = defineTable({
  testAttemptId: v.id("testAttempt"),
  questionId: v.id("question"),
  answerText: v.optional(v.string()),
  answerOptions: v.optional(v.array(v.string())),
  answerMediaUrl: v.optional(v.string()),
  answerMediaMetadata: v.optional(
    v.object({
      extension: v.string(),
      size: v.number(),
      name: v.string(),
    })
  ),
  isCorrect: v.optional(v.boolean()),
  deletedAt: v.optional(v.number()),
})
  .index("by_attempt_and_question", ["testAttemptId", "questionId"])
  .index("by_attempt", ["testAttemptId"]);