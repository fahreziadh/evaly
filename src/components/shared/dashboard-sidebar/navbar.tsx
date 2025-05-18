import { useEffect, useState } from "react";
import { NavUser } from "./nav-user";
import { cn } from "@/lib/utils";

const Navbar = () => {
  const [showBorder, setShowBorder] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBorder(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <div
      className={cn(
        "px-8 h-14 flex flex-row justify-between sticky top-0 z-50 bg-background",
        showBorder && "border-b border-border"
      )}
    >
      <div></div>
      <div className="flex flex-row items-center gap-2">
        <NavUser />
      </div>
    </div>
  );
};

export default Navbar;
