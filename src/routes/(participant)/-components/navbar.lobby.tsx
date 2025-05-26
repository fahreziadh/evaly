import type { DataModel, Id } from '@convex/_generated/dataModel'
import { useParams } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

import { LogoType } from '@/components/shared/logo'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

import usePresence from '@/hooks/presence/use-presence'

import UpdateProfile from './update-profile'

const NavbarLobby = ({ user }: { user: DataModel['users']['document'] }) => {
  const { testId } = useParams({
    from: '/(participant)/s/$testId/'
  })
  const { updateData } = usePresence(testId as Id<'test'>, user._id, {})

  useEffect(() => {
    updateData({
      data: {
        testId: testId as Id<'test'>,
        testSectionId: undefined
      }
    })
  }, [testId])

  return (
    <div className="fixed top-0 flex h-14 w-full flex-row justify-between px-4">
      <div className="flex flex-row items-center gap-2">
        <LogoType />
      </div>
      <div className="flex flex-row items-center gap-2">
        <AccountDropdown user={user} />
      </div>
    </div>
  )
}

export const AccountDropdown = ({ user }: { user: DataModel['users']['document'] }) => {
  const [openProfileDialog, setOpenProfileDialog] = useState(false)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="transition hover:opacity-75">
        <Avatar>
          <AvatarImage src={user?.image} />
          <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end" className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setOpenProfileDialog(true)}>
          Update Profile
        </DropdownMenuItem>
        <DropdownMenuItem>Logout</DropdownMenuItem>
      </DropdownMenuContent>
      <UpdateProfile
        open={openProfileDialog}
        onClose={() => setOpenProfileDialog(false)}
      />
    </DropdownMenu>
  )
}

export default NavbarLobby
