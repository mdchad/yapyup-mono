import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import {createTRPCClient, httpBatchLink} from "@trpc/client";
import { createTRPCQueryUtils } from "@trpc/react-query";
import ReactDOM from "react-dom/client";
import { toast } from "sonner";
import Loader from "./components/loader";
import { routeTree } from "./routeTree.gen";
import {createTRPCOptionsProxy} from "@trpc/tanstack-react-query";
import type { AppRouter } from "../../server/src/routers";
import { authClient } from "@/lib/auth-client";

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

// const trpcClient = trpc.createClient({
//   links: [
//     httpBatchLink({
//       url: `${import.meta.env.VITE_SERVER_URL}/trpc`,
//       fetch(url, options) {
//         return fetch(url, {
//           ...options,
//           credentials: "include",
//         });
//       },
//     }),
//   ],
// });
//
// export const trpcQueryUtils = createTRPCQueryUtils({
//   queryClient,
//   client: trpcClient,
// });

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
    queryClient
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

const rootElement = document.getElementById("app")!;

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<RouterProvider router={router} />);
}
