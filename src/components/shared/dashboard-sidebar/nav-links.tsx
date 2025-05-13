"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
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
      icon: <Home className="size-4" />,
    },
    {
      name: "Questions",
      href: "/app/questions",
      icon: <BookOpen className="size-4" />,
    },
    {
      name: "Participants",
      href: "/app/participants",
      icon: <UserCircle className="size-4" />,
    },
    {
      name: "Settings",
      href: "/app/settings",
      icon: <Cog className="size-4" />,
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
      <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild isActive={activeItem === item.href}>
                <Link to={item.href}>
                  {item.icon} {item.name}
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
