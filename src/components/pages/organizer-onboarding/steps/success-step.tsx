import { api } from '@convex/_generated/api'
import { useMutation } from 'convex/react'
import { ArrowRight, CheckCircle } from 'lucide-react'
import { motion } from 'motion/react'
import React, { useState } from 'react'

import type { FormData } from '../index'

interface SuccessStepProps {
  formData: FormData
}

const SuccessStep: React.FC<SuccessStepProps> = ({ formData }) => {
  const [isLoading, setIsLoading] = useState(false)
  const submitOnBoarding = useMutation(api.organizer.profile.createInitialOrganization)

  const getOrgTypeLabel = (type: string): string => {
    const types: Record<string, string> = {
      school: 'School',
      company: 'Company',
      startup: 'Startup',
      course: 'Digital Course',
      freelancer: 'Freelancer',
      other: 'Other'
    }
    return types[type] || type
  }

  const onComplete = async () => {
    setIsLoading(true)
    await submitOnBoarding({
      fullName: formData.fullName,
      organizationName: formData.organizationName,
      organizationType: formData.organizationType
    })
    setIsLoading(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="py-8 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-500"
      >
        <CheckCircle size={32} />
      </motion.div>

      <h2 className="mb-2 text-2xl font-bold text-gray-800">Welcome aboard!</h2>
      <p className="mb-8 text-gray-500">Your account has been successfully created.</p>

      <div className="mb-8 rounded-xl bg-gray-50 p-4 text-left">
        <h3 className="mb-3 font-medium text-gray-700">Your information</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-500">Name:</span>
            <span className="font-medium">{formData.fullName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Organization:</span>
            <span className="font-medium">{formData.organizationName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Type:</span>
            <span className="font-medium">
              {getOrgTypeLabel(formData.organizationType)}
            </span>
          </div>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        disabled={isLoading}
        className="bg-primary hover:bg-primary/90 flex w-full items-center justify-center rounded-xl px-6 py-3 font-medium text-white transition-colors"
        onClick={() => onComplete()}
      >
        Continue to Dashboard <ArrowRight size={18} className="ml-2" />
      </motion.button>
    </motion.div>
  )
}

export default SuccessStep
