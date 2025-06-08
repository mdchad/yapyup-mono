import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { EditIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { XIcon } from "@/components/ui/x";
import { authClient } from "@/lib/auth-client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { InvitationDialog } from "@/components/invitation-dialog";
import { useQuery } from "@tanstack/react-query";
import { authQueries } from "@/lib/queries/auth";

export const Route = createFileRoute("/_protected/dashboard/org/$orgId/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: activeOrganization } = authClient.useActiveOrganization();
  const params = useParams({ from: "/_protected/dashboard/org/$orgId/" });
  const { data, isLoading } = useQuery(
    authQueries.fullOrganization(params.orgId),
  );

  const [org, setOrg] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOrg({ ...org, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    // Update organisation in Supabase
  };

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  if (!activeOrganization) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Tab Navigation */}
      <nav className="flex border-b bg-white px-12 pt-8 pb-2 gap-8 text-sm font-medium">
        <Link to="/dashboard/org/$orgId" params={{ orgId: params.orgId }} className="px-2 py-1 hover:text-black text-gray-600">Usage</Link>
        <Link to="/dashboard/org/$orgId" params={{ orgId: params.orgId }} className="px-2 py-1 hover:text-black text-gray-600">Billing</Link>
        <span className="px-2 py-1 rounded bg-gray-100 text-black">Team</span>
        <Link to="/dashboard/org/$orgId" params={{ orgId: params.orgId }} className="px-2 py-1 hover:text-black text-gray-600">SMTP</Link>
        <Link to="/dashboard/org/$orgId" params={{ orgId: params.orgId }} className="px-2 py-1 hover:text-black text-gray-600">Integrations</Link>
        <Link to="/dashboard/org/$orgId" params={{ orgId: params.orgId }} className="px-2 py-1 hover:text-black text-gray-600">Documents</Link>
      </nav>
      <main className="flex flex-col items-center px-4 py-10">
        {/* Overview Card */}
        <Card className="w-full max-w-2xl mb-10 shadow-xs">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex items-center gap-6 mb-6">
                {/* Avatar */}
                {activeOrganization?.logo_url ? (
                  <img
                    src={activeOrganization?.logo_url}
                    alt="Logo"
                    className="h-16 w-16 rounded-lg border object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gradient-to-br from-purple-700 to-purple-400 text-3xl font-bold text-white">
                    {activeOrganization.name?.[0]?.toUpperCase() || "I"}
                  </div>
                )}
                <Button type="button" variant="outline" className="h-9">Update Image</Button>
              </div>
              <div className="mb-4">
                <Label htmlFor="name">Team Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={activeOrganization.name || ""}
                  onChange={handleChange}
                  required
                  className="mt-2 capitalize"
                />
              </div>
              <Button type="submit" className="cursor-pointer" disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </Button>
              {error && <div className="text-sm text-red-500">{error}</div>}
              {success && <div className="text-sm text-green-600">Saved!</div>}
            </form>
          </CardContent>
        </Card>
        {/* Members Card */}
        <Card className="w-full max-w-2xl mb-10 shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Members</CardTitle>
            <Button className="ml-auto" variant="default">Invite</Button>
          </CardHeader>
          <CardContent>
            {isLoading && !data ? (
              <div className="space-y-2">
                {[...Array(2)].map((_, i) => (
                  <div className="flex space-x-8" key={i}>
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-6 w-1/4" />
                  </div>
                ))}
              </div>
            ) : (
              <table className="min-w-full text-sm">
                <thead>
                  <tr>
                    <th className="py-2 text-left">Email</th>
                    <th className="py-2 text-left">Role</th>
                    <th className="py-2 text-left">Enabled MFA</th>
                    <th className="py-2 text-left"></th>
                  </tr>
                </thead>
                <tbody>
                  {data?.data?.members.map((member) => (
                    <tr key={member.id} className="border-b last:border-b-0">
                      <td className="py-2">{member.user.email}</td>
                      <td className="py-2"><div className="bg-slate-100 rounded-lg px-2 py-1 inline-flex items-center font-medium text-xs capitalize">{member.role ? member.role : "—"}</div></td>
                      <td className="py-2">{'-'}</td>
                      <td className="py-2 text-right">
                        <Link
                          to="/dashboard/org/$orgId/user/$userId"
                          params={{
                            orgId: params.orgId,
                            userId: member.id,
                          }}
                        >
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6 cursor-pointer"
                          >
                            <EditIcon className="h-4 w-4" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
        {/* Invitations Card */}
        <Card className="w-full max-w-2xl shadow-xs">
          <CardHeader>
            <CardTitle>Invitations</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && !data ? (
              <div className="space-y-2">
                {[...Array(2)].map((_, i) => (
                  <div className="flex space-x-8" key={i}>
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-6 w-1/4" />
                  </div>
                ))}
              </div>
            ) : (
              <table className="min-w-full text-sm">
                <thead>
                  <tr>
                    <th className="py-2 text-left">Email</th>
                    <th className="py-2 text-left">Role</th>
                    <th className="py-2 text-left"></th>
                  </tr>
                </thead>
                <tbody>
                  {data?.data?.invitations?.map((invitee) => (
                    <tr key={invitee.id} className="border-b last:border-b-0">
                      <td className="py-2">{invitee.email}</td>
                      <td className="py-2"><div className="bg-slate-100 rounded-lg px-2 py-1 inline-flex items-center font-medium text-xs capitalize">{invitee.role ? invitee.role : "—"}</div></td>
                      <td className="py-2 text-right">
                        <Button variant="ghost" size="icon" className="h-6 w-6 cursor-pointer">
                          <XIcon className="text-red-400" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
