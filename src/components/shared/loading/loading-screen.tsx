import { Loader2 } from 'lucide-react'

const LoadingScreen = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="size-12 animate-spin" />
    </div>
  )
}

export default LoadingScreen
