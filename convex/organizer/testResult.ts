import { v } from "convex/values";
import { query, mutation } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { checkTestOwnership } from "./test";
import type { DataModel, Id } from "../_generated/dataModel";

export const getProgress = query({
  args: {
    testId: v.id("test"),
  },
  async handler(ctx, args) {
    const user = await getAuthUserId(ctx);
    if (!user) {
      return null;
    }

    const { isOwner } = await checkTestOwnership(ctx, args.testId);
    if (!isOwner) {
      return null;
    }

    const testSections = await ctx.db
      .query("testSection")
      .withIndex("by_test_id", (q) => q.eq("testId", args.testId))
      .filter((q) => q.lte(q.field("deletedAt"), 0))
      .collect();

    // Show the the list of participants
    // Each participants generate the answers it should be as Map<questionId, testAttemptAnswer>
    const testAttempt = await ctx.db
      .query("testAttempt")
      .withIndex("by_test", (q) => q.eq("testId", args.testId))
      .filter((q) => q.lte(q.field("deletedAt"), 0))
      .collect();

    const progress = {
      workingInProgress: 0,
      submissions: 0,
      averageTime: 0, //in second
      completitionRate: 0, //in perentage
    };

    // Get All of the attempt grouped by participants
    const attemptByParticipant = new Map<
      Id<"users">,
      DataModel["testAttempt"]["document"][]
    >();
    for (const attempt of testAttempt) {
      const existings = attemptByParticipant.get(attempt.participantId);
      if (existings && existings.length > 0) {
        attemptByParticipant.set(attempt.participantId, [
          ...existings,
          attempt,
        ]);
      } else {
        attemptByParticipant.set(attempt.participantId, [attempt]);
      }
    }

    // Get Progress
    for (const [, attempts] of attemptByParticipant) {
      const isCompleted = attempts
        .map((e) => e.finishedAt !== undefined && e.finishedAt > 0)
        .filter((e) => e);

      if (isCompleted.length === testSections.length) {
        progress.submissions += 1;

        const finishedTime = attempts
          .map((e) => {
            if (!e.finishedAt) {
              return 0;
            }
            return e.finishedAt - e.startedAt;
          })
          .reduce((prev, curr) => prev + curr);

        progress.averageTime += finishedTime / 1000;
      } else {
        progress.workingInProgress += 1;
      }
    }

    // Calculate completion rate
    if (progress.submissions > 0) {
      progress.completitionRate = Math.round(
        (progress.submissions / attemptByParticipant.size) * 100
      );
    }

    return progress;
  },
});

// Calculate and store score for a test attempt
export const calculateAndStoreScore = mutation({
  args: {
    testAttemptId: v.id("testAttempt"),
  },
  async handler(ctx, args) {
    const user = await getAuthUserId(ctx);
    if (!user) {
      throw new Error("Unauthorized");
    }

    const testAttempt = await ctx.db.get(args.testAttemptId);
    if (!testAttempt) {
      throw new Error("Test attempt not found");
    }

    // Check if user owns the test
    const { isOwner } = await checkTestOwnership(ctx, testAttempt.testId);
    if (!isOwner) {
      throw new Error("Unauthorized");
    }

    // Get all questions for this test section
    const questions = await ctx.db
      .query("question")
      .withIndex("by_reference_id", (q) => q.eq("referenceId", testAttempt.testSectionId))
      .filter((q) => q.lte(q.field("deletedAt"), 0))
      .collect();

    // Get all answers for this test attempt
    const answers = await ctx.db
      .query("testAttemptAnswer")
      .withIndex("by_attempt", (q) => q.eq("testAttemptId", args.testAttemptId))
      .filter((q) => q.lte(q.field("deletedAt"), 0))
      .collect();

    let totalScore = 0;
    let maxPossibleScore = 0;

    // Calculate score for each question
    for (const question of questions) {
      const questionScore = question.pointValue || 1;
      maxPossibleScore += questionScore;

      const answer = answers.find(a => a.questionId === question._id);
      if (!answer) continue;

      let isCorrect = false;

      // Handle different question types
      if (question.type === "multiple-choice" || question.type === "yes-or-no") {
        if (question.options && answer.answerOptions) {
          // Get correct option IDs
          const correctOptionIds = question.options
            .filter(opt => opt.isCorrect)
            .map(opt => opt.id);

          // Check if answer matches exactly (for single-answer questions)
          if (!question.allowMultipleAnswers) {
            isCorrect = correctOptionIds.length === answer.answerOptions.length &&
                       correctOptionIds.every(id => answer.answerOptions!.includes(id));
          } else {
            // For multiple-answer questions, require all correct answers selected
            isCorrect = correctOptionIds.length === answer.answerOptions.length &&
                       correctOptionIds.every(id => answer.answerOptions!.includes(id)) &&
                       answer.answerOptions.every(id => correctOptionIds.includes(id));
          }
        }
      }

      // Update the answer with correctness
      await ctx.db.patch(answer._id, {
        isCorrect,
      });

      if (isCorrect) {
        totalScore += questionScore;
      }
    }

    return {
      totalScore,
      maxPossibleScore,
      percentage: maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0
    };
  },
});

