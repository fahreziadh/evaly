import { LogoType } from "@/components/shared/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { api } from "@convex/_generated/api";
import { useQuery } from "convex/react";

const NavbarLobby = () => {
  return (
    <div className="flex flex-row justify-between h-14 px-4 fixed top-0 w-full">
      <div className="flex flex-row items-center gap-2">
        <LogoType href="/" />
      </div>
      <div className="flex flex-row items-center gap-2">
        <AccountDropdown />
      </div>
    </div>
  );
};

const AccountDropdown = () => {
  const user = useQuery(api.participant.profile.getProfile);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="cursor-pointer hover:opacity-75 transition">
        <Avatar>
          <AvatarImage src={user?.image} />
          <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end" className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Update Profile</DropdownMenuItem>
        <DropdownMenuItem>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NavbarLobby;
