// convex/convex.config.ts
import r2 from '@convex-dev/r2/convex.config'
import { defineApp } from 'convex/server'

const app = defineApp()
app.use(r2)

export default app
