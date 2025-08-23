import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RefreshCw, AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface RetryErrorProps {
  error: Error | null;
  onRetry: () => void | Promise<void>;
  maxRetries?: number;
  retryDelay?: number;
  autoRetry?: boolean;
  className?: string;
  showError?: boolean;
  successMessage?: string;
}

export function RetryError({
  error,
  onRetry,
  maxRetries = 3,
  retryDelay = 1000,
  autoRetry = false,
  className,
  showError = true,
  successMessage = "Operation completed successfully!",
}: RetryErrorProps) {
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (autoRetry && error && retryCount < maxRetries) {
      const delay = retryDelay * Math.pow(2, retryCount); // Exponential backoff
      let timeLeft = Math.floor(delay / 1000);
      setCountdown(timeLeft);

      const countdownInterval = setInterval(() => {
        timeLeft -= 1;
        setCountdown(timeLeft);
        if (timeLeft <= 0) {
          clearInterval(countdownInterval);
          handleRetry();
        }
      }, 1000);

      return () => clearInterval(countdownInterval);
    }
  }, [error, retryCount, autoRetry, maxRetries, retryDelay]);

  const handleRetry = async () => {
    setIsRetrying(true);
    setCountdown(null);
    setIsSuccess(false);
    
    try {
      await onRetry();
      setIsSuccess(true);
      setRetryCount(0);
      // Clear success message after 3 seconds
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (err) {
      setRetryCount(prev => prev + 1);
    } finally {
      setIsRetrying(false);
    }
  };

  if (!error && !isSuccess) return null;

  const hasReachedMaxRetries = retryCount >= maxRetries;

  return (
    <div className={cn("space-y-3", className)}>
      {/* Success Message */}
      {isSuccess && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            {successMessage}
          </AlertDescription>
        </Alert>
      )}

      {/* Error Message */}
      {error && showError && !isSuccess && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error.message || "An error occurred. Please try again."}
            {retryCount > 0 && (
              <span className="block mt-1 text-sm">
                Retry attempt {retryCount} of {maxRetries}
              </span>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Retry Controls */}
      {error && !isSuccess && (
        <div className="flex items-center gap-3">
          <Button
            onClick={handleRetry}
            disabled={isRetrying || countdown !== null || hasReachedMaxRetries}
            size="sm"
            variant={hasReachedMaxRetries ? "destructive" : "default"}
            className="flex items-center gap-2"
          >
            <RefreshCw className={cn("h-4 w-4", isRetrying && "animate-spin")} />
            {isRetrying
              ? "Retrying..."
              : countdown !== null
              ? `Retrying in ${countdown}s...`
              : hasReachedMaxRetries
              ? "Max retries reached"
              : "Retry"}
          </Button>

          {hasReachedMaxRetries && (
            <span className="text-sm text-gray-500">
              Please refresh the page or contact support.
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// Hook for retry logic
export function useRetry<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    retryDelay?: number;
    onError?: (error: Error, attempt: number) => void;
  } = {}
) {
  const { maxRetries = 3, retryDelay = 1000, onError } = options;
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [attempt, setAttempt] = useState(0);

  const execute = async () => {
    setIsLoading(true);
    setError(null);
    
    let currentAttempt = 0;
    
    while (currentAttempt <= maxRetries) {
      try {
        const result = await fn();
        setData(result);
        setAttempt(0);
        setIsLoading(false);
        return result;
      } catch (err) {
        currentAttempt++;
        setAttempt(currentAttempt);
        
        const error = err instanceof Error ? err : new Error(String(err));
        
        if (currentAttempt > maxRetries) {
          setError(error);
          setIsLoading(false);
          if (onError) onError(error, currentAttempt);
          throw error;
        }
        
        if (onError) onError(error, currentAttempt);
        
        // Exponential backoff
        await new Promise(resolve => 
          setTimeout(resolve, retryDelay * Math.pow(2, currentAttempt - 1))
        );
      }
    }
  };

  const retry = () => execute();

  return { data, error, isLoading, attempt, retry, execute };
}

// Inline retry component for small operations
export function InlineRetry({
  onRetry,
  isLoading = false,
  error,
  className,
}: {
  onRetry: () => void;
  isLoading?: boolean;
  error?: string | null;
  className?: string;
}) {
  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      {error && (
        <span className="text-sm text-red-600">{error}</span>
      )}
      <Button
        onClick={onRetry}
        disabled={isLoading}
        size="sm"
        variant="ghost"
        className="h-auto p-1"
      >
        <RefreshCw className={cn("h-3 w-3", isLoading && "animate-spin")} />
      </Button>
    </div>
  );
}