import { Footer } from '@/components/landing/Footer'
import ComingSoon from '@/components/shared/coming-soon'

import { PublicHeader } from './public-header'

export default function ComingSoonPage() {
  return (
    <div className="bg-background flex min-h-svh flex-col">
      <PublicHeader />
      <ComingSoon />
      <Footer />
    </div>
  )
}
