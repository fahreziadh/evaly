import { Loader2Icon } from 'lucide-react'
import { motion } from 'motion/react'

const LoadingScreen = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex h-screen flex-col items-center justify-center"
    >
      <Loader2Icon className="size-10 animate-spin" />
    </motion.div>
  )
}

export default LoadingScreen
