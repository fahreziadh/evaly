'use client'

import { CheckCircle } from 'lucide-react'
import { motion } from 'motion/react'
import { useTranslations } from 'next-intl'

const MotionDiv = motion.div

export const BenefitsSection = () => {
  const t = useTranslations('HomePage.benefits')

  const benefits = [
    {
      title: t('allInOne'),
      description: t('allInOneDesc')
    },
    {
      title: t('aiIntegration'),
      description: t('aiIntegrationDesc')
    },
    {
      title: t('dualMode'),
      description: t('dualModeDesc')
    },
    {
      title: t('security'),
      description: t('securityDesc')
    }
  ]

  return (
    <section className="py-20">
      <div className="container">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-bold">{t('title')}</h2>
          <div className="bg-foreground/10 text-foreground px-3 py-1 text-sm">
            {t('competitiveEdge')}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {benefits.map((benefit, i) => (
            <MotionDiv
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -10 : 10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: Math.floor(i / 2) * 0.1 }}
              viewport={{ once: true }}
              className="hover:bg-foreground/[0.02] border-border/40 flex gap-4 border p-4 transition-colors duration-300"
            >
              <div className="bg-foreground/10 flex h-10 w-10 flex-shrink-0 items-center justify-center">
                <CheckCircle className="text-foreground h-5 w-5" />
              </div>
              <div>
                <h3 className="mb-1 text-sm font-medium">{benefit.title}</h3>
                <p className="text-muted-foreground text-sm">{benefit.description}</p>
              </div>
            </MotionDiv>
          ))}
        </div>
      </div>
    </section>
  )
}
