import { headers } from 'next/headers'

import { auth } from '@/lib/auth'
// path to your auth file
import { toNextJsHandler } from 'better-auth/next-js'

// Reconstruct request to fix 'n.get is not a function' error
const reconstructRequest = async (request: Request) => {
  const headersList = await headers()

  return new Request(request.url, {
    method: request.method,
    headers: headersList,
    body: request.body,
    duplex: 'half'
  } as RequestInit)
}

const handler = toNextJsHandler(auth)

export async function POST(request: Request) {
  const modifiedRequest = await reconstructRequest(request)
  return handler.POST(modifiedRequest)
}

export async function GET(request: Request) {
  const modifiedRequest = await reconstructRequest(request)
  return handler.GET(modifiedRequest)
}
