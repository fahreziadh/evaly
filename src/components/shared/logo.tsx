"use client";

import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";

interface Props {
  className?: string;
  href?: string;
}

export const LogoLink = ({ className, href = "/" }: Props) => {
  return (
    <Link to={href} className={cn("flex items-center gap-2", className)}>
      <LogoType />
    </Link>
  );
};

export const LogoType = ({ className }: { className?: string}) => {
  return (
    <div className={cn("font-extrabold text-primary text-3xl italic", className)}>
      evaly
    </div>
  );
};
