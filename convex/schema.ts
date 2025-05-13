import { defineSchema } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { users } from "./schemas/users";
import { organization } from "./schemas/organization";
import { organizer } from "./schemas/organizer";
import { test } from "./schemas/test";
import { question } from "./schemas/question";
import { testSection } from "./schemas/test.section";
import { whistlist } from "./schemas/whistlist";
export default defineSchema({
  ...authTables,
  users,
  organization,
  organizer,
  test,
  testSection,
  question,
  whistlist,
});
