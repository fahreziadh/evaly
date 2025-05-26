import { Link, useLocation } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

import { NavUser } from '../dashboard-sidebar/nav-user'

const DashboardNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = useLocation({
    select(state) {
      return state.pathname
    }
  })
  const [activeItem, setActiveItem] = useState('/dashboard')

  const navItems = [
    {
      name: 'Dashboard',
      href: '/app'
    },
    {
      name: 'Questions',
      href: '/app/questions'
    },
    {
      name: 'Participants',
      href: '/app/participants'
    },
    {
      name: 'Settings',
      href: '/app/settings'
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

  useEffect(() => {
    if (!window) return
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  return (
    <div
      className={cn(
        'bg-background sticky top-0 flex h-14 flex-row items-center justify-between border-b border-transparent px-4 md:px-6',
        isScrolled ? 'border-border' : ''
      )}
    >
      <div className="flex flex-row items-center gap-2">
        {/* <Button variant={"outline"} className="mr-8">
          <Building2 />
          SMK Adi Sanggoro
          <ChevronsUpDown />
        </Button> */}

        {navItems.map(e => (
          <Link to={e.href}>
            <button
              className={cn(
                'px-2 text-[15px] font-medium',
                activeItem === e.href
                  ? ''
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {e.name}
            </button>
          </Link>
        ))}
      </div>
      <div className="flex flex-row items-center gap-2">
        <NavUser />
      </div>
    </div>
  )
}

export default DashboardNavbar
