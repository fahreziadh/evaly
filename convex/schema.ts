import { defineSchema } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { users } from "./schemas/users";
import { organization } from "./schemas/organization";
import { organizer } from "./schemas/organizer";
import { test } from "./schemas/test";
import { question } from "./schemas/question";
import { testSection } from "./schemas/testSection";
import { whistlist } from "./schemas/whistlist";
import { testAttempt, testAttemptAnswer } from "./schemas/testAttempt";
import { testPresence, testPresenceHeartbeats } from "./schemas/test";
export default defineSchema({
  ...authTables,
  users,
  organization,
  organizer,
  test,
  testSection,
  question,
  whistlist,
  testAttempt,
  testAttemptAnswer,
  testPresence,
  testPresenceHeartbeats,
});
