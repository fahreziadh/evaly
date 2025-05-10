import { test } from "@/lib/db/schema";
import { addInvitationTest } from "@/services/organization/test/add-invitation-test";
import { checkTestOwner } from "@/services/organization/test/check-test-owner";
import { createNewTest } from "@/services/organization/test/create-new-test";
import { deleteInvitationTest } from "@/services/organization/test/delete-invitation-test";
import { deleteTest } from "@/services/organization/test/delete-test";
import { getAllTestsByOrganizationId } from "@/services/organization/test/get-all-tests-by-organization-id";
import { getInvitationListTest } from "@/services/organization/test/get-invitation-list-test";
import { getSubmissionDetailsByEmail } from "@/services/organization/test/get-submission-details-by-email";
import { getTestById } from "@/services/organization/test/get-test-by-id";
import { getTestSubmissions } from "@/services/organization/test/get-test-submissions";
import { publishUnpublishTest } from "@/services/organization/test/publish-unpublish";
import { duplicateTest } from "@/services/organization/test/re-open-test";
import { updateTest } from "@/services/organization/test/update-test";
import { validateTestIsPublishable } from "@/services/organization/test/validate-test-is-publishable";
import { organizerProcedure, router } from "@/trpc";
import { createUpdateSchema } from "drizzle-zod";
import { z } from "zod";

export const testRouter = router({
  getAll: organizerProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(20),
      })
    )
    .query(async ({ ctx: { organizer }, input }) => {
      const organizationId = organizer.organizationId;
      return await getAllTestsByOrganizationId({
        organizationId,
        page: input.page,
        limit: input.limit,
      });
    }),

  create: organizerProcedure
    .input(
      z.object({
        type: z.enum(["live", "self-paced"]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const createdByOrganizerId = ctx.organizer.id;
      const organizationId = ctx.organizer.organizationId;

      return await createNewTest({
        createdByOrganizerId,
        organizationId,
        type: input.type,
      });
    }),

  getById: organizerProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const organizationId = ctx.organizer.organizationId;
      const testId = input.id;

      return await getTestById({
        organizationId,
        id: testId,
      });
    }),

  update: organizerProcedure
    .input(createUpdateSchema(test))
    .mutation(async ({ ctx, input }) => {
      const organizationId = ctx.organizer.organizationId;
      const testId = input.id;

      if (!testId) {
        throw new Error("Test ID is required");
      }

      return await updateTest({
        organizationId,
        id: testId,
        data: input,
      });
    }),

  delete: organizerProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const organizationId = ctx.organizer.organizationId;
      const testId = input.id;

      if (!testId) {
        throw new Error("Test ID is required");
      }

      await checkTestOwner(testId, organizationId);
      return await deleteTest(testId);
    }),

  invite: organizerProcedure
    .input(
      z.object({
        id: z.string(),
        emails: z.array(z.string().email()),
      })
    )
    .mutation(async ({ input }) => {
      const testId = input.id;
      const emails = input.emails;

      return await addInvitationTest(testId, emails);
    }),

  getInvites: organizerProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input }) => {
      const testId = input.id;

      return await getInvitationListTest(testId);
    }),

  deleteInvite: organizerProcedure
    .input(
      z.object({
        id: z.string(),
        email: z.string().email(),
      })
    )
    .mutation(async ({ input }) => {
      const testId = input.id;
      const email = input.email;

      return await deleteInvitationTest(testId, email);
    }),

  isPublishable: organizerProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const organizationId = ctx.organizer.organizationId;
      const testId = input.id;

      return await validateTestIsPublishable(testId, organizationId);
    }),

  publish: organizerProcedure
    .input(
      z.object({
        id: z.string(),
        isPublished: z.boolean(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const organizationId = ctx.organizer.organizationId;
      const testId = input.id;
      const isPublished = input.isPublished;
      return await publishUnpublishTest(testId, isPublished, organizationId);
    }),

  duplicateTest: organizerProcedure // aka re-open test
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const organizationId = ctx.organizer.organizationId;
      const testId = input.id;

      return await duplicateTest(testId, organizationId);
    }),

  // Deprecated
  getTestResults: organizerProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input }) => {
      const testId = input.id;

      return await getTestSubmissions(testId);
    }),

  // Deprecated
  getTestResultsByParticipant: organizerProcedure
    .input(
      z.object({
        id: z.string(),
        email: z.string().email(),
      })
    )
    .query(async ({ input }) => {
      const testId = input.id;
      const email = input.email;

      return await getSubmissionDetailsByEmail(testId, email);
    }),

  getResults: organizerProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({}) => {}),
});
