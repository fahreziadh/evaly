"use client";

import { Building2, LogOut, User, Home, Settings } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { useNavigate } from "@tanstack/react-router";
import { useAuthActions } from "@convex-dev/auth/react";

export const NavUser = () => {
  const { isMobile } = useSidebar();
  const user = useQuery(api.organizer.profile.getProfile);
  const { signOut } = useAuthActions();
  const navigate = useNavigate();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size={"icon"} variant={"ghost"} className="rounded-full">
          <Avatar className="rounded-full">
            {user?.image ? (
              <AvatarImage src={user?.image} alt="User" asChild>
                <img
                  src={user?.image}
                  alt="User"
                  width={60}
                  height={60}
                  className="rounded-full size-8"
                />
              </AvatarImage>
            ) : (
              <AvatarFallback>
                {user?.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        side={isMobile ? "bottom" : "right"}
        align="start"
        sideOffset={4}
        alignOffset={4}
      >
        <DropdownMenuLabel className="flex flex-row gap-3">
          <Avatar className="size-8 rounded-full">
            {user?.image ? (
              <AvatarImage src={user?.image} alt="User" asChild>
                <img
                  src={user?.image}
                  alt="User"
                  width={32}
                  height={32}
                  className="rounded-full size-8"
                />
              </AvatarImage>
            ) : (
              <AvatarFallback>
                {user?.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">
              {user?.name || "N/A"}
            </span>
            <span className="truncate text-xs">{user?.email || "N/A"}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate({ to: "/" })}>
          <User className="size-3.5 mr-1" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate({ to: "/" })}>
          <Building2 className="size-3.5 mr-1" />
          Organization
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => navigate({ to: "/" })}>
          <Settings className="size-3.5 mr-1" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate({ to: "/" })}>
          <Home className="size-3.5 mr-1" />
          Home
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            signOut();
          }}
        >
          <LogOut className="size-3.5 mr-1" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
