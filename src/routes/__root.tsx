import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useRouterState,
  type ReactNode,
} from "@tanstack/react-router";
import { Toaster } from "../components/ui/sonner.tsx";
import appCss from "../styles/app.css?url";
import { NotFound } from "@/components/pages/not-found.tsx";
import { QueryClient } from "@tanstack/react-query";
import { cn } from "@/lib/utils.ts";

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
    notFoundComponent: () => <NotFound />,
  }
);

function RootComponent() {

  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}
function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  const status = useRouterState();

  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body className={cn("antialiased font-sans",status.isLoading ? "animate-pulse" : "")}>
        {children}
        <Toaster position="top-center" />
        {/* <TanStackRouterDevtools /> */}
        <Scripts />
      </body>
    </html>
  );
}
