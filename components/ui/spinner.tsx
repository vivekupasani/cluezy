// Based on: https://github.com/vercel/ai/blob/main/examples/next-ai-rsc/components/llm-stocks/spinner.tsx


import { IconLogo } from './icons'
import { TextShimmer } from './text-shimmer'

interface SpinnerProps extends React.SVGProps<SVGSVGElement> { }

export const Spinner = ({ className, ...props }: SpinnerProps) => (
  <div>
    <TextShimmer className='text-sm ml-2 md:ml-1 select-none'>
      Working...
    </TextShimmer>
  </div>
)

export const LogoSpinner = () => (
  <div className="p-4 border border-background">
    <IconLogo className="w-4 h-4 animate-spin" />
  </div>
)
