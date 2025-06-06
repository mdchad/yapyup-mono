import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { type MouseEventHandler, useState } from "react";
import { toast } from "sonner";

export function InvitationDialog() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await authClient.organization.inviteMember({
        email: email,
        role: "admin",
      });

      toast.success("Invitation send", {});
    } catch (e) {
      toast.error("Failed to invite member. Please try again.", {});
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Invite</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Invite</DialogTitle>
          <DialogDescription>
            Invite members to your organisation
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="name-1">Email</Label>
            <Input
              id="name-1"
              name="email"
              placeholder="john@test.com"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {/*<div className="grid gap-3">*/}
          {/*  <Label htmlFor="username-1">Username</Label>*/}
          {/*  <Input id="username-1" name="username" defaultValue="@peduarte" />*/}
          {/*</div>*/}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit" onClick={handleSubmit}>
            Send
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
