'use client'

import { usePathname } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import { BookOpen, Cog, Home, Menu, UserCircle, X } from 'lucide-react'
import { motion } from 'motion/react'
import { useTranslations } from 'next-intl'
import { useEffect, useMemo, useState } from 'react'

import { Button } from '@/components/ui/button'

import AdminAccount from './account/admin-account'
import DialogSelectLanguage from './dialog/dialog-select-language'
import { LogoType } from './logo'
import { Link } from './progress-bar'

export function DashboardNavbar({ className }: { className?: string }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const [activeItem, setActiveItem] = useState('/dashboard')
  const t = useTranslations('Navbar')

  const navItems = useMemo(
    () => [
      {
        name: t('dashboard'),
        href: '/dashboard',
        icon: <Home className="size-4" />
      },
      {
        name: t('question'),
        href: '/dashboard/question',
        icon: <BookOpen className="size-4" />
      },
      {
        name: t('participant'),
        href: '/dashboard/participant',
        icon: <UserCircle className="size-4" />
      },
      {
        name: t('settings'),
        href: '/dashboard/settings',
        icon: <Cog className="size-4" />
      }
    ],
    [t]
  )

  useEffect(() => {
    // Set active item based on pathname or keep it as state for demo
    if (pathname) {
      // Special case for /dashboard - only active for /dashboard or /dashboard/test/*
      if (pathname === '/dashboard' || pathname.startsWith('/dashboard/test')) {
        setActiveItem('/dashboard')
      }
      // For other routes, find matching nav items
      else {
        const matchingItem = navItems
          .filter(item => item.href !== '/dashboard' && pathname.startsWith(item.href))
          .sort((a, b) => b.href.length - a.href.length)[0]

        if (matchingItem) {
          setActiveItem(matchingItem.href)
        }
      }
    }
  }, [pathname, navItems])

  return (
    <nav
      className={cn(
        'bg-card sticky top-0 left-0 z-50 w-full border-b border-dashed transition-all',
        className
      )}
    >
      <div className="mx-auto h-12 px-3 md:px-6">
        <div className="flex h-full items-center justify-between">
          <div className="flex flex-row items-center">
            {/* Logo */}
            <LogoType href="/dashboard" />

            {/* Desktop Navigation */}
            <div className="ml-14 hidden items-center gap-2 text-sm font-medium md:flex">
              {navItems.map(item => (
                <Link key={item.href} href={item.href}>
                  <Button
                    size={'sm'}
                    variant={activeItem === item.href ? 'secondary' : 'ghost'}
                    className={cn(
                      'text-[15px] font-semibold transition-none',
                      activeItem === item.href
                        ? 'bg-foreground/10'
                        : 'text-muted-foreground'
                    )}
                  >
                    {/* {item.icon} */}
                    {item.name}
                  </Button>
                </Link>
              ))}
            </div>
          </div>

          {/* Search, Notifications, Profile */}
          <div className="flex items-center gap-3">
            {/* <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
            </Button> */}
            <DialogSelectLanguage />
            <AdminAccount />

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="bg-background z-50 space-y-4 py-4 md:hidden">
            {navItems.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative flex items-center px-3 py-2 font-medium transition-colors',
                  // Special case for dashboard
                  item.href === '/dashboard'
                    ? pathname === '/dashboard' ||
                      pathname.startsWith('/dashboard/test')
                      ? 'text-primary'
                      : 'hover:text-primary/80'
                    : pathname.startsWith(item.href)
                      ? 'text-primary'
                      : 'hover:text-primary/80'
                )}
                onClick={() => setActiveItem(item.href)}
              >
                {item.icon}
                {item.name}
                {activeItem === item.href && (
                  <motion.span
                    layoutId="navbar-active-indicator-mobile"
                    className="bg-muted/80 absolute inset-0 z-[-1]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
