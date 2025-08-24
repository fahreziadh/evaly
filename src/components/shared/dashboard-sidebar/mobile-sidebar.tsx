import { cn } from "@/lib/utils";
import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BookLock, Home, Settings, SquareUserRound, Menu } from "lucide-react";
import { NavUser } from "./nav-user";
import { NavOrganization } from "./nav-organization";
import { LogoLink } from "../logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";

const MobileSidebar = ({ className }: { className?: string }) => {
  const pathname = useLocation({
    select(state) {
      return state.pathname;
    },
  });
  const [activeItem, setActiveItem] = useState("/dashboard");
  const [open, setOpen] = useState(false);

  const navItems = [
    {
      name: "Dashboard",
      href: "/app",
      icon: Home,
    },
    {
      name: "Questions",
      href: "/app/questions",
      icon: BookLock,
    },
    {
      name: "Participants",
      href: "/app/participants",
      icon: SquareUserRound,
    },
    {
      name: "Settings",
      href: "/app/settings",
      icon: Settings,
    },
  ];

  useEffect(() => {
    if (pathname) {
      if (pathname === "/app" || pathname.startsWith("/app/test")) {
        setActiveItem("/app");
      } else {
        const matchingItem = navItems
          .filter(
            (item) => item.href !== "/app" && pathname.startsWith(item.href)
          )
          .sort((a, b) => b.href.length - a.href.length)[0];

        if (matchingItem) {
          setActiveItem(matchingItem.href);
        }
      }
    }
  }, [pathname]);

  return (
    <div className={cn("sticky top-0 z-50 bg-background border-b px-4 py-3", className)}>
      <div className="flex items-center justify-between">
        <LogoLink href="/app" />
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[280px] p-0">
            <SheetHeader className="px-6 py-4 border-b">
              <NavOrganization />
            </SheetHeader>
            <div className="flex flex-col py-4">
              {navItems.map((e) => (
                <Link 
                  to={e.href} 
                  key={e.href}
                  onClick={() => setOpen(false)}
                >
                  <button
                    className={cn(
                      "font-medium py-3 px-6 flex flex-row items-center text-[15px] gap-3 w-full",
                      activeItem === e.href
                        ? "bg-muted font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    <e.icon className="size-4" />
                    {e.name}
                  </button>
                </Link>
              ))}
            </div>
            <div className="mt-auto border-t px-6 py-4">
              <NavUser />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default MobileSidebar;