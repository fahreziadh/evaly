"use client";
import { Loader2 } from "lucide-react";
import { motion } from "motion/react";

const LoadingScreen = () => {
  return (
    <motion.div
      className="flex justify-center items-center h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Loader2 className="size-12 animate-spin" />
    </motion.div>
  );
};

export default LoadingScreen;
