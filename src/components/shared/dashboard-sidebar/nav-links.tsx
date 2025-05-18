"use client";

import {
  SidebarGroup,
  SidebarGroupContent, SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Link, useLocation } from "@tanstack/react-router";
import { BookOpen, Cog, Home, UserCircle } from "lucide-react";
import { useEffect, useState } from "react";

const NavLinks = () => {
  const pathname = useLocation({
    select(state) {
      return state.pathname
    },
  })
  const [activeItem, setActiveItem] = useState("/dashboard");

  const navItems = [
    {
      name: "Dashboard",
      href: "/app",
      icon: Home,
    },
    {
      name: "Questions",
      href: "/app/questions",
      icon: BookOpen,
    },
    {
      name: "Participants",
      href: "/app/participants",
      icon: UserCircle,
    },
    {
      name: "Settings",
      href: "/app/settings",
      icon: Cog,
    },
  ]

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
            (item) =>
              item.href !== "/app" && pathname.startsWith(item.href)
          )
          .sort((a, b) => b.href.length - a.href.length)[0];

        if (matchingItem) {
          setActiveItem(matchingItem.href);
        }
      }
    }
  }, [pathname, navItems]);

  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild isActive={activeItem === item.href}>
                <Link to={item.href}>
                  <item.icon className={cn("", activeItem === item.href && "")} /> {item.name}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default NavLinks;
