'use client'

import { api } from '@convex/_generated/api'
import { useQuery } from 'convex/react'
import { EllipsisVertical } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'

import { useIsMobile } from '@/hooks/use-mobile'

export const NavOrganization = () => {
  const isMobile = useIsMobile()
  const user = useQuery(api.organizer.profile.getProfile)

  const org = user?.organization

  if (!user) {
    return <Skeleton className="h-12 w-full" />
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex h-12 w-full flex-row items-center justify-start gap-2 text-sm hover:opacity-70">
          <Avatar className="size-8 rounded-lg">
            {org?.image ? (
              <AvatarImage src={org?.image} alt="User" asChild>
                <img src={org?.image} alt="User" width={100} height={100} />
              </AvatarImage>
            ) : (
              <AvatarFallback className="bg-foreground/10 rounded-lg">
                {org?.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="grid flex-1 text-start">
            <span className="font-medium">{org?.name}</span>
            <span className="text-muted-foreground text-xs">Free</span>
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
        <DropdownMenuLabel>Will be available soon</DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
