import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(organizer)/app/participants')({
  component: RouteComponent
})

function RouteComponent() {
  return <div>Hello "/(dashboard)/participants"!</div>
}
