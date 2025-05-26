import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(organizer)/app/questions/')({
  component: RouteComponent
})

function RouteComponent() {
  return <div>Question Page</div>
}
