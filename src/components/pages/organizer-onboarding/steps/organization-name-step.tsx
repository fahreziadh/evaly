import { Building } from 'lucide-react'
import { motion } from 'motion/react'
import React, { useEffect, useRef } from 'react'

interface OrganizationNameStepProps {
  value: string
  onChange: (value: string) => void
}

const OrganizationNameStep: React.FC<OrganizationNameStepProps> = ({
  value,
  onChange
}) => {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  return (
    <div className="space-y-6">
      <div className="relative">
        <div className="absolute top-1/2 left-3 -translate-y-1/2 text-gray-400">
          <Building size={20} />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="Enter your organization name"
          className="focus:ring-primary/20 focus:border-primary w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pr-4 pl-10 transition-all outline-none focus:ring-2"
          autoComplete="organization"
        />
      </div>

      {value && value.length < 2 && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="text-sm text-amber-600"
        >
          Please enter a valid organization name
        </motion.p>
      )}
    </div>
  )
}

export default OrganizationNameStep
