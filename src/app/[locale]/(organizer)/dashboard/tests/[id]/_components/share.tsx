import { useParams } from 'next/navigation'

import { env } from '@/lib/env.client'
import { useMutation } from '@tanstack/react-query'
import {
  Check,
  CheckCircle2,
  Copy,
  Download,
  Info,
  Link2,
  Loader2,
  Mail,
  QrCode,
  SendIcon,
  Settings,
  Upload,
  UserPlus,
  XIcon
} from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Image } from '@/components/ui/image'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Slider } from '@/components/ui/slider'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'

import { trpc } from '@/trpc/trpc.client'

import { useTabsState } from '../_hooks/use-tabs-state'

// Define types for invited participants
interface InvitedParticipant {
  id: string
  email: string
  createdAt: string
  isEmailSent: boolean
  name: string | null
  image: string | null
}

const Share = () => {
  const { id } = useParams()
  const testId = id as string
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<string>('link')
  const qrCodeRef = useRef<HTMLDivElement>(null)
  const [, setTabsState] = useTabsState('questions')
  const [inviteEmails, setInviteEmails] = useState('')
  const [logoSize, setLogoSize] = useState(40) // Size of the logo in the QR code
  const [isLogoUpdating, setIsLogoUpdating] = useState(false)

  const { data: test } = trpc.organization.test.getById.useQuery({
    id: id?.toString() || ''
  })

  const { data: submissionsData } = trpc.organization.test.getTestResults.useQuery({
    id: testId
  })

  const participantCount = submissionsData?.submissions?.length || 0

  // Determine if the test is invite-only or public
  const isInviteOnly = useMemo(() => {
    // Check if the test has access control set to "invite-only"
    return test?.access === 'invite-only'
  }, [test])

  // Fetch invitation data only if the test is invite-only
  const {
    data: invitationData,
    refetch: refetchInvitations,
    isLoading: isLoadingInvitations
  } = trpc.organization.test.getInvites.useQuery({
    id: testId
  })

  // Get list of invited participants
  const invitedParticipants = useMemo<InvitedParticipant[]>(() => {
    if (!isInviteOnly || !invitationData) return []

    // Return the data directly from the API response
    return invitationData
  }, [isInviteOnly, invitationData])

  // Get list of participants who have started or completed the test
  const activeParticipants = useMemo(() => {
    return submissionsData?.submissions || []
  }, [submissionsData])

  const shareUrl = `${env.NEXT_PUBLIC_URL}/s/${testId}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    toast.success('Link copied to clipboard', { position: 'top-right' })

    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  const copyQRCodeImage = async () => {
    if (!qrCodeRef.current) return

    const svg = qrCodeRef.current.querySelector('svg')
    if (!svg) return

    // Create a canvas element
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = 500
    canvas.height = 500

    // Create an image from the SVG
    const img = document.createElement('img')
    const svgData = new XMLSerializer().serializeToString(svg)
    const svgBlob = new Blob([svgData], {
      type: 'image/svg+xml;charset=utf-8'
    })
    const url = URL.createObjectURL(svgBlob)

    try {
      // Wait for the image to load
      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
        img.src = url
      })

      // Fill white background
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw the image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      // Add logo if it exists in the DOM
      const logoImg = qrCodeRef.current.querySelector('.qr-logo') as HTMLImageElement
      if (logoImg && logoImg.complete) {
        // Calculate logo position (center)
        const logoX = (canvas.width - logoSize * 2) / 2
        const logoY = (canvas.height - logoSize * 2) / 2

        // Draw logo
        ctx.drawImage(logoImg, logoX, logoY, logoSize * 2, logoSize * 2)
      }

      // Convert to blob and copy to clipboard
      canvas.toBlob(async blob => {
        if (blob) {
          try {
            // Use the clipboard API to copy the image
            await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })])
            setCopied(true)
            toast.success('QR Code image copied to clipboard', {
              position: 'top-right'
            })

            setTimeout(() => {
              setCopied(false)
            }, 2000)
          } catch (err) {
            toast.error(
              'Failed to copy image. Your browser may not support this feature.'
            )
            console.error('Clipboard write failed:', err)
          }
        }
      }, 'image/png')
    } catch (err) {
      toast.error('Failed to generate QR code image')
      console.error('Error generating QR code image:', err)
    } finally {
      URL.revokeObjectURL(url)
    }
  }

  const downloadQRCode = () => {
    if (!qrCodeRef.current) return

    const svg = qrCodeRef.current.querySelector('svg')
    if (!svg) return

    // Create a canvas element
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = 1000
    canvas.height = 1000

    // Create an image from the SVG
    const img = document.createElement('img')
    const svgData = new XMLSerializer().serializeToString(svg)
    const svgBlob = new Blob([svgData], {
      type: 'image/svg+xml;charset=utf-8'
    })
    const url = URL.createObjectURL(svgBlob)

    img.onload = () => {
      // Fill white background
      ctx.fillStyle = 'white'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw the image
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

      // Add logo if it exists in the DOM
      const logoImg = qrCodeRef.current?.querySelector('.qr-logo') as HTMLImageElement
      if (logoImg && logoImg.complete) {
        // Calculate logo position (center)
        const logoSize = 250 // Size of logo on the downloaded image
        const logoX = (canvas.width - logoSize) / 2
        const logoY = (canvas.height - logoSize) / 2

        // Draw logo
        ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize)
      }

      // Convert to data URL and download
      const dataUrl = canvas.toDataURL('image/png')
      const link = document.createElement('a')
      link.download = `${test?.title || 'test'}-qrcode.png`
      link.href = dataUrl
      link.click()

      // Clean up
      URL.revokeObjectURL(url)
    }

    img.src = url
    toast.success('QR Code downloaded', { position: 'top-right' })
  }

  const goToSettings = () => {
    setTabsState('settings')
  }

  // Mutation for adding new invitations
  const { mutate: addInvitation, isPending: isAddingInvitation } =
    trpc.organization.test.invite.useMutation({
      onSuccess() {
        toast.success('Invitations added successfully')
        setInviteEmails('')
        refetchInvitations()
      },
      onError(error) {
        toast.error(error.message || 'Failed to add invitations')
      }
    })

  // Mutation for sending email to a specific participant
  const { mutate: sendInvitationEmail, isPending: isSendingEmail } = useMutation({
    mutationFn: async (targetEmail: string) => {
      // This is a placeholder - replace with actual API call to send email
      // In a real implementation, you would call an API endpoint to send the email
      console.log(`Sending invitation email to: ${targetEmail}`)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      return { success: true, email: targetEmail }
    },
    onSuccess: () => {
      toast.success('Invitation email sent successfully')
      refetchInvitations()
    },
    onError: () => {
      toast.error('Failed to send invitation email')
    }
  })

  // Mutation for deleting an invitation
  const { mutate: deleteInvitation, isPending: isDeletingInvitation } =
    trpc.organization.test.deleteInvite.useMutation({
      onError(error) {
        toast.error(error.message || 'Failed to delete invitation')
      },
      onSuccess() {
        toast.success('Invitation deleted successfully')
        refetchInvitations()
      }
    })

  const handleSendInvitations = () => {
    const emails = inviteEmails.split(/[\s,;]+/).filter(email => email.trim() !== '')

    if (emails.length === 0) {
      toast.error('Please enter at least one valid email address')
      return
    }

    addInvitation({ id: testId, emails })
  }

  // Function to handle logo size change with debounce
  const handleLogoSizeChange = (value: number[]) => {
    setLogoSize(value[0])
  }

  // Function to handle logo upload (disabled for now)
  const handleLogoUpload = () => {
    setIsLogoUpdating(true)

    // Simulate upload process
    setTimeout(() => {
      toast.info('Logo upload will be available in a future update')
      setIsLogoUpdating(false)
    }, 1000)
  }

  return (
    <div className="space-y-8">
      <Card className="border">
        <CardHeader className="border-b border-dashed pb-2">
          <CardTitle>Share Options</CardTitle>
          <CardDescription>
            Choose how you want to share your test with participants
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList
              className={`grid ${isInviteOnly ? 'grid-cols-3' : 'grid-cols-2'} mb-6`}
            >
              <TabsTrigger value="link" className="flex items-center gap-2">
                <Link2 className="h-4 w-4" />
                Direct Link
              </TabsTrigger>
              {isInviteOnly && (
                <TabsTrigger value="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Invitations
                </TabsTrigger>
              )}
              <TabsTrigger value="qr" className="flex items-center gap-2">
                <QrCode className="h-4 w-4" />
                QR Code
              </TabsTrigger>
            </TabsList>

            <TabsContent value="link" className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Input
                    value={shareUrl}
                    readOnly
                    className="pr-10 font-mono text-sm"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-0 right-0 h-full"
                    onClick={copyToClipboard}
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <Button onClick={copyToClipboard}>
                  {copied ? 'Copied!' : 'Copy Link'}
                </Button>
              </div>

              <div className="bg-muted/50 flex items-start gap-3 p-4">
                <Info className="mt-0.5 h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">
                    {isInviteOnly
                      ? 'Only invited participants can access this test'
                      : 'Anyone with this link can access the test'}
                  </p>
                  <p className="text-muted-foreground mt-1 text-sm">
                    {isInviteOnly
                      ? 'Share this link with participants after inviting them via email.'
                      : 'Share this link directly with participants or use it in your communications.'}
                  </p>
                </div>
              </div>
            </TabsContent>

            {isInviteOnly && (
              <TabsContent value="email" className="space-y-4">
                <div className="bg-muted/50 p-4">
                  <p className="text-sm">
                    Send email invitations to specific participants. Only invited
                    participants will be able to access the test.
                  </p>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex flex-col items-center gap-2 sm:flex-row">
                    <Input
                      placeholder="participant1@example.com, participant2@example.com..."
                      value={inviteEmails}
                      onChange={e => setInviteEmails(e.target.value)}
                      className="flex-1"
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleSendInvitations()
                        }
                      }}
                    />
                    <Button
                      onClick={handleSendInvitations}
                      disabled={isAddingInvitation}
                      className="mt-2 w-full gap-2 sm:mt-0 sm:w-auto"
                    >
                      {isAddingInvitation ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <UserPlus className="h-4 w-4" />
                      )}
                      Add Invitations
                    </Button>
                  </div>

                  <div className="rounded-md border">
                    <div className="bg-muted/30 flex items-center justify-between border-b p-3">
                      <h3 className="text-sm font-medium">Invited Participants</h3>
                      <Badge variant="outline">
                        {invitedParticipants.length} participants
                      </Badge>
                    </div>

                    {isLoadingInvitations ? (
                      <div className="flex items-center justify-center p-8">
                        <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
                      </div>
                    ) : invitedParticipants.length === 0 ? (
                      <div className="text-muted-foreground p-8 text-center">
                        No participants have been invited yet.
                      </div>
                    ) : (
                      <ScrollArea className="h-[300px]">
                        <Table>
                          <TableHeader className="bg-background sticky top-0 z-10">
                            <TableRow>
                              <TableHead className="w-[50%] pl-4">
                                Participant
                              </TableHead>
                              <TableHead className="hidden sm:table-cell">
                                Status
                              </TableHead>
                              <TableHead className="w-[100px] text-right sm:text-left">
                                Actions
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {invitedParticipants.map((participant, index) => (
                              <TableRow key={participant.id}>
                                <TableCell className="flex items-center gap-4 pl-4">
                                  {participant.image ? (
                                    <Avatar className="hidden sm:inline-flex">
                                      <AvatarImage
                                        asChild
                                        src={participant.image}
                                        alt={participant.email}
                                      >
                                        <Image
                                          src={participant.image}
                                          alt={participant.email}
                                          width={32}
                                          height={32}
                                          className="size-8 rounded-full"
                                        />
                                      </AvatarImage>
                                      <AvatarFallback>
                                        {participant.email.charAt(0).toUpperCase()}
                                      </AvatarFallback>
                                    </Avatar>
                                  ) : (
                                    <Avatar className="hidden sm:inline-flex">
                                      <AvatarFallback>
                                        {participant.email.charAt(0).toUpperCase()}
                                      </AvatarFallback>
                                    </Avatar>
                                  )}

                                  <div className="min-w-0">
                                    <div className="truncate font-medium">
                                      {index + 1}. {participant.email}
                                    </div>
                                    <div className="text-muted-foreground flex items-center gap-2 text-xs">
                                      <span className="whitespace-nowrap">
                                        Invited on{' '}
                                        {new Date(
                                          participant.createdAt
                                        ).toLocaleDateString()}
                                      </span>
                                      <Badge
                                        variant={
                                          participant.isEmailSent
                                            ? 'success'
                                            : 'outline'
                                        }
                                        className="sm:hidden"
                                      >
                                        {participant.isEmailSent ? 'Sent' : 'Pending'}
                                      </Badge>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="hidden sm:table-cell">
                                  <Badge
                                    variant={
                                      participant.isEmailSent ? 'success' : 'outline'
                                    }
                                  >
                                    {participant.isEmailSent ? 'Email Sent' : 'Pending'}
                                  </Badge>
                                </TableCell>
                                <TableCell className="text-right sm:text-left">
                                  <div className="flex items-center justify-end gap-1 sm:justify-start">
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() =>
                                            sendInvitationEmail(participant.email)
                                          }
                                          disabled={
                                            isSendingEmail || participant.isEmailSent
                                          }
                                        >
                                          {isSendingEmail ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                          ) : (
                                            <SendIcon className="h-4 w-4" />
                                          )}
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        {participant.isEmailSent
                                          ? 'Email already sent'
                                          : 'Send invitation email'}
                                      </TooltipContent>
                                    </Tooltip>

                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          onClick={() =>
                                            deleteInvitation({
                                              email: participant.email,
                                              id: testId
                                            })
                                          }
                                          disabled={isDeletingInvitation}
                                        >
                                          {isDeletingInvitation ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                          ) : (
                                            <XIcon className="h-4 w-4" />
                                          )}
                                        </Button>
                                      </TooltipTrigger>
                                      <TooltipContent>Remove invitation</TooltipContent>
                                    </Tooltip>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </ScrollArea>
                    )}
                  </div>
                </div>
              </TabsContent>
            )}

            <TabsContent value="qr" className="space-y-4">
              <div className="bg-background flex flex-col items-start gap-6 md:flex-row">
                <div className="bg-background relative border p-4" ref={qrCodeRef}>
                  <QRCodeSVG
                    value={shareUrl}
                    size={180}
                    level="H"
                    includeMargin={true}
                    imageSettings={{
                      src: '/images/logo.svg', // Platform logo
                      x: undefined,
                      y: undefined,
                      height: logoSize,
                      width: logoSize,
                      excavate: true
                    }}
                  />
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <Image
                      src="/images/logo.svg" // Platform logo
                      alt="Logo"
                      width={logoSize}
                      height={logoSize}
                      className="qr-logo"
                    />
                  </div>
                </div>
                <div className="flex flex-1 flex-col items-center space-y-4 md:items-start">
                  <div>
                    <h3 className="mb-2 font-medium">QR Code for Test Access</h3>
                    <p className="text-muted-foreground text-sm">
                      Scan this QR code to access the test directly. Useful for
                      in-person events or printed materials.
                    </p>
                  </div>

                  <div className="w-full space-y-4">
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center justify-between">
                        <label htmlFor="logo-size" className="text-sm font-medium">
                          Logo Size
                        </label>
                        <span className="text-muted-foreground text-sm">
                          {logoSize}px
                        </span>
                      </div>
                      <Slider
                        id="logo-size"
                        min={20}
                        max={60}
                        step={1}
                        value={[logoSize]}
                        onValueChange={handleLogoSizeChange}
                        className="w-full"
                      />
                    </div>

                    <div className="flex w-full flex-col gap-3 sm:flex-row">
                      <Button
                        variant="outline"
                        className="gap-2"
                        onClick={downloadQRCode}
                      >
                        <Download className="h-4 w-4" />
                        Download QR Code
                      </Button>
                      <Button
                        variant="secondary"
                        className="gap-2"
                        onClick={copyQRCodeImage}
                      >
                        {copied ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                        {copied ? 'Copied!' : 'Copy Image'}
                      </Button>
                    </div>

                    <Separator />

                    <div>
                      <h4 className="mb-2 text-sm font-medium">Custom Logo</h4>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          className="w-full gap-2 sm:w-auto"
                          disabled={true}
                          onClick={handleLogoUpload}
                        >
                          {isLogoUpdating ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Upload className="h-4 w-4" />
                          )}
                          Upload Custom Logo
                        </Button>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="text-muted-foreground h-4 w-4 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                Custom logo upload will be available in a future update
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card className="border">
        <CardHeader className="border-b border-dashed pb-2">
          <CardTitle>Manage Access</CardTitle>
          <CardDescription>Control who can access your test</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
              <div>
                <h3 className="font-medium">Test Status</h3>
                <p className="text-muted-foreground text-sm">
                  Current status of your test
                </p>
              </div>
              <Badge variant={test?.isPublished ? 'success' : 'outline'}>
                {test?.isPublished ? 'Published' : 'Draft'}
              </Badge>
            </div>

            <Separator />

            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
              <div>
                <h3 className="font-medium">Access Control</h3>
                <p className="text-muted-foreground text-sm">
                  Who can access this test
                </p>
              </div>
              <Badge variant="outline">
                {isInviteOnly ? 'Invite Only' : 'Public Link'}
              </Badge>
            </div>

            <div className="bg-muted/50 flex flex-col items-start gap-3 p-4 sm:flex-row">
              <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">
                  {isInviteOnly
                    ? 'Only invited participants can access this test'
                    : 'Anyone with the link can access this test'}
                </p>
                <p className="text-muted-foreground mt-1 text-sm">
                  {isInviteOnly
                    ? 'You need to invite participants via email before they can access the test.'
                    : 'For more advanced access control, you can change to invite-only mode in settings.'}
                </p>
                <div className="mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2"
                    onClick={goToSettings}
                  >
                    <Settings className="h-3.5 w-3.5" />
                    Change Access Settings
                  </Button>
                </div>
              </div>
            </div>

            <Separator />

            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
              <div>
                <h3 className="font-medium">Participation</h3>
                <p className="text-muted-foreground text-sm">
                  {isInviteOnly
                    ? 'Invited participants and their status'
                    : 'Number of participants who have taken the test'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="px-3 py-1 text-base">
                  {participantCount}
                </Badge>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="text-muted-foreground h-4 w-4 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Total number of participants who have submitted the test</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            {isInviteOnly && invitedParticipants.length > 0 && (
              <div className="mt-2">
                <h4 className="mb-2 text-sm font-medium">
                  Invited Participants Status
                </h4>
                <ScrollArea className="h-[200px] border">
                  <div className="space-y-2 p-4">
                    {invitedParticipants.map(participant => {
                      const hasStarted = activeParticipants.some(
                        p => p.email === participant.email
                      )

                      return (
                        <div
                          key={participant.id}
                          className="hover:bg-muted/50 flex flex-col justify-between gap-2 px-3 py-2 sm:flex-row sm:items-center"
                        >
                          <div className="flex items-center gap-2">
                            <Avatar className="hidden h-8 w-8 sm:inline-flex">
                              {participant.image ? (
                                <AvatarImage
                                  src={participant.image}
                                  alt={participant.email}
                                />
                              ) : (
                                <AvatarFallback>
                                  {participant.email.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              )}
                            </Avatar>
                            <div className="min-w-0 flex-1">
                              <p className="truncate font-medium">
                                {participant.email}
                              </p>
                              <p className="text-muted-foreground text-xs">
                                Invited on{' '}
                                {new Date(participant.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <div className="mt-2 flex flex-wrap items-center gap-2 sm:mt-0">
                            <Badge
                              variant={
                                participant.isEmailSent ? 'outline' : 'secondary'
                              }
                            >
                              {participant.isEmailSent ? 'Email Sent' : 'Pending Email'}
                            </Badge>
                            <Badge
                              variant={hasStarted ? 'success' : 'outline'}
                              className="gap-1"
                            >
                              {hasStarted ? (
                                <>
                                  <CheckCircle2 className="h-3 w-3" />
                                  Started
                                </>
                              ) : (
                                'Not Started'
                              )}
                            </Badge>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Share
