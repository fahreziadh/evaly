import { Github } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Link } from './progress-bar'

const ComingSoon = () => {
  const t = useTranslations('ComingSoonPage')
  const homePage = useTranslations('HomePage')
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 text-center">
      <h1 className="mt-6 mb-6 max-w-3xl text-3xl font-semibold text-balance md:text-5xl lg:text-6xl">
        {t('title', { defaultValue: 'Coming Soon!' })}
      </h1>
      <Link href="https://github.com/fahreziadh/evaly" target="_blank">
        <Button variant={'secondary'} className="mb-2 h-max p-1">
          <Badge>
            {homePage('hero.badge')}
            <Github />
          </Badge>
          <div className="bg-border hidden h-1 w-1 sm:block"></div>
          <div className="text-muted-foreground mr-3 hidden sm:block">
            {homePage('hero.openSource')}
          </div>
        </Button>
      </Link>
      {/* <Link href="/">
      <Button variant="outline">
        {t("backToHome", { defaultValue: "Back to Home" })}
      </Button>
    </Link> */}
    </main>
  )
}

export default ComingSoon
