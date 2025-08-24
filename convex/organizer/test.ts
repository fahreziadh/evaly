import { v } from "convex/values";
import { mutation, query, type QueryCtx } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { type Id } from "../_generated/dataModel";
import { internal } from "../_generated/api";

export const createTest = mutation({
  args: {
    type: v.union(v.literal("live"), v.literal("self-paced")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not found");
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const organizationId = user.selectedOrganizationId;
    const organizerId = user.selectedOrganizerId;
    if (!organizationId || !organizerId) {
      throw new Error("Organization or organizer not found");
    }

    const test = await ctx.db.insert("test", {
      title: "",
      access: "public",
      createdByOrganizerId: organizerId,
      organizationId,
      isPublished: false,
      showResultImmediately: false,
      type: args.type,
    });

    await ctx.db.insert("testSection", {
      order: 1,
      testId: test,
      title: "",
    });

    return test;
  },
});

export const getTests = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return [];
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      return [];
    }

    const organizationId = user.selectedOrganizationId;
    if (!organizationId) {
      return [];
    }

    const tests = await ctx.db
      .query("test")
      .withIndex("by_organization_id", (q) =>
        q.eq("organizationId", organizationId)
      )
      .filter((q) => q.lte(q.field("deletedAt"), 0))
      .order("desc")
      .collect();

    return tests;
  },
});

export const deleteTest = mutation({
  args: {
    testId: v.id("test"),
  },
  handler: async (ctx, args) => {
    const { isOwner, test } = await checkTestOwnership(ctx, args.testId);
    if (!isOwner || !test) {
      throw new Error("You are not allowed to delete this test");
    }

    // Cancel any scheduled jobs before deleting
    if (test.activationJobId) {
      try {
        await ctx.scheduler.cancel(test.activationJobId);
      } catch (error) {
        // Job might already be executed or canceled, continue with deletion
        console.warn(`Failed to cancel activation job ${test.activationJobId}:`, error);
      }
    }

    if (test.finishJobId) {
      try {
        await ctx.scheduler.cancel(test.finishJobId);
      } catch (error) {
        // Job might already be executed or canceled, continue with deletion
        console.warn(`Failed to cancel finish job ${test.finishJobId}:`, error);
      }
    }

    // Soft delete the test
    await ctx.db.patch(args.testId, {
      deletedAt: Date.now(),
    });
  },
});

export const getTestById = query({
  args: {
    testId: v.id("test"),
  },
  handler: async (ctx, args) => {
    const { isOwner, test } = await checkTestOwnership(ctx, args.testId);
    if (!isOwner) {
      return null;
    }

    if (!test) {
      return null;
    }

    return test;
  },
});

export const updateTest = mutation({
  args: {
    testId: v.id("test"),
    data: v.object({
      title: v.string(),
      access: v.union(v.literal("public"), v.literal("private")),
      showResultImmediately: v.boolean(),
      isPublished: v.boolean(),
      type: v.union(v.literal("live"), v.literal("self-paced")),
      description: v.optional(v.string()),
      finishedAt: v.optional(v.number()),
    }),
  },
  handler: async (ctx, args) => {
    const { isOwner } = await checkTestOwnership(ctx, args.testId);
    if (!isOwner) {
      throw new Error("You are not allowed to update this test");
    }

    await ctx.db.patch(args.testId, {
      title: args.data.title,
      access: args.data.access,
      showResultImmediately: args.data.showResultImmediately,
      isPublished: args.data.isPublished,
      type: args.data.type,
      description: args.data.description,
      finishedAt: args.data.finishedAt,
    });
  },
});

export const duplicateTest = mutation({
  args: {
    testId: v.id("test"),
  },
  handler: async (ctx, args) => {
    const { isOwner } = await checkTestOwnership(ctx, args.testId);
    if (!isOwner) {
      throw new Error("You are not allowed to duplicate this test");
    }

    // Duplicate the test
    const test = await ctx.db.get(args.testId);
    if (!test) {
      throw new Error("Test not found");
    }

    const newTestId = await ctx.db.insert("test", {
      title: `${test.title} (Copy)`,
      access: test.access,
      createdByOrganizerId: test.createdByOrganizerId,
      organizationId: test.organizationId,
      isPublished: false,
      showResultImmediately: test.showResultImmediately,
      type: test.type,
      description: test.description,
    });

    // Duplicate the all test sections
    const testSections = await ctx.db
      .query("testSection")
      .withIndex("by_test_id", (q) => q.eq("testId", args.testId))
      .filter((q) => q.lte(q.field("deletedAt"), 0))
      .collect();

    for (const testSection of testSections) {
      const newTestSectionId = await ctx.db.insert("testSection", {
        testId: newTestId,
        order: testSection.order,
        title: testSection.title,
        description: testSection.description,
        duration: testSection.duration,
      });

      // Duplicate the all test questions
      const testQuestions = await ctx.db
        .query("question")
        .withIndex("by_reference_id", (q) =>
          q.eq("referenceId", testSection._id)
        )
        .filter((q) => q.lte(q.field("deletedAt"), 0))
        .collect();

      for (const question of testQuestions) {
        await ctx.db.insert("question", {
          referenceId: newTestSectionId,
          allowMultipleAnswers: question.allowMultipleAnswers,
          order: question.order,
          organizationId: question.organizationId,
          pointValue: question.pointValue,
          question: question.question,
          type: question.type,
          options: question.options,
        });
      }
    }

    return newTestId;
  },
});

export async function checkTestOwnership(ctx: QueryCtx, testId: Id<"test">) {
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    return {
      isOwner: false,
      test: null,
    };
  }

  const user = await ctx.db.get(userId);
  if (!user) {
    return {
      isOwner: false,
      test: null,
    };
  }

  // check if the test is available
  const test = await ctx.db.get(testId);
  if (!test) {
    return {
      isOwner: false,
      test: null,
    };
  }

  const organizationId = user.selectedOrganizationId;
  if (!organizationId) {
    return {
      isOwner: false,
      test: null,
    };
  }

  // check if the user is the owner of the test
  if (test.organizationId !== organizationId) {
    return {
      isOwner: false,
      test: null,
    };
  }

  return {
    isOwner: true,
    test,
  };
}

/**
 * Publish a test with optional scheduling
 * Supports both immediate publishing and scheduled publishing
 */
export const publishTest = mutation({
  args: {
    testId: v.id("test"),
    startOption: v.union(v.literal("now"), v.literal("schedule")),
    scheduledStartAt: v.optional(v.number()),
    scheduledEndAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { testId, startOption, scheduledStartAt, scheduledEndAt } = args;
    
    // Check ownership
    const { isOwner, test } = await checkTestOwnership(ctx, testId);
    if (!isOwner || !test) {
      throw new Error("You are not allowed to publish this test");
    }

    // Cancel existing scheduled jobs if they exist (for rescheduling)
    if (test.activationJobId) {
      try {
        await ctx.scheduler.cancel(test.activationJobId);
      } catch (error) {
        console.warn(`Failed to cancel existing activation job:`, error);
      }
    }
    if (test.finishJobId) {
      try {
        await ctx.scheduler.cancel(test.finishJobId);
      } catch (error) {
        console.warn(`Failed to cancel existing finish job:`, error);
      }
    }

    let updates: any = {};
    let activationJobId: Id<"_scheduled_functions"> | undefined;
    let finishJobId: Id<"_scheduled_functions"> | undefined;

    // Handle start scheduling
    if (startOption === "now") {
      updates.isPublished = true;
      updates.scheduledStartAt = Date.now();
      updates.activationJobId = undefined; // Clear any existing job ID
    } else if (startOption === "schedule" && scheduledStartAt) {
      // Only set isPublished to false if test isn't already published
      // This allows rescheduling without unpublishing
      if (!test.isPublished) {
        updates.isPublished = false;
      }
      updates.scheduledStartAt = scheduledStartAt;
      
      // Only schedule activation if test isn't already active
      if (!test.isPublished || scheduledStartAt > Date.now()) {
        activationJobId = await ctx.scheduler.runAt(
          scheduledStartAt,
          internal.internal.test.activateTest,
          { testId }
        );
        updates.activationJobId = activationJobId;
      } else {
        updates.activationJobId = undefined;
      }
    } else {
      throw new Error("Invalid start option or missing scheduled start time");
    }

    // Handle end scheduling
    if (scheduledEndAt) {
      updates.scheduledEndAt = scheduledEndAt;
      
      // Only schedule finish if end time is in the future
      if (scheduledEndAt > Date.now()) {
        finishJobId = await ctx.scheduler.runAt(
          scheduledEndAt,
          internal.internal.test.finishTest,
          { testId }
        );
        updates.finishJobId = finishJobId;
      } else {
        updates.finishJobId = undefined;
      }
    } else {
      updates.scheduledEndAt = undefined;
      updates.finishJobId = undefined;
    }

    // Update the test
    await ctx.db.patch(testId, updates);

    return { success: true };
  }
});

/**
 * Update test schedule (change end date/duration while active)
 */
export const updateTestSchedule = mutation({
  args: {
    testId: v.id("test"),
    scheduledEndAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { testId, scheduledEndAt } = args;
    
    // Check ownership
    const { isOwner, test } = await checkTestOwnership(ctx, testId);
    if (!isOwner || !test) {
      throw new Error("You are not allowed to update this test schedule");
    }

    // Cancel existing finish job if it exists
    if (test.finishJobId) {
      await ctx.scheduler.cancel(test.finishJobId);
    }

    let updates: any = {
      scheduledEndAt,
      finishJobId: undefined
    };

    // Schedule new finish job if end date is provided
    if (scheduledEndAt) {
      const finishJobId = await ctx.scheduler.runAt(
        scheduledEndAt,
        internal.internal.test.finishTest,
        { testId }
      );
      updates.finishJobId = finishJobId;
    }

    await ctx.db.patch(testId, updates);

    return { success: true };
  }
});

/**
 * Stop/unpublish a test manually and cancel all scheduled jobs
 */
export const stopTest = mutation({
  args: {
    testId: v.id("test"),
  },
  handler: async (ctx, args) => {
    const { isOwner, test } = await checkTestOwnership(ctx, args.testId);
    if (!isOwner || !test) {
      throw new Error("You are not allowed to stop this test");
    }

    // Cancel any remaining scheduled jobs
    if (test.activationJobId) {
      try {
        await ctx.scheduler.cancel(test.activationJobId);
      } catch (error) {
        console.warn(`Failed to cancel activation job during stop:`, error);
      }
    }

    if (test.finishJobId) {
      try {
        await ctx.scheduler.cancel(test.finishJobId);
      } catch (error) {
        console.warn(`Failed to cancel finish job during stop:`, error);
      }
    }

    // Stop the test
    await ctx.db.patch(args.testId, {
      finishedAt: Date.now(),
      // Clear scheduler job IDs since we canceled them
      activationJobId: undefined,
      finishJobId: undefined,
    });

    return { success: true };
  },
});
