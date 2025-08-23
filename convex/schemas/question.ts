import { defineTable } from "convex/server";
import { v } from "convex/values";

export const question = defineTable({
  question: v.string(),
  referenceId: v.string(), // points to testSectionId or questionLibraryId
  originalReferenceId: v.optional(v.string()), // original questionLibraryId when duplicated from library to section
  organizationId: v.id("organization"),
  order: v.number(),
  type: v.union(
    v.literal("multiple-choice"),
    v.literal("yes-or-no"),
    v.literal("text-field"),
    v.literal("file-upload"),
    v.literal("fill-the-blank"),
    v.literal("audio-response"),
    v.literal("video-response"),
    v.literal("dropdown"),
    v.literal("matching-pairs"),
    v.literal("slider-scale")
  ),
  pointValue: v.optional(v.number()),
  options: v.optional(
    v.array(
      v.object({
        id: v.string(),
        text: v.string(),
        isCorrect: v.boolean(),
        mediaUrl: v.optional(v.string()),
        mediaType: v.optional(v.string()),
        pointValue: v.optional(v.number()),
      })
    )
  ),
  allowMultipleAnswers: v.boolean(),
  deletedAt: v.optional(v.number()),
}).index("by_reference_id", ["referenceId"]);
