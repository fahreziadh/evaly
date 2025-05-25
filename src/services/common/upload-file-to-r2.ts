import { env } from '@/lib/env'
import { R2_URL, client } from '@/lib/r2'

const MULTIPART_THRESHOLD = 20 * 1024 * 1024 // 20 MB
const CHUNK_SIZE = 10 * 1024 * 1024 // 10 MB
const BUCKET_NAME = env.CLOUDFLARE_BUCKET_NAME

export async function uploadFileToR2(file: File, key: string) {
  if (file.size < MULTIPART_THRESHOLD) {
    // Simple PUT upload for smaller files
    const url = `${R2_URL}/${BUCKET_NAME}/${key}`
    const request = new Request(url, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type,
        'Content-Length': file.size.toString()
      },
      body: file
    })

    const signedRequest = await client.sign(request)

    const response = await fetch(signedRequest)

    if (!response.ok) {
      throw new Error(`Failed to upload file: ${response.statusText}`)
    }
  } else {
    // Multipart upload for larger files
    const uploadId = await initiateMultipartUpload(key)
    const numberOfChunks = Math.ceil(file.size / CHUNK_SIZE)
    const parts: { ETag: string; PartNumber: number }[] = []
    const uploadPromises: Promise<{ ETag: string; PartNumber: number }>[] = []

    try {
      for (let i = 0; i < numberOfChunks; i++) {
        const start = i * CHUNK_SIZE
        const end = Math.min(start + CHUNK_SIZE, file.size)
        const chunk = file.slice(start, end)
        const partNumber = i + 1

        // Queue the upload part promise
        uploadPromises.push(
          uploadPart(key, uploadId, partNumber, chunk).catch(async err => {
            // If one part fails, try to abort the whole upload
            await abortMultipartUpload(key, uploadId)
            throw err // Re-throw the error after attempting abort
          })
        )
      }

      // Wait for all parts to upload
      const results = await Promise.all(uploadPromises)
      parts.push(...results)

      // Complete the multipart upload
      await completeMultipartUpload(key, uploadId, parts)
    } catch (error) {
      // Ensure abort is called if any step fails after initiation
      try {
        await abortMultipartUpload(key, uploadId)
      } catch (abortError) {
        console.error('Error trying to abort multipart upload:', abortError)
      }
      console.error('Multipart upload failed:', error)
      throw error // Re-throw the original error
    }
  }

  const finalUrl = `${env.CLOUDFLARE_CDN_URL}/${key}`

  // Return the final URL (assuming successful upload)
  return finalUrl
}

async function initiateMultipartUpload(key: string): Promise<string> {
  const url = `${R2_URL}/${BUCKET_NAME}/${key}?uploads`
  const request = new Request(url, { method: 'POST' })
  const signedRequest = await client.sign(request)

  const response = await fetch(signedRequest)
  if (!response.ok) {
    throw new Error(`Failed to initiate multipart upload: ${response.statusText}`)
  }

  const text = await response.text()
  const parser = new DOMParser()
  const xmlDoc = parser.parseFromString(text, 'application/xml')
  const uploadId = xmlDoc.getElementsByTagName('UploadId')[0]?.textContent

  if (!uploadId) {
    throw new Error('Could not parse UploadId from response')
  }
  return uploadId
}

async function uploadPart(
  key: string,
  uploadId: string,
  partNumber: number,
  chunk: Blob
): Promise<{ ETag: string; PartNumber: number }> {
  const url = `${R2_URL}/${BUCKET_NAME}/${key}?partNumber=${partNumber}&uploadId=${uploadId}`
  const request = new Request(url, { method: 'PUT', body: chunk })
  const signedRequest = await client.sign(request)

  const response = await fetch(signedRequest)
  if (!response.ok) {
    throw new Error(`Failed to upload part ${partNumber}: ${response.statusText}`)
  }

  const etag = response.headers.get('ETag')
  if (!etag) {
    throw new Error(`ETag not found for part ${partNumber}`)
  }

  return { ETag: etag, PartNumber: partNumber }
}

async function completeMultipartUpload(
  key: string,
  uploadId: string,
  parts: { ETag: string; PartNumber: number }[]
): Promise<void> {
  const url = `${R2_URL}/${BUCKET_NAME}/${key}?uploadId=${uploadId}`
  let xmlBody = '<CompleteMultipartUpload>'
  parts
    .sort((a, b) => a.PartNumber - b.PartNumber) // Parts must be sorted by PartNumber
    .forEach(part => {
      xmlBody += `<Part><PartNumber>${part.PartNumber}</PartNumber><ETag>${part.ETag}</ETag></Part>`
    })
  xmlBody += '</CompleteMultipartUpload>'

  const request = new Request(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/xml' },
    body: xmlBody
  })
  const signedRequest = await client.sign(request)

  const response = await fetch(signedRequest)
  if (!response.ok) {
    const errorText = await response.text()
    console.error('CompleteMultipartUpload error response:', errorText)
    throw new Error(`Failed to complete multipart upload: ${response.statusText}`)
  }
}

async function abortMultipartUpload(key: string, uploadId: string): Promise<void> {
  const url = `${R2_URL}/${BUCKET_NAME}/${key}?uploadId=${uploadId}`
  const request = new Request(url, { method: 'DELETE' })
  const signedRequest = await client.sign(request)

  const response = await fetch(signedRequest)
  if (!response.ok) {
    // Log error but don't throw, as the primary operation might have succeeded or failed already
    console.error(
      `Failed to abort multipart upload ${uploadId}: ${response.statusText}`
    )
  }
}
