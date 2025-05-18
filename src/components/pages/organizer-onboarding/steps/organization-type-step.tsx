import React from 'react';
import { motion } from 'motion/react';
import {
  GraduationCap,
  Briefcase,
  Rocket,
  BookOpen,
  PenLine,
  Store,
  Check
} from 'lucide-react';

interface OrganizationTypeStepProps {
  value: string;
  onChange: (value: string) => void;
}

interface OrgTypeOption {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
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
];

const OrganizationTypeStep: React.FC<OrganizationTypeStepProps> = ({ value, onChange }) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      {orgTypes.map((type) => (
        <motion.div
          key={type.id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onChange(type.id)}
          className={`relative  p-4 rounded-xl border-2 ${
            value === type.id
              ? 'border-primary bg-primary/10'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          {value === type.id && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center"
            >
              <Check size={12} className="text-white" />
            </motion.div>
          )}
          <div className={`mb-2 ${value === type.id ? 'text-primary' : 'text-gray-500'}`}>
            {type.icon}
          </div>
          <h3 className="font-medium text-gray-900">{type.label}</h3>
          <p className="text-xs text-gray-500 mt-1">{type.description}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default OrganizationTypeStep;