import { env } from './env'

// Email interface definition
export interface EmailBody {
  from:
    | string
    | {
        name: string
        address: string
      }
  to: string | string[]
  subject: string
  text?: string
  html?: string
}

const config = {
  accessKeyId: env.EVALY_AWS_ACCESS_KEY_ID,
  secretAccessKey: env.EVALY_AWS_SECRET_ACCESS_KEY,
  region: 'ap-southeast-1' // currently we only support this region
}

/**
 * Sends an email using AWS SES via HTTP requests
 * Uses native Web Crypto API for signing (no external dependencies)
 *
 * @param emailData - The email content to send
 * @param config - AWS SES configuration
 * @returns Promise with the response data
 */
export async function sendEmail(
  emailData: EmailBody
): Promise<{ success: boolean; messageId: string; rawResponse: string }> {
  try {
    // Validate required fields
    if (!emailData.from || !emailData.to) {
      throw new Error('From and To email addresses are required')
    }

    // Validate that either text or html is provided, but not both
    if ((!emailData.text && !emailData.html) || (emailData.text && emailData.html)) {
      throw new Error('Exactly one of text or html must be provided')
    }

    // Get current date in required format for AWS
    const date = new Date()
    const amzDate = date.toISOString().replace(/[:\-]|\.\d{3}/g, '')
    const dateStamp = amzDate.substring(0, 8)

    // AWS SES API configuration
    const { region, accessKeyId, secretAccessKey } = config
    const service = 'ses'
    const host = `email.${region}.amazonaws.com`
    const endpoint = `https://${host}/`

    // Handle the 'from' field which can be a string or an object
    const sourceValue =
      typeof emailData.from === 'object'
        ? `${emailData.from.name} <${emailData.from.address}>`
        : emailData.from

    // Handle the 'to' field which can be a string or an array
    const toAddresses = Array.isArray(emailData.to) ? emailData.to[0] : emailData.to

    // Create params and only include the content type that was provided
    const paramsObj: Record<string, string> = {
      Action: 'SendEmail',
      Source: sourceValue,
      'Destination.ToAddresses.member.1': toAddresses,
      'Message.Subject.Data': emailData.subject || '',
      Version: '2010-12-01'
    }

    // Add only the content type that was provided
    if (emailData.text) {
      paramsObj['Message.Body.Text.Data'] = emailData.text
    } else if (emailData.html) {
      paramsObj['Message.Body.Html.Data'] = emailData.html
    }

    const params = new URLSearchParams(paramsObj).toString()

    // Create canonical request for AWS Signature v4
    const method = 'POST'
    const canonicalUri = '/'
    const canonicalQueryString = ''
    const canonicalHeaders = `content-type:application/x-www-form-urlencoded\nhost:${host}\nx-amz-date:${amzDate}\n`
    const signedHeaders = 'content-type;host;x-amz-date'
    const payloadHash = await sha256(params)
    const canonicalRequest = `${method}\n${canonicalUri}\n${canonicalQueryString}\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`

    // Create string to sign
    const algorithm = 'AWS4-HMAC-SHA256'
    const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`
    const stringToSign = `${algorithm}\n${amzDate}\n${credentialScope}\n${await sha256(canonicalRequest)}`

    // Calculate signature
    const signingKey = await getSignatureKey(
      secretAccessKey,
      dateStamp,
      region,
      service
    )
    const signature = await hmacSha256Hex(signingKey, stringToSign)

    // Create authorization header
    const authorizationHeader = `${algorithm} Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`

    // Send the request
    const response = await fetch(endpoint, {
      method: method,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'X-Amz-Date': amzDate,
        Authorization: authorizationHeader
      },
      body: params
    })

    const responseData = await response.text()

    if (!response.ok) {
      throw new Error(`SES API Error: ${response.status} - ${responseData}`)
    }

    return {
      success: true,
      messageId: extractMessageId(responseData),
      rawResponse: responseData
    }
  } catch (error) {
    console.error('Email sending failed:', error)
    throw error
  }
}

// Utility function to extract MessageId from XML response
function extractMessageId(xmlResponse: string): string {
  const match = xmlResponse.match(/<MessageId>(.*?)<\/MessageId>/)
  return match ? match[1] : ''
}

// Utility functions for AWS Signature v4 signing - using native Web Crypto API
async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message)
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer)
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

async function hmacSha256(
  key: ArrayBuffer | string,
  message: string
): Promise<ArrayBuffer> {
  const keyBuffer = key instanceof ArrayBuffer ? key : new TextEncoder().encode(key)
  const messageBuffer = new TextEncoder().encode(message)

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyBuffer,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )

  return await crypto.subtle.sign('HMAC', cryptoKey, messageBuffer)
}

async function hmacSha256Hex(
  key: ArrayBuffer | string,
  message: string
): Promise<string> {
  const result = await hmacSha256(key, message)
  return Array.from(new Uint8Array(result))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

async function getSignatureKey(
  key: string,
  dateStamp: string,
  region: string,
  service: string
): Promise<ArrayBuffer> {
  const kDate = await hmacSha256(`AWS4${key}`, dateStamp)
  const kRegion = await hmacSha256(kDate, region)
  const kService = await hmacSha256(kRegion, service)
  return await hmacSha256(kService, 'aws4_request')
}
