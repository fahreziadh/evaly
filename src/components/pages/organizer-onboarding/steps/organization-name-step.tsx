import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Building } from 'lucide-react';

interface OrganizationNameStepProps {
  value: string;
  onChange: (value: string) => void;
}

const OrganizationNameStep: React.FC<OrganizationNameStepProps> = ({ value, onChange }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="space-y-6">
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Building size={20} />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter your organization name"
          className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
          autoComplete="organization"
        />
      </div>

      {value && value.length < 2 && (
        <motion.p 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="text-amber-600 text-sm"
        >
          Please enter a valid organization name
        </motion.p>
      )}
    </div>
  );
};

export default OrganizationNameStep;