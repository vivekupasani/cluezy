import { Cpu, FileText, History, LayoutGrid, Search, SearchIcon, Users } from "lucide-react";

export interface pricingPlanProps {
    id: string;
    name: string;
    price: number;
    cycle: "month" | "year";
    priceId: string
    paymentLink: string
    popular: boolean;
    description: string;
    features: { icon: any; label: string }[];
}

export const currentPlanName = (planId: string) => {
    const plan = pricingPlans.find((plan) => plan.priceId === planId);
    if (!plan) return "Free";
    return plan?.name;
}

export const pricingPlans: pricingPlanProps[] = [
    {
        id: "free",
        name: "Free",
        price: 0,
        cycle: "month",
        priceId: "",
        paymentLink: "",
        popular: false,
        description: "Smart research with limited searches and core AI features.",
        features: [
            { icon: Search, label: "10 searches per day" },
            { icon: Cpu, label: "Basic AI models" },
            { icon: History, label: "30 day search history" },
            { icon: LayoutGrid, label: "Basic connectors" },
        ],
    },
    {
        id: "starter",
        name: "Starter",
        price: 8,
        cycle: "month",
        priceId: "",
        paymentLink: "",
        popular: false,
        description: "Smart research with limited searches and core AI features.",
        features: [
            { icon: Search, label: "500 searches per month" },
            { icon: Cpu, label: "Advanced AI models" },
            { icon: History, label: "Unlimited search history" },
        ],
    },
    {
        id: "pro",
        name: "Pro",
        price: 15,
        cycle: "month",
        priceId: "price_1T1mJSGnVTIFcQ3RuJpSZ0T0",
        paymentLink: "https://buy.stripe.com/test_7sYcN572Ia4v1mEcVMbEA00",
        popular: true,
        description: "Unlimited research with advanced AI, large files, and full integrations.",
        features: [
            { icon: Search, label: "Unlimited searches" },
            { icon: Cpu, label: "Advanced AI models" },
            { icon: History, label: "Unlimited search history" },
            { icon: FileText, label: "Large PDF uploads" },
            // { icon: Brain, label: "Deep research mode" },
            { icon: LayoutGrid, label: "Advanced connectors" },
            { icon: Users, label: "Priority support" }
        ],
    },
    {
        id: "max",
        name: "Max",
        price: 150,
        cycle: "year",
        priceId: "price_1T1mNmGnVTIFcQ3RndtF5KLq",
        paymentLink: "https://buy.stripe.com/test_4gMbJ12Ms2C33uMg7YbEA01",
        popular: false,
        description: "Unlimited AI research with built-in yearly savings and priority performance.",
        features: [
            { icon: Search, label: "Unlimited searches" },
            { icon: Cpu, label: "Advanced AI models" },
            { icon: History, label: "Unlimited search history" },
            { icon: SearchIcon, label: "Query suggestions" },
            { icon: FileText, label: "Large PDF uploads" },
            // { icon: Brain, label: "Deep research mode" },
            { icon: LayoutGrid, label: "Advanced connectors" },
            { icon: Users, label: "Priority support" },
            { icon: Users, label: "Community discussions" }
        ],
    },
]