import { defineRouting } from 'next-intl/routing'

import ZH from '../../public/flags/cn.svg'
import DE from '../../public/flags/de.svg'
import ES from '../../public/flags/es.svg'
import FR from '../../public/flags/fr.svg'
import ID from '../../public/flags/id.svg'
import IN from '../../public/flags/in.svg'
import JP from '../../public/flags/jp.svg'
import PT from '../../public/flags/pt.svg'
import RU from '../../public/flags/ru.svg'
import SA from '../../public/flags/sa.svg'
import US from '../../public/flags/us.svg'

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: [
    'en' // English
    // "id", // Indonesian
    // "jp", // Japanese
    // "zh", // Chinese
    // "de", // German
    // "es", // Spanish
    // "ar", // Arabic
    // "fr", // French
    // "hi", // Hindi
    // "pt", // Portuguese
    // "ru", // Russian
  ],

  // Used when no locale matches
  defaultLocale: 'en'
})

export const localesWithLabels: Record<string, { label: string; flag: string }> = {
  en: {
    label: 'English',
    flag: US
  },
  id: {
    label: 'Bahasa Indonesia',
    flag: ID
  },
  jp: {
    label: 'Japanese',
    flag: JP
  },
  zh: {
    label: 'Chinese',
    flag: ZH
  },
  de: {
    label: 'German',
    flag: DE
  },
  es: {
    label: 'Spanish',
    flag: ES
  },
  ar: {
    label: 'Arabic',
    flag: SA
  },
  fr: {
    label: 'French',
    flag: FR
  },
  hi: {
    label: 'Hindi',
    flag: IN
  },
  pt: {
    label: 'Portuguese',
    flag: PT
  },
  ru: {
    label: 'Russian',
    flag: RU
  }
}
