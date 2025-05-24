import React, { useState } from "react";
import { motion } from "motion/react";
import { CheckCircle, ArrowRight } from "lucide-react";
import type { FormData } from "../index";
import { api } from "@convex/_generated/api";
import { useMutation } from "convex/react";

interface SuccessStepProps {
  formData: FormData;
}

const SuccessStep: React.FC<SuccessStepProps> = ({ formData }) => {
  const [isLoading, setIsLoading] = useState(false);
  const submitOnBoarding = useMutation(
    api.organizer.profile.createInitialOrganization
  );

  const getOrgTypeLabel = (type: string): string => {
    const types: Record<string, string> = {
      school: "School",
      company: "Company",
      startup: "Startup",
      course: "Digital Course",
      freelancer: "Freelancer",
      other: "Other",
    };
    return types[type] || type;
  };

  const onComplete = async () => {
    setIsLoading(true);
    await submitOnBoarding({
      fullName: formData.fullName,
      organizationName: formData.organizationName,
      organizationType: formData.organizationType,
    });
    setIsLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-8"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        className="mx-auto w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mb-6"
      >
        <CheckCircle size={32} />
      </motion.div>

      <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome aboard!</h2>
      <p className="text-gray-500 mb-8">
        Your account has been successfully created.
      </p>

      <div className="bg-gray-50 rounded-xl p-4 mb-8 text-left">
        <h3 className="font-medium text-gray-700 mb-3">Your information</h3>
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
        className="w-full bg-primary text-white font-medium py-3 px-6 rounded-xl hover:bg-primary/90 transition-colors flex items-center justify-center"
        onClick={() => onComplete()}
      >
        Continue to Dashboard <ArrowRight size={18} className="ml-2" />
      </motion.button>
    </motion.div>
  );
};

export default SuccessStep;
