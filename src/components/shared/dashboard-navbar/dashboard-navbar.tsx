import { Button } from "@/components/ui/button";
import { NavUser } from "./nav-user";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";

const DashboardNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = useLocation({
    select(state) {
      return state.pathname;
    },
  });
  const [activeItem, setActiveItem] = useState("/dashboard");

  const navItems = [
    {
      name: "Dashboard",
      href: "/app",
    },
    {
      name: "Questions",
      href: "/app/questions",
    },
    {
      name: "Participants",
      href: "/app/participants",
    },
    {
      name: "Settings",
      href: "/app/settings",
    },
  ];

  useEffect(() => {
    // Set active item based on pathname or keep it as state for demo
    if (pathname) {
      // Special case for /dashboard - only active for /dashboard or /dashboard/test/*
      if (pathname === "/app" || pathname.startsWith("/app/test")) {
        setActiveItem("/app");
      }
      // For other routes, find matching nav items
      else {
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
  }, [pathname, navItems]);
  useEffect(() => {
    if (!window) return;
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <div
      className={cn(
        "h-14 flex flex-row justify-between items-center px-4 md:px-6 sticky top-0 bg-background border-b border-transparent",
        isScrolled ? "border-border" : ""
      )}
    >
      <div className="flex flex-row items-center">
        {/* <Button variant={"outline"} className="mr-8">
          <Building2 />
          SMK Adi Sanggoro
          <ChevronsUpDown />
        </Button> */}

        {navItems.map((e) => (
          <Link to={e.href}>
            <Button variant={"ghost"} className={activeItem === e.href ? "" : "text-muted-foreground"}>{e.name}</Button>
          </Link>
        ))}
      </div>
      <div className="flex flex-row items-center gap-2">
        <NavUser />
      </div>
    </div>
  );
};

export default DashboardNavbar;
