import { Link, useLocation } from '@tanstack/react-router'
import { BookLock, Home, Settings, SquareUserRound } from 'lucide-react'
import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

import { LogoLink } from '../logo'
import { NavOrganization } from './nav-organization'
import { NavUser } from './nav-user'

const DashboardSidebar = ({ className }: { className?: string }) => {
  const pathname = useLocation({
    select(state) {
      return state.pathname
    }
  })
  const [activeItem, setActiveItem] = useState('/dashboard')

  const navItems = [
    {
      name: 'Dashboard',
      href: '/app',
      icon: Home
    },
    {
      name: 'Questions',
      href: '/app/questions',
      icon: BookLock
    },
    {
      name: 'Participants',
      href: '/app/participants',
      icon: SquareUserRound
    },
    {
      name: 'Settings',
      href: '/app/settings',
      icon: Settings
    }
  ]

  useEffect(() => {
    // Set active item based on pathname or keep it as state for demo
    if (pathname) {
      // Special case for /dashboard - only active for /dashboard or /dashboard/test/*
      if (pathname === '/app' || pathname.startsWith('/app/test')) {
        setActiveItem('/app')
      }
      // For other routes, find matching nav items
      else {
        const matchingItem = navItems
          .filter(item => item.href !== '/app' && pathname.startsWith(item.href))
          .sort((a, b) => b.href.length - a.href.length)[0]

        if (matchingItem) {
          setActiveItem(matchingItem.href)
        }
      }
    }
  }, [pathname, navItems])

  return (
    <div className={cn('flex flex-col', className)}>
      <div className="flex flex-col gap-4">
        <LogoLink href="/app" />
        <NavOrganization />
      </div>
      <div className="mt-6 flex flex-1 flex-col">
        {navItems.map(e => (
          <Link to={e.href} key={e.href}>
            <button
              className={cn(
                'flex w-full flex-row items-center gap-2 py-2 text-[15px] font-medium',
                activeItem === e.href
                  ? 'font-medium'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <e.icon className="size-4" />
              {e.name}
            </button>
          </Link>
        ))}
      </div>
      <div>
        <NavUser />
      </div>
    </div>
  )
}

export default DashboardSidebar