// Get results with calculated scores for all participants
export const getResultsWithScores = query({
  args: {
    testId: v.id("test"),
  },
  async handler(ctx, args) {
    const user = await getAuthUserId(ctx);
    if (!user) {
      return null;
    }

    const { isOwner } = await checkTestOwnership(ctx, args.testId);
    if (!isOwner) {
      return null;
    }

    // Get all test sections for this test
    const testSections = await ctx.db
      .query("testSection")
      .withIndex("by_test_id", (q) => q.eq("testId", args.testId))
      .filter((q) => q.lte(q.field("deletedAt"), 0))
      .collect();

    // Get all test attempts for this test
    const testAttempts = await ctx.db
      .query("testAttempt")
      .withIndex("by_test", (q) => q.eq("testId", args.testId))
      .filter((q) => q.lte(q.field("deletedAt"), 0))
      .collect();

    // Group attempts by participant
    const participantResults = new Map<Id<"users">, {
      participantId: Id<"users">;
      participantName?: string;
      participantImage?: string;
      attempts: DataModel["testAttempt"]["document"][];
      totalScore: number;
      maxPossibleScore: number;
      percentage: number;
      isCompleted: boolean;
      completedSectionsCount: number;
      completedAt?: number;
    }>();

    // Calculate scores for each participant
    for (const attempt of testAttempts) {
      let existing = participantResults.get(attempt.participantId);
      if (!existing) {
        existing = {
          participantId: attempt.participantId,
          participantName: undefined,
          participantImage: undefined,
          attempts: [],
          totalScore: 0,
          maxPossibleScore: 0,
          percentage: 0,
          isCompleted: false,
          completedSectionsCount: 0,
        };
        participantResults.set(attempt.participantId, existing);
      }
      existing.attempts.push(attempt);
    }

    // Calculate scores for each participant
    for (const [, result] of participantResults) {
      let totalScore = 0;
      let maxPossibleScore = 0;
      let allCompleted = true;
      let latestCompletedAt = 0;
      let completedCount = 0;

      for (const attempt of result.attempts) {
        if (!attempt.finishedAt) {
          allCompleted = false;
          continue;
        }

        completedCount++;
        if (attempt.finishedAt > latestCompletedAt) {
          latestCompletedAt = attempt.finishedAt;
        }

        // Get questions for this section
        const questions = await ctx.db
          .query("question")
          .withIndex("by_reference_id", (q) => q.eq("referenceId", attempt.testSectionId))
          .filter((q) => q.lte(q.field("deletedAt"), 0))
          .collect();

        // Get answers for this attempt
        const answers = await ctx.db
          .query("testAttemptAnswer")
          .withIndex("by_attempt", (q) => q.eq("testAttemptId", attempt._id))
          .filter((q) => q.lte(q.field("deletedAt"), 0))
          .collect();

        // Calculate section score
        for (const question of questions) {
          const questionScore = question.pointValue || 1;
          maxPossibleScore += questionScore;

          const answer = answers.find(a => a.questionId === question._id);
          if (answer && answer.isCorrect) {
            totalScore += questionScore;
          }
        }
      }

      result.totalScore = totalScore;
      result.maxPossibleScore = maxPossibleScore;
      result.percentage = maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0;
      result.isCompleted = allCompleted && result.attempts.length === testSections.length;
      result.completedSectionsCount = completedCount;
      if (latestCompletedAt > 0) {
        result.completedAt = latestCompletedAt;
      }
    }

    // Fetch user data for all participants
    const results = Array.from(participantResults.values());
    for (const result of results) {
      const user = await ctx.db.get(result.participantId);
      if (user) {
        result.participantName = user.name;
        result.participantImage = user.image;
      }
    }

    return results.sort((a, b) => b.percentage - a.percentage); // Sort by highest score first
  },
});

export const getSummary = query({
  args: {
    testId: v.id("test"),
    testSectionId: v.id("testSection"),
  },
  async handler(ctx, { testId, testSectionId }) {
    const user = await getAuthUserId(ctx);
    if (!user) {
      return null;
    }

    const { isOwner } = await checkTestOwnership(ctx, testId);
    if (!isOwner) {
      return null;
    }

    const testSection = await ctx.db.get(testSectionId);
    if (testSection?.testId !== testId) return null;

    const questions = await ctx.db
      .query("question")
      .withIndex("by_reference_id", (q) => q.eq("referenceId", testSectionId))
      .filter((q) => q.lte(q.field("deletedAt"), 0))
      .collect();

    const questionsOrdered = questions.sort((a, b) => a.order - b.order);

    // Get all answers
    const answers = await ctx.db
      .query("testAttemptAnswer")
      .withIndex("by_section", (q) => q.eq("testSectionId", testSectionId))
      .filter((q) => q.lte(q.field("deletedAt"), 0))
      .collect();

    const summary: {
      [questionId: Id<"question">]: {
        optionsAnswer: { [optionId: string]: number };
      };
    } = {};

    for (const question of questionsOrdered) {
      // Initialize the question entry in summary first
      summary[question._id] = {
        optionsAnswer: {}
      };

      const answer = answers.filter((e) => e.questionId === question._id);
      
      if (question.options) {
        for (const option of question.options) {
          const total = answer.filter((f) => f.answerOptions?.includes(option.id)).length;
          summary[question._id].optionsAnswer[option.id] = total;
        }
      }
    }

    return summary;
  },
});

/**
 * Helper function to determine if an answer is correct for a given question
 */

