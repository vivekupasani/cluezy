'use client'

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
import Link from 'next/link'

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      // The url which will be included in the email. This URL needs to be configured in your redirect URLs in the Supabase dashboard at https://supabase.com/dashboard/project/_/auth/url-configuration
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`
      })
      if (error) throw error
      setSuccess(true)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn('flex flex-col gap-3', className)} {...props}>
      {success ? (
        <div className='w-full max-w-sm shadow-lg shadow-muted p-2'>
          <Card className='bg-background'>
            <CardHeader>
              <CardTitle className="text-2xl">Check Your Email</CardTitle>
              <CardDescription>Password reset instructions sent</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                If you registered using your email and password, you will receive
                a password reset email.
              </p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className='w-full h-full max-w-[400px] rounded-2xl bg-muted/80 dark:border-none border border-muted-foreground/10 backdrop-blur-xl p-2'>
          <Card className='w-full h-full max-w-[400px] rounded-xl bg-background drop-shadow-xl'>
            <CardHeader>
              <CardTitle className="text-2xl txt-grad">Reset Your Password</CardTitle>
              <CardDescription className='txt-mut'>
                Type in your email and we&apos;ll send you a link to reset your
                password
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleForgotPassword}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="email" className='txt-grad'>Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className='text-foreground/90'
                    />
                  </div>
                  {error && <p className="text-sm text-red-500">{error}</p>}
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Sending...' : 'Send reset email'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          <div className="mt-4 mb-2 text-center text-sm txt-grad ">
            Already have an account?{' '}
            <Link
              href="/auth/login"
              className="hover:underline underline-offset-4 text-foreground/70 hover:text-foreground"
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
