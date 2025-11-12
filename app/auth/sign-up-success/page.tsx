import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'

export default function Page() {
  return (
    <div className="flex min-h-svh w-screen items-center justify-center p-6 md:p-10 ">
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
