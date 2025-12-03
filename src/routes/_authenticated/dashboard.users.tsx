import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/dashboard/users')({
  component: Users,
})

function Users() {
  return <div>Hello "/_authenticated/dashboard/users"!</div>
}
