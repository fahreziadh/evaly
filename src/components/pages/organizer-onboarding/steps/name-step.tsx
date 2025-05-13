import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { User } from 'lucide-react';

interface NameStepProps {
  value: string;
  onChange: (value: string) => void;
}

const NameStep: React.FC<NameStepProps> = ({ value, onChange }) => {
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
          <User size={20} />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter your full name"
          className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
          autoComplete="name"
        />
      </div>

      {value && value.length < 3 && (
        <motion.p 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="text-amber-600 text-sm"
        >
          Please enter your full name (at least 3 characters)
        </motion.p>
      )}
    </div>
  );
};

export default NameStep;