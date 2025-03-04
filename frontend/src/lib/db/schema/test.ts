import { sql } from "drizzle-orm";
import {
  boolean,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { ulid } from "ulidx";

export const test = pgTable("test", {
  id: varchar("id", { length: 255 })
    .primaryKey()
    .$defaultFn(() => "ts-" + ulid()),
  title: varchar("title", { length: 255 }),
  type: varchar("type", { length: 20, enum: ["live", "self-paced"] }).default("self-paced").notNull(),
  access: varchar("access", {length: 20, enum: ["public", "invite-only"]}),
  isPublished: boolean("is_published").default(false),
  description: text("description"),
  createdByOrganizerId: varchar("created_by_organizer_id", { // Someone that created this test
    length: 255,
  }).notNull(),
  organizationId: varchar("organization_id", { length: 255 }).notNull(), // Organization that owned this test
  heldAt: timestamp("held_at", {
    mode: "string",
    withTimezone: true,
  }),
  finishedAt: timestamp("finished_at", {
    mode: "string",
    withTimezone: true,
  }),
  createdAt: timestamp("created_at", {
    mode: "string",
    withTimezone: true,
  })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at", {
    mode: "string",
    withTimezone: true,
  })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => new Date().toISOString()),
  deletedAt: timestamp("deleted_at", {
    mode: "string",
    withTimezone: true,
  }),
});


// Types
export type Test = typeof test.$inferSelect;
export type InsertTest = typeof test.$inferInsert;
export type UpdateTest = Partial<InsertTest>;

// Zod
export const zodInsertTest = createInsertSchema(test);
export const zodUpdateTest = createInsertSchema(test).partial();
