"use client";

import { TextShimmer } from "@/components/ui/text-shimmer";
import { motion } from "framer-motion";

const LoadingScreen = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex justify-center items-center h-screen bg-background"
    >
      <TextShimmer className="text-2xl font-medium">Loading...</TextShimmer>
    </motion.div>
  );
};

export default LoadingScreen;
