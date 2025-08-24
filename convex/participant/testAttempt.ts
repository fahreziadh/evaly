import { ConvexError, v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const start = mutation({
  args: {
    testSectionId: v.id("testSection"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Unauthorized");
    }

    // Check Test Section
    const testSection = await ctx.db.get(args.testSectionId);
    if (!testSection) {
      throw new ConvexError("Test section not found");
    }

    const test = await ctx.db.get(testSection.testId);
    if (!test) {
      throw new ConvexError("Test not found");
    }

    // If the user has already started the test, return the current test attempt
    const currentTestAttempt = await ctx.db
      .query("testAttempt")
      .withIndex("by_participant_test_section", (q) =>
        q.eq("participantId", userId).eq("testSectionId", args.testSectionId)
      )
      .first();

    if (currentTestAttempt) {
      return currentTestAttempt;
    }

    // If not, create a new test attempt
    const newTestAttemptId = await ctx.db.insert("testAttempt", {
      participantId: userId,
      startedAt: Date.now(),
      testId: test._id,
      testSectionId: testSection._id,
    });

    const newTestAttempt = await ctx.db.get(newTestAttemptId);

    if (!newTestAttempt) {
      throw new ConvexError("Failed to create test attempt");
    }

    return newTestAttempt;
  },
});

export const getByTestIdAndParticipantId = query({
  args: {
    testId: v.id("test"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return [];
    }

    const testAttempt = await ctx.db
      .query("testAttempt")
      .withIndex("by_participant_test", (q) =>
        q.eq("participantId", userId).eq("testId", args.testId)
      )
      .collect();

    return testAttempt;
  },
});

export const getById = query({
  args: {
    id: v.id("testAttempt"),
  },
  handler: async (ctx, args) => {
    const testAttempt = await ctx.db.get(args.id);
    if (!testAttempt) {
      return null;
    }

    const questions = await ctx.db
      .query("question")
      .withIndex("by_reference_id", (q) =>
        q.eq("referenceId", testAttempt.testSectionId)
      )
      .filter((q) => q.lte(q.field("deletedAt"), 0))
      .collect();

    // Order questions by order and remove the answer from the question options
    const orderedQuestions = questions
      .sort((a, b) => a.order - b.order)
      .map((question) => {
        const options = question.options?.map((option) => {
          return {
            ...option,
            isCorrect: false,
          };
        });
        return {
          ...question,
          options,
        };
      });

    return {
      ...testAttempt,
      questions: orderedQuestions,
    };
  },
});

export const finish = mutation({
  args: {
    id: v.id("testAttempt"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new ConvexError("Unauthorized");
    }

    const testAttempt = await ctx.db.get(args.id);
    if (!testAttempt) {
      throw new ConvexError("Test attempt not found");
    }

    if (testAttempt.participantId !== userId) {
      throw new ConvexError("Unauthorized");
    }

    // Update the test attempt as finished
    await ctx.db.patch(args.id, {
      finishedAt: Date.now(),
    });

    // Automatically calculate scores for completed attempts
    try {
      // Get all questions for this test section
      const questions = await ctx.db
        .query("question")
        .withIndex("by_reference_id", (q) => q.eq("referenceId", testAttempt.testSectionId))
        .filter((q) => q.lte(q.field("deletedAt"), 0))
        .collect();

      // Get all answers for this test attempt
      const answers = await ctx.db
        .query("testAttemptAnswer")
        .withIndex("by_attempt", (q) => q.eq("testAttemptId", args.id))
        .filter((q) => q.lte(q.field("deletedAt"), 0))
        .collect();

      // Calculate score for each question and update answer correctness
      for (const question of questions) {
        const answer = answers.find(a => a.questionId === question._id);
        if (!answer) continue;

        let isCorrect = false;

        // Handle different question types
        switch (question.type) {
          case "multiple-choice":
          case "yes-or-no":
            if (question.options && answer.answerOptions) {
              // Get correct option IDs
              const correctOptionIds = question.options
                .filter(opt => opt.isCorrect)
                .map(opt => opt.id);

              // Check if answer matches exactly
              if (!question.allowMultipleAnswers) {
                // Single answer: exactly one correct option selected
                isCorrect = correctOptionIds.length === 1 &&
                           answer.answerOptions.length === 1 &&
                           correctOptionIds[0] === answer.answerOptions[0];
              } else {
                // Multiple answers: all and only correct options selected
                isCorrect = correctOptionIds.length === answer.answerOptions.length &&
                           correctOptionIds.every(id => answer.answerOptions!.includes(id)) &&
                           answer.answerOptions.every(id => correctOptionIds.includes(id));
              }
            }
            break;

          case "text-field":
          case "fill-the-blank":
            // For text questions, mark as manually graded for now
            // Organizers will need to grade these manually
            isCorrect = false;
            break;

          case "file-upload":
          case "audio-response":
          case "video-response":
            // For media upload questions, mark as manually graded
            // Organizers will need to grade these manually
            isCorrect = false;
            break;

          case "dropdown":
            // Dropdown works like single-choice multiple choice
            if (question.options && answer.answerOptions) {
              const correctOptionIds = question.options
                .filter(opt => opt.isCorrect)
                .map(opt => opt.id);
              
              isCorrect = correctOptionIds.length === 1 &&
                         answer.answerOptions.length === 1 &&
                         correctOptionIds[0] === answer.answerOptions[0];
            }
            break;

          case "matching-pairs":
          case "slider-scale":
            // For complex question types, mark as manually graded for now
            // Organizers will need to grade these manually
            isCorrect = false;
            break;

          default:
            // Unknown question type, needs manual grading
            isCorrect = false;
        }

        // Update the answer with correctness
        await ctx.db.patch(answer._id, {
          isCorrect,
        });
      }
    } catch (error) {
      // Log error but don't fail the finish operation
      console.error("Failed to calculate scores:", error);
    }

    return args.id;
  },
});
