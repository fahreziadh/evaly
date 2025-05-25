'use client'

import NextImage, { ImageProps as NextImageProps } from 'next/image'

import { forwardRef } from 'react'

// Using type instead of interface to avoid the "no-empty-interface" eslint warning
export type ImageProps = Omit<NextImageProps, 'loader'>

const Image = forwardRef<HTMLImageElement, ImageProps>(
  ({ src, alt, ...props }, ref) => {
    return <NextImage ref={ref} src={src} alt={alt || ''} {...props} />
  }
)

Image.displayName = 'Image'

export { Image }
