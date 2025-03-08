import { boolean, pgTable, timestamp, varchar, uniqueIndex } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/relations";
import { ulid } from "ulidx";
import { test } from "./test";
import { user } from "./user";

export const testInvitation = pgTable(
  "test_invitation", 
  {
    id: varchar("id", { length: 255 })
      .primaryKey()
      .$defaultFn(() => "ti" + ulid()),
    testId: varchar("test_id", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    isEmailSent: boolean("is_email_sent").notNull().default(false),
    createdAt: timestamp("created_at", {
      mode: "string",
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", {
      mode: "string",
      withTimezone: true,
    })
      .notNull()
      .defaultNow(),
  },
  (table) => {
    return {
      emailTestIdUnique: uniqueIndex("email_test_id_unique").on(table.email, table.testId),
    };
  }
);

export const testInvitationRelations = relations(testInvitation, ({ one }) => ({
  test: one(test, {
    fields: [testInvitation.testId],
    references: [test.id],
  }),
  participant: one(user, {
    fields: [testInvitation.email],
    references: [user.email],
  }),
}));
