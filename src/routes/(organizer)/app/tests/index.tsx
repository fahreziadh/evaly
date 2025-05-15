import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(organizer)/app/tests/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/app/tests"!</div>
}
