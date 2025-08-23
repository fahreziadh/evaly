import { Loader2, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

// Inline Loading Indicator
export function LoadingDots({ className }: { className?: string }) {
  return (
    <div className={cn("flex space-x-1", className)}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
          style={{
            animationDelay: `${i * 0.2}s`,
            animationDuration: '1.4s'
          }}
        />
      ))}
    </div>
  );
}

// Loading Text with animated dots
export function LoadingText({ 
  text = "Loading", 
  className 
}: { 
  text?: string; 
  className?: string; 
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      {text}
      <LoadingDots />
    </span>
  );
}

// Pulsing Container
export function PulsingContainer({ 
  children, 
  className,
  isLoading = false 
}: { 
  children: React.ReactNode; 
  className?: string;
  isLoading?: boolean;
}) {
  return (
    <div className={cn(className, isLoading && "animate-pulse opacity-60")}>
      {children}
    </div>
  );
}

// Loading Button with different states
export function LoadingButton({
  loading,
  loadingText = "Loading...",
  children,
  className,
  disabled,
  ...props
}: {
  loading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
} & React.ComponentProps<typeof Button>) {
  return (
    <Button
      className={className}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </Button>
  );
}

// Refresh Button
export function RefreshButton({
  onRefresh,
  loading = false,
  className,
  size = "sm",
  ...props
}: {
  onRefresh: () => void;
  loading?: boolean;
  className?: string;
  size?: "sm" | "default" | "lg";
} & Omit<React.ComponentProps<typeof Button>, 'onClick' | 'size'>) {
  return (
    <Button
      variant="ghost"
      size={size}
      onClick={onRefresh}
      disabled={loading}
      className={className}
      {...props}
    >
      <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
    </Button>
  );
}

// Content Placeholder
export function ContentPlaceholder({ 
  title = "Loading...", 
  description,
  className 
}: { 
  title?: string; 
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center", className)}>
      <Loader2 className="h-8 w-8 animate-spin mb-4 text-gray-400" />
      <h3 className="font-medium text-gray-900 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-gray-500">{description}</p>
      )}
    </div>
  );
}

// Table Loading Row
export function TableLoadingRow({ columns = 4 }: { columns?: number }) {
  return (
    <tr>
      <td colSpan={columns} className="p-4">
        <div className="flex items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin mr-2" />
          <span className="text-sm text-gray-500">Loading...</span>
        </div>
      </td>
    </tr>
  );
}

// Card Loading State
export function LoadingCard({ className }: { className?: string }) {
  return (
    <div className={cn("border rounded-lg p-4 animate-pulse", className)}>
      <div className="flex items-center justify-center h-32">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    </div>
  );
}

// Progress Loading Bar
export function LoadingProgress({ 
  progress = 0, 
  className,
  showPercentage = true 
}: { 
  progress?: number; 
  className?: string;
  showPercentage?: boolean;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      {showPercentage && (
        <div className="text-sm text-gray-600 text-center">
          {progress}%
        </div>
      )}
    </div>
  );
}

// Loading Overlay for sections
export function SectionLoadingOverlay({ 
  visible, 
  message = "Loading...",
  className 
}: { 
  visible: boolean; 
  message?: string;
  className?: string;
}) {
  if (!visible) return null;

  return (
    <div className={cn(
      "absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center rounded-lg",
      className
    )}>
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin" />
        <p className="text-sm text-gray-600">{message}</p>
      </div>
    </div>
  );
}

// Skeleton Text Lines
export function SkeletonLines({ 
  lines = 3, 
  className 
}: { 
  lines?: number; 
  className?: string; 
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-4 bg-gray-200 rounded animate-pulse",
            i === lines - 1 ? "w-2/3" : "w-full"
          )}
        />
      ))}
    </div>
  );
}

// Loading State Hook Wrapper Component
export function LoadingStateWrapper<T>({
  isLoading,
  error,
  data,
  loadingComponent,
  errorComponent,
  children,
  emptyComponent,
}: {
  isLoading: boolean;
  error?: Error | null;
  data?: T;
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
  emptyComponent?: React.ReactNode;
  children: (data: T) => React.ReactNode;
}) {
  if (isLoading) {
    return <>{loadingComponent || <ContentPlaceholder />}</>;
  }

  if (error) {
    return <>{errorComponent || <div>Error: {error.message}</div>}</>;
  }

  if (!data) {
    return <>{emptyComponent || <ContentPlaceholder title="No data" />}</>;
  }

  return <>{children(data)}</>;
}