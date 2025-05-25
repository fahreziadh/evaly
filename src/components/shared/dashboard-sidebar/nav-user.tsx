'use client'

import Image from 'next/image'

import { Building2, Home, LogOut, Settings, User } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { SidebarMenu, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar'

import { trpc } from '@/trpc/trpc.client'

import { LogoType } from '../logo'
import { useProgressRouter } from '../progress-bar'

export function NavUser() {
  return (
    <SidebarMenu className="flex flex-row items-center justify-between px-2">
      <LogoType href="/dashboard" />
      <SidebarMenuItem>
        <NavUserAccount />
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export const NavUserAccount = () => {
  const { isMobile } = useSidebar()
  const { data } = trpc.organization.profile.useQuery()
  const router = useProgressRouter()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size={'icon'} variant={'ghost'} className="rounded-full">
          <Avatar className="size-6 rounded-full">
            {data?.user?.image ? (
              <AvatarImage src={data?.user?.image} alt="User" asChild>
                <Image
                  src={data?.user?.image}
                  alt="User"
                  width={60}
                  height={60}
                  className="size-8 rounded-full"
                />
              </AvatarImage>
            ) : (
              <AvatarFallback>
                {data?.user?.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        side={isMobile ? 'bottom' : 'right'}
        align="start"
        sideOffset={4}
        alignOffset={4}
      >
        <DropdownMenuLabel className="flex flex-row gap-3">
          <Avatar className="size-8 rounded-full">
            {data?.user?.image ? (
              <AvatarImage src={data?.user?.image} alt="User" asChild>
                <Image
                  src={data?.user?.image}
                  alt="User"
                  width={32}
                  height={32}
                  className="size-8 rounded-full"
                />
              </AvatarImage>
            ) : (
              <AvatarFallback>
                {data?.user?.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{data?.user?.name || 'N/A'}</span>
            <span className="truncate text-xs">{data?.user?.email || 'N/A'}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => router.push('/dashboard/settings?tab=profile')}
        >
          <User className="mr-1 size-3.5" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push('/dashboard/settings?tab=organization')}
        >
          <Building2 className="mr-1 size-3.5" />
          Organization
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push('/dashboard/settings?tab=general')}
        >
          <Settings className="mr-1 size-3.5" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push('/')}>
          <Home className="mr-1 size-3.5" />
          Home
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            router.push('/logout')
          }}
        >
          <LogOut className="mr-1 size-3.5" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
