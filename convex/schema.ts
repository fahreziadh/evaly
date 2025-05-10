import { defineSchema } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { users } from "./schemas/users";
import { organization } from "./schemas/organization";
import { organizer } from "./schemas/organizer";
import { test } from "./schemas/test";

export default defineSchema({
  ...authTables,
  users,
  organization,
  organizer,
  test,
});
