'use client'

import { useSidebar } from '@/components/ui/sidebar'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { SiInstagram, SiLinkedin, SiX } from 'react-icons/si'

export default function AboutClient() {
  const router = useRouter()
  const { open } = useSidebar()
  const isMobile = useIsMobile()

  return (
    <div
      className={cn(
        'h-svh min-w-0 w-full bg-sidebar mt-0',
        open && !isMobile
          ? 'pt-3.5 border-none transition-all duration-300 ease-in-out'
          : 'mt-0 rounded-t-none transition-all duration-300 ease-in-out border-l border-sidebar-foreground/10'
      )}
    >
      <div
        className={cn(
          'h-svh min-w-0 w-full bg-background mt-0',
          open && !isMobile
            ? 'rounded-tl-xl border-t border-l border-sidebar-ring/30 dark:border-sidebar-ring/10 transition-all duration-300 ease-in-out'
            : 'mt-0 rounded-t-none transition-all duration-300 ease-in-out border-l border-sidebar-foreground/10'
        )}
      >
        <div className="CustomScrollbar max-w-3xl mx-auto px-4 lg:px-8 py-0 h-full overflow-y-auto HiddenScrollbar">
          {/* ── Page Header ──────────────────────────────── */}
          <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm pt-4 md:pt-7 pb-4 mb-2 md:hidden">
            <button
              onClick={() => router.push('/')}
              className="group flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm transition-colors duration-200"
            >
              <ArrowLeft
                size={14}
                className="transition-transform duration-200 group-hover:-translate-x-0.5"
              />
              Back to Home
            </button>
          </div>

          <div className="mt-4 md:mt-8 pb-10">
            <header className="mb-10 space-y-3">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                About Us
              </h1>
              <p className="text-muted-foreground text-sm md:text-base max-w-xl">
                Learn more about who we are and what drives the future of
                intelligent research at Cluezy.
              </p>
            </header>

            <main className="text-foreground/90 leading-7 md:leading-8">
              <section className="space-y-6">
                <p className="text-md text-foreground">
                  At <span className="font-semibold">Cluezy</span>, we believe
                  that finding accurate answers shouldn’t be complicated. Cluezy
                  is an{' '}
                  <span className="font-medium italic decoration-primary/30">
                    agentic research engine
                  </span>{' '}
                  designed to make information discovery smarter, faster, and
                  more intuitive.
                </p>

                <p>
                  Our mission is to make knowledge access{' '}
                  <span className="font-medium">
                    instant, intelligent, and effortless
                  </span>{' '}
                  for everyone. We combine advanced AI models, deep contextual
                  understanding, and real-time search capabilities to deliver
                  accurate, meaningful, and reliable answers—not just a list of
                  links.
                </p>

                <p>
                  Our vision is to redefine how people interact with information through
                  innovation, user-centric design, and cutting-edge
                  technology.
                </p>

                <p>
                  Our drive is shaped by the belief that technology should empower
                  curiosity, creativity, and professional growth.
                </p>
              </section>

              <p className="text-start pt-8">
                We’re not just building a tool; we’re building a smarter way to
                think, search, and learn.
              </p>
            </main>

            <footer className="mt-20 pt-10 border-t border-border/40 pb-8 flex flex-col sm:flex-row items-center justify-between gap-6">
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium order-2 sm:order-1">
                © 2026 Cluezy. All rights reserved.
              </p>

              <div className="flex gap-5 items-center order-1 sm:order-2">
                <Link
                  href="https://x.com/cluezyai"
                  target="_blank"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <SiX className="w-4 h-4" />
                </Link>
                <Link
                  href="https://www.linkedin.com/company/cluezy"
                  target="_blank"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <SiLinkedin className="w-4 h-4" />
                </Link>
                <Link
                  href="https://www.instagram.com/cluezyai"
                  target="_blank"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <SiInstagram className="w-4 h-4" />
                </Link>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  )
}
