'use client'

import { ChevronsUpDown, SchoolIcon } from 'lucide-react'

import { DropdownMenu, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@/components/ui/sidebar'
import { Skeleton } from '@/components/ui/skeleton'

import { trpc } from '@/trpc/trpc.client'

export function NavOrganization() {
  // const { isMobile } = useSidebar();
  const { data, isPending } = trpc.organization.profile.useQuery()

  if (isPending) return <Skeleton className="h-12 w-full" />

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size={'lg'}
              className="bg-secondary data-[state=open]:bg-sidebar-secondary data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-foreground/10 flex size-7 items-center justify-center rounded-md">
                <SchoolIcon className="stroke-foreground/80 size-5" />
              </div>
              <div className="ml-1 grid flex-1 text-left text-sm leading-tight">
                <span className="truncate">{data?.organizer?.organization.name}</span>
                <span className="text-muted-foreground text-xs">Free</span>
              </div>
              <ChevronsUpDown className="stroke-muted-foreground ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          {/* <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{data?.organizer?.organization.name}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent> */}
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
