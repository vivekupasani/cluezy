import Link from 'next/link'

import { ArrowLeft } from 'lucide-react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'

export default function Page() {
  return (
    <div className="min-h-svh w-screen flex flex-col">
      {/* Header */}
      <header className="h-14 flex items-center px-5 md:px-10">
        <Link
          href="/auth/sign-up"
          className="group flex items-center justify-center gap-1 text-muted-foreground hover:text-foreground text-sm transition-colors duration-200"
        >
          <ArrowLeft size={16} />
          <span>Back to signup</span>
        </Link>
      </header>

      {/* Centered Content */}
      <main className="flex flex-1 items-center justify-center px-4">
        <div className="w-full h-full max-w-[400px] rounded-2xl bg-muted/80 dark:border-none border border-muted-foreground/10 backdrop-blur-xl p-2">
          <Card className="w-full h-full max-w-[400px] rounded-xl bg-background drop-shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl txt-grad">
                Thank you for signing up!
              </CardTitle>
              <CardDescription className="txt-mut">
                Check your email to confirm
              </CardDescription>
            </CardHeader>

            <CardContent>
              <p className="text-sm txt-mut text-center">
                You&apos;ve successfully signed up. Please check your email to
                confirm your account before signing in.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
