import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
} from "@/components/ui/sidebar";
import NavLinks from "./nav-links";
import { LogoType } from "../logo";

const DashboardSidebars = () => {
  return (
    <Sidebar>
      <SidebarHeader className="gap-4">
        <SidebarMenu className="p-2">
          <LogoType href="/app" />
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavLinks />
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
    </Sidebar>
  );
};

export default DashboardSidebars;
