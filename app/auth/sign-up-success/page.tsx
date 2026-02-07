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
          href="/"
          className="group flex items-center gap-2 text-sm"
        >
          <ArrowLeft
            size={18}
            className="text-foreground/70 group-hover:text-foreground"
          />
          <span className="txt-grad group-hover:text-foreground">
            Back
          </span>
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
