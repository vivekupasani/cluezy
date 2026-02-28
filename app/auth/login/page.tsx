import Link from 'next/link'

import { ArrowLeft } from 'lucide-react'

import { LoginForm } from '@/components/login-form'

export default function Page() {
  return (
    <div className="flex-1 min-h-svh w-screen flex flex-col">
      {/* Header */}
      <header className="h-14 flex items-center px-5">
        <Link
          href="/"
          className="group flex items-center justify-center gap-1 text-muted-foreground hover:text-foreground text-sm transition-colors duration-200"
        >
          <ArrowLeft size={16} />
          <span>Back to home</span>
        </Link>
      </header>

      {/* Centered Login */}
      <main className="flex flex-1 items-center justify-center px-4">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </main>
    </div>
  )
}
