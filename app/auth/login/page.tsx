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
          className="group flex items-center gap-1 text-sm"
        >
          <ArrowLeft
            size={16}
            className="text-foreground/70 group-hover:text-foreground"
          />
          <span className="txt-grad group-hover:text-foreground">
            Back
          </span>
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
