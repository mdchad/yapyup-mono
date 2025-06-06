import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Home,
  Inbox,
  Search,
  Settings,
  User2,
  Plus,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Link, useRouteContext } from "@tanstack/react-router";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { LogoutIcon } from "@/components/ui/logout";
import { useRef } from "react";
import { UserIcon } from "@/components/ui/user";
import { ChevronUpIcon } from "@/components/ui/chevron-up";
import { LayersIcon } from "@/components/ui/layers";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { authClient } from "@/lib/auth-client";
import { Separator } from "@/components/ui/separator";
import { CheckIcon } from "@/components/ui/check";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

export function AppSidebar() {
  const { data: activeOrganization } = authClient.useActiveOrganization();
  const { data: organizations } = authClient.useListOrganizations();

  const queryClient = useRouteContext({ select: (context) => context.queryClient})

  const iconRef = useRef(null);
  const layersIconRef = useRef(null);
  const checkIconRef = useRef(null);

  async function handleSignOut() {
    try {
      await authClient.signOut();

      await queryClient.invalidateQueries({ queryKey: ['auth', 'session'], });
      // router.invalidate();

      // Check if it worked

      // queryClient.removeQueries({ queryKey: ['auth', 'session'] });
      // queryClient.removeQueries({ queryKey: ['organizations'] });
      // queryClient.removeQueries({ queryKey: ['organization'] });
    } catch (error) {

    }
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  className="border border-gray-200 px-2 py-4 font-medium"
                  onMouseEnter={() => layersIconRef.current?.startAnimation()}
                  onMouseLeave={() => layersIconRef.current?.stopAnimation()}
                >
                  <LayersIcon size={16} ref={layersIconRef} />
                  {activeOrganization?.name}
                  <ChevronDown className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[--radix-popper-anchor-width] min-w-[207px]">
                {organizations &&
                  organizations.map((org) => {
                    const isActive = org.id === activeOrganization?.id;
                    return (
                      <DropdownMenuItem
                        key={org.id}
                        className="cursor-pointer"
                        onMouseEnter={() =>
                          checkIconRef.current?.startAnimation()
                        }
                        onMouseLeave={() =>
                          checkIconRef.current?.stopAnimation()
                        }
                      >
                        <div className="flex w-full items-center justify-between">
                          <p>{org.name}</p>
                          {isActive && <CheckIcon ref={checkIconRef} />}
                          {/*{isActive && (*/}
                          {/*  <div className="w-2 h-2 rounded-full bg-green-500" />*/}
                          {/*)}*/}
                        </div>
                      </DropdownMenuItem>
                    );
                  })}
                <Separator className="my-2" />
                <Link to={`/dashboard/org/${activeOrganization?.id}`}>
                  <DropdownMenuItem className="cursor-pointer p-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Settings size={16} />
                      <span>Settings</span>
                    </div>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuItem className="cursor-pointer p-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Plus size={16} />
                    <span>Create Organization</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <Collapsible defaultOpen className="group/collapsible">
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger>
                Recent
                <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent />
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  className="cursor-pointer py-6"
                  onMouseEnter={() => iconRef.current?.startAnimation()}
                  onMouseLeave={() => iconRef.current?.stopAnimation()}
                >
                  {/*<User2 />*/}
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                  </Avatar>
                  <ChevronUpIcon
                    size={18}
                    ref={iconRef}
                    className="text-gray-500"
                  />
                  {/*<span className="truncate text-xs">{user.email}</span>*/}
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem>
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Billing</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
