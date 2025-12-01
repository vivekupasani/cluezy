import type { Metadata, Viewport } from 'next'
import { Inter as FontSans } from 'next/font/google'

import { Analytics } from '@vercel/analytics/next'

import { cn } from '@/lib/utils'

import { SidebarProvider } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/sonner'

import { ThemeProvider } from '@/components/theme-provider'

import ArtifactRoot from '@/components/artifact/artifact-root'
import { AuthProvider } from '@/components/context/auth-context'
import Header from '@/components/header'
import { HistoryDialogProvider } from '@/components/history-dialog'
import { SourcesDialogProvider } from '@/components/sources-dialog'
import { getModels } from '@/lib/config/models'
import './globals.css'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans'
})

const title = 'Cluezy - Advanced AI search & answer engine'
const description =
  'Cluezy is an advanced AI search engine that finds, analyzes, and cites the live web'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.cluezy.site'),
  title,
  description,
  openGraph: {
    url: "https://www.cluezy.site",
    siteName: "Cluezy AI",
    title,
    description,
  },
  twitter: {
    title,
    description,
    card: 'summary_large_image',
    creator: '@v1vekupasani'
  },
  keywords: [
    'cluezy.ai',
    'free ai search',
    'ai search',
    'ai research tool',
    'ai search tool',
    'perplexity ai alternative',
    'perplexity alternative',
    'chatgpt alternative',
    'ai search engine',
    'search engine',
    'cluezy ai',
    'cluezy AI',
    'cluezy AI',
    'cluezy.AI',
    'cluezy github',
    'ai search engine',
    'cluezy',
    'cluezy',
    'cluezy.app',
    'cluezy ai',
    'cluezy ai app',
    'cluezy',
    'cluezy AI',
    'Perplexity alternatives',
    'Perplexity AI alternatives',
    'open source ai search engine',
    'minimalistic ai search engine',
    'minimalistic ai search alternatives',
    'ai search',
    'minimal ai search',
    'minimal ai search alternatives',
    'AI Search Engine',
    'vivek upasani',
    'cluezy.how',
    'search engine',
    'AI',
    'perplexity',
  ],
  manifest: "/manifest.json"
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const models = await getModels()

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'h-screen flex flex-col font-sans antialiased',
          fontSans.variable
        )}
      >
        <AuthProvider>
          <HistoryDialogProvider>
            <SourcesDialogProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                <SidebarProvider defaultOpen>
                  <div className="flex flex-col flex-1">
                    {/* <AppSidebar /> */}
                    <Header models={models} />
                    <main className="flex flex-1 min-h-0">
                      <ArtifactRoot>{children}</ArtifactRoot>
                    </main>
                  </div>
                </SidebarProvider>
                <Toaster />
                <Analytics />
              </ThemeProvider>
            </SourcesDialogProvider>
          </HistoryDialogProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
