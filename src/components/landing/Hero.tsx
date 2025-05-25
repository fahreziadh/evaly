'use client'

import { Link } from '@/i18n/navigation'
import { Github } from 'lucide-react'
import { motion } from 'motion/react'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'

import { Badge } from '../ui/badge'

const MotionDiv = motion.div

export const Hero = () => {
  const t = useTranslations('HomePage')

  return (
    <section className="relative container flex h-[calc(100vh-56px)] max-w-3xl flex-col items-center justify-center overflow-hidden">
      <MotionDiv>
        <Link href="https://github.com/fahreziadh/evaly" target="_blank">
          <Button variant={'secondary'} className="mb-2 h-max p-1">
            <Badge>
              {t('hero.badge')}
              <Github />
            </Badge>
            <div className="bg-border hidden h-1 w-1 sm:block"></div>
            <div className="text-muted-foreground mr-3 hidden sm:block">
              {t('hero.openSource')}
            </div>
          </Button>
        </Link>

        <h1 className="mt-6 mb-6 max-w-3xl text-3xl font-semibold text-balance md:text-5xl lg:text-6xl">
          {t('hero.title')}
        </h1>

        <p className="text-primary/80 mb-8 max-w-2xl md:text-lg">
          {t('hero.subtitle')}
        </p>

        <div className="flex flex-wrap gap-4">
          <Link href="/dashboard">
            <Button size="lg" className="text-lg font-bold">
              {t('hero.getStarted')}
            </Button>
          </Link>
          {/* <Link href="#">
            <Button variant="outline" size="lg">
              {t("hero.watchDemo")}
            </Button>
          </Link> */}
        </div>
      </MotionDiv>
    </section>
  )
}
