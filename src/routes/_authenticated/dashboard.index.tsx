import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/dashboard/')({
  component: Index,
})

function Index() {
  return <div>Hello "/_authenticated/dashboard/"!</div>
}
