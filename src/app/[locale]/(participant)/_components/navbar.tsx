'use client'

import { cn } from '@/lib/utils'
import { useEffect } from 'react'
import { useState } from 'react'

import ParticipantAccount from '@/components/shared/account/participant-account'
import { LogoType } from '@/components/shared/logo'

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      className={cn(
        'bg-background sticky top-0 flex flex-row items-center justify-between border-b border-dashed px-6 py-3 transition-all duration-300',
        isScrolled ? 'border-border' : 'border-transparent'
      )}
    >
      <LogoType href="/" />
      <div className="flex flex-row items-center gap-2">
        <ParticipantAccount />
      </div>
    </div>
  )
}

export default Navbar
