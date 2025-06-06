import { useState } from 'react'
import { cn } from '@/lib/utils'
// import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {authClient} from "@/lib/auth-client";
import {redirect, useNavigate} from "@tanstack/react-router";
import {toast} from "sonner";

export function SignUpForm({ className, ...props }: React.ComponentPropsWithoutRef<'div'>) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [organisation, setOrganisation] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)


    // if (!organisation.trim()) {
    //   setError('Workspace name is required')
    //   return
    // }
      const {data, error} = await authClient.signUp.email({
        email, // user email address
        password, // user password -> min 8 characters by default
        name, // user display name
        organisation,
        // image, // User image URL (optional)
        callbackURL: "/dashboard" // A URL to redirect to after the user verifies their email (optional)
      }, {
        onRequest: (ctx) => {
          setIsLoading(true)
          //show loading
        },
        onSuccess: (ctx) => {
          setIsLoading(false)
          //redirect to the dashboard or sign in page
          // redirect('/dashboard')
          navigate({ to: '/create-organisation'})
        },
        onError: (ctx) => {
          setIsLoading(false)
          toast.error(ctx.error.message, {});
          // display the error message
          // alert(ctx.error.message);
        },
      });
    //   // Insert organisation after successful sign up
    //   const { error: orgError, data: orgData } = await supabase.from('organisations').insert([
    //     { name: workspaceName }
    //   ])
    //
    //   if (orgError) throw orgError
    //
    //   const { error: signUpError, data: signUpData } = await supabase.auth.signUp({
    //     email,
    //     password,
    //     user_metadata: { name },
    //     app_metadata: { tenant_id: orgData.id}
    //     //@TODO: ADD tenant_id
    //   })
    //   if (signUpError) throw signUpError
    //   setSuccess(true)
    // catch (error: unknown) {
    //   setError(error instanceof Error ? error.message : 'An error occurred')
    // } finally {
    //   setIsLoading(false)
    // }
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      {success ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Thank you for signing up!</CardTitle>
            <CardDescription>Check your email to confirm</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              You've successfully signed up. Please check your email to confirm your account before
              signing in.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Sign up</CardTitle>
            <CardDescription>Create a new account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="John"
                    required
                    autoComplete="username"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="********"
                    required
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <hr />
                {/*<div className="grid gap-2">*/}
                {/*  <Label htmlFor="workspace-name">Organisation Name</Label>*/}
                {/*  <Input*/}
                {/*    id="workspace-name"*/}
                {/*    type="text"*/}
                {/*    placeholder="Your workspace name"*/}
                {/*    required*/}
                {/*    value={organisation}*/}
                {/*    onChange={(e) => setOrganisation(e.target.value)}*/}
                {/*  />*/}
                {/*</div>*/}
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Creating an account...' : 'Sign up'}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Already have an account?{' '}
                <a href="/sign-in" className="underline underline-offset-4">
                  Login
                </a>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
