import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader
} from '@/components/ui/sidebar'

import NavLinks from './nav-links'
import { NavOrganization } from './nav-organization'
import { NavUser } from './nav-user'

const DashboardSidebar = () => {
  return (
    <Sidebar>
      <SidebarHeader className="gap-4">
        <NavUser />
        <NavOrganization />
      </SidebarHeader>
      <SidebarContent>
        <NavLinks />
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
    </Sidebar>
  )
}

export default DashboardSidebar
