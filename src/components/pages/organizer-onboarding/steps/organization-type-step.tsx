import {
  BookOpen,
  Briefcase,
  Check,
  GraduationCap,
  PenLine,
  Rocket,
  Store
} from 'lucide-react'
import { motion } from 'motion/react'
import React from 'react'

interface OrganizationTypeStepProps {
  value: string
  onChange: (value: string) => void
}

interface OrgTypeOption {
  id: string
  label: string
  icon: React.ReactNode
  description: string
}

const orgTypes: OrgTypeOption[] = [
  {
    id: 'school',
    label: 'School',
    icon: <GraduationCap size={24} />,
    description: 'Educational institution'
  },
  {
    id: 'company',
    label: 'Company',
    icon: <Briefcase size={24} />,
    description: 'Established business'
  },
  {
    id: 'startup',
    label: 'Startup',
    icon: <Rocket size={24} />,
    description: 'New business venture'
  },
  {
    id: 'course',
    label: 'Digital Course',
    icon: <BookOpen size={24} />,
    description: 'Online education'
  },
  {
    id: 'freelancer',
    label: 'Freelancer',
    icon: <PenLine size={24} />,
    description: 'Independent professional'
  },
  {
    id: 'other',
    label: 'Other',
    icon: <Store size={24} />,
    description: 'Not listed above'
  }
]

const OrganizationTypeStep: React.FC<OrganizationTypeStepProps> = ({
  value,
  onChange
}) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      {orgTypes.map(type => (
        <motion.div
          key={type.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onChange(type.id)}
          className={`relative rounded-xl border-2 p-4 ${
            value === type.id
              ? 'border-primary bg-primary/10'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          {value === type.id && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="bg-primary absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full"
            >
              <Check size={12} className="text-white" />
            </motion.div>
          )}
          <div
            className={`mb-2 ${value === type.id ? 'text-primary' : 'text-gray-500'}`}
          >
            {type.icon}
          </div>
          <h3 className="font-medium text-gray-900">{type.label}</h3>
          <p className="mt-1 text-xs text-gray-500">{type.description}</p>
        </motion.div>
      ))}
    </div>
  )
}

export default OrganizationTypeStep
