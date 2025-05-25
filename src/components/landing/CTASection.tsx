'use client'

import { Link } from '@/i18n/navigation'
import { ArrowRight, TwitterIcon } from 'lucide-react'
import { motion } from 'motion/react'
import { useTranslations } from 'next-intl'

import { Button } from '@/components/ui/button'

const MotionDiv = motion.div

export const CTASection = () => {
  const t = useTranslations('HomePage.cta')

  return (
    <section className="bg-foreground/[0.02] relative py-20">
      <div className="bg-grid-pattern pointer-events-none absolute inset-0 opacity-[0.015]"></div>
      <div className="container text-center">
        <MotionDiv
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="bg-background border-border/40 rounded-2xl border p-8 shadow-sm">
            <h2 className="mb-3 text-2xl font-bold">{t('title')}</h2>
            <p className="text-muted-foreground mx-auto mb-6 max-w-[600px]">
              {t('subtitle')}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="https://evaly.io/dashboard">
                <Button variant="default" size="lg">
                  {t('button')} <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="https://x.com/evalyio">
                <Button variant="outline" size="lg">
                  <TwitterIcon />
                  {t('twitter')}
                </Button>
              </Link>
            </div>
          </div>
        </MotionDiv>
      </div>
    </section>
  )
}
