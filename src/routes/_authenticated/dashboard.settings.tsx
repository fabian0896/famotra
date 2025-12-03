import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/dashboard/settings')({
  component: Settings,
})

function Settings() {
  return <div>Hello "/_authenticated/dashboard/settings"!</div>
}
