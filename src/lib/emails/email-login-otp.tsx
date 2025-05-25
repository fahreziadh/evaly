import { Container, Head, Hr, Section, Tailwind, Text } from '@react-email/components'
import * as React from 'react'

export default function EmailLoginOTPEmail({ otp }: { otp: string | number }) {
  return (
    <Tailwind>
      <Head>
        <title>Login Verification Code</title>
      </Head>
      <Container className="font-sans">
        <Section className="mx-auto my-8 max-w-md rounded-lg border border-gray-200 bg-white px-8 py-6">
          <Text className="mb-2 text-lg font-semibold text-gray-800">
            Evaly Login Verification
          </Text>
          <Hr className="my-4 border-gray-200" />
          <Text className="mb-4 text-gray-700">
            Please use the following verification code to complete your login:
          </Text>
          <Section className="mb-4 rounded-md bg-gray-50 px-6 py-4">
            <Text className="text-4xl font-bold tracking-wide text-gray-800">
              {otp}
            </Text>
          </Section>
          <Text className="mb-4 text-sm text-gray-600">
            This verification code will expire in 10 minutes for security purposes.
          </Text>
          <Hr className="my-4 border-gray-200" />
          <Text className="text-xs text-gray-500">
            If you did not request this code, please disregard this email or contact
            support.
          </Text>
          <Text className="text-xs text-gray-500">
            © {new Date().getFullYear()} Evaly. All rights reserved.
          </Text>
        </Section>
      </Container>
    </Tailwind>
  )
}

EmailLoginOTPEmail.PreviewProps = {
  otp: 123456
}
