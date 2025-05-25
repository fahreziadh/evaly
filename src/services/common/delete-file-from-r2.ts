import { env } from '@/lib/env'
import { R2_URL, client } from '@/lib/r2'

const BUCKET_NAME = env.CLOUDFLARE_BUCKET_NAME

export async function deleteFileFromR2(key: string, isWithCdnUrl = true) {
  let objectKey = key
  if (isWithCdnUrl) {
    // Remove the CDN URL prefix if present
    const cdnPrefix = `${env.CLOUDFLARE_CDN_URL}/`
    if (key.startsWith(cdnPrefix)) {
      objectKey = key.substring(cdnPrefix.length)
    } else {
      // If isWithCdnUrl is true but the prefix is not found, maybe log a warning or handle as needed
      console.warn(
        `Expected key to start with ${cdnPrefix}, but got ${key}. Attempting deletion with the provided key anyway.`
      )
    }
  }

  if (objectKey.startsWith('/')) {
    objectKey = objectKey.substring(1) // Remove leading slash if exists after manipulation
  }

  const url = `${R2_URL}/${BUCKET_NAME}/${objectKey}`
  const request = new Request(url, { method: 'DELETE' })
  const signedRequest = await client.sign(request)

  try {
    const response = await fetch(signedRequest)

    if (!response.ok) {
      // R2 returns 204 No Content on successful deletion
      if (response.status !== 204) {
        throw new Error(`Failed to delete file: ${response.statusText}`)
      }
    }
    console.log(`Successfully deleted ${objectKey} from R2.`)
  } catch (error) {
    console.error(`Error deleting file ${objectKey} from R2:`, error)
    throw error // Re-throw the error after logging
  }
}
