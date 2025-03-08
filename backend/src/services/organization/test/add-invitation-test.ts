import db from "../../../lib/db";
import { testInvitation } from "../../../lib/db/schema";

export async function addInvitationTest(testId: string, emails: string[]) {
  try {
    const res = await db
      .insert(testInvitation)
      .values(emails.map((email) => ({ email, testId })))
      .onConflictDoNothing({ target: [testInvitation.email, testInvitation.testId] })
      .returning();

    return res;
  } catch (error) {
    console.error("Error adding test invitations:", error);
    return [];
  }
}
