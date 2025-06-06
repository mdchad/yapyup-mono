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

  // if (loading) {
  //   return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  // }

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
    <div className="flex">
      {/* Main content */}
      <main className="flex flex-1 flex-col px-48 py-12">
        <div className="flex flex-col gap-6">
          <h2 className="text-xl font-semibold">General details</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="mb-8 flex items-center gap-4">
              {/* Logo preview */}
              {activeOrganization?.logo_url ? (
                <img
                  src={activeOrganization?.logo_url}
                  alt="Logo"
                  className="h-16 w-16 rounded-full border object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 text-2xl">
                  🏢
                </div>
              )}
              <div>
                <div className="text-lg font-semibold">
                  {activeOrganization.name}
                </div>
                <div className="text-sm text-gray-500">
                  Organization profile
                </div>
              </div>
              {/*<Button type="submit" variant="outline" className="ml-auto" disabled={saving}>*/}
              {/*  Edit profile*/}
              {/*</Button>*/}
              <div>
                <InvitationDialog />
              </div>
              {/*<Button type="submit" variant="outline" className="ml-auto" disabled={saving} onClick={handleInvitation}>*/}
              {/*  Invite members*/}
              {/*</Button>*/}
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={activeOrganization.name || ""}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="slug">Slug</Label>
                <div className="flex gap-2">
                  <Input
                    disabled
                    id="slug"
                    name="slug"
                    value={activeOrganization.slug || ""}
                    onChange={handleChange}
                    required
                  />
                  {/*<Button onClick={generateSlug} size="sm" type="button">Generate</Button>*/}
                </div>
              </div>
            </div>
            {error && <div className="text-sm text-red-500">{error}</div>}
            {success && <div className="text-sm text-green-600">Saved!</div>}
            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </div>
        {/* Members table below the form */}
        <Card className="mt-12 w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Members</CardTitle>
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
              <>
                <table className="min-w-full text-sm">
                  <thead>
                    <tr>
                      <th className="py-2 text-left">Name</th>
                      <th className="py-2 text-left">Email</th>
                      <th className="py-2 text-left">Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.data?.members.map((member) => (
                      <tr key={member.id}>
                        <td className="py-1">{member.user.name || "-"}</td>
                        <td className="py-1">{member.user.email}</td>
                        <td className="py-1">
                          {member.role ? member.role : "—"}
                        </td>
                        <td className="py-1">
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
                <CardTitle className="mt-10">Invatations</CardTitle>
                <table className="mt-6 min-w-full bg-gray-50 text-sm rounded-xl">
                  <thead>
                    <tr>
                      <th className="p-4 text-left">Email</th>
                      <th className="p-4 text-left">Role</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.data?.invitations.map((invitee) => (
                      <tr key={invitee.id}>
                        <td className="py-1 px-4">{invitee.email}</td>
                        <td className="py-1 px-4">
                          {invitee.role ? invitee.role : "—"}
                        </td>
                        <td className="py-1 px-4">
                          <Link
                            to="/dashboard/org/$orgId/user/$userId"
                            params={{
                              orgId: params.orgId,
                              userId: invitee.id,
                            }}
                          >
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 cursor-pointer"
                            >
                              <XIcon className="text-red-400"/>
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
