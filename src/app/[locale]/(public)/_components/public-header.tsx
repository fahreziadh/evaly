import { Github, Menu } from 'lucide-react'
import { useTranslations } from 'next-intl'

import DialogSelectLanguage from '@/components/shared/dialog/dialog-select-language'
import { LogoType } from '@/components/shared/logo'
import { Link } from '@/components/shared/progress-bar'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'

export function PublicHeader() {
  const t = useTranslations('HomePage')
  const landing = useTranslations('LandingPage')

  return (
    <header className="bg-background border-border/10 sticky top-0 z-50 border-b">
      <div className="container flex items-center justify-between py-3">
        <LogoType href="/" />

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-2 md:flex">
          <Link href="/schools">
            <Button variant="ghost">{landing('forSchools')}</Button>
          </Link>
          <Link href="/companies">
            <Button variant="ghost">{landing('forCompanies')}</Button>
          </Link>
          <Link href="/pricing" className="mr-4">
            <Button variant="ghost">{landing('pricing')}</Button>
          </Link>
          <a
            href="https://github.com/fahreziadh/evaly"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline">
              <Github className="mr-2 h-4 w-4" />
              {t('openSource')}
            </Button>
          </a>
          <DialogSelectLanguage />
          <Link href="/dashboard">
            <Button variant="default">{t('dashboard')}</Button>
          </Link>
        </div>

        {/* Mobile Navigation */}
        <div className="flex items-center gap-3 md:hidden">
          <Link href="/dashboard" className="mr-1">
            <Button variant="default" size="sm">
              {t('dashboard')}
            </Button>
          </Link>
          <DialogSelectLanguage />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="p-4">
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between">
                  <LogoType href="/" />
                  <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                </div>

                <nav className="mt-6 flex flex-col gap-1">
                  <Link href="/schools">
                    <Button
                      variant="ghost"
                      className="h-12 w-full justify-start text-base"
                    >
                      {landing('forSchools')}
                    </Button>
                  </Link>
                  <Link href="/companies">
                    <Button
                      variant="ghost"
                      className="h-12 w-full justify-start text-base"
                    >
                      {landing('forCompanies')}
                    </Button>
                  </Link>
                  <Link href="/pricing">
                    <Button
                      variant="ghost"
                      className="h-12 w-full justify-start text-base"
                    >
                      {landing('pricing')}
                    </Button>
                  </Link>
                  <div className="mt-2">
                    <a
                      href="https://github.com/fahreziadh/evaly"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full"
                    >
                      <Button variant="outline" className="mt-2 w-full justify-start">
                        <Github className="mr-2 h-4 w-4" />
                        {t('openSource')}
                      </Button>
                    </a>
                  </div>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
