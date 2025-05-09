import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "text-sm border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground aria-invalid:outline-destructive/60 aria-invalid:ring-destructive/20 dark:aria-invalid:outline-destructive dark:aria-invalid:ring-destructive/50 ring-ring/80 dark:outline-ring/40 outline-ring/50 aria-invalid:border-destructive/60 dark:aria-invalid:border-destructive flex h-8 w-full min-w-0 border bg-transparent px-3 py-1 transition-[color,box-shadow] file:inline-flex file:h-7 file:border-0 file:bg-transparent  file:font-medium focus-visible:ring-2 focus-visible:outline-1 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:focus-visible:ring-[3px] aria-invalid:focus-visible:outline-none dark:aria-invalid:focus-visible:ring-2 duration-100 rounded-md",
        className
      )}
      {...props}
    />
  )
}

export { Input }
