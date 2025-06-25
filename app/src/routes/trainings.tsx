import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/trainings')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/trainings"!</div>
}
