// Define media types constant
export const MEDIA_TYPES = ['audio', 'video', 'file', 'image'] as const

export type MediaType = (typeof MEDIA_TYPES)[number]
