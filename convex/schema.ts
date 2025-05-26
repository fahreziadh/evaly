import { authTables } from '@convex-dev/auth/server'
import { defineSchema } from 'convex/server'

import { organization } from './schemas/organization'
import { organizer } from './schemas/organizer'
import { question } from './schemas/question'
import { test } from './schemas/test'
import { testPresence, testPresenceHeartbeats } from './schemas/test'
import { testAttempt, testAttemptAnswer } from './schemas/testAttempt'
import { testSection } from './schemas/testSection'
import { users } from './schemas/users'
import { whistlist } from './schemas/whistlist'

export default defineSchema({
  ...authTables,
  users,
  organization,
  organizer,
  test,
  testSection,
  question,
  whistlist,
  testAttempt,
  testAttemptAnswer,
  testPresence,
  testPresenceHeartbeats
})
