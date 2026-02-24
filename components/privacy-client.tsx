"use client"

import { useSidebar } from "@/components/ui/sidebar"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { SiInstagram, SiLinkedin, SiX } from "react-icons/si"

interface PrivacySection {
    id: number
    title: string
    content: string
}

const privacy: PrivacySection[] = [
    {
        id: 1,
        title: "Information We Collect",
        content:
            "We collect information you provide directly and information collected automatically when you use our Service, including name, email, IP address, device and browser details."
    },
    {
        id: 2,
        title: "How We Use Your Information",
        content:
            "We use your information to operate, maintain, and improve the Service, provide support, and comply with legal obligations."
    },
    {
        id: 3,
        title: "Data Sharing",
        content:
            "We do not sell your personal information. We may share it with trusted third-party service providers or when legally required."
    },
    {
        id: 4,
        title: "Security Measures",
        content:
            "We implement appropriate safeguards to protect your information, though no system is completely secure."
    },
    {
        id: 5,
        title: "Your Choices",
        content:
            "You may update your account details, opt out of marketing communications, or request account deletion."
    },
    {
        id: 6,
        title: "Children’s Privacy",
        content:
            "Cluezy is not intended for children under 13 and does not knowingly collect data from minors."
    },
    {
        id: 7,
        title: "Changes to This Policy",
        content:
            "We may update this Privacy Policy periodically. Updates will be posted on this page."
    },
    {
        id: 8,
        title: "Contact Us",
        content:
            "If you have questions, contact us at cluezyai@gmail.com."
    },
    {
        id: 9,
        title: "Acknowledgment",
        content:
            "By using Cluezy, you acknowledge that you have read and agree to this Privacy Policy."
    }
]

export default function PrivacyClient() {
    const router = useRouter()
    const { open } = useSidebar()
    const isMobile = useIsMobile()

    return (
        <div className={cn("h-svh min-w-0 w-full bg-sidebar mt-0",
            open && !isMobile ? "pt-3.5 border-none transition-all duration-300 ease-in-out" : "mt-0 rounded-t-none transition-all duration-300 ease-in-out border-l border-sidebar-foreground/10"
        )}>
            <div className={cn("min-h-svh h-full overflow-y-auto CustomScrollbar bg-background",
                open && !isMobile ? "rounded-tl-xl border-t border-l border-sidebar-ring/30 dark:border-sidebar-ring/10 transition-all duration-300 ease-in-out" : "mt-0 rounded-t-none transition-all duration-300 ease-in-out border-l border-sidebar-foreground/10"
            )}>
                <div className="max-w-3xl mx-auto px-6 py-6 md:py-4">
                    <header className="mb-6 text-center space-y-4">
                        <button
                            onClick={() => router.push("/")}
                            className="visible md:hidden group flex items-center mb-5 gap-1.5 text-muted-foreground hover:text-foreground text-[16px] transition-colors duration-200"
                        >
                            <ArrowLeft
                                size={16}
                                className="transition-transform duration-200"
                            />
                            Back
                        </button>
                        <div className="flex flex-col justify-start items-start">
                            <h1 className="text-3xl md:text-4xl pb-2 font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
                                Privacy Policy
                            </h1>
                            <p className="text-muted-foreground text-sm md:text-base max-w-md text-start">
                                At Cluezy, we take your privacy seriously and are committed to protecting your personal information.
                            </p>
                        </div>
                    </header>

                    <main className="text-muted-foreground/90">
                        <section className="space-y-2 border-b border-border/40 pb-10">
                            <p className="text-md text-foreground/90">
                                This Privacy Policy explains how we collect, use, disclose, and safeguard your data when you access and use our AI-powered search and answer engine (collectively referred to as the “Service”). By using Cluezy, you agree to the collection and use of your information in accordance with this Privacy Policy.
                            </p>
                        </section>

                        <div className="space-y-8 mt-10">
                            {privacy.map((section) => (
                                <section key={section.id} className="space-y-4">
                                    <h2 className="text-foreground font-semibold">
                                        {section.title}
                                    </h2>
                                    <p className="text-sm">
                                        {section.content}
                                    </p>
                                </section>
                            ))}
                        </div>
                    </main>

                    <footer className="mt-20 md:mt-10 pt-12 mb-10 flex flex-col items-center gap-6">
                        <div className="flex gap-6 items-center">
                            <Link href="https://x.com/cluezyai" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                                <SiX className="w-5 h-5" />
                            </Link>
                            <Link href="https://www.linkedin.com/company/cluezy" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                                <SiLinkedin className="w-5 h-5" />
                            </Link>
                            <Link href="https://www.instagram.com/cluezyai" className="text-muted-foreground hover:text-foreground transition-colors duration-200">
                                <SiInstagram className="w-5 h-5" />
                            </Link>
                        </div>
                        <p className="text-[10px] md:text-xs text-muted-foreground tracking-widest uppercase">
                            © 2026 Cluezy. All rights reserved.
                        </p>
                    </footer>
                </div>
            </div>
        </div>
    );
}