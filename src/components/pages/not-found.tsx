import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";

interface NotFoundProps {
  children?: React.ReactNode;
}

export function NotFound({ children }: NotFoundProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="text-center max-w-md space-y-6">
        {/* Main message */}
        <div>
          <h1 className="text-7xl font-bold text-gray-900">404</h1>
          <h2 className="text-xl font-medium text-gray-700 mt-2">
            Page not found
          </h2>
        </div>
        
        {/* Description */}
        <p className="text-gray-600">
          {children || "The page you are looking for doesn't exist or has been moved."}
        </p>
        
        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-3">
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
          >
            Go back
          </Button>
          <Link to="/">
            <Button>
              Go to homepage
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
