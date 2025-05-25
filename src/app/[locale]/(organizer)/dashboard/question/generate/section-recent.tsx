import { motion } from 'motion/react'

const SectionRecent = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="my-28 flex flex-col"
    >
      <h1 className="font-medium">Recent</h1>
      <p className="text-muted-foreground text-sm">
        Here are some of your recent question sets.
      </p>
      <div className="mt-6 grid grid-cols-3 gap-4"></div>
    </motion.div>
  )
}

export default SectionRecent
