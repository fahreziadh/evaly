import { v } from "convex/values";
import { query } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get participant's own test results
export const getMyResults = query({
  args: {
    testId: v.id("test"),
  },
  async handler(ctx, args) {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    // Get all my test attempts for this test
    const myAttempts = await ctx.db
      .query("testAttempt")
      .withIndex("by_participant_test", (q) => 
        q.eq("participantId", userId).eq("testId", args.testId)
      )
      .filter((q) => q.lte(q.field("deletedAt"), 0))
      .collect();

    if (myAttempts.length === 0) {
      return null;
    }

    // Get all test sections for this test
    const testSections = await ctx.db
      .query("testSection")
      .withIndex("by_test_id", (q) => q.eq("testId", args.testId))
      .filter((q) => q.lte(q.field("deletedAt"), 0))
      .collect();

    let totalScore = 0;
    let maxPossibleScore = 0;
    let allCompleted = true;
    const sectionResults = [];

    // Calculate results for each section
    for (const attempt of myAttempts) {
      if (!attempt.finishedAt) {
        allCompleted = false;
        continue;
      }

      // Get questions for this section
      const questions = await ctx.db
        .query("question")
        .withIndex("by_reference_id", (q) => q.eq("referenceId", attempt.testSectionId))
        .filter((q) => q.lte(q.field("deletedAt"), 0))
        .collect();

      // Get my answers for this attempt
      const answers = await ctx.db
        .query("testAttemptAnswer")
        .withIndex("by_attempt", (q) => q.eq("testAttemptId", attempt._id))
        .filter((q) => q.lte(q.field("deletedAt"), 0))
        .collect();

      // Calculate section score
      let sectionScore = 0;
      let sectionMaxScore = 0;
      const questionResults = [];

      for (const question of questions.sort((a, b) => a.order - b.order)) {
        const questionScore = question.pointValue || 1;
        sectionMaxScore += questionScore;

        const answer = answers.find(a => a.questionId === question._id);
        const isCorrect = answer ? answer.isCorrect || false : false;

        if (isCorrect) {
          sectionScore += questionScore;
        }

        questionResults.push({
          questionId: question._id,
          question: question.question,
          type: question.type,
          options: question.options, // Show correct answers for review
          myAnswer: answer ? {
            answerText: answer.answerText,
            answerOptions: answer.answerOptions,
          } : null,
          isCorrect,
          pointValue: questionScore,
          scoreEarned: isCorrect ? questionScore : 0,
        });
      }

      totalScore += sectionScore;
      maxPossibleScore += sectionMaxScore;

      const section = testSections.find(s => s._id === attempt.testSectionId);
      sectionResults.push({
        sectionId: attempt.testSectionId,
        sectionTitle: section?.title || "Untitled Section",
        score: sectionScore,
        maxScore: sectionMaxScore,
        percentage: sectionMaxScore > 0 ? Math.round((sectionScore / sectionMaxScore) * 100) : 0,
        completedAt: attempt.finishedAt,
        duration: attempt.finishedAt - attempt.startedAt,
        questions: questionResults,
      });
    }

    const overallPercentage = maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0;

    return {
      testId: args.testId,
      totalScore,
      maxPossibleScore,
      percentage: overallPercentage,
      isCompleted: allCompleted && myAttempts.length === testSections.length,
      sectionsCount: testSections.length,
      completedSectionsCount: myAttempts.filter(a => a.finishedAt).length,
      sections: sectionResults,
      grade: getLetterGrade(overallPercentage),
    };
  },
});

// Helper function to determine letter grade
function getLetterGrade(percentage: number): string {
  if (percentage >= 90) return "A";
  if (percentage >= 80) return "B";
  if (percentage >= 70) return "C";
  if (percentage >= 60) return "D";
  return "F";
}

// Get quick summary of participant's results (for dashboard/list view)
export const getMyResultsSummary = query({
  args: {
    testId: v.id("test"),
  },
  async handler(ctx, args) {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return null;
    }

    // Get all my test attempts for this test
    const myAttempts = await ctx.db
      .query("testAttempt")
      .withIndex("by_participant_test", (q) => 
        q.eq("participantId", userId).eq("testId", args.testId)
      )
      .filter((q) => q.lte(q.field("deletedAt"), 0))
      .collect();

    if (myAttempts.length === 0) {
      return null;
    }

    // Get test info
    const test = await ctx.db.get(args.testId);
    if (!test) {
      return null;
    }

    const testSections = await ctx.db
      .query("testSection")
      .withIndex("by_test_id", (q) => q.eq("testId", args.testId))
      .filter((q) => q.lte(q.field("deletedAt"), 0))
      .collect();

    const completedAttempts = myAttempts.filter(a => a.finishedAt);
    const isCompleted = completedAttempts.length === testSections.length;
    const latestCompletedAt = Math.max(...completedAttempts.map(a => a.finishedAt || 0));

    // Quick score calculation (without detailed breakdown)
    let totalScore = 0;
    let maxPossibleScore = 0;

    for (const attempt of completedAttempts) {
      const answers = await ctx.db
        .query("testAttemptAnswer")
        .withIndex("by_attempt", (q) => q.eq("testAttemptId", attempt._id))
        .filter((q) => q.lte(q.field("deletedAt"), 0))
        .collect();

      const questions = await ctx.db
        .query("question")
        .withIndex("by_reference_id", (q) => q.eq("referenceId", attempt.testSectionId))
        .filter((q) => q.lte(q.field("deletedAt"), 0))
        .collect();

      for (const question of questions) {
        const questionScore = question.pointValue || 1;
        maxPossibleScore += questionScore;

        const answer = answers.find(a => a.questionId === question._id);
        if (answer && answer.isCorrect) {
          totalScore += questionScore;
        }
      }
    }

    const percentage = maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0;

    return {
      testId: args.testId,
      testTitle: test.title,
      totalScore,
      maxPossibleScore,
      percentage,
      grade: getLetterGrade(percentage),
      isCompleted,
      completedAt: isCompleted ? latestCompletedAt : undefined,
      sectionsCount: testSections.length,
      completedSectionsCount: completedAttempts.length,
    };
  },
});