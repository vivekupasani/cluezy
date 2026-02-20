"use client"
import { useAuth } from "@/components/context/auth-context";
import { Button } from "@/components/ui";
import { UserPlanDetailsProps } from "@/lib/actions/user-premium";
import { cn } from "@/lib/utils";
import { pricingPlanProps } from "@/lib/utils/pricing-plans";
import { User } from "@supabase/supabase-js";
import { ArrowLeft, Check, ChevronRight, Zap } from "lucide-react";
import { useRouter } from "next/navigation";


export default function PricingPage() {
    const router = useRouter();
    const { user, userPlanDetails } = useAuth();

    return (
        <div className="h-screen w-full flex flex-col items-center px-4 sm:px-6 py-6 sm:py-14 overflow-y-auto CustomScrollbar">
            {/* Header */}
            <div className="text-center max-w-xl mb-8 sm:mb-14 px-2">
                <button
                    onClick={() => router.push("/")}
                    className="visible md:hidden group flex items-center mb-5 pt-6 gap-1.5 text-muted-foreground hover:text-foreground text-[16px] transition-colors duration-200"
                >
                    <ArrowLeft
                        size={16}
                        className="transition-transform duration-200"
                    />
                    Back
                </button>

                <span className="border border-border bg-muted text-muted-foreground rounded-full px-2 text-xs sm:text-sm font-mono flex items-center justify-center w-fit mx-auto mb-2">select your plan</span>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">premium pricing</h1>
                <p className="mt-2 sm:mt-3 text-sm sm:text-base text-muted-foreground">
                    Choose the plan that fits your needs. Upgrade or downgrade anytime.
                </p>
            </div>
            <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-3 max-w-6xl w-full sm:w-fit pb-12">
                {/* {
                    pricingPlans.map((plan, index) => (
                        <div key={plan.id} className="flex justify-center">
                            <PricingTile plan={plan} user={user} userPlanDetails={userPlanDetails} index={index} />
                        </div>
                    ))
                } */}
            </div>
            {/* <div className='text-xs mt-6 w-full flex flex-wrap items-center justify-center gap-1 text-center text-muted-foreground'>
                By subscribing, you agree to our <Link href="/terms" className="text-foreground hover:text-primary">terms of service</Link> and <Link href="/privacy" className="text-foreground hover:text-primary">privacy policy</Link>
            </div> */}
        </div>
    )
}

const PricingTile = ({
    plan, user, userPlanDetails, index }: {
        plan: pricingPlanProps; user: User | null; userPlanDetails: UserPlanDetailsProps | null; index: number
    }) => {

    const isCurrentPlan = userPlanDetails?.isActive
        ? userPlanDetails.planName === plan.name
        : plan.name === "Free"; // specific check for Free plan when no active subscription

    const isAnyPlanActive = userPlanDetails?.isActive;
    const isFreePlan = plan.name === "Free";

    // Disable button if:
    // 1. Any plan is active (prevents double subscription)
    // 2. It's the free plan (always disabled)
    const isDisabled = isAnyPlanActive || isFreePlan;

    const isPopular = plan.popular;

    return (
        <div
            className={cn(
                "group relative flex flex-col w-full rounded-2xl border transition-all duration-300",
                "bg-background/60 backdrop-blur-sm",
                isCurrentPlan
                    ? "border-primary shadow-[0_0_0_1px_hsl(var(--primary)/0.3),0_20px_60px_-10px_hsl(var(--primary)/0.15)] scale-[1.02] sm:scale-[1.03]"
                    : isPopular
                        ? "border-primary/50 shadow-sm hover:border-primary hover:shadow-md"
                        : "border-border hover:border-border hover:shadow-sm"
            )}
        >
            {/* Badges: Current Plan takes priority or stacks? Let's prioritize Current Plan for clarity */}
            {isCurrentPlan ? (
                <div className="absolute -top-3.5 left-0 right-0 flex justify-center z-10">
                    <span className="inline-flex items-center gap-1 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                        <Check size={12} strokeWidth={3} />
                        Current Plan
                    </span>
                </div>
            ) : isPopular && (
                <div className="absolute -top-3.5 left-0 right-0 flex justify-center z-10">
                    <span className="inline-flex items-center gap-1 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                        <Zap size={10} className="fill-current" />
                        Most Popular
                    </span>
                </div>
            )}

            {/* Card top: name + price */}
            <div className={cn(
                "p-5 sm:p-6 border-b",
                (isPopular || isCurrentPlan) ? "border-primary/20 bg-primary/[0.03] rounded-t-2xl" : "border-border/50 rounded-t-2xl"
            )}>
                <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="text-lg font-bold tracking-tight">{plan.name}</p>
                    {isPopular && !isCurrentPlan && (
                        <span className="text-[10px] font-mono text-primary bg-primary/10 border border-primary/20 rounded px-1.5 py-0.5">
                            ✦ best value
                        </span>
                    )}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-5">{plan.description}</p>

                {/* Price */}
                <div className="flex items-end gap-1">
                    <span className={cn(
                        "text-4xl font-bold tracking-tight",
                        (isPopular || isCurrentPlan) ? "text-primary" : "text-foreground"
                    )}>
                        ${plan.price}
                    </span>
                    <span className="text-sm text-muted-foreground mb-1.5 ml-0.5">/{plan.cycle}</span>
                </div>
            </div>

            {/* CTA button */}
            <div className="px-5 sm:px-6 pt-5">
                <Button
                    asChild={!isDisabled}
                    className={cn(
                        "w-full rounded-xl h-10 text-sm font-semibold transition-all duration-200",
                        (isPopular || isCurrentPlan)
                            ? "bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_4px_20px_-4px_hsl(var(--primary)/0.1)]"
                            : "bg-foreground hover:bg-foreground/85 text-background",
                        isDisabled && "opacity-60 cursor-not-allowed hover:bg-primary hover:text-primary-foreground"
                    )}
                    disabled={true}
                >
                    {isDisabled ? (
                        <span className="flex items-center justify-center gap-1.5">
                            Get started
                        </span>
                    ) : (
                        <>
                            Get started
                            <ChevronRight size={15} className="group-hover:translate-x-0.5 transition-transform duration-200" />
                        </>
                    )}
                </Button>
            </div>

            {/* Features list */}
            <div className="p-5 sm:p-6 pt-5 flex flex-col gap-2.5 flex-1">
                <p className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground/60 mb-1">
                    What's included
                </p>
                {plan.features.map((feature: any, idx: number) => (
                    <div className="flex items-start gap-2.5" key={idx}>
                        <span className={cn(
                            "mt-0.5 w-4 h-4 flex-shrink-0 rounded-full flex items-center justify-center",
                            isPopular
                                ? "bg-primary/15 text-primary"
                                : "bg-muted text-muted-foreground"
                        )}>
                            <Check size={10} strokeWidth={2.5} />
                        </span>
                        <span className="text-xs sm:text-[13px] text-foreground/70 leading-relaxed">
                            {feature.label}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};