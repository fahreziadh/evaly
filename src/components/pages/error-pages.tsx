import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { 
  AlertCircle, 
  Lock, 
  ServerCrash, 
  WifiOff, 
  Clock,
  Home,
  RefreshCw,
  ArrowLeft
} from "lucide-react";

interface ErrorPageProps {
  onRetry?: () => void;
  showBackButton?: boolean;
}

// Base error page component
function ErrorPage({
  icon: Icon,
  title,
  description,
  suggestions,
  onRetry,
  showBackButton = true,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  suggestions?: string[];
  onRetry?: () => void;
  showBackButton?: boolean;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className="mb-6">
          <Icon className="w-20 h-20 mx-auto text-gray-400" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>

        {/* Description */}
        <p className="text-gray-600 mb-6">{description}</p>

        {/* Suggestions */}
        {suggestions && suggestions.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <p className="font-semibold text-sm text-gray-700 mb-2">Try these:</p>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              {suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-3 flex-wrap">
          {onRetry && (
            <Button onClick={onRetry} className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
          )}
          {showBackButton && (
            <Button
              variant="outline"
              onClick={() => window.history.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button>
          )}
          <Link to="/">
            <Button variant="outline" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Homepage
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

// 401 Unauthorized
export function UnauthorizedError({ onRetry, showBackButton }: ErrorPageProps) {
  return (
    <ErrorPage
      icon={Lock}
      title="401 - Unauthorized"
      description="You need to be logged in to access this page."
      suggestions={[
        "Check if you're logged in",
        "Your session may have expired",
        "Try logging in again",
      ]}
      onRetry={onRetry}
      showBackButton={showBackButton}
    />
  );
}

// 403 Forbidden
export function ForbiddenError({ onRetry, showBackButton }: ErrorPageProps) {
  return (
    <ErrorPage
      icon={Lock}
      title="403 - Access Denied"
      description="You don't have permission to access this resource."
      suggestions={[
        "Contact your administrator for access",
        "Check if you're using the correct account",
        "Request permission from the resource owner",
      ]}
      onRetry={onRetry}
      showBackButton={showBackButton}
    />
  );
}

// 500 Internal Server Error
export function ServerError({ onRetry, showBackButton }: ErrorPageProps) {
  return (
    <ErrorPage
      icon={ServerCrash}
      title="500 - Server Error"
      description="Something went wrong on our end. We're working to fix it."
      suggestions={[
        "Wait a few moments and try again",
        "Check our status page for updates",
        "Contact support if the problem persists",
      ]}
      onRetry={onRetry}
      showBackButton={showBackButton}
    />
  );
}

// 503 Service Unavailable
export function ServiceUnavailableError({ onRetry, showBackButton }: ErrorPageProps) {
  return (
    <ErrorPage
      icon={Clock}
      title="503 - Service Unavailable"
      description="The service is temporarily unavailable. Please try again later."
      suggestions={[
        "The service might be under maintenance",
        "Check back in a few minutes",
        "Follow our status page for updates",
      ]}
      onRetry={onRetry}
      showBackButton={showBackButton}
    />
  );
}

// Network Error
export function NetworkError({ onRetry, showBackButton }: ErrorPageProps) {
  return (
    <ErrorPage
      icon={WifiOff}
      title="Network Error"
      description="Unable to connect to the server. Please check your internet connection."
      suggestions={[
        "Check your internet connection",
        "Try disabling VPN or proxy",
        "Refresh the page",
        "Check if the site is accessible from another device",
      ]}
      onRetry={onRetry}
      showBackButton={showBackButton}
    />
  );
}

// Generic Error
export function GenericError({ 
  onRetry, 
  showBackButton,
  title = "Something Went Wrong",
  description = "An unexpected error occurred. Please try again."
}: ErrorPageProps & { title?: string; description?: string }) {
  return (
    <ErrorPage
      icon={AlertCircle}
      title={title}
      description={description}
      suggestions={[
        "Refresh the page",
        "Clear your browser cache",
        "Try again in a different browser",
        "Contact support if the issue persists",
      ]}
      onRetry={onRetry}
      showBackButton={showBackButton}
    />
  );
}