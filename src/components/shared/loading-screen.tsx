import { Loader2Icon } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingScreenProps {
  message?: string;
  fullScreen?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const LoadingScreen = ({ 
  message, 
  fullScreen = true, 
  className,
  size = "md" 
}: LoadingScreenProps) => {
  const sizeClasses = {
    sm: "size-6",
    md: "size-10",
    lg: "size-16"
  };

  return (
    <div
      className={cn(
        "flex flex-col justify-center items-center gap-4 animate-in fade-in duration-300",
        fullScreen ? "h-screen" : "py-8",
        className
      )}
    >
      <Loader2Icon className={cn("animate-spin", sizeClasses[size])} />
      {message && (
        <p className="text-sm text-muted-foreground animate-pulse">{message}</p>
      )}
    </div>
  );
};

export default LoadingScreen;

// Inline loading spinner for smaller components
export function LoadingSpinner({ 
  className, 
  size = "sm" 
}: { 
  className?: string; 
  size?: "sm" | "md" | "lg";
}) {
  const sizeClasses = {
    sm: "size-4",
    md: "size-6",
    lg: "size-8"
  };

  return (
    <Loader2Icon 
      className={cn(
        "animate-spin",
        sizeClasses[size],
        className
      )} 
    />
  );
}

// Loading overlay for sections
export function LoadingOverlay({ 
  visible, 
  message 
}: { 
  visible: boolean; 
  message?: string;
}) {
  if (!visible) return null;

  return (
    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <LoadingSpinner size="md" />
        {message && (
          <p className="text-sm text-muted-foreground">{message}</p>
        )}
      </div>
    </div>
  );
}
