'use client'

import { useSidebar } from '@/components/ui/sidebar'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/lib/utils'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { SiInstagram, SiLinkedin, SiX } from 'react-icons/si'

interface TermSection {
  id: number
  title: string
  content: string
}

const termsOfUse: TermSection[] = [
  {
    id: 1,
    title: 'Acceptance of Terms',
    content:
      'By accessing and using the Cluezy website and services (“Service”), you agree to be bound by these Terms of Use (“Terms”). These Terms constitute a legally binding agreement between you and Cluezy.'
  },
  {
    id: 2,
    title: 'Description of Service',
    content:
      'Cluezy is an AI-powered search and answer engine designed to help users discover accurate and relevant information through intelligent, AI-generated results.'
  },
  {
    id: 3,
    title: 'Registration',
    content:
      'To access certain features, you may be required to create an account and provide accurate information. You are responsible for maintaining the confidentiality of your account credentials.'
  },
  {
    id: 4,
    title: 'Use of the Service',
    content:
      'You agree to use Cluezy in compliance with all applicable laws and not misuse, disrupt, or attempt unauthorized access to the Service.'
  },
  {
    id: 5,
    title: 'Intellectual Property',
    content:
      'All content, trademarks, algorithms, and intellectual property related to Cluezy are the exclusive property of Cluezy.'
  },
  {
    id: 6,
    title: 'Privacy Policy',
    content: 'Your use of Cluezy is also governed by our Privacy Policy.'
  },
  {
    id: 7,
    title: 'Termination',
    content:
      'Cluezy reserves the right to suspend or terminate access at any time for violation of these Terms.'
  },
  {
    id: 8,
    title: 'Disclaimer of Warranties',
    content: "The Service is provided 'as is' without warranties of any kind."
  },
  {
    id: 9,
    title: 'Limitation of Liability',
    content:
      'Cluezy shall not be liable for any damages arising from use of the Service.'
  },
  {
    id: 10,
    title: 'Indemnification',
    content:
      'You agree to indemnify and hold harmless Cluezy and its affiliates.'
  },
  {
    id: 11,
    title: 'Governing Law',
    content: 'These Terms are governed by the laws of India.'
  },
  {
    id: 12,
    title: 'Contact Information',
    content: 'For questions regarding these Terms, contact cluezyai@gmail.com.'
  },
  {
    id: 13,
    title: 'Acknowledgment',
    content:
      'By using Cluezy, you acknowledge that you have read and agree to these Terms.'
  }
]

export default function TermsClient() {
  const router = useRouter()
  const { open } = useSidebar()
  const isMobile = useIsMobile()

  return (
    <div
      className={cn(
        'h-svh min-w-0 w-full bg-sidebar mt-0',
        open && !isMobile
          ? 'pt-3.5 border-none transition-all duration-300 ease-in-out'
          : 'mt-0 rounded-t-none md:transition-all md:duration-300 md:ease-in-out border-l border-sidebar-foreground/10'
      )}
    >
      <div
        className={cn(
          'h-svh min-w-0 w-full bg-background mt-0',
          open && !isMobile
            ? 'rounded-tl-xl border-t border-l border-sidebar-ring/30 dark:border-sidebar-ring/10 transition-all duration-300 ease-in-out'
            : 'mt-0 rounded-t-none md:transition-all md:duration-300 md:ease-in-out border-l border-sidebar-foreground/10'
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
                Terms of Service
              </h1>
              <p className="text-muted-foreground text-sm md:text-base max-w-xl">
                By using our service, you agree to these terms and conditions.
              </p>
            </header>

            <main className="text-muted-foreground/90">
              <section className="space-y-6 border-b border-border/40 pb-10">
                <p className="text-md text-foreground/90">
                  By accessing and using the Cluezy website and services
                  ("Service"), you agree to be bound by these Terms of Use
                  ("Terms"). These Terms constitute a legally binding agreement
                  between you and Cluezy. If you do not agree to these Terms,
                  please refrain from using the Service.
                </p>
              </section>

              <div className="space-y-8 mt-10">
                {termsOfUse.map(term => (
                  <section key={term.id} className="space-y-4">
                    <h2 className="text-foreground font-semibold">
                      {term.title}
                    </h2>
                    <p className="text-sm">{term.content}</p>
                  </section>
                ))}
              </div>
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
