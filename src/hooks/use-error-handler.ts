import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

export type ErrorType = 
  | "NETWORK_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "SERVER_ERROR"
  | "VALIDATION_ERROR"
  | "UNKNOWN_ERROR";

interface ErrorHandlerOptions {
  showToast?: boolean;
  redirectTo?: string;
  fallbackMessage?: string;
  onError?: (error: Error, type: ErrorType) => void;
}

export function useErrorHandler(options: ErrorHandlerOptions = {}) {
  const navigate = useNavigate();
  const [isHandlingError, setIsHandlingError] = useState(false);
  
  const {
    showToast = true,
    redirectTo,
    fallbackMessage = "An unexpected error occurred",
    onError,
  } = options;

  const getErrorType = (error: any): ErrorType => {
    // Check for network errors
    if (!navigator.onLine || error.message?.toLowerCase().includes("network")) {
      return "NETWORK_ERROR";
    }

    // Check for HTTP status codes
    const status = error?.status || error?.response?.status;
    if (status === 401) return "UNAUTHORIZED";
    if (status === 403) return "FORBIDDEN";
    if (status === 404) return "NOT_FOUND";
    if (status >= 500) return "SERVER_ERROR";
    if (status >= 400) return "VALIDATION_ERROR";

    // Check for Convex-specific errors
    if (error?.message?.includes("Unauthorized")) return "UNAUTHORIZED";
    if (error?.message?.includes("Forbidden")) return "FORBIDDEN";
    if (error?.message?.includes("not found")) return "NOT_FOUND";

    return "UNKNOWN_ERROR";
  };

  const getErrorMessage = (error: any, type: ErrorType): string => {
    // Try to get a user-friendly message
    const message = error?.message || error?.data?.message || fallbackMessage;

    switch (type) {
      case "NETWORK_ERROR":
        return "Network error. Please check your connection and try again.";
      case "UNAUTHORIZED":
        return "You need to log in to continue.";
      case "FORBIDDEN":
        return "You don't have permission to perform this action.";
      case "NOT_FOUND":
        return "The requested resource was not found.";
      case "SERVER_ERROR":
        return "Server error. Please try again later.";
      case "VALIDATION_ERROR":
        return message || "Please check your input and try again.";
      default:
        return message;
    }
  };

  const handleError = useCallback(
    async (error: Error | any) => {
      if (isHandlingError) return; // Prevent multiple error handlers
      
      setIsHandlingError(true);
      
      try {
        const errorType = getErrorType(error);
        const errorMessage = getErrorMessage(error, errorType);

        // Log error in development
        if (import.meta.env.DEV) {
          console.error(`[${errorType}]:`, error);
        }

        // Call custom error handler if provided
        if (onError) {
          onError(error, errorType);
        }

        // Show toast notification
        if (showToast) {
          switch (errorType) {
            case "NETWORK_ERROR":
              toast.error(errorMessage, {
                action: {
                  label: "Retry",
                  onClick: () => window.location.reload(),
                },
              });
              break;
            case "UNAUTHORIZED":
              toast.error(errorMessage);
              // Redirect to login after a delay
              setTimeout(() => {
                navigate({ to: "/login" });
              }, 1500);
              break;
            default:
              toast.error(errorMessage);
          }
        }

        // Handle redirects
        if (redirectTo) {
          await navigate({ to: redirectTo });
        } else if (errorType === "UNAUTHORIZED" && !showToast) {
          await navigate({ to: "/login" });
        }
      } finally {
        setIsHandlingError(false);
      }
    },
    [navigate, showToast, redirectTo, fallbackMessage, onError, isHandlingError]
  );

  return { handleError, isHandlingError };
}

// Wrapper for async operations with error handling
export function useAsyncOperation<T = any>() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { handleError } = useErrorHandler();

  const execute = useCallback(
    async (
      operation: () => Promise<T>,
      options?: {
        onSuccess?: (data: T) => void;
        onError?: (error: Error) => void;
        showErrorToast?: boolean;
      }
    ): Promise<T | undefined> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await operation();
        if (options?.onSuccess) {
          options.onSuccess(result);
        }
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        
        if (options?.onError) {
          options.onError(error);
        }
        
        if (options?.showErrorToast !== false) {
          handleError(error);
        }
        
        return undefined;
      } finally {
        setIsLoading(false);
      }
    },
    [handleError]
  );

  return { execute, isLoading, error };
}