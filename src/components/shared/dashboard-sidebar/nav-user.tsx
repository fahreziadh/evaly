"use client";

import { Building2, LogOut, User, Home, Settings } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { trpc } from "@/trpc/trpc.client";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { useProgressRouter } from "../progress-bar";

export function NavUser() {
  const { isMobile } = useSidebar();
  const { data, isPending } = trpc.organization.profile.useQuery();
  const router = useProgressRouter();

  if (isPending) return <Skeleton className="h-12 w-full" />;
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size={"lg"}
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="size-8 rounded-full">
                {data?.user?.image ? (
                  <AvatarImage src={data?.user?.image} alt="User" asChild>
                    <Image
                      src={data?.user?.image}
                      alt="User"
                      width={32}
                      height={32}
                      className="rounded-full size-8"
                    />
                  </AvatarImage>
                ) : (
                  <AvatarFallback>
                    {data?.user?.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  {data?.user?.name || "N/A"}
                </span>
                <span className="truncate text-xs">
                  {data?.user?.email || "N/A"}
                </span>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="start"
            sideOffset={4}
            alignOffset={4}
          >
            <DropdownMenuLabel>Hi {data?.user?.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => router.push("/dashboard/settings?tab=profile")}
            >
              <User className="size-3.5 mr-1" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                router.push("/dashboard/settings?tab=organization")
              }
            >
              <Building2 className="size-3.5 mr-1" />
              Organization
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push("/dashboard/settings?tab=general")}
            >
              <Settings className="size-3.5 mr-1" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/")}>
              <Home className="size-3.5 mr-1" />
              Home
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                router.push("/logout");
              }}
            >
              <LogOut className="size-3.5 mr-1" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
