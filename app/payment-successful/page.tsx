'use client'
import { STRIPE_BILLING_URL } from '@/components/billing-dialog'
import { useAuth } from '@/components/context/auth-context'
import { Button } from '@/components/ui'
import { CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function PaymentSuccessfulPage() {
  const [visible, setVisible] = useState(false)
  const { userPlanDetails } = useAuth()
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const isYearly = userPlanDetails?.planName === 'Max'
  const billingLabel = isYearly ? 'Yearly' : 'Monthly'

  return (
    <>
      <div
        className={`
                    min-h-screen flex items-center justify-center p-5 sm:p-8
                    bg-background text-foreground
                    transition-opacity duration-700
                    ${visible ? 'opacity-100' : 'opacity-0'}
                `}
      >
        <div className="w-full max-w-md space-y-8">
          {/* Success indicator */}
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/10 dark:bg-primary/5">
              <CheckCircle2
                className="h-7 w-7 text-primary"
                strokeWidth={2.2}
              />
            </div>
            <div className="text-sm font-medium text-primary">
              Payment confirmed
            </div>
          </div>

          {/* Heading */}
          <div className="space-y-3">
            <h1
              className="font-serif text-4xl sm:text-5xl font-normal tracking-tight text-foreground"
              style={{ fontFamily: 'var(--font-serif)' }}
            >
              Thank You<span className="text-foreground/70">.</span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-prose">
              Your subscription is now active. A detailed receipt will be sent
              to your email shortly.
            </p>
          </div>

          {/* Plan details */}
          <div className="rounded-xl border bg-muted dark:bg-card p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground/80">
                  Your plan
                </div>
                {userPlanDetails?.planName ? (
                  <div className="mt-0.5 text-lg font-semibold lowercase text-foreground">
                    {userPlanDetails?.planName || ''}
                  </div>
                ) : (
                  <div className="mt-0.5 opacity-0 text-lg font-semibold text-foreground">
                    Free
                  </div>
                )}
              </div>

              <div className="flex shrink-0 items-center gap-2.5">
                <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
                  <span className="mr-1.5 h-2 w-2 rounded-full bg-primary" />
                  Active
                </span>

                <span className="rounded-md border bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                  {billingLabel}
                </span>
              </div>
            </div>
          </div>

          {/* CTA */}
          <Button
            onClick={() => router.replace('/')}
            className="group relative flex w-full items-centerjustify-center rounded-xl bg-primary px-6 py-4 text-base font-medium text-primary-foreground shadow transition-all hover:bg-primary/95 hover:shadow-md active:scale-[0.99]"
          >
            <span>Return to Home</span>
          </Button>

          {/* Footer links */}
          <p className="text-center text-sm text-muted-foreground">
            Questions?{' '}
            <a
              href="mailto:cluezyai@gmail.com"
              className="text-foreground hover:text-foreground underline underline-offset-4 transition-colors"
            >
              Contact support
            </a>{' '}
            •{' '}
            <Link
              href={STRIPE_BILLING_URL}
              className="text-foreground hover:text-foreground underline underline-offset-4 transition-colors"
            >
              Manage billing
            </Link>
          </p>
        </div>
      </div>
    </>
  )
}
