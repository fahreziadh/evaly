import { cn } from '@/lib/utils'
import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

const buttonVariants = cva(
  "inline-flex items-center justify-center duration-100 border border-transparent whitespace-nowrap text-sm font-medium disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 transition-all cursor-pointer active:opacity-90",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/95',
        destructive:
          'bg-destructive text-destructive-foreground  hover:bg-destructive/95',
        outline:
          'border border-border bg-background hover:text-muted-foreground shadow-sm hover:shadow-none shadow-black/5',
        secondary: 'bg-muted text-secondary-foreground  hover:bg-foreground/10',
        'secondary-outline':
          'bg-secondary border-foreground/10 text-secondary-foreground  hover:bg-secondary/80 hover:border-transparent',
        ghost: 'hover:bg-secondary hover:text-secondary-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        success: 'bg-emerald-500/10 text-emerald-500',
        accent: 'bg-accent text-accent-foreground hover:bg-accent/90'
      },
      size: {
        default: 'h-8 px-2.5 gap-2 rounded-md',
        sm: 'h-7 px-2  gap-1.5 text-sm rounded-md',
        xs: 'h-6 px-3 text-xs gap-1 text-xs rounded-md',
        xxs: 'h-5 px-2 text-xs gap-1 text-xs rounded-md',
        lg: "h-9 px-4 gap-3 text-base [&_svg:not([class*='size-'])]:size-4 rounded-lg",
        icon: 'size-8 rounded-md',
        'icon-sm': 'size-7 text-sm rounded-md',
        'icon-xs': 'size-6 text-xs rounded-md',
        'icon-xxs': 'size-5 text-xs rounded-md'
      },
      rounded: {
        false: '',
        true: 'rounded-full'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      rounded: false
    }
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  rounded,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className, rounded }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
