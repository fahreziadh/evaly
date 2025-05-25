import { useSearchParams } from 'next/navigation'

export const useGetCallbackUrl = () => {
  const searchParams = useSearchParams()
  const callbackURL = searchParams.get('callbackURL')

  if (!callbackURL) {
    return null
  }

  return callbackURL
}
