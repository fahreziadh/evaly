import db from '@/lib/db'
import { organization, organizer, user } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function createOrganizer(userId: string) {
  const insertOrganization = await db
    .insert(organization)
    .values({
      name: 'My Organization'
    })
    .returning()

  if (!insertOrganization[0]) {
    throw new Error('Failed to create organization')
  }

  const insertOrganizer = await db
    .insert(organizer)
    .values({
      organizationId: insertOrganization[0].id,
      userId,
      level: 'owner'
    })
    .returning()

  if (!insertOrganizer[0]) {
    throw new Error('Failed to create organizer')
  }

  const updateUser = await db
    .update(user)
    .set({
      selectedOrganizerId: insertOrganizer[0].id
    })
    .where(eq(user.id, userId))

  if (!updateUser) {
    throw new Error('Failed to update user')
  }

  return { ...insertOrganizer[0], organization: insertOrganization[0] }
}
