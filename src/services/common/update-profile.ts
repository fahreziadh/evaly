import { eq } from 'drizzle-orm'

import db from '../../lib/db'
import { user } from '../../lib/db/schema'

export async function updateProfile(data: Partial<typeof user.$inferInsert>) {
  if (!data.id) {
    throw new Error('User ID is required')
  }

  const updatedUser = await db
    .update(user)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(user.id, data.id))
    .returning()

  if (!updatedUser[0]) {
    throw new Error('User not found')
  }

  return updatedUser[0]
}
