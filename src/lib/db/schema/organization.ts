import { relations, sql } from 'drizzle-orm'
import { foreignKey, index, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core'
import { ulid } from 'ulidx'

import { user } from './user'

// Organization
export const organization = pgTable(
  'organization',
  {
    id: varchar('id', { length: 255 })
      .primaryKey()
      .$defaultFn(() => 'orgs-' + ulid()),
    name: varchar('name', { length: 255 }).notNull(),
    logoUrl: varchar('logo_url', { length: 255 }),
    type: varchar('type', {
      length: 50,
      enum: ['school', 'company', 'other']
    }).default('other'),
    createdAt: timestamp('created_at', {
      mode: 'string',
      withTimezone: true
    })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp('updated_at', {
      mode: 'string',
      withTimezone: true
    })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => new Date().toISOString()),
    deletedAt: timestamp('deleted_at', {
      mode: 'string',
      withTimezone: true
    })
  },
  table => ({
    organizationId: index('organization_id_idx').on(table.id)
  })
).enableRLS()

// Organizer
export const organizer = pgTable(
  'organizer',
  {
    id: varchar('id', { length: 255 })
      .primaryKey()
      .$defaultFn(() => 'org-' + ulid()),
    userId: varchar('user_id', { length: 255 }).notNull(),
    organizationId: varchar('organization_id', { length: 255 }).notNull(),
    level: varchar('level', { length: 10, enum: ['owner', 'admin'] }).notNull(),
    organizationRole: varchar('organizationRole', {
      length: 100,
      enum: ['teacher', 'hr', 'admin', 'other']
    }).default('other'),
    createdAt: timestamp('created_at', {
      mode: 'string',
      withTimezone: true
    })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp('updated_at', {
      mode: 'string',
      withTimezone: true
    })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => new Date().toISOString()),
    deletedAt: timestamp('deleted_at', {
      mode: 'string',
      withTimezone: true
    })
  },
  table => ({
    organizerIdIdx: index('organizer_id_idx').on(table.id),
    organizationIdOrganizationIdIdx: index('organization_organizer_id_idx').on(
      table.organizationId
    ),
    userFk: foreignKey({
      columns: [table.userId],
      foreignColumns: [user.id],
      name: 'organizer_user_fk'
    }).onDelete('cascade'),
    organizerUserIdx: index('organizer_user_idx').on(table.userId),
    organizationFk: foreignKey({
      columns: [table.organizationId],
      foreignColumns: [organization.id],
      name: 'organizer_organization_fk'
    }).onDelete('cascade')
  })
).enableRLS()

// Relations
export const organizationRelations = relations(organization, ({ many }) => ({
  organizers: many(organizer)
}))

export const organizerRelations = relations(organizer, ({ one }) => ({
  user: one(user, {
    fields: [organizer.userId],
    references: [user.id]
  }),
  organization: one(organization, {
    fields: [organizer.organizationId],
    references: [organization.id]
  })
}))

export type Organizer = typeof organizer.$inferSelect & {
  organization: typeof organization.$inferSelect
}
