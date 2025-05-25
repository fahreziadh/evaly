import { TestType } from '@/types/test'

// For backwards compatibility, provide the original non-translated version
export const testTypeFormatter = (type?: TestType, t?: (key: string) => string) => {
  if (t) {
    switch (type) {
      case 'live':
        return t('liveTestType')
      case 'self-paced':
        return t('selfPacedTestType')
      default:
        return t('unknownTestType')
    }
  }

  // Fallback for when translation function is not provided
  switch (type) {
    case 'live':
      return 'Live test'
    case 'self-paced':
      return 'Self-Paced test'
    default:
      return 'Unknown test type'
  }
}

export const testTypeColor = (type?: TestType) => {
  switch (type) {
    case 'live':
      return 'bg-emerald-600/10 text-emerald-600 border border-emerald-600/10'
    case 'self-paced':
      return 'bg-blue-500/10 text-blue-500 border border-blue-500/10'
    default:
      return 'bg-gray-500/10 text-gray-500 border border-gray-500/10'
  }
}
