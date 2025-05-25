import { Building2, Home, LogOut, Settings, User } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { DropdownMenu } from '@/components/ui/dropdown-menu'
import { Image } from '@/components/ui/image'

import { trpc } from '@/trpc/trpc.client'

import { useProgressRouter } from '../progress-bar'

const AdminAccount = () => {
  const { data } = trpc.organization.profile.useQuery()
  const router = useProgressRouter()

  const email = data?.user?.email
  const name = data?.user?.name || email?.split('@')[0]
  const image = data?.user?.image

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 rounded-full p-0">
          <Avatar className="h-8 w-8">
            {image ? (
              <AvatarImage src={image} alt="User" asChild>
                <Image
                  src={image}
                  alt="User"
                  width={32}
                  height={32}
                  className="size-8 rounded-full"
                />
              </AvatarImage>
            ) : (
              <AvatarFallback>{email?.charAt(0).toUpperCase()}</AvatarFallback>
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Hi {name}</DropdownMenuLabel>
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

export default AdminAccount
