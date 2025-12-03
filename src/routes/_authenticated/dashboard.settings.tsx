import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/dashboard/settings')({
  beforeLoad: () => ({
    breadcrumb: 'Ajustes'
  }),
  component: Settings,
})

function Settings() {
  return <div>Settings Page</div>
}
