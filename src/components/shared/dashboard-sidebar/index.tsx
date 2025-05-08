import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
} from "@/components/ui/sidebar";
import { NavUser } from "./nav-user";
import { NavOrganization } from "./nav-organization";
import NavLinks from "./nav-links";

const DashboardSidebar = () => {
  return (
    <Sidebar>
      <SidebarHeader>
        <NavUser />
        <NavOrganization />
      </SidebarHeader>
      <SidebarContent>
        <NavLinks />
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
    </Sidebar>
  );
};

export default DashboardSidebar;
