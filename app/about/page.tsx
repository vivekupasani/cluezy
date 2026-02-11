"use client"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { SiInstagram, SiLinkedin, SiX } from "react-icons/si"

export default async function AboutPage() {
    const router = useRouter();
    return (
        <div className="min-h-screen h-full overflow-y-auto CustomScrollbar selection:bg-primary/20">
            <div className="max-w-3xl mx-auto px-6 py-20 md:py-24">
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
                            Know About Us
                        </h1>
                        <p className="text-muted-foreground text-sm md:text-base max-w-md text-start">
                            Learn more about who we are and what drives the future of intelligent research at Cluezy.
                        </p>
                    </div>
                </header>

                <main className="text-muted-foreground/90 leading-7 md:leading-8">
                    <section className="space-y-6">
                        <p className="text-md text-foreground/90">
                            At <span className="font-semibold">Cluezy</span>, we believe that finding accurate answers shouldn’t be complicated.
                            Cluezy is an <span className="font-medium italic underline decoration-primary/30 underline-offset-4">agentic research engine</span> designed to make information discovery smarter, faster, and more intuitive.
                        </p>

                        <p>
                            Our mission is to make knowledge access <span className="font-medium">instant, intelligent, and effortless</span> for everyone.
                            We combine advanced AI models, deep contextual understanding, and real-time search capabilities to deliver accurate, meaningful, and reliable answers—not just a list of links.
                        </p>
                    </section>

                    <section className="grid gap-8 md:grid-cols-2 mt-10">
                        <div className="p-6 rounded-2xl border border-border/50 bg-secondary/10 space-y-3">
                            <h2 className="text-foreground font-semibold">Our Vision</h2>
                            <p className="text-sm">Redefining how people interact with information through innovation, user centric design, and cutting-edge technology.</p>
                        </div>
                        <div className="p-6 rounded-2xl border border-border/50 bg-secondary/10 space-y-3">
                            <h2 className="text-foreground font-semibold">Our Drive</h2>
                            <p className="text-sm">We're shaped by the belief that technology should empower curiosity, creativity, and professional growth.</p>
                        </div>
                    </section>

                    <p className="text-center pt-8 border-t border-border/40">
                        We’re not just building a tool; we’re building a smarter way to think, search, and learn.
                    </p>
                </main>

                <footer className="mt-20 md:mt-32 pt-12 border-t border-border/40 flex flex-col items-center gap-6">
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
    )
}

