import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
  useRouterState,
  type ReactNode,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import { Toaster } from "../components/ui/sonner.tsx";
import appCss from "../styles/app.css?url";
import { NotFound } from "@/components/pages/not-found.tsx";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils.ts";
const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

export const Route = createRootRoute({
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
  notFoundComponent: () => <NotFound />,
});

function RootComponent() {
  const status = useRouterState()

  return (
    <RootDocument>
      <Loader2
        className={cn(
          "fixed top-2 right-2 animate-spin",
          status.isLoading
            ? "z-50 opacity-100 scale-100"
            : "-z-10 opacity-0 scale-0"
        )}
      />
      <Outlet />
    </RootDocument>
  );
}
function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        <ConvexAuthProvider client={convex}>{children}</ConvexAuthProvider>
        <Toaster position="top-center" />
        <TanStackRouterDevtools />
        <Scripts />
      </body>
    </html>
  );
}
