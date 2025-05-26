'use client'

import { useAuthActions } from '@convex-dev/auth/react'
import { api } from '@convex/_generated/api'
import { useNavigate } from '@tanstack/react-router'
import { useQuery } from 'convex/react'
import { Building2, EllipsisVertical, Home, LogOut, Settings, User } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'

import { useIsMobile } from '@/hooks/use-mobile'

export const NavUser = () => {
  const isMobile = useIsMobile()
  const user = useQuery(api.organizer.profile.getProfile)
  const { signOut } = useAuthActions()
  const navigate = useNavigate()

  if (!user) {
    return <Skeleton className="h-12 w-full" />
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex h-12 w-full flex-row items-center justify-start gap-2 text-sm hover:opacity-70">
          <Avatar className="size-8 rounded-lg">
            {user?.image ? (
              <AvatarImage src={user?.image} alt="User" asChild>
                <img src={user?.image} alt="User" width={100} height={100} />
              </AvatarImage>
            ) : (
              <AvatarFallback className="bg-foreground/10 rounded-lg">
                {user?.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="grid flex-1 text-start">
            <span className="font-medium">{user.name}</span>
            <span className="text-muted-foreground text-xs">{user.email}</span>
          </div>
          <EllipsisVertical className="text-muted-foreground size-4" />
        </button>
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
            {user?.image ? (
              <AvatarImage src={user?.image} alt="User" asChild>
                <img
                  src={user?.image}
                  alt="User"
                  width={32}
                  height={32}
                  className="size-8 rounded-full"
                />
              </AvatarImage>
            ) : (
              <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
            )}
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{user?.name || 'N/A'}</span>
            <span className="truncate text-xs">{user?.email || 'N/A'}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate({ to: '/' })}>
          <User className="mr-1 size-3.5" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate({ to: '/' })}>
          <Building2 className="mr-1 size-3.5" />
          Organization
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate({ to: '/' })}>
          <Settings className="mr-1 size-3.5" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate({ to: '/' })}>
          <Home className="mr-1 size-3.5" />
          Home
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            signOut()
          }}
        >
          <LogOut className="mr-1 size-3.5" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
