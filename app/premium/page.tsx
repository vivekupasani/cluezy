"use client"
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";
import { ArrowLeft, Cpu, History, LayoutGrid, Search, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function PricingPage() {
    const router = useRouter();

    const pricingPlans = [
        {
            id: "free",
            name: "Free",
            price: 0,
            popular: false,
            description: "Experience smarter research with fast answers, multiple sources, and zero cost.",
            features: [
                { icon: Search, label: "10 searches per day" },
                { icon: Cpu, label: "Basic AI models" },
                { icon: History, label: "Search history" },
                { icon: Users, label: "Community support" },
                { icon: LayoutGrid, label: "Connect & chat with apps" },
            ],
        },
        {
            id: "pro",
            name: "Pro",
            price: 15,
            popular: true,
            description: "From quick searches to deep insights, research without limits.",
            features: [
                { icon: Search, label: "Unlimited searches" },
                { icon: Cpu, label: "Advanced AI models" },
                { icon: History, label: "Unlimited history" },
                { icon: Users, label: "Priority support" },
                { icon: LayoutGrid, label: "Connect & chat with apps" },
            ],
        },
        // {
        //     id: "enterprise",
        //     name: "Enterprise",
        //     price: "",
        //     popular: false,
        //     description: "Built for teams and businesses that need full control.",
        //     features: [
        //         { icon: Search, label: "Unlimited searches" },
        //         { icon: Cpu, label: "Custom AI models" },
        //         { icon: History, label: "Team-wide history" },
        //         { icon: Users, label: "Dedicated support" },
        //         { icon: ChartLine, label: "Enterprise analytics" },
        //     ],
        // },
    ]

    return (
        <div className="h-screen w-full flex flex-col items-center px-4 sm:px-6 py-12 sm:py-20 overflow-y-auto CustomScrollbar">
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

                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">premium pricing</h1>
                <p className="mt-2 sm:mt-3 text-sm sm:text-base text-muted-foreground">
                    Choose the plan that fits your needs. Upgrade or downgrade anytime.
                </p>
            </div>
            <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 max-w-6xl w-full sm:w-fit pb-12">
                {
                    pricingPlans.map((plan) => (
                        <div key={plan.id} className="flex justify-center">
                            <PricingTile plan={plan} />
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

const PricingTile = ({ plan }: { plan: any }) => {
    const handleSubmit = () => {
        toast.message(`Plan selected: ${plan.name}`, {
            duration: 2000,
        })
    }
    return (
        <div
            className={cn("w-full max-w-[350px] rounded-2xl sm:rounded-3xl bg-muted/80 border border-muted-foreground/10 backdrop-blur-xl p-2",
                // plan.popular && "border-primary"
            )}>
            <div className="w-full p-4 sm:p-5 gap-3 sm:gap-4 flex flex-col items-start justify-center rounded-2xl sm:rounded-3xl bg-background drop-shadow-md">
                <div className="w-full">
                    <p className="text-xl sm:text-2xl font-bold">{plan.name}</p>
                    <p className="text-xs sm:text-sm mt-1 text-foreground/70 max-w-full">{plan.description}</p>
                </div>
                <div className="w-full h-[2px] bg-border" />
                <div className="text-foreground/70 text-xs sm:text-sm">
                    <span className="text-3xl sm:text-4xl font-bold text-foreground">${plan.price} </span>/month
                </div>
                <Button
                    // onClick={handleSubmit}
                    disabled
                    // className="w-full rounded-full bg-primary hover:bg-primary/80 text-primary-foreground">Get Started <ChevronRight size={16} className="ml-2" /></Button>
                    className="w-full rounded-full bg-primary hover:bg-primary/80 text-primary-foreground text-sm sm:text-base">Coming Soon</Button>
            </div>

            <div className="w-full p-4 sm:p-5 gap-3 sm:gap-4 flex flex-col items-start justify-center">
                <span className="text-xs text-foreground/70 font-bold">WHAT'S INCLUDED:</span>
                <div className="w-full">
                    <div className="flex flex-col gap-2 sm:gap-3">
                        {
                            plan.features.map((feature: any, idx: number) => (
                                <div className="flex items-center gap-2" key={idx}>
                                    <feature.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-foreground/70 flex-shrink-0" />
                                    <span className="text-xs sm:text-sm text-foreground/70 font-semibold">{feature.label}</span>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div >
    )
}