"use client"
import { useAuth } from "@/components/context/auth-context";
import { PricingTile } from "@/components/pricing-dialog";
import { pricingPlans } from "@/lib/utils/pricing-plans";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
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
                {
                    pricingPlans.map((plan, index) => (
                        <div key={plan.id} className="flex justify-center">
                            <PricingTile plan={plan} user={user} userPlanDetails={userPlanDetails} />
                        </div>
                    ))
                }
            </div>

            <span className="mt-4 text-xs text-muted-foreground text-center">
                By subscribing, you agree to our <Link href="/terms" className='font-bold hover:text-primary'>Terms of Service</Link> and <Link href="/privacy" className='font-bold hover:text-primary'>Privacy Policy</Link>.
            </span>
        </div>
    )
}