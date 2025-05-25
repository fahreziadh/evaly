'use client'

import { usePathname } from '@/i18n/navigation'
import { BookOpen, Cog } from 'lucide-react'
import { Home } from 'lucide-react'
import { UserCircle } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useMemo, useState } from 'react'

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'

import { Link } from '../progress-bar'

const NavLinks = () => {
  const t = useTranslations('Navbar')
  const pathname = usePathname()
  const [activeItem, setActiveItem] = useState('/dashboard')

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
    <SidebarGroup>
      <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {navItems.map(item => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild isActive={activeItem === item.href}>
                <Link prefetch={true} href={item.href}>
                  {item.icon} {item.name}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}

export default NavLinks
