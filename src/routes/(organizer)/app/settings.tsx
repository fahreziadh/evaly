import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(organizer)/app/settings')({
  component: RouteComponent
})

function RouteComponent() {
  return <div>Hello "/(dashboard)/settings"!</div>
}
