'use client'

import { useAuth } from '@/components/context/auth-context'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'
import { pricingPlans } from '@/lib/utils/pricing-plans'
import { ChevronRight, CreditCard } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

interface PricingDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: React.ReactNode
}

export function PricingDialog({
  open,
  onOpenChange,
  trigger
}: PricingDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const isMobile = useIsMobile()
  const { user, userPlanDetails } = useAuth()

  // Helper to handle uncontrolled/controlled state
  const showDialog = open !== undefined ? open : isOpen
  const setShowDialog = onOpenChange || setIsOpen

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      {trigger ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon">
            <CreditCard className="size-5" />
          </Button>
        </DialogTrigger>
      )}
      <DialogContent className="max-w-4xl w-[95%] max-h-[90vh] overflow-y-auto CustomScrollbar p-6 rounded-2xl">
        <DialogHeader>
          <DialogTitle>Subscription & Plans</DialogTitle>
          <DialogDescription>
            Choose the plan that fits your needs. Upgrade or downgrade anytime.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-3 mt-4">
          {pricingPlans.map(plan => (
            <PricingTile
              key={plan.id}
              plan={plan}
              user={user}
              userPlanDetails={userPlanDetails}
            />
          ))}
        </div>

        <span className="mt-4 text-xs text-muted-foreground text-center">
          By subscribing, you agree to our{' '}
          <Link href="/terms" className="font-bold hover:text-primary">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="font-bold hover:text-primary">
            Privacy Policy
          </Link>
          .
        </span>
      </DialogContent>
    </Dialog>
  )
}

export function PricingTile({
  plan,
  user,
  userPlanDetails
}: {
  plan: any
  user: any
  userPlanDetails: any
}) {
  const isCurrentPlan = userPlanDetails?.isActive
    ? userPlanDetails.planName === plan.name
    : plan.name === 'Free'

  const isAnyPlanActive = userPlanDetails?.isActive
  const isFreePlan = plan.name === 'Free'

  // const isDisabled = isAnyPlanActive || isFreePlan || isCurrentPlan;
  const isDisabled = true

  return (
    <div
      className={cn(
        'relative w-full rounded-xl bg-muted/50 border border-border p-4 flex flex-col',
        // isCurrentPlan && 'border-primary shadow-[0_0_0_1px_hsl(var(--primary)/0.3)]',
        plan.popular && !isCurrentPlan && 'border-primary/50 bg-primary/5'
      )}
    >
      {plan.popular && !isCurrentPlan && (
        <div className="absolute -top-3 left-0 right-0 flex justify-center">
          <span className="bg-primary text-primary-foreground text-[10px] px-2 py-0.5 rounded-full tracking-wide">
            Most Popular
          </span>
        </div>
      )}

      <div className="mb-4">
        <h3 className="text-lg font-bold">{plan.name}</h3>
        <p className="text-xs text-muted-foreground mt-1 min-h-[40px]">
          {plan.description}
        </p>
      </div>

      <div className="mb-4">
        <div className="flex items-baseline">
          <span className="text-2xl font-bold">${plan.price}</span>
          <span className="text-muted-foreground text-sm ml-1">
            /{plan.cycle}
          </span>
        </div>
      </div>

      <div className="flex-1">
        <ul className="space-y-2 mb-4">
          {plan.features.map((feature: any, idx: number) => (
            <li key={idx} className="flex items-start gap-2 text-xs">
              <feature.icon className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
              <span className="text-muted-foreground">{feature.label}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-auto pt-4">
        <Button
          asChild={!isDisabled}
          disabled
          className={cn(
            'w-full rounded-full text-xs h-9',
            isCurrentPlan
              ? 'bg-muted text-muted-foreground hover:bg-muted'
              : plan.popular
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
            isDisabled && !isCurrentPlan && 'opacity-60 cursor-not-allowed'
          )}
        >
          {isDisabled ? (
            <span className="flex items-center justify-center gap-1.5">
              {/* {isCurrentPlan ? "Current Plan" : `Get ${plan.name}`} */}
              Subscription is currently not available
            </span>
          ) : !user ? (
            <Button className="flex items-center justify-center gap-1.5">
              Login to Get {plan.name}
            </Button>
          ) : (
            <a
              href={
                plan.paymentLink +
                '?prefilled_email=' +
                user?.email +
                '&client_reference_id=' +
                user?.id
              }
              className="flex items-center justify-center"
            >
              Get {plan.name} <ChevronRight className="ml-1 w-3 h-3" />
            </a>
          )}
        </Button>
      </div>
    </div>
  )
}
