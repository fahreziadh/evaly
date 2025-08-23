"use client";

import {
  LogOut,
  Home,
  User,
  Building2,
  Settings, EllipsisVertical
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQuery } from "convex-helpers/react/cache";
import { api } from "@convex/_generated/api";
import { useNavigate } from "@tanstack/react-router";
import { useAuthActions } from "@convex-dev/auth/react";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";

export const NavUser = () => {
  const isMobile = useIsMobile();
  const user = useQuery(api.organizer.profile.getProfile);
  const { signOut } = useAuthActions();
  const navigate = useNavigate();

  if (!user) {
    return <Skeleton className="h-12 w-full" />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="w-full justify-start text-sm h-12 flex flex-row gap-2 items-center hover:opacity-70">
          <Avatar className="size-8 rounded-lg">
            {user?.image ? (
              <AvatarImage src={user?.image} alt="User" asChild>
                <img src={user?.image} alt="User" width={100} height={100} />
              </AvatarImage>
            ) : (
              <AvatarFallback className="rounded-lg bg-foreground/10">
                {user?.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1 text-start grid">
            <span className="font-medium">{user.name}</span>
            <span className="text-xs text-muted-foreground">{user.email}</span>
          </div>
          <EllipsisVertical className="size-4 text-muted-foreground" />
        </button>
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
