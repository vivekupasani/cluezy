'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PasswordInput } from '@/components/ui/password-input'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (password !== repeatPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/` }
      })
      if (error) throw error
      router.push('/auth/sign-up-success')
      toast.success('Account created successfully. Please verify your email.')
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = async () => {
    const supabase = createClient()
    setIsLoading(true)
    setError(null)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${location.origin}/auth/oauth` }
      })
      if (error) throw error
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An OAuth error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn('flex flex-col items-center justify-center gap-6', className)} {...props}>

      <div className="w-full h-full max-w-[400px] rounded-2xl bg-muted/80 border border-muted-foreground/10 backdrop-blur-xl p-2">
        <Card className="w-full h-full max-w-[400px] rounded-xl bg-background drop-shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl flex flex-col items-center justify-center gap-4 txt-grad">
              Create an account
            </CardTitle>
            <CardDescription className='txt-mut'>
              Enter your details to get started
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="flex flex-col gap-4">
              <form onSubmit={handleSignUp} className="flex flex-col gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email" className='txt-grad'>Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="password" className='txt-grad'>Password</Label>
                  <PasswordInput
                    id="password"
                    placeholder="********"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="repeatPassword" className='txt-grad pb-[0.2px]'>Repeat Password</Label>
                  <PasswordInput
                    id="repeatPassword"
                    placeholder="********"
                    required
                    value={repeatPassword}
                    onChange={e => setRepeatPassword(e.target.value)}
                  />
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Creating account...' : 'Sign Up'}
                </Button>
              </form>

              <div className="flex items-center my-2">
                <span className="w-1/2 border-t" />
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="px-2 text-muted-foreground">Or</span>
                </div>
                <span className="w-1/2 border-t" />
              </div>

              <Button
                variant="outline"
                type="button"
                className="w-full gap-2"
                onClick={handleSocialLogin}
                disabled={isLoading}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  viewBox="0 0 48 48"
                >
                  <path
                    fill="#FFC107"
                    d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8
                    c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657
                    C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24
                    c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20
                    C44,22.659,43.862,21.35,43.611,20.083z"
                  />
                  <path
                    fill="#FF3D00"
                    d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12
                    c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657
                    C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                  />
                  <path
                    fill="#4CAF50"
                    d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238
                    C29.211,35.091,26.715,36,24,36
                    c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025
                    C9.505,39.556,16.227,44,24,44z"
                  />
                  <path
                    fill="#1976D2"
                    d="M43.611,20.083H42V20H24v8h11.303
                    c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238
                    C36.971,39.205,44,34,44,24
                    C44,22.659,43.862,21.35,43.611,20.083z"
                  />
                </svg>
                <p>Sign Up with Google</p>
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="my-3 text-center text-sm">
          Already have an account?{' '}
          <Link href="/auth/login" className="hover:underline underline-offset-4">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
