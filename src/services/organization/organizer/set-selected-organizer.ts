import db from '@/lib/db'
import { user } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function setSelectedOrganizer(userId: string, organizerId: string) {
  await db
    .update(user)
    .set({
      selectedOrganizerId: organizerId
    })
    .where(eq(user.id, userId))
}
