import React from 'react'

export const dynamic = 'force-static'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <div>{children}</div>
}

export default Layout
