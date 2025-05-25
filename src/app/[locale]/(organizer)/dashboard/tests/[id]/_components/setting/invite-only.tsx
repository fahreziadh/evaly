import { ChevronRight, Loader2, XIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

import { trpc } from '@/trpc/trpc.client'

import { TestInvitation } from '@/types/test'

const InviteOnly = ({ testId }: { testId: string }) => {
  const t = useTranslations('TestDetail')
  const tCommon = useTranslations('Common')
  const { data, isPending } = trpc.organization.test.getInvites.useQuery({ id: testId })
  const [emailInput, setEmailInput] = useState('')
  const [listInvited, setListInvited] = useState<TestInvitation[]>([])

  useEffect(() => {
    setListInvited(data || [])
  }, [data])

  const {
    mutateAsync: addInvitedParticipant,
    isPending: isPendingAddInvitedParticipant
  } = trpc.organization.test.invite.useMutation({
    onSuccess(data) {
      toast.success(`${data.length} ${t('participantsAdded')}`)
      setListInvited([...listInvited, ...data])
      setEmailInput('')
    },
    onError(error) {
      toast.error(error.message || tCommon('genericUpdateError'))
    }
  })

  const listInvitedPreview = useMemo(() => {
    return listInvited.slice(0, 10)
  }, [listInvited])

  const {
    mutateAsync: deleteInvitedParticipant,
    isPending: isPendingDeleteInvitedParticipant
  } = trpc.organization.test.deleteInvite.useMutation({
    onSuccess(_, variables) {
      toast.success(t('participantRemoved'))
      setListInvited(listInvited.filter(item => item.email !== variables.email))
    },
    onError(error) {
      toast.error(error.message || tCommon('genericUpdateError'))
    }
  })

  return (
    <div>
      <Label className="text-sm">{t('inviteOnlyDescription')}</Label>
      <div className="mt-4 border p-4">
        <div className="flex flex-row gap-2">
          <Input
            placeholder="fathia@gmail.com, arumi@gmail.com, shahfika@gmail.com...."
            className="w-full max-w-2xs"
            inputMode="email"
            type="email"
            value={emailInput}
            onChange={e => setEmailInput(e.target.value)}
            disabled={isPendingAddInvitedParticipant}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault()
                const listEmails = emailInput
                  .trim()
                  .toLowerCase()
                  .split(',')
                  .map(email => email.trim())

                if (listEmails.length > 0) {
                  addInvitedParticipant({ emails: listEmails, id: testId })
                }
              }
            }}
          />
          <Button
            onClick={() => {
              const listEmails = emailInput
                .trim()
                .toLowerCase()
                .split(',')
                .map(email => email.trim())
              if (listEmails.length > 0) {
                addInvitedParticipant({ emails: listEmails, id: testId })
              }
            }}
            type="button"
            variant="outline"
            disabled={isPendingAddInvitedParticipant}
          >
            {isPendingAddInvitedParticipant ? (
              <Loader2 className="animate-spin" />
            ) : (
              tCommon('add')
            )}
          </Button>
        </div>
        <div className="mt-4 flex flex-row flex-wrap gap-2">
          {listInvitedPreview.map(item => (
            <div
              key={item.email}
              className="group relative flex items-center gap-2 rounded-full border py-0.5 pr-4 pl-0.5 text-sm"
            >
              <Avatar className="size-7">
                {item.image ? (
                  <AvatarImage
                    src={item.image || ''}
                    alt={item.email}
                    className="rounded-full"
                  />
                ) : (
                  <AvatarFallback className="rounded-full font-bold">
                    {item?.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                )}
                <Button
                  variant={'destructive'}
                  rounded
                  size={'icon-sm'}
                  onClick={() =>
                    deleteInvitedParticipant({ id: testId, email: item.email })
                  }
                  disabled={isPendingDeleteInvitedParticipant}
                  className="absolute opacity-0 transition-all group-hover:opacity-100"
                >
                  {isPendingDeleteInvitedParticipant ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <XIcon />
                  )}
                </Button>
              </Avatar>
              {item.email}
            </div>
          ))}
          {listInvitedPreview?.length === 0 ? (
            <div className="text-muted-foreground">{t('noInvitedParticipants')}</div>
          ) : (
            <Dialog>
              <DialogTrigger asChild>
                <Button rounded variant={'secondary'} className="h-9">
                  {t('seeDetail')} <ChevronRight className="size-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t('invitedParticipants')}</DialogTitle>
                  <DialogDescription>
                    {listInvited.length} {t('participantsInvited')}
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-[50vh]">
                  <Table>
                    <TableHeader className="bg-background sticky top-0">
                      <TableRow>
                        <TableHead>{t('email')}</TableHead>
                        <TableHead>{t('name')}</TableHead>
                        <TableHead>{t('action')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {listInvited.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="flex flex-row items-center gap-2">
                            <Avatar>
                              <AvatarImage
                                src={item.image || ''}
                                alt={item.email}
                                className="size-7 rounded-full"
                              />
                              <AvatarFallback className="size-7 rounded-full font-bold">
                                {item?.email?.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            {item.email}
                          </TableCell>
                          <TableCell>{item.name || '-'}</TableCell>
                          <TableCell>
                            <Button
                              disabled={isPendingDeleteInvitedParticipant}
                              variant={'ghost'}
                              size={'icon-xs'}
                              onClick={() =>
                                deleteInvitedParticipant({
                                  id: testId,
                                  email: item.email
                                })
                              }
                            >
                              <XIcon />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant={'outline'}>{tCommon('close')}</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
          {isPending && (
            <div className="flex items-center justify-center">
              <Loader2 className="animate-spin" />
            </div>
          )}
          {listInvited.length > 10 ? (
            <Button rounded variant={'outline'} className="h-9">
              {t('seeDetail')} <ChevronRight className="size-4" />
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default InviteOnly
