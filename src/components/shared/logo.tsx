"use client";

import { EqualApproximatelyIcon } from "lucide-react";
import { Link } from "./progress-bar";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  href?: string;
}

export const LogoType = ({ className, href = "/" }: Props) => {
  return (
    <Link href={href} className={cn("flex items-center gap-2", className)}>
      <Logo />
      <span className="font-extrabold font-mono">Evaly</span>
    </Link>
  );
};

export const Logo = ({ className, }: { className?: string, }) => {
  return (
    <div className={cn("size-6 bg-foreground flex items-center justify-center rounded-sm", className)}>
      <EqualApproximatelyIcon size={18} strokeWidth={3} className="stroke-background" />
    </div>
  );
};
