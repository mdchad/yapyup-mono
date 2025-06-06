import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { createFileRoute, Link, useRouterState } from '@tanstack/react-router'
import { cn } from '@/lib/utils'
import { EditIcon } from 'lucide-react'
import { authClient } from "@/lib/auth-client";
import { useQuery } from "@tanstack/react-query";
import { authQueries } from "@/lib/queries/auth";


export const Route = createFileRoute(
  '/_protected/dashboard/org/$orgId/user/$userId',
)({
  component: RouteComponent,
  // loader: async ({ params, context }) => {
  //   const member = await authClient.organization.getActiveMember()
  //
  //   return member?.data?.user
  // },
})


function RouteComponent() {
  // const user = Route.useLoaderData()
  const { data, isLoading } = useQuery(authQueries.activeMember())

  async function handleSubmit(e: any) {
    e.preventDefault();
  }

  function handleChange() {}

  return (
    <div>
      <main className="flex-1 flex flex-col py-12 px-6">
        <div className="flex flex-col gap-6 px-30">
          <h2 className="text-xl font-semibold">General details</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" value={data?.data?.user.name || ''} onChange={handleChange} required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="slug">Email</Label>
                <div className="flex gap-2">
                  <Input
                    id="email"
                    name="email"
                    value={data?.data?.user.email || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
            <Button type="submit" className="w-full">{'Update'}</Button>
          </form>
        </div>
      </main>
    </div>
  )
}
