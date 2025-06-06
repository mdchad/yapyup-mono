import { createFileRoute } from '@tanstack/react-router'
import OrganisationForm from "@/components/organisation-form";
import { trpcQueryUtils } from '@/main';

export const Route = createFileRoute('/_auth/set-organisation')({
  component: RootComponent,
})

function RootComponent() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-6">
      </div>
    </div>
  )
}