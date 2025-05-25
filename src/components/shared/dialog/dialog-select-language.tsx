'use client'

import { usePathname, useRouter } from '@/i18n/navigation'
import { localesWithLabels } from '@/i18n/routing'
import { cn } from '@/lib/utils'
import { CheckIcon } from 'lucide-react'
import { useLocale } from 'next-intl'
import { useState, useTransition } from 'react'
import { useMemo } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Image } from '@/components/ui/image'
import { Input } from '@/components/ui/input'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

const DialogSelectLanguage = () => {
  const router = useRouter()
  const pathname = usePathname()
  const activeLocale = useLocale()
  const [search, setSearch] = useState('')
  const [transition, startTransition] = useTransition()

  const listLanguages = useMemo(() => {
    return Object.entries(localesWithLabels).filter(([, label]) =>
      label.label.toLowerCase().includes(search.toLowerCase())
    )
  }, [search])

  return null
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size={'icon'}>
          <Image
            className="rounded-[2px] border"
            src={localesWithLabels[activeLocale].flag}
            alt={localesWithLabels[activeLocale].label}
            width={18}
            height={18}
          />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Select Language</DialogTitle>
          <DialogDescription>
            Please select the language you want to use.
          </DialogDescription>
          <Input
            placeholder="Search"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </DialogHeader>
        <ScrollArea type="always" className="h-[350px]">
          <div className="flex flex-col gap-1">
            {listLanguages.map(([locale, label]) => (
              <Button
                onClick={() => {
                  startTransition(() => {
                    router.replace(pathname, { locale })
                  })
                }}
                key={locale}
                disabled={transition}
                variant={locale === activeLocale ? 'default' : 'ghost'}
                className={cn('justify-start')}
              >
                <Image
                  src={label.flag}
                  alt={label.label}
                  width={18}
                  height={18}
                  className="rounded-[2px] border"
                />
                {label.label} {locale === activeLocale && <CheckIcon />}
              </Button>
            ))}
          </div>
          <ScrollBar />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export default DialogSelectLanguage
