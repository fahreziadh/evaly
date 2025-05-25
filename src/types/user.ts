import { user } from '../lib/db/schema'

export type OrganizerUser = typeof user.$inferSelect
export type OrganizerUserUpdate = Partial<typeof user.$inferInsert>
