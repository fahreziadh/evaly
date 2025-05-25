import { Link } from '@/i18n/navigation'
import { Github } from 'lucide-react'
import { useTranslations } from 'next-intl'

export const Footer = () => {
  const t = useTranslations('HomePage.footer')
  const landing = useTranslations('LandingPage')

  return (
    <footer className="border-border/40 bg-background border-t py-6">
      <div className="container">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="bg-foreground flex h-6 w-6 items-center justify-center rounded-full">
              <span className="text-background text-xs font-semibold">E</span>
            </div>
            <span className="font-semibold">Evaly</span>
          </div>
          <div className="flex flex-col items-center gap-4 md:flex-row md:gap-8">
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground text-xs transition-colors"
              >
                {landing('forSchools')}
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground text-xs transition-colors"
              >
                {landing('forCompanies')}
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground text-xs transition-colors"
              >
                {landing('pricing')}
              </Link>
              <a
                href="https://github.com/fahreziadh/evaly"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs transition-colors"
              >
                <Github className="h-3 w-3" />
                {t('openSource')}
              </a>
            </div>
            <div className="text-muted-foreground text-xs">
              {t('copyright').replace('2023', '2024')}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
