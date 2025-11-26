import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function Page() {
  return (
    <div className="relative flex min-h-svh flex-col gap-3 w-screen items-center justify-center p-6 md:p-10 ">
      <Link
        href="/"
        className="absolute top-72 left-4 md:top-0 md:left-72 group ml-2 mt-10 md:mt-16 flex gap-2 items-start cursor-pointer w-full max-w-[400px]">
        <ArrowLeft size={18} className="text-foreground/70 group-hover:text-foreground" />
        <p className="txt-grad group-hover:text-foreground text-sm">Back</p>
      </Link>
      <div className='w-full max-w-sm shadow-lg shadow-muted rounded-md'>
        <div className="flex flex-col gap-6">
          <Card className='bg-background'>
            <CardHeader>
              <CardTitle className="text-2xl txt-grad">
                Thank you for signing up!
              </CardTitle>
              <CardDescription className='txt-mut'>Check your email to confirm</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm txt-mut">
                You&apos;ve successfully signed up. Please check your email to
                confirm your account before signing in.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
