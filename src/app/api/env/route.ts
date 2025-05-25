import { NextResponse } from 'next/server'

import db from '@/lib/db'

export const GET = async () => {
  return NextResponse.json({
    env: process.env,
    testDb: await db.query.user.findFirst()
  })
}
