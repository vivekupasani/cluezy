'use client'

import { useAuth } from '@/components/context/auth-context'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogTrigger
} from '@/components/ui/dialog'
import { CreditCard, ExternalLink, Lock, ShieldCheck, Zap } from 'lucide-react'
import { useState } from 'react'

export const STRIPE_BILLING_URL = 'https://billing.stripe.com/p/login/test_7sYcN572Ia4v1mEcVMbEA00'

interface BillingDialogProps {
    open?: boolean
    onOpenChange?: (open: boolean) => void
    trigger?: React.ReactNode
}

export function BillingDialog({
    open,
    onOpenChange,
    trigger
}: BillingDialogProps) {
    const [isOpen, setIsOpen] = useState(false)
    const { userPlanDetails } = useAuth()

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
            <DialogContent className="max-w-md w-[95%] p-0 overflow-hidden rounded-2xl border border-border">
                {/* Header */}
                <div className="px-6 pt-6 pb-4 border-b border-border">
                    <div className="flex items-center gap-3 mb-1">
                        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-primary/10">
                            <CreditCard className="w-4.5 h-4.5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-base font-semibold leading-tight">Billing & Subscription</h2>
                            <p className="text-xs text-muted-foreground">Manage your plan and payments</p>
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="px-6 py-5 space-y-4">
                    {/* Current plan badge */}
                    {userPlanDetails?.isActive && (
                        <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/5 border border-primary/20">
                            <Zap className="w-3.5 h-3.5 text-primary shrink-0" />
                            <span className="text-xs font-medium text-primary">
                                {userPlanDetails.planName} — Active
                            </span>
                        </div>
                    )}

                    {/* Info text */}
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        Your billing is securely managed through{' '}
                        <span className="text-foreground font-medium">Stripe</span>, a trusted payment
                        platform. You can upgrade, downgrade, or cancel your subscription directly from
                        the Stripe Customer Portal.
                    </p>

                    {/* Trust indicators */}
                    <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-muted/50 border border-border">
                            <Lock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                            <span className="text-xs text-muted-foreground">Secure & encrypted</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-muted/50 border border-border">
                            <ShieldCheck className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                            <span className="text-xs text-muted-foreground">Cancel anytime</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 pb-6 flex flex-col gap-2">
                    <Button
                        className="w-full h-10 rounded-xl font-medium text-sm gap-2"
                        asChild
                    >
                        <a
                            href={STRIPE_BILLING_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Open Stripe Billing Portal
                            <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                    </Button>
                    <p className="text-center text-[11px] text-muted-foreground">
                        You'll be redirected to Stripe's secure portal
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    )
}
