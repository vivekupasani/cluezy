"use client"

import { useSidebar } from "@/components/ui/sidebar"
import { useIsMobile } from "@/hooks/use-mobile"
import { cn } from "@/lib/utils"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { SiInstagram, SiLinkedin, SiX } from "react-icons/si"

interface TermSection {
    id: number
    title: string
    content: string
}

const termsOfUse: TermSection[] = [
    {
        id: 1,
        title: "Acceptance of Terms",
        content:
            "By accessing and using the Cluezy website and services (“Service”), you agree to be bound by these Terms of Use (“Terms”). These Terms constitute a legally binding agreement between you and Cluezy."
    },
    {
        id: 2,
        title: "Description of Service",
        content:
            "Cluezy is an AI-powered search and answer engine designed to help users discover accurate and relevant information through intelligent, AI-generated results."
    },
    {
        id: 3,
        title: "Registration",
        content:
            "To access certain features, you may be required to create an account and provide accurate information. You are responsible for maintaining the confidentiality of your account credentials."
    },
    {
        id: 4,
        title: "Use of the Service",
        content:
            "You agree to use Cluezy in compliance with all applicable laws and not misuse, disrupt, or attempt unauthorized access to the Service."
    },
    {
        id: 5,
        title: "Intellectual Property",
        content:
            "All content, trademarks, algorithms, and intellectual property related to Cluezy are the exclusive property of Cluezy."
    },
    {
        id: 6,
        title: "Privacy Policy",
        content:
            "Your use of Cluezy is also governed by our Privacy Policy."
    },
    {
        id: 7,
        title: "Termination",
        content:
            "Cluezy reserves the right to suspend or terminate access at any time for violation of these Terms."
    },
    {
        id: 8,
        title: "Disclaimer of Warranties",
        content:
            "The Service is provided 'as is' without warranties of any kind."
    },
    {
        id: 9,
        title: "Limitation of Liability",
        content:
            "Cluezy shall not be liable for any damages arising from use of the Service."
    },
    {
        id: 10,
        title: "Indemnification",
        content:
            "You agree to indemnify and hold harmless Cluezy and its affiliates."
    },
    {
        id: 11,
        title: "Governing Law",
        content:
            "These Terms are governed by the laws of India."
    },
    {
        id: 12,
        title: "Contact Information",
        content:
            "For questions regarding these Terms, contact cluezyai@gmail.com."
    },
    {
        id: 13,
        title: "Acknowledgment",
        content:
            "By using Cluezy, you acknowledge that you have read and agree to these Terms."
    }
]

export default function TermsClient() {
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
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
                                Terms of Service
                            </h1>
                            <p className="text-muted-foreground text-sm md:text-base max-w-md text-start">
                                By using our service, you agree to these terms and conditions.
                            </p>
                        </div>
                    </header>

                    <main className="text-muted-foreground/90">
                        <section className="space-y-6 border-b border-border/40 pb-10">
                            <p className="text-md text-foreground/90">
                                By accessing and using the Cluezy website and services ("Service"), you agree to be bound by these Terms of Use ("Terms"). These Terms constitute a legally binding agreement between you and Cluezy. If you do not agree to these Terms, please refrain from using the Service.
                            </p>
                        </section>

                        <div className="space-y-8 mt-10">
                            {termsOfUse.map((term) => (
                                <section key={term.id} className="space-y-4">
                                    <h2 className="text-foreground font-semibold">
                                        {term.title}
                                    </h2>
                                    <p className="text-sm">
                                        {term.content}
                                    </p>
                                </section>
                            ))}
                        </div>
                    </main>

                    <footer className="mt-20 md:mt-10 mb-10 pt-12 flex flex-col items-center gap-6">
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