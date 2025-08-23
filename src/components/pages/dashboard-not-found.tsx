import { Link, useLocation } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Home, FileText, HelpCircle, Search } from "lucide-react";

const suggestions = [
  { to: "/app", label: "Dashboard", icon: Home, description: "Go to main dashboard" },
  { to: "/app/tests", label: "Tests", icon: FileText, description: "Manage your tests" },
  { to: "/app/questions", label: "Questions", icon: HelpCircle, description: "Question library" },
];

const funMessages = [
  "Oops! This page decided to play hide and seek 🙈",
  "404: Page not found (but your creativity is!) ✨",
  "This page is on a coffee break ☕",
  "Lost in the dashboard wilderness? 🗺️",
  "Page.exe has stopped working 🤖",
];

export function DashboardNotFound() {
  const location = useLocation();
  const randomMessage = funMessages[Math.floor(Math.random() * funMessages.length)];
  const attemptedPath = location.pathname;
  
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-6">
      <div className="max-w-lg w-full space-y-8">
        {/* Fun Header */}
        <div className="text-center">
          <div className="text-8xl mb-4">🤷‍♀️</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {randomMessage}
          </h1>
          <p className="text-gray-600">
            The page <Badge variant="secondary" className="mx-1 font-mono text-xs">{attemptedPath}</Badge> doesn't exist in your dashboard.
          </p>
        </div>
        
        {/* Suggestions Grid */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Search className="w-4 h-4" />
            Where would you like to go instead?
          </h3>
          <div className="grid gap-3">
            {suggestions.map((suggestion) => {
              const Icon = suggestion.icon;
              return (
                <Link key={suggestion.to} to={suggestion.to}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer group">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-50 group-hover:bg-blue-100 transition-colors">
                          <Icon className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{suggestion.label}</div>
                          <div className="text-sm text-gray-500">{suggestion.description}</div>
                        </div>
                        <div className="text-gray-400 group-hover:text-gray-600">→</div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
        
        {/* Alternative Actions */}
        <div className="flex items-center justify-center gap-3 pt-4 border-t">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => window.history.back()}
          >
            ← Go back
          </Button>
          <span className="text-gray-300">•</span>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => window.location.reload()}
          >
            🔄 Refresh
          </Button>
        </div>
        
        {/* Help Text */}
        <p className="text-xs text-gray-400 text-center">
          Still lost? The sidebar on the left has all your navigation options!
        </p>
      </div>
    </div>
  );
}