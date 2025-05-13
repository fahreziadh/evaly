import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';
import NameStep from './steps/name-step';
import OrganizationNameStep from './steps/organization-name-step';
import OrganizationTypeStep from './steps/organization-type-step';
import SuccessStep from './steps/success-step';

export interface FormData {
  fullName: string;
  organizationName: string;
  organizationType: string;
}

const OrganizerOnboarding = ({defaultFullname}:{defaultFullname?: string}) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    fullName: defaultFullname || '',
    organizationName: '',
    organizationType: '',
  });

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.fullName.trim().length >= 3;
      case 2:
        return formData.organizationName.trim().length >= 2;
      case 3:
        return !!formData.organizationType;
      default:
        return true;
    }
  };

  return (
    <div className="min-h-screen  flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md border border-foreground/10 rounded-lg shadow-2xl shadow-black/10 overflow-hidden"
      >
        {step <= 3 && (
          <div className="p-6 pb-0">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold text-gray-800">
                {step === 1 && "Welcome"}
                {step === 2 && "Your Organization"}
                {step === 3 && "Organization Type"}
              </h1>
              <div className="flex space-x-1">
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    className={`h-2 rounded-full ${
                      i <= step ? 'bg-primary' : 'bg-gray-200'
                    }`}
                    initial={{ width: i === step ? 12 : 24 }}
                    animate={{ width: i === step ? 24 : 12 }}
                    style={{ marginRight: '4px' }}
                  />
                ))}
              </div>
            </div>
            <p className="text-gray-500 mb-8">
              {step === 1 && "Let's get to know you better."}
              {step === 2 && "Tell us about your organization."}
              {step === 3 && "What best describes your organization?"}
            </p>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="p-6"
          >
            {step === 1 && (
              <NameStep
                value={formData.fullName}
                onChange={(value) => updateFormData('fullName', value)}
              />
            )}
            {step === 2 && (
              <OrganizationNameStep
                value={formData.organizationName}
                onChange={(value) => updateFormData('organizationName', value)}
              />
            )}
            {step === 3 && (
              <OrganizationTypeStep
                value={formData.organizationType}
                onChange={(value) => updateFormData('organizationType', value)}
              />
            )}
            {step === 4 && <SuccessStep formData={formData} />}
          </motion.div>
        </AnimatePresence>

        {step < 4 && (
          <div className="p-6 border-t border-gray-100 flex justify-between">
            {step > 1 ? (
              <button
                onClick={prevStep}
                className="flex items-center text-gray-500 hover:text-gray-700 px-4 py-2 rounded-lg transition-colors"
              >
                <ChevronLeft size={18} className="mr-1" />
                Back
              </button>
            ) : (
              <div /> // Empty div for flex spacing
            )}

            <motion.button
              onClick={nextStep}
              disabled={!isStepValid()}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center ${
                isStepValid()
                  ? 'bg-primary hover:bg-primary/90 text-white'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              } px-6 py-2 rounded-lg font-medium transition-colors`}
            >
              {step === 3 ? (
                <>
                  Complete <Check size={18} className="ml-1" />
                </>
              ) : (
                <>
                  Continue <ChevronRight size={18} className="ml-1" />
                </>
              )}
            </motion.button>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default OrganizerOnboarding;