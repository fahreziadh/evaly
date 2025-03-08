import { test } from "../lib/db/schema/test";
import { testInvitation } from "../lib/db/schema/test.invitation";
import { testSession } from "../lib/db/schema/test.session";

export type Test = typeof test.$inferSelect;
export type InsertTest = typeof test.$inferInsert;
export type UpdateTest = Partial<InsertTest>;

export type TestSession = typeof testSession.$inferSelect & {
  numOfQuestions?: number;
};
export type InsertTestSession = typeof testSession.$inferInsert;
export type UpdateTestSession = Partial<InsertTestSession>;


export type TestInvitation = typeof testInvitation.$inferSelect & {
  name?: string | null;
  image?: string | null;
};
export type InsertTestInvitation = typeof testInvitation.$inferInsert;
export type UpdateTestInvitation = Partial<InsertTestInvitation>;