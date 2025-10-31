'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils/index'

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
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      })
      if (error) throw error
      router.push('/auth/sign-up-success')
      toast.success('Account created successfully. Please check your email to verify your account.')
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
        options: {
          redirectTo: `${location.origin}/auth/oauth`
        }
      })
      if (error) throw error
    } catch (error: unknown) {
      setError(
        error instanceof Error ? error.message : 'An OAuth error occurred'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className={cn('flex flex-col items-center gap-6', className)}
      {...props}
    >
      <div className='w-full max-w-sm shadow-lg shadow-muted rounded-md'>
        <Card className="w-full max-w-sm bg-background shadow-inner shadow-foreground/10 border-b border-foreground/12">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl flex flex-col items-center justify-center gap-4">
              <div className="flex-shrink-0">
                <svg
                  width="44"
                  height="44"
                  viewBox="0 0 67 61"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18.3005 0.699779C20.8082 -0.578424 23.588 0.143417 25.9499 1.42244L26.4167 1.68513L28.6023 2.96247L26.0466 7.33259L23.8611 6.05525L23.4987 5.85115C21.7476 4.90719 20.8945 5.06001 20.5993 5.21052L20.5974 5.2115C20.3386 5.34332 19.8126 5.80655 19.5027 7.36482C19.1998 8.88797 19.2017 11.0438 19.6101 13.7545C19.8211 15.1551 20.1361 16.6653 20.5495 18.2613C22.1931 18.0179 23.9047 17.8189 25.6706 17.6724C28.6264 12.8954 31.7867 8.83092 34.8327 5.83064C37.0075 3.68855 39.2282 1.98401 41.3718 0.994701C43.4163 0.0511988 45.7899 -0.409936 47.9665 0.59431L48.1765 0.696849L48.1814 0.698802L48.4763 0.859935C49.9147 1.69909 50.8447 3.04229 51.407 4.50447C51.9991 6.04486 52.2414 7.85058 52.2507 9.75837L52.2634 12.2896L47.2009 12.314L47.1882 9.78279L47.1765 9.22224C47.1288 7.95843 46.9419 6.99866 46.6814 6.32087C46.3936 5.57244 46.0779 5.31117 45.8825 5.20954L45.7644 5.16072C45.4399 5.05237 44.7574 5.00837 43.4939 5.59138C42.0827 6.24264 40.339 7.5129 38.3855 9.43708C36.2937 11.4974 34.0814 14.1905 31.903 17.3746C32.3463 17.3684 32.7917 17.3638 33.239 17.3638C41.8221 17.3638 49.699 18.5193 55.5173 20.4586C58.4131 21.4238 60.9394 22.6293 62.7937 24.0904C64.6193 25.5291 66.1451 27.514 66.1452 30.0201C66.1452 32.1797 65.0015 33.9608 63.5398 35.3121C62.0784 36.6629 60.0921 37.7913 57.8298 38.7252L55.49 39.691L53.5583 35.0113L55.8982 34.0455C57.8546 33.2379 59.2443 32.3883 60.1032 31.5943C60.9614 30.8009 61.0827 30.27 61.0827 30.0201C61.0826 29.7299 60.9082 29.0507 59.6599 28.067C58.4397 27.1056 56.5174 26.1292 53.9167 25.2623C48.7409 23.5372 41.4295 22.4263 33.239 22.4263C31.6757 22.4263 30.1445 22.4671 28.654 22.5445C27.9089 23.8362 27.1787 25.1813 26.4695 26.5728C25.8806 27.7282 25.329 28.8782 24.8103 30.0142C25.1254 30.7045 25.4506 31.401 25.7917 32.0992L26.4734 33.4635V33.4644L27.1775 34.8179C30.7282 41.5073 34.7419 47.0141 38.3855 50.6031C40.3387 52.527 42.0821 53.7973 43.4929 54.4478C44.7565 55.0304 45.4389 54.9853 45.7634 54.8765L45.8806 54.8277C46.1119 54.7092 46.5492 54.3381 46.8669 53.1383C47.184 51.9406 47.2892 50.2198 47.0779 47.9976C46.6831 43.8493 45.2356 38.449 42.7771 32.5592L42.2722 31.3746L41.2614 29.0543L45.9021 27.0318L46.9128 29.3531L47.445 30.5992C50.0387 36.8108 51.6614 42.7201 52.1179 47.5172C52.3603 50.0654 52.2884 52.4438 51.7614 54.4342C51.2685 56.2961 50.2944 58.0892 48.5407 59.1392L48.1794 59.3385L48.1775 59.3394C45.9445 60.4761 43.4838 60.018 41.3728 59.0445C39.2288 58.0558 37.0075 56.3526 34.8327 54.2105C30.5674 50.0092 26.0796 43.7193 22.2439 36.3052C20.9345 39.965 20.0488 43.3625 19.6091 46.2838C19.2012 48.9946 19.1986 51.1508 19.5017 52.6744C19.7732 54.0386 20.2106 54.5639 20.489 54.7623L20.5974 54.8287L20.5993 54.8306L20.6853 54.8668C21.1678 55.0413 22.4748 55.0383 24.9714 53.2681L27.0359 51.8043L29.9646 55.9342L27.8991 57.398C25.0405 59.4249 21.4555 60.9513 18.2976 59.3394V59.3385C16.0661 58.2007 14.9904 55.9417 14.5368 53.6627C14.0761 51.3471 14.148 48.5485 14.6023 45.5299C15.285 40.9934 16.8817 35.6297 19.2741 30.0142C18.41 27.9856 17.6525 25.9888 17.0017 24.0533C15.3928 24.4095 13.9055 24.8146 12.5622 25.2623C9.96118 26.1292 8.03827 27.1055 6.81808 28.067C5.56972 29.0507 5.39534 29.7299 5.39523 30.0201C5.39523 30.4715 5.88581 31.6987 8.77609 33.2105L11.0183 34.3843L8.67258 38.8697L6.42941 37.6968C3.31907 36.0699 0.332733 33.5647 0.332733 30.0201C0.332837 27.5141 1.85868 25.5291 3.6843 24.0904C5.53851 22.6293 8.06485 21.4238 10.9607 20.4586C12.3781 19.9861 13.9181 19.5612 15.5603 19.1871C15.1476 17.5531 14.8269 15.9866 14.6042 14.5084C14.1496 11.4905 14.0765 8.6927 14.5368 6.37751C14.9903 4.0976 16.0669 1.83699 18.3005 0.699779ZM22.2644 20.5894C20.7666 20.5894 19.5516 21.8036 19.5515 23.3013C19.5515 24.7992 20.7665 26.0133 22.2644 26.0133C23.7621 26.013 24.9763 24.7991 24.9763 23.3013C24.9762 21.8037 23.762 20.5896 22.2644 20.5894Z"
                    fill="white"
                  />
                </svg>
              </div>
              Create an account
            </CardTitle>
            <CardDescription>
              Enter your details below to get started
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {/* <Button
                variant="outline"
                type="button"
                className="w-full gap-2"
                onClick={handleSocialLogin}
                disabled={isLoading}
              >
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                </svg><p> Continue with Google</p>
              </Button>

              <div className="flex items-center my-2">
                <span className="w-1/2 border-t" />
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="px-2 text-muted-foreground">Or</span>
                </div>
                <span className="w-1/2 border-t" />
              </div> */}
              <form onSubmit={handleSignUp}>
                <div className="flex flex-col gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
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
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                    </div>
                    <PasswordInput
                      id="password"
                      type="password"
                      placeholder="********"
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="repeat-password">Repeat Password</Label>
                    </div>
                    <PasswordInput
                      id="repeat-password"
                      type="password"
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
                </div>
                <div className="mt-6 text-center text-sm">
                  Already have an account?{' '}
                  <Link href="/auth/login" className="underline underline-offset-4">
                    Sign In
                  </Link>
                </div>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="text-center text-xs text-muted-foreground">
        <Link href="/" className="hover:underline">
          &larr; Back to Home
        </Link>
      </div>
    </div>
  )
}
