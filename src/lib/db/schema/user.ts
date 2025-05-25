import { relations, sql } from 'drizzle-orm'
import { boolean, index, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core'

import { organizer } from './organization'

export const user = pgTable(
  'user',
  {
    id: varchar('id', { length: 255 }).primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    emailVerified: boolean('email_verified').notNull().default(false),
    image: varchar('image', { length: 255 }),
    selectedOrganizerId: varchar('selected_organizer_id', { length: 255 }),
    createdAt: timestamp('created_at', {
      mode: 'date',
      withTimezone: true
    })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp('updated_at', {
      mode: 'date',
      withTimezone: true
    })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => new Date())
  },
  table => ({
    emailIdx: index('email_idx').on(table.email)
  })
).enableRLS()

export const userRelations = relations(user, ({ many, one }) => ({
  sessions: many(session),
  accounts: many(account),
  organizer: many(organizer),
  selectedOrganizer: one(organizer, {
    fields: [user.selectedOrganizerId],
    references: [organizer.id]
  })
}))

export const session = pgTable(
  'session',
  {
    id: varchar('id', { length: 255 }).primaryKey(),
    userId: varchar('user_id', { length: 255 }).notNull(),
    token: varchar('token', { length: 255 }).notNull(),
    expiresAt: timestamp('expires_at', {
      mode: 'date',
      withTimezone: true
    }).notNull(),
    ipAddress: varchar('ip_address', { length: 255 }),
    userAgent: varchar('user_agent', { length: 255 }),
    createdAt: timestamp('created_at', {
      mode: 'date',
      withTimezone: true
    })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp('updated_at', {
      mode: 'date',
      withTimezone: true
    })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => new Date())
  },
  table => ({
    userIdIdx: index('user_id_idx').on(table.userId)
  })
).enableRLS()

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id]
  })
}))

export const account = pgTable(
  'account',
  {
    id: varchar('id', { length: 255 }).primaryKey(),
    userId: varchar('user_id', { length: 255 }).notNull(),
    accountId: varchar('account_id', { length: 255 }).notNull(),
    providerId: varchar('provider_id', { length: 255 }).notNull(),
    accessToken: text('access_token'),
    refreshToken: text('refresh_token'),
    accessTokenExpiresAt: timestamp('access_token_expires_at', {
      mode: 'date',
      withTimezone: true
    }),
    refreshTokenExpiresAt: timestamp('refresh_token_expires_at', {
      mode: 'date',
      withTimezone: true
    }),
    scope: varchar('scope', { length: 255 }),
    idToken: text('id_token'),
    password: varchar('password', { length: 255 }),
    createdAt: timestamp('created_at', {
      mode: 'date',
      withTimezone: true
    })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp('updated_at', {
      mode: 'date',
      withTimezone: true
    })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => new Date())
  },
  table => ({
    userIdIdx: index('user_account_id_idx').on(table.userId),
    providerIdx: index('provider_idx').on(table.providerId)
  })
).enableRLS()

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id]
  })
}))

export const verification = pgTable(
  'verification',
  {
    id: varchar('id', { length: 255 }).primaryKey(),
    identifier: varchar('identifier', { length: 255 }).notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at', {
      mode: 'date',
      withTimezone: true
    }).notNull(),
    createdAt: timestamp('created_at', {
      mode: 'date',
      withTimezone: true
    })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp('updated_at', {
      mode: 'date',
      withTimezone: true
    })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdate(() => new Date())
  },
  table => ({
    identifierIdx: index('identifier_idx').on(table.identifier)
  })
).enableRLS()
