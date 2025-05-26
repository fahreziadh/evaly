'use client'

import { Link } from '@tanstack/react-router'

import { cn } from '@/lib/utils'

interface Props {
  className?: string
  href?: string
}

export const LogoLink = ({ className, href = '/' }: Props) => {
  return (
    <Link to={href} className={cn('flex items-center gap-2', className)}>
      <LogoType />
    </Link>
  )
}

export const LogoType = ({ className }: { className?: string }) => {
  return (
    <div className={cn('text-primary text-xl font-extrabold', className)}>Evaly</div>
  )
}
