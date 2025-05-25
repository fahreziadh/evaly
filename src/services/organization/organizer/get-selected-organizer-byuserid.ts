import db from '@/lib/db'

import { setSelectedOrganizer } from './set-selected-organizer'

export async function getSelectedOrganizerByUserId(userId: string) {
  const userWithSelectedOrganizer = await db.query.user.findFirst({
    with: {
      selectedOrganizer: {
        with: {
          organization: true
        }
      }
    },
    where(fields, operators) {
      return operators.eq(fields.id, userId)
    }
  })

  // If there is a selected organizer by a user, just return it
  if (userWithSelectedOrganizer?.selectedOrganizer) {
    return userWithSelectedOrganizer?.selectedOrganizer
  }

  // If there is no selected organizer, find the first organizer available and update to user data with selected organizer
  const firstFoundOrganizer = await db.query.organizer.findFirst({
    with: {
      organization: true
    },
    orderBy(fields, operators) {
      return operators.desc(fields.createdAt)
    },
    where(fields, operators) {
      return operators.eq(fields.userId, userId)
    }
  })

  if (firstFoundOrganizer) {
    await setSelectedOrganizer(userId, firstFoundOrganizer.id)
    return firstFoundOrganizer
  }

  return undefined
}
