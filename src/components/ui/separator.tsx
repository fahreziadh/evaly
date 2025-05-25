'use client'

import { cn } from '@/lib/utils'
import * as SeparatorPrimitive from '@radix-ui/react-separator'
import * as React from 'react'

function Separator({
  className,
  orientation = 'horizontal',
  decorative = true,
  ...props
}: React.ComponentProps<typeof SeparatorPrimitive.Root>) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator-root"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        'shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=horizontal]:border-b data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px data-[orientation=vertical]:border-r',
        className
      )}
      {...props}
    />
  )
}

export { Separator }
