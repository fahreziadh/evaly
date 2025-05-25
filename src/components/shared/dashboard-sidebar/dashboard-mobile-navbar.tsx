'use client'

import { cn } from '@/lib/utils'
import { Menu, XIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'

import { LogoType } from '../logo'
import { useProgressBar } from '../progress-bar'
import NavLinks from './nav-links'
import { NavUserAccount } from './nav-user'

const DashboardMobileNavbar = () => {
  const [open, setOpen] = useState(false)
  const status = useProgressBar()
  useEffect(() => {
    if (status.state === 'in-progress') {
      setOpen(false)
    }
  }, [status.state])
  return (
    <div className="relative">
      <div className="bg-background sticky top-0 z-50 flex h-14 flex-row items-center justify-between border-b px-4 md:hidden">
        <LogoType />
        <div className="flex flex-row items-center gap-2">
          <NavUserAccount />
          <Button
            variant={'ghost'}
            size={'icon'}
            onClick={() => setOpen(!open)}
            className="relative"
          >
            <Menu
              className={cn(
                'absolute left-1 size-5 transition-all duration-100',
                !open ? 'scale-100' : 'scale-0'
              )}
            />
            <XIcon
              className={cn(
                'absolute left-1 size-5 transition-all duration-100',
                open ? 'scale-100' : 'scale-0'
              )}
            />
          </Button>
        </div>
      </div>
      {open ? (
        <div className="bg-background fixed top-14 left-0 z-50 h-full w-full">
          <div className="flex flex-col gap-4">
            <NavLinks />
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default DashboardMobileNavbar
