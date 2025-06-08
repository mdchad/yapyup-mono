import Loader from "@/components/loader";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { queryClient, router, trpcQueryUtils } from "@/main";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  Outlet,
  createRootRouteWithContext,
  useRouterState, redirect,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import "../index.css";
import {  QueryClientProvider, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import {authQueries} from "@/lib/queries/auth";
import {z} from "zod";

export interface RouterAppContext {
  trpcQueryUtils: typeof trpcQueryUtils;
  queryClient: typeof queryClient;
  auth: any;
}

const redirectSearchSchema = z.object({
  app_redirect: z.string().optional(),
})

export const Route = createRootRouteWithContext<RouterAppContext>()({
  validateSearch: redirectSearchSchema,
  beforeLoad: async ({  context, location }) => {
    const isAuthenticated = !!context.auth?.data?.session?.id
    // const isAuthenticated = !!session?.user
    const isDashboardRoute = location.pathname.startsWith('/dashboard')
    if (!isAuthenticated && isDashboardRoute) {
      throw redirect({
        to: "/sign-in",
        search: {
          app_redirect: location.href,
        },
      });
    }

    if (isAuthenticated && location.searchStr !== "") {
      throw redirect({
        to: location.search.app_redirect,
      });
    }

    await context.queryClient.ensureQueryData(authQueries.fullOrganization());
    await context.queryClient.ensureQueryData(authQueries.activeMember());
  },
  component: RootComponent,
});

function RootComponent() {
  const session = authClient.useSession();

  useEffect(() => {
    router.invalidate()
  }, [session?.data?.session?.id]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <Outlet />
        <Toaster />
        <TanStackRouterDevtools position="bottom-right" />
        <ReactQueryDevtools position="bottom" buttonPosition="bottom-right" />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
