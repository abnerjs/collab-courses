import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/matriz-treinamentos')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/matriz-treinamentos"!</div>
}
