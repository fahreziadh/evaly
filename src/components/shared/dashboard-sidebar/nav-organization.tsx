"use client";

import { EllipsisVertical } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";

export const NavOrganization = () => {
  const isMobile = useIsMobile();
  const user = useQuery(api.organizer.profile.getProfile);

  const org = user?.organization

  if (!user) {
    return <Skeleton className="h-12 w-full" />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="w-full justify-start text-sm h-12 flex flex-row gap-2 items-center hover:opacity-70">
          <Avatar className="size-8 rounded-lg">
            {org?.image ? (
              <AvatarImage src={org?.image} alt="User" asChild>
                <img src={org?.image} alt="User" width={100} height={100} />
              </AvatarImage>
            ) : (
              <AvatarFallback className="rounded-lg bg-foreground/10">
                {org?.name?.charAt(0).toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1 text-start grid">
            <span className="font-medium">{org?.name}</span>
            <span className="text-xs text-muted-foreground">Free</span>
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
        <DropdownMenuLabel>Will be available soon</DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
