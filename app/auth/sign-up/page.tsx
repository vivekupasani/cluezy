import { SignUpForm } from '@/components/sign-up-form'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function Page() {
  return (
    <div className="relative flex min-h-svh w-screen items-center justify-center p-3 md:p-10">
      <Link
        href="/"
        className="absolute top-20 md:top-0 md:left-72 group ml-2 mt-10 md:mt-16 flex gap-2 items-start cursor-pointer w-full max-w-[400px]">
        <ArrowLeft size={18} className="text-foreground/70 group-hover:text-foreground" />
        <p className="txt-grad group-hover:text-foreground text-sm">Back</p>
      </Link>
      <div className="w-full h-full max-w-sm">
        <SignUpForm />
      </div>
    </div>
  )
}
