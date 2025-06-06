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

export interface RouterAppContext {
  trpcQueryUtils: typeof trpcQueryUtils;
  queryClient: typeof queryClient;
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
  beforeLoad: async ({  context, location }) => {
    const session = await authClient.getSession();

    const isAuthenticated = !!session?.data?.session?.id
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

    // await context.queryClient.ensureQueryData(authQueries.organizations());
    // await context.queryClient.ensureQueryData(authQueries.activeMember());
  },
  component: RootComponent,

});

function RootComponent() {
  const session = authClient.useSession();

  const isFetching = useRouterState({
    select: (s) => s.isLoading,
  });

  useEffect(() => {
    router.invalidate()
  }, [session?.data?.session?.id]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        {/*{isFetching && <Loader />}*/}
        <Outlet />
        <Toaster />
        <TanStackRouterDevtools position="bottom-left" />
        <ReactQueryDevtools position="bottom" buttonPosition="bottom-right" />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
