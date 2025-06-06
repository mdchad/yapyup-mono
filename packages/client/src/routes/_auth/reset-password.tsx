import { createFileRoute } from '@tanstack/react-router'
import { UpdatePasswordForm } from "@/components/update-password-form"

export const Route = createFileRoute('/_auth/reset-password')({
  component: ResetPassword,
})

function ResetPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-6">
        <UpdatePasswordForm />
      </div>
    </div>
  )
} 