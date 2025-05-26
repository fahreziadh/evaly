import { api } from '@convex/_generated/api'
import type { Id } from '@convex/_generated/dataModel'
import { useQuery } from 'convex/react'
import { Check, Copy, Download, Info } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { useRef, useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

const Share = ({ testId }: { testId: Id<'test'> }) => {
  const [copied, setCopied] = useState(false)
  const qrCodeRef = useRef<HTMLDivElement>(null)
  const logoSize = 42
  const test = useQuery(api.organizer.test.getTestById, {
    testId: testId as Id<'test'>
  })

  const copyToClipboard = () => {
    navigator.clipboard.writeText(`${window.location.origin}/s/${testId}`)
    toast.success('Link copied to clipboard')
    setCopied(true)
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

  return (
    <div className="space-y-8">
      <Card className="border">
        <CardHeader className="border-b border-dashed pb-2">
          <CardTitle>Share Test</CardTitle>
          <CardDescription>Share your test with participants</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-start gap-6 md:flex-row">
            <div className="bg-background relative border p-4" ref={qrCodeRef}>
              <QRCodeSVG
                value={`${window.location.origin}/s/${testId}`}
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
                <img
                  src="/images/logo.svg" // Platform logo
                  alt="Logo"
                  width={logoSize}
                  height={logoSize}
                  className="qr-logo"
                />
              </div>
            </div>
            <div className="flex flex-1 flex-col items-center space-y-4 md:items-start">
              <div className="w-full space-y-4">
                <div className="flex w-full flex-col gap-3 sm:flex-row">
                  <Button variant="outline" className="gap-2" onClick={downloadQRCode}>
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
                    {copied ? 'Copied!' : 'Copy QR'}
                  </Button>
                </div>

                <Separator />
              </div>
              <div className="flex w-full items-center gap-2">
                <div className="relative flex-1">
                  <Input
                    value={`${window.location.origin}/s/${testId}`}
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

              <div className="flex w-full items-start gap-3 p-4">
                <Info className="mt-0.5 h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">
                    {test?.access === 'private'
                      ? 'Only invited participants can access this test'
                      : 'Anyone with this link can access the test'}
                  </p>
                  <p className="text-muted-foreground mt-1 text-sm">
                    {test?.access === 'private'
                      ? 'Share this link with participants after inviting them via email.'
                      : 'Share this link directly with participants or use it in your communications.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Share
