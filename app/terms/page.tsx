"use client"
import { useSidebar } from "@/components/ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SiInstagram, SiLinkedin, SiX } from "react-icons/si";

interface TermSection {
    id: number;
    title: string;
    content: string;
}

const termsOfUse: TermSection[] = [
    {
        id: 1,
        title: "Acceptance of Terms",
        content:
            "By accessing and using the Cluezy website and services (“Service”), you agree to be bound by these Terms of Use (“Terms”). These Terms constitute a legally binding agreement between you and Cluezy (operating under the service name “Cluezy”). If you do not agree to these Terms, please refrain from using the Service."
    },
    {
        id: 2,
        title: "Description of Service",
        content:
            "Cluezy is an AI-powered search and answer engine designed to help users discover accurate and relevant information through intelligent, AI-generated results. The Service allows users to input queries, which are processed and answered using advanced artificial intelligence technology. Cluezy reserves the right to modify, enhance, suspend, or discontinue any aspect of the Service at any time, with or without notice."
    },
    {
        id: 3,
        title: "Registration",
        content:
            "To access certain features of Cluezy, you may be required to create an account and provide accurate, current, and complete information. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree not to share your login details with others and to notify Cluezy immediately if you suspect any unauthorized access or use of your account."
    },
    {
        id: 4,
        title: "Use of the Service",
        content:
            "You agree to use Cluezy in compliance with all applicable laws, regulations, and these Terms. You must not use the Service for any unlawful or unauthorized purpose, interfere with or disrupt the operation, performance, or security of the Service, attempt to gain unauthorized access to any Cluezy systems, servers, or accounts, upload, transmit, or distribute any viruses, malware, or harmful code, or engage in any conduct that restricts or inhibits other users from enjoying the Service. Any violation of these Terms may result in suspension or termination of your access to the Service."
    },
    {
        id: 5,
        title: "Intellectual Property",
        content:
            "All content, design, trademarks, algorithms, and intellectual property related to Cluezy are the exclusive property of Cluezy. You are not permitted to copy, reproduce, distribute, or create derivative works from any part of the Service without prior written consent from Cluezy."
    },
    {
        id: 6,
        title: "Privacy Policy",
        content:
            "Your use of Cluezy is also governed by our Privacy Policy, which explains how we collect, use, and protect your information. By using the Service, you agree to the terms outlined in the Privacy Policy, which is incorporated into these Terms by reference."
    },
    {
        id: 7,
        title: "Termination",
        content:
            "Cluezy reserves the right to suspend or terminate your access to the Service at any time, with or without notice, for conduct that it believes violates these Terms or is harmful to other users, Cluezy, or third parties. Upon termination, your right to use the Service will immediately cease."
    },
    {
        id: 8,
        title: "Disclaimer of Warranties",
        content:
            "The Cluezy Service is provided “as is” and “as available,” without any warranties of any kind, either express or implied. Cluezy does not warrant that the Service will be uninterrupted, error-free, secure, or that any results obtained from its use will be accurate or reliable."
    },
    {
        id: 9,
        title: "Limitation of Liability",
        content:
            "In no event shall Cluezy be liable for any direct, indirect, incidental, special, consequential, or exemplary damages arising out of or in connection with your use or inability to use the Service, even if Cluezy has been advised of the possibility of such damages."
    },
    {
        id: 10,
        title: "Indemnification",
        content:
            "You agree to indemnify, defend, and hold harmless Cluezy, its affiliates, and their respective officers, employees, and agents from and against any claims, damages, obligations, losses, liabilities, and expenses (including reasonable attorney’s fees) arising from your use of the Service or your violation of these Terms."
    },
    {
        id: 11,
        title: "Governing Law",
        content:
            "These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law principles. Any disputes arising under or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts located in Maharashtra, India."
    },
    {
        id: 12,
        title: "Contact Information",
        content:
            "If you have any questions or concerns regarding these Terms of Use, please contact us at 📩cluezyai@gmail.com."
    },
    {
        id: 13,
        title: "Acknowledgment",
        content:
            "By using Cluezy, you acknowledge that you have read, understood, and agree to be bound by these Terms of Use. These Terms may be updated by Cluezy from time to time, and continued use of the Service after such updates constitutes acceptance of the revised Terms."
    }
];


export default async function TermsPage() {
    const router = useRouter();
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

