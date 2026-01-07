import Link from "next/link"
import { SiInstagram, SiLinkedin, SiX } from "react-icons/si"


export default async function AboutPage() {
    return (
        <div className="h-screen overflow-y-auto CustomScrollbar">
            <div className="max-w-2xl flex flex-col mx-auto px-4">
                {/* <Link
                    href="/"
                    className="group mt-10 md:mt-16 flex gap-2 items-center cursor-pointer">
                    <ArrowLeft size={18} className="text-foreground/70 group-hover:text-foreground" />
                    <p className="txt-grad group-hover:text-foreground text-sm">Back</p>
                </Link> */}

                <div className="mt-10 md:mt-16 flex flex-col justify-center items-center text-center">
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-tr from-foreground to-foreground/60">
                        About Us
                    </h1>
                    <h3 className="text-xs bg-clip-text text-transparent bg-gradient-to-tr from-foreground/90 to-foreground/60">
                        Learn more about who we are and what drives Cluezy
                    </h3>
                </div>

                <div className="mt-10 flex flex-col">
                    <span className="text-sm text-foreground/80 mb-2 leading-relaxed">
                        At <b>Cluezy</b>, we believe that finding accurate answers shouldn’t be complicated. Built by <b>Cluezy</b>, Cluezy is an
                        <b> agentic research engine</b> designed to make information discovery smarter, faster, and more intuitive.
                        Our mission is to make knowledge access <b>instant, intelligent, and effortless</b> for everyone.
                    </span>

                    <span className="text-sm text-foreground/80 mb-2 leading-relaxed">
                        We combine <b>advanced AI models</b>, <b>contextual understanding</b>, and <b>real-time search capabilities</b> to deliver
                        accurate, meaningful, and reliable answers not just results. Whether you’re exploring, learning, or researching,
                        Cluezy helps you find clarity and insight in seconds.
                    </span>

                    <span className="text-sm text-foreground/80 mb-2 leading-relaxed">
                        Founded with a vision to redefine how people interact with information, Cluezy continues to evolve through innovation,
                        user feedback, and technology. We’re not just building a tool we’re building a smarter way to think, search, and learn.
                    </span>

                    <span className="text-sm text-foreground/80 mb-10 leading-relaxed">
                        At <b>Cluezy</b>, we’re driven by the belief that technology should empower curiosity, creativity, and growth.
                        Through Cluezy, we’re shaping the future of intelligent information discovery one question at a time.
                    </span>
                </div>

                <div className="flex flex-col gap-2 mb-10 justify-center items-center">
                    <div className="flex gap-4">
                        <Link href="https://x.com/v1vekupasani" className="hover:cursor-pointer">
                            <SiX />
                        </Link>
                        <Link href="https://www.linkedin.com/company/cluezy/" className="hover:cursor-pointer">
                            <SiLinkedin />
                        </Link>
                        <Link href="https://www.instagram.com/v1vekupasani/" className="hover:cursor-pointer">
                            <SiInstagram />
                        </Link>
                    </div>
                    <span className="text-xs mt-2">
                        © 2025 Cluezy. All rights reserved.
                    </span>
                </div>
            </div>
        </div>
    )
}
