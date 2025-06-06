// import SignUp from '@/components/sign-up-form'
import {createFileRoute, Link, useRouteContext} from '@tanstack/react-router'
import {useQuery} from "@tanstack/react-query";
import {trpcQueryUtils} from "@/main";
// import {Header} from "@/components/ui/header";

export const Route = createFileRoute('/')({
  component: HomeComponent,
})

function HomeComponent() {
  const healthCheckQuery = useQuery(trpcQueryUtils.healthCheck.queryOptions({}));
  const privateDataQuery = useQuery(trpcQueryUtils.privateData.queryOptions({}));

  return (
    <>
      {/*<Header isAuthenticated={auth.data?.session}/>*/}
      <div className="p-2">
        <h3>Welcome Home!</h3>
        <Link to="/dashboard">Go to Dashboard</Link>
        <p>healthCheck: {healthCheckQuery.data}</p>
        <p>privateData: {privateDataQuery.data?.message}</p>
        {/*<SignUp />*/}
      </div>
    </>
  )
}
