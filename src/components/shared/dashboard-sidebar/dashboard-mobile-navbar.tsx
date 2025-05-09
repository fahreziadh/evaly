"use client";

import { Button } from "@/components/ui/button";
import { LogoType } from "../logo";
import { Menu, XIcon } from "lucide-react";
import { NavUserAccount } from "./nav-user";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import NavLinks from "./nav-links";
import { useProgressBar } from "../progress-bar";
const DashboardMobileNavbar = () => {
  const [open, setOpen] = useState(false);
  const status = useProgressBar();
  useEffect(() => {
    if (status.state === "in-progress") {
      setOpen(false);
    }
  }, [status.state]);
  return (
    <div className="relative">
      <div className="h-14 bg-background border-b px-4 md:hidden flex flex-row items-center justify-between sticky top-0 z-50">
        <LogoType />
        <div className="flex flex-row items-center gap-2">
          <NavUserAccount />
          <Button
            variant={"ghost"}
            size={"icon"}
            onClick={() => setOpen(!open)}
            className="relative"
          >
            <Menu
              className={cn(
                "size-5 absolute left-1 transition-all duration-100",
                !open ? "scale-100" : "scale-0"
              )}
            />
            <XIcon
              className={cn(
                "size-5 absolute left-1 transition-all duration-100",
                open ? "scale-100" : "scale-0"
              )}
            />
          </Button>
        </div>
      </div>
      {open ? (
        <div className="fixed top-14 left-0 w-full h-full bg-background z-50">
          <div className="flex flex-col gap-4">
            <NavLinks />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default DashboardMobileNavbar;
