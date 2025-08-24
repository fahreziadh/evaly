import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useRouterState,
} from "@tanstack/react-router";
import { Toaster } from "../components/ui/sonner.tsx";
import appCss from "../styles/app.css?url";
import { NotFound } from "@/components/pages/not-found.tsx";
import { ErrorBoundary } from "@/components/shared/error-boundary.tsx";
import { GenericError } from "@/components/pages/error-pages.tsx";
import { QueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils.ts";
import type { ReactNode } from "react";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()(
  {
    component: RootComponent,
    head: () => ({
      meta: [
        {
          charSet: "utf-8",
        },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
        {
          title: "Evaly",
        },
      ],
      links: [
        {
          rel: "stylesheet",
          href: appCss,
        },
        { rel: "icon", href: "/favicon.ico" },
      ],
    }),
    notFoundComponent: () => {
      return (
        <RootDocument>
          <NotFound />
        </RootDocument>
      );
    },
    errorComponent: () => {
      return (
        <RootDocument>
          <GenericError />
        </RootDocument>
      );
    },
  }
);

function RootComponent() {
  return (
    <ErrorBoundary
      fallback={
        <RootDocument>
          <GenericError />
        </RootDocument>
      }
      onError={(error, errorInfo) => {
        // Log to error tracking service in production
        if (!import.meta.env.DEV) {
          console.error("Application Error:", error, errorInfo);
          // You can send to Sentry, LogRocket, etc. here
        }
      }}
    >
      <RootDocument>
        <Outlet />
      </RootDocument>
    </ErrorBoundary>
  );
}
function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  const status = useRouterState();

  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body className={cn("antialiased ",status.isLoading ? "animate-pulse" : "")}>
        {children}
        <Toaster position="top-center" />
        {/* <TanStackRouterDevtools /> */}
        <Scripts />
      </body>
    </html>
  );
}
