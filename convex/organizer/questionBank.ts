import { v } from "convex/values";
import { mutation, query, type QueryCtx } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { nanoid } from "nanoid";
import { type Id } from "../_generated/dataModel";

export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    isPublic: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const organizationId = user.selectedOrganizationId;
    if (!organizationId) {
      throw new Error("Organization not found");
    }

    const questionBankId = await ctx.db.insert("questionBank", {
      title: args.title,
      description: args.description,
      organizationId,
      tags: args.tags || [],
      isPublic: args.isPublic || false,
      questionCount: 0,
      createdBy: userId,
    });

    return questionBankId;
  },
});

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Unauthorized");
    }
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }
    const organizationId = user.selectedOrganizationId;
    if (!organizationId) {
      throw new Error("Organization not found");
    }

    const questionBanks = await ctx.db
      .query("questionBank")
      .withIndex("by_organization_id", (q) =>
        q.eq("organizationId", organizationId)
      )
      .filter((q) => 
        q.or(
          q.eq(q.field("deletedAt"), undefined),
          q.eq(q.field("deletedAt"), null)
        )
      )
      .collect();
    
    return questionBanks.sort((a, b) => b._creationTime - a._creationTime);
  },
});

export const getById = query({
  args: {
    id: v.id("questionBank"),
  },
  handler: async (ctx, args) => {
    const { isOwner } = await checkQuestionBankOwnership(ctx, args.id);
    if (!isOwner) {
      return undefined;
    }
    const questionBank = await ctx.db.get(args.id);
    if (!questionBank || questionBank.deletedAt) {
      return undefined;
    }
    return questionBank;
  },
});

export const update = mutation({
  args: {
    id: v.id("questionBank"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    isPublic: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { isOwner } = await checkQuestionBankOwnership(ctx, args.id);
    if (!isOwner) {
      throw new Error("Unauthorized");
    }

    const updateData: any = {};
    if (args.title !== undefined) updateData.title = args.title;
    if (args.description !== undefined) updateData.description = args.description;
    if (args.tags !== undefined) updateData.tags = args.tags;
    if (args.isPublic !== undefined) updateData.isPublic = args.isPublic;

    await ctx.db.patch(args.id, updateData);
    return args.id;
  },
});

export const deleteById = mutation({
  args: {
    id: v.id("questionBank"),
  },
  handler: async (ctx, args) => {
    const { isOwner } = await checkQuestionBankOwnership(ctx, args.id);
    if (!isOwner) {
      throw new Error("Unauthorized");
    }

    // Soft delete the question bank
    await ctx.db.patch(args.id, {
      deletedAt: Date.now(),
    });

    // Also soft delete all questions in this bank
    const questions = await ctx.db
      .query("question")
      .withIndex("by_reference_id", (q) =>
        q.eq("referenceId", args.id)
      )
      .filter((q) => 
        q.or(
          q.eq(q.field("deletedAt"), undefined),
          q.eq(q.field("deletedAt"), null)
        )
      )
      .collect();

    for (const question of questions) {
      await ctx.db.patch(question._id, {
        deletedAt: Date.now(),
      });
    }

    return args.id;
  },
});

// Get questions for a specific question bank
export const getQuestions = query({
  args: {
    questionBankId: v.id("questionBank"),
  },
  handler: async (ctx, args) => {
    const { isOwner } = await checkQuestionBankOwnership(ctx, args.questionBankId);
    if (!isOwner) {
      return [];
    }

    const questions = await ctx.db
      .query("question")
      .withIndex("by_reference_id", (q) =>
        q.eq("referenceId", args.questionBankId)
      )
      .filter((q) => 
        q.or(
          q.eq(q.field("deletedAt"), undefined),
          q.eq(q.field("deletedAt"), null)
        )
      )
      .collect();
    
    return questions.sort((a, b) => a.order - b.order);
  },
});

// Add question to question bank
export const addQuestion = mutation({
  args: {
    questionBankId: v.id("questionBank"),
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
    question: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { isOwner } = await checkQuestionBankOwnership(ctx, args.questionBankId);
    if (!isOwner) {
      throw new Error("Unauthorized");
    }

    const userId = await getAuthUserId(ctx);
    const user = await ctx.db.get(userId!);
    const organizationId = user!.selectedOrganizationId!;

    // Get current question count for ordering
    const existingQuestions = await ctx.db
      .query("question")
      .withIndex("by_reference_id", (q) =>
        q.eq("referenceId", args.questionBankId)
      )
      .filter((q) => 
        q.or(
          q.eq(q.field("deletedAt"), undefined),
          q.eq(q.field("deletedAt"), null)
        )
      )
      .collect();

    const nextOrder = existingQuestions.length + 1;

    // Create default options based on question type
    let options;
    if (args.type === "yes-or-no") {
      options = [
        { id: nanoid(5), text: "Yes", isCorrect: true },
        { id: nanoid(5), text: "No", isCorrect: false },
      ];
    } else if (args.type === "multiple-choice") {
      options = [
        { id: nanoid(5), text: "", isCorrect: true },
        { id: nanoid(5), text: "", isCorrect: false },
        { id: nanoid(5), text: "", isCorrect: false },
        { id: nanoid(5), text: "", isCorrect: false },
      ];
    }

    const questionId = await ctx.db.insert("question", {
      type: args.type,
      question: args.question || "<p></p>",
      referenceId: args.questionBankId,
      organizationId,
      order: nextOrder,
      options,
      allowMultipleAnswers: false,
    });

    // Update question count in the bank
    await ctx.db.patch(args.questionBankId, {
      questionCount: existingQuestions.length + 1,
    });

    return questionId;
  },
});

// Duplicate questions from question bank to test section
export const duplicateQuestionsToSection = mutation({
  args: {
    questionBankId: v.id("questionBank"),
    testSectionId: v.id("testSection"),
    questionIds: v.optional(v.array(v.id("question"))), // if empty, duplicate all questions
    startingOrder: v.optional(v.number()), // where to insert in the section
  },
  handler: async (ctx, args) => {
    const { isOwner } = await checkQuestionBankOwnership(ctx, args.questionBankId);
    if (!isOwner) {
      throw new Error("Unauthorized");
    }

    const userId = await getAuthUserId(ctx);
    const user = await ctx.db.get(userId!);
    const organizationId = user!.selectedOrganizationId!;

    // Get questions to duplicate
    let questionsToDuplicate;
    if (args.questionIds && args.questionIds.length > 0) {
      // Duplicate only selected questions
      questionsToDuplicate = await Promise.all(
        args.questionIds.map(id => ctx.db.get(id))
      );
      questionsToDuplicate = questionsToDuplicate
        .filter(q => q && !q.deletedAt)
        .sort((a, b) => a!.order - b!.order);
    } else {
      // Duplicate all questions in the bank
      questionsToDuplicate = await ctx.db
        .query("question")
        .withIndex("by_reference_id", (q) =>
          q.eq("referenceId", args.questionBankId)
        )
        .filter((q) => 
          q.or(
            q.eq(q.field("deletedAt"), undefined),
            q.eq(q.field("deletedAt"), null)
          )
        )
        .collect();
      questionsToDuplicate.sort((a, b) => a.order - b.order);
    }

    if (questionsToDuplicate.length === 0) {
      return [];
    }

    // Get existing questions in the target section for ordering
    const existingQuestions = await ctx.db
      .query("question")
      .withIndex("by_reference_id", (q) =>
        q.eq("referenceId", args.testSectionId)
      )
      .filter((q) => 
        q.or(
          q.eq(q.field("deletedAt"), undefined),
          q.eq(q.field("deletedAt"), null)
        )
      )
      .collect();

    const startOrder = args.startingOrder || existingQuestions.length + 1;

    // If inserting in the middle, update existing question orders
    if (startOrder <= existingQuestions.length) {
      const questionsToReorder = existingQuestions
        .filter(q => q.order >= startOrder)
        .sort((a, b) => b.order - a.order); // Sort descending to avoid conflicts

      for (const question of questionsToReorder) {
        await ctx.db.patch(question._id, {
          order: question.order + questionsToDuplicate.length,
        });
      }
    }

    // Duplicate questions
    const duplicatedQuestionIds: Id<"question">[] = [];
    
    for (let i = 0; i < questionsToDuplicate.length; i++) {
      const sourceQuestion = questionsToDuplicate[i]!;
      
      const duplicatedQuestionId = await ctx.db.insert("question", {
        type: sourceQuestion.type,
        question: sourceQuestion.question,
        referenceId: args.testSectionId,
        originalReferenceId: args.questionBankId, // Keep track of original bank
        organizationId,
        order: startOrder + i,
        options: sourceQuestion.options,
        allowMultipleAnswers: sourceQuestion.allowMultipleAnswers,
        pointValue: sourceQuestion.pointValue,
      });

      duplicatedQuestionIds.push(duplicatedQuestionId);
    }

    return duplicatedQuestionIds;
  },
});

async function checkQuestionBankOwnership(
  ctx: QueryCtx,
  questionBankId: Id<"questionBank">
) {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    return { isOwner: false, questionBank: undefined };
  }

  const user = await ctx.db.get(userId);
  if (!user) {
    return { isOwner: false, questionBank: undefined };
  }

  const questionBank = await ctx.db.get(questionBankId);
  const isOwner = questionBank?.organizationId === user.selectedOrganizationId;
  return { isOwner, questionBank };
}