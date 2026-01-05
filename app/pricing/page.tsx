"use client"
import { Button } from "@/components/ui";
import { ChartLine, ChevronRight, Cpu, History, Search, Users } from "lucide-react";
import { toast } from "sonner";

export default function PricingPage() {

    const pricingPlans = [
        {
            id: "free",
            name: "Free",
            price: 0,
            popular: false,
            description: "Track your investment and stay updated with the latest market trends.",
            features: [
                { icon: Search, label: "10 searches per day" },
                { icon: Cpu, label: "Basic AI models" },
                { icon: History, label: "Search history" },
                { icon: Users, label: "Community support" },
                { icon: ChartLine, label: "Basic analytics" },
            ],
        },
        {
            id: "pro",
            name: "Pro",
            price: 15,
            popular: true,
            description: "Perfect for professionals who need more power and insights.",
            features: [
                { icon: Search, label: "Unlimited searches" },
                { icon: Cpu, label: "Advanced AI models" },
                { icon: History, label: "Unlimited history" },
                { icon: Users, label: "Priority support" },
                { icon: ChartLine, label: "Advanced analytics" },
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
        <div className="min-h-screen w-full flex flex-col items-center justify-center px-6 py-20">
            {/* Header */}
            <div className="text-center max-w-xl mb-14">
                <h1 className="text-4xl font-bold tracking-tight">Simple pricing</h1>
                <p className="mt-3 text-muted-foreground">
                    Choose the plan that fits your needs. Upgrade or downgrade anytime.
                </p>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-2 max-w-6xl w-fit">
                {
                    pricingPlans.map((plan) => (
                        <div key={plan.id}>
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
            className="w-full h-[500px] max-w-[350px] rounded-3xl bg-muted/80 border border-muted-foreground/10 backdrop-blur-xl p-2">
            <div className="w-full p-5 max-w-[350px] gap-4 flex flex-col items-start justify-center rounded-3xl bg-background drop-shadow-md">
                <div>
                    <p className="text-2xl font-bold">{plan.name}</p>
                    <p className="text-sm w-[300px] text-foreground/70">{plan.description}</p>
                </div>
                <div className="w-full h-[2px] bg-border" />
                <div className="text-foreground/70 text-sm">
                    <span className="text-4xl font-bold text-foreground">${plan.price} </span> /month
                </div>
                <Button
                    onClick={handleSubmit}
                    className="w-full rounded-full bg-foreground hover:bg-foreground/80 text-background">Get Started <ChevronRight size={16} className="ml-2" /></Button>
            </div>

            <div className="w-full p-5 max-w-[400px] gap-4 flex flex-col items-start justify-center">
                <span className="text-xs text-foreground/70 font-bold">WHAT'S INCLUDE:</span>
                <div>
                    <div className="flex flex-col gap-3 mt-2">
                        {
                            plan.features.map((feature: any, idx: number) => (
                                <div className="flex items-center gap-2" key={idx}>
                                    <feature.icon className="w-4 h-4 text-foreground/70" />
                                    <span className="text-sm text-foreground/70 font-semibold">{feature.label}</span>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}