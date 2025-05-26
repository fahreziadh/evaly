import { R2 } from '@convex-dev/r2'

import { components } from '../_generated/api'

export const r2 = new R2(components.r2)

export const { generateUploadUrl, syncMetadata } = r2.clientApi({})
