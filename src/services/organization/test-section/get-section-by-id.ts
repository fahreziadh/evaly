import { and, count, eq, isNull } from "drizzle-orm/sql";
import db from "../../../lib/db";
import { question } from "../../../lib/db/schema";

export async function getSectionById(sectionId: string) {
  const section = await db.query.testSection.findFirst({
    where(fields, { and, eq, isNull }) {
      return and(eq(fields.id, sectionId), isNull(fields.deletedAt));
    },
  });

  if (!section) {
    throw new Error("Section not found");
  }

  const numOfQuestions = await db
    .select({
      count: count(),
    })
    .from(question)
    .where(
      and(eq(question.referenceId, sectionId), isNull(question.deletedAt))
    );

  return {
    ...section,
    numOfQuestions: numOfQuestions[0]?.count,
  };
}