// Get comprehensive analytics for a test
export const getComprehensiveAnalytics = query({
  args: {
    testId: v.id("test"),
  },
  async handler(ctx, args) {
    const user = await getAuthUserId(ctx);
    if (!user) {
      return null;
    }

    const { isOwner } = await checkTestOwnership(ctx, args.testId);
    if (!isOwner) {
      return null;
    }

    // Get test and sections
    const test = await ctx.db.get(args.testId);
    if (!test) return null;

    const testSections = await ctx.db
      .query("testSection")
      .withIndex("by_test_id", (q) => q.eq("testId", args.testId))
      .filter((q) => q.lte(q.field("deletedAt"), 0))
      .collect();

    // Get all questions
    const allQuestions = await Promise.all(
      testSections.map(async (section) => {
        const questions = await ctx.db
          .query("question")
          .withIndex("by_reference_id", (q) => q.eq("referenceId", section._id))
          .filter((q) => q.lte(q.field("deletedAt"), 0))
          .collect();
        return { sectionId: section._id, sectionTitle: section.title, questions };
      })
    );

    // Get all attempts
    const allAttempts = await ctx.db
      .query("testAttempt")
      .withIndex("by_test", (q) => q.eq("testId", args.testId))
      .filter((q) => q.lte(q.field("deletedAt"), 0))
      .collect();

    // Calculate statistics
    const participantIds = new Set(allAttempts.map(a => a.participantId));
    const completedParticipants = new Set<Id<"users">>();
    const participantScores: number[] = [];
    const timeSpent: number[] = [];
    const questionDifficulty = new Map<Id<"question">, { correct: number; total: number; }>();

    // Group attempts by participant
    const participantAttempts = new Map<Id<"users">, typeof allAttempts>();
    for (const attempt of allAttempts) {
      const existing = participantAttempts.get(attempt.participantId) || [];
      existing.push(attempt);
      participantAttempts.set(attempt.participantId, existing);
    }

    // Analyze each participant's performance
    for (const [participantId, attempts] of participantAttempts) {
      let totalScore = 0;
      let maxPossibleScore = 0;
      let totalTime = 0;
      const completedSections = attempts.filter(a => a.finishedAt);

      if (completedSections.length === testSections.length) {
        completedParticipants.add(participantId);
      }

      for (const attempt of attempts) {
        if (attempt.finishedAt) {
          totalTime += attempt.finishedAt - attempt.startedAt;

          // Get answers for this attempt
          const answers = await ctx.db
            .query("testAttemptAnswer")
            .withIndex("by_attempt", (q) => q.eq("testAttemptId", attempt._id))
            .filter((q) => q.lte(q.field("deletedAt"), 0))
            .collect();

          // Get questions for this section
          const sectionData = allQuestions.find(q => q.sectionId === attempt.testSectionId);
          if (sectionData) {
            for (const question of sectionData.questions) {
              const pointValue = question.pointValue || 1;
              maxPossibleScore += pointValue;

              const answer = answers.find(a => a.questionId === question._id);
              
              // Track question difficulty
              const difficulty = questionDifficulty.get(question._id) || { correct: 0, total: 0 };
              difficulty.total++;
              
              if (answer?.isCorrect) {
                totalScore += pointValue;
                difficulty.correct++;
              }
              
              questionDifficulty.set(question._id, difficulty);
            }
          }
        }
      }

      if (maxPossibleScore > 0 && completedSections.length > 0) {
        participantScores.push((totalScore / maxPossibleScore) * 100);
        timeSpent.push(totalTime / 1000); // Convert to seconds
      }
    }

    // Calculate aggregate statistics
    const avgScore = participantScores.length > 0 
      ? participantScores.reduce((a, b) => a + b, 0) / participantScores.length 
      : 0;
    
    const medianScore = participantScores.length > 0
      ? participantScores.sort((a, b) => a - b)[Math.floor(participantScores.length / 2)]
      : 0;

    const avgTime = timeSpent.length > 0
      ? timeSpent.reduce((a, b) => a + b, 0) / timeSpent.length
      : 0;

    // Find hardest and easiest questions
    const questionStats = Array.from(questionDifficulty.entries()).map(([questionId, stats]) => {
      const question = allQuestions.flatMap(s => s.questions).find(q => q._id === questionId);
      return {
        questionId,
        question: question?.question || "",
        successRate: stats.total > 0 ? (stats.correct / stats.total) * 100 : 0,
        totalAttempts: stats.total,
        correctAttempts: stats.correct,
      };
    });

    const hardestQuestions = questionStats.sort((a, b) => a.successRate - b.successRate).slice(0, 5);
    const easiestQuestions = questionStats.sort((a, b) => b.successRate - a.successRate).slice(0, 5);

    // Score distribution (for histogram)
    const scoreDistribution = {
      "0-20": participantScores.filter(s => s >= 0 && s < 20).length,
      "20-40": participantScores.filter(s => s >= 20 && s < 40).length,
      "40-60": participantScores.filter(s => s >= 40 && s < 60).length,
      "60-80": participantScores.filter(s => s >= 60 && s < 80).length,
      "80-100": participantScores.filter(s => s >= 80 && s <= 100).length,
    };

    return {
      testTitle: test.title,
      overview: {
        totalParticipants: participantIds.size,
        completedParticipants: completedParticipants.size,
        completionRate: participantIds.size > 0 
          ? (completedParticipants.size / participantIds.size) * 100 
          : 0,
        averageScore: Math.round(avgScore * 10) / 10,
        medianScore: Math.round(medianScore * 10) / 10,
        highestScore: Math.max(...participantScores, 0),
        lowestScore: Math.min(...participantScores, 100),
        averageTimeSpent: Math.round(avgTime), // in seconds
      },
      scoreDistribution,
      hardestQuestions,
      easiestQuestions,
      sectionAnalysis: await Promise.all(testSections.map(async (section) => {
        const sectionData = allQuestions.find(q => q.sectionId === section._id);
        const sectionAttempts = allAttempts.filter(a => a.testSectionId === section._id && a.finishedAt);
        
        let sectionTotalScore = 0;
        let sectionMaxScore = 0;
        let sectionParticipants = 0;

        for (const attempt of sectionAttempts) {
          const answers = await ctx.db
            .query("testAttemptAnswer")
            .withIndex("by_attempt", (q) => q.eq("testAttemptId", attempt._id))
            .filter((q) => q.lte(q.field("deletedAt"), 0))
            .collect();

          if (sectionData) {
            sectionParticipants++;
            for (const question of sectionData.questions) {
              const pointValue = question.pointValue || 1;
              sectionMaxScore += pointValue;
              
              const answer = answers.find(a => a.questionId === question._id);
              if (answer?.isCorrect) {
                sectionTotalScore += pointValue;
              }
            }
          }
        }

        return {
          sectionId: section._id,
          sectionTitle: section.title,
          averageScore: sectionMaxScore > 0 && sectionParticipants > 0
            ? Math.round((sectionTotalScore / sectionMaxScore) * 100 / sectionParticipants * 10) / 10
            : 0,
          questionsCount: sectionData?.questions.length || 0,
          completedBy: sectionAttempts.length,
        };
      })),
    };
  },
});
