'use client'

import { useParams, useRouter } from 'next/navigation'

import { usePathname } from '@/i18n/navigation'
import React, { useEffect, useTransition } from 'react'

import LoadingScreen from '@/components/shared/loading/loading-screen'
import { SidebarProvider } from '@/components/ui/sidebar'

const Provider = ({
  children,
  isLoggedIn
}: {
  children: React.ReactNode
  isLoggedIn: boolean
}) => {
  const pathName = usePathname()
  const [isRedirecting, startRedirecting] = useTransition()
  const { locale } = useParams()
  const router = useRouter()

  useEffect(() => {
    if (!isLoggedIn && pathName) {
      startRedirecting(() => {
        router.replace(
          `/${locale}/login?callbackURL=${encodeURIComponent(`${pathName}`)}`
        )
      })
    }
  }, [pathName, locale, router, isLoggedIn])

  if (!pathName || isRedirecting) return <LoadingScreen />

  return <SidebarProvider>{children}</SidebarProvider>
}

export default Provider
