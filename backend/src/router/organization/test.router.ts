import Elysia, { t } from "elysia";
import { organizationMiddleware } from "../../middlewares/auth.middleware";
import { getAllTestsByOrganizationId } from "../../services/organization/test/get-all-tests-by-organization-id";
import { createNewTest } from "../../services/organization/test/create-new-test";
import { getTestById } from "../../services/organization/test/get-test-by-id";
import { updateTest } from "../../services/organization/test/update-test";
import { createUpdateSchema } from "drizzle-typebox";
import { test } from "../../lib/db/schema";
import { testSessionRouter } from "./test.session.router";
import { checkTestOwner } from "../../services/organization/test/check-test-owner";
import { addInvitationTest } from "../../services/organization/test/add-invitation-test";
import { getInvitationListTest } from "../../services/organization/test/get-invitation-list-test";
import { deleteInvitationTest } from "../../services/organization/test/delete-invitation-test";

export const testRouter = new Elysia().group("/test", (app) => {
  return (
    app
      .derive(organizationMiddleware)

      // Get All Tests
      .get(
        "/all",
        async ({ query, organizer }) => {
          const organizationId = organizer.organizationId;
          return await getAllTestsByOrganizationId({
            organizationId,
            page: query.page,
            limit: query.limit,
          });
        },
        {
          query: t.Object({
            page: t.Number({ default: 1 }),
            limit: t.Number({ default: 20 }),
          }),
        }
      )

      // Create New Test
      .post(
        "/create",
        async ({ body, organizer }) => {
          const createdByOrganizerId = organizer.id;
          const organizationId = organizer.organizationId;

          return await createNewTest({
            createdByOrganizerId,
            organizationId,
            type: body.type,
          });
        },
        {
          body: t.Object({
            type: t.UnionEnum(["live", "self-paced"]),
          }),
        }
      )

      // Get Test By Id
      .get(
        "/:id",
        async ({ params, organizer, error }) => {
          const organizationId = organizer.organizationId;
          const testId = params.id;
          const data = await getTestById({
            organizationId,
            id: testId,
          });

          if (!data) {
            return error("Not Found", "Test not found");
          }

          return data;
        },
        {
          params: t.Object({
            id: t.String(),
          }),
        }
      )

      // Update Test
      .put(
        "/:id",
        async ({ params, body, organizer }) => {
          const organizationId = organizer.organizationId;
          const testId = params.id;

          return await updateTest({
            organizationId,
            id: testId,
            data: body,
          });
        },
        {
          params: t.Object({
            id: t.String(),
          }),
          body: createUpdateSchema(test, {}),
        }
      )

      // Add Invitation Test
      .post(
        "/:id/invitation",
        async ({ params, body, organizer }) => {
          const organizationId = organizer.organizationId;
          const testId = params.id;

          await checkTestOwner(testId, organizationId);
          const res = await addInvitationTest(testId, body.emails);
          return {data: res};
        },
        {
          params: t.Object({
            id: t.String(),
          }),
          body: t.Object({
            emails: t.Array(t.String({ format: "email" }), {
              minItems: 1,
            }),
          }),
        }
      )

      // Get Invitation List Test
      .get(
        "/:id/invitation",
        async ({ params, organizer }) => {
          const organizationId = organizer.organizationId;
          const testId = params.id;

          await checkTestOwner(testId, organizationId);
          const listInvitation = await getInvitationListTest(testId);
          return {
            data: listInvitation,
          };
        },
        {
          params: t.Object({
            id: t.String(),
          }),
        }
      )

      // Delete Invitation Test
      .delete(
        "/:id/invitation/:email",
        async ({ params, organizer }) => {
          const organizationId = organizer.organizationId;
          const testId = params.id;
          const email = params.email;

          await checkTestOwner(testId, organizationId);
          const res = await deleteInvitationTest(testId, email);
          return {data: res};
        },
        {
          params: t.Object({
            id: t.String(),
            email: t.String({ format: "email" }),
          }),
        }
      )
      .use(testSessionRouter)
  );
});
