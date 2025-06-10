import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import {createTRPCClient, httpBatchLink} from "@trpc/client";
import ReactDOM from "react-dom/client";
import { toast } from "sonner";
import { routeTree } from "./routeTree.gen";
import {createTRPCOptionsProxy} from "@trpc/tanstack-react-query";
import type { AppRouter } from "../../server/src/routers";
import {useEffect} from "react";
import {AuthProvider, useAuth} from "@/providers/auth-provider";

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      toast.error(error.message, {
        action: {
          label: "retry",
          onClick: () => {
            queryClient.invalidateQueries();
          },
        },
      });
    },
  }),
});

const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: `${import.meta.env.VITE_SERVER_URL}/trpc`,
      fetch(url, options) {
        return fetch(url, {
          ...options,
          credentials: "include",
        });
      },
    }),
  ],
});

export const trpcQueryUtils = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
  queryClient,
});

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
  context: {
    trpcQueryUtils,
    queryClient,
    auth: undefined
  },
  // defaultPendingComponent: () => <Loader />,
  Wrap: function WrapComponent({ children }) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  },
});

// Register things for typesafety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export const App = () => {
  const auth = useAuth();

  useEffect(() => {
    router.invalidate();
  }, [auth?.data?.session.id]);

  return <RouterProvider router={router} context={{ auth }} />;
};

const rootElement = document.getElementById("app")!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}
