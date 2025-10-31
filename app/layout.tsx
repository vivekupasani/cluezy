import type { Metadata, Viewport } from 'next'
import { Inter as FontSans } from 'next/font/google'

import { Analytics } from '@vercel/analytics/next'

import { cn } from '@/lib/utils'

import { SidebarProvider } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/sonner'

import { ThemeProvider } from '@/components/theme-provider'

import ArtifactRoot from '@/components/artifact/artifact-root'
import { HistoryDialogProvider } from '@/components/history-dialog'
import './globals.css'

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans'
})

const title = 'Cluezy - Advanced AI search engine & Perplexity alternative | $12/month'
const description =
  'AI-powered search engine with a generative UI.'

export const metadata: Metadata = {
  metadataBase: new URL('https://www.cluezy.site'),
  title,
  description,
  openGraph: {
    title,
    description,
  },
  twitter: {
    title,
    description,
    card: 'summary_large_image',
    creator: '@v1vekupasani'
  }
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
  // let user = null
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // if (supabaseUrl && supabaseAnonKey) {
  //   const supabase = await createClient()
  //   const {
  //     data: { user: supabaseUser }
  //   } = await supabase.auth.getUser()
  //   user = supabaseUser
  // }
  // console.log("users", user)
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen flex flex-col font-sans antialiased',
          fontSans.variable
        )}
      >
        <HistoryDialogProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <SidebarProvider defaultOpen>
              <div className="flex flex-col flex-1">
                {/* <AppSidebar /> */}
                {/* <Header /> */}
                <main className="flex flex-1 min-h-0">
                  <ArtifactRoot>{children}</ArtifactRoot>
                </main>
                {/* <WaitlistPage /> */}
              </div>
            </SidebarProvider>
            <Toaster />
            <Analytics />
          </ThemeProvider>
        </HistoryDialogProvider>
      </body>
    </html>
  )
}
