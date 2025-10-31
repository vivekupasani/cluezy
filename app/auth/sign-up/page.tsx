import { SignUpForm } from '@/components/sign-up-form'

export default function Page() {
  return (
    <div className="flex min-h-svh w-screen items-center justify-center p-6 md:p-10">
      <div className="w-full h-full max-w-sm">
        <SignUpForm />
      </div>
    </div>
  )
}
