import {createFileRoute, createLazyFileRoute, Outlet, useRouteContext} from '@tanstack/react-router'
// import DashboardHeader from "@/components/ui/dashboard-header";
import {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";
import {AppSidebar} from "@/components/ui/app-sidebar";

export const Route = createLazyFileRoute('/_protected/dashboard')({
  component: Dashboard
  // beforeLoad: () => ,
})

function Dashboard() {
  // const auth = useRouteContext({ select: (context) => context.auth })

  return (
    <SidebarProvider>
      {/*<div className="min-h-screen bg-gray-50 p-6">*/}
        <AppSidebar />
        <div className="w-full">
          {/*<DashboardHeader />*/}
        {/*  <div className="flex justify-between items-center mb-8">*/}
        {/*    <h1 className="text-3xl font-bold">Dashboard</h1>*/}
            <Outlet />
          {/*</div>*/}
        {/*</div>*/}
      </div>
    </SidebarProvider>
  )
} 