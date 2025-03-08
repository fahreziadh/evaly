import { asc, eq } from "drizzle-orm";
import db from "../../../lib/db";
import { testInvitation } from "../../../lib/db/schema/test.invitation";
import { user } from "../../../lib/db/schema";

export async function getInvitationListTest(testId: string) {
  const res = await db
    .select({
      id: testInvitation.id,
      email: testInvitation.email,
      isEmailSent: testInvitation.isEmailSent,
      createdAt: testInvitation.createdAt,
      updatedAt: testInvitation.updatedAt,
      testId: testInvitation.testId,
      name: user.name,
      image: user.image,
    })
    .from(testInvitation)
    .leftJoin(user, eq(testInvitation.email, user.email))
    .where(eq(testInvitation.testId, testId))
    .orderBy(asc(testInvitation.email));

  return res;
}
