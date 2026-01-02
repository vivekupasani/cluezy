import { Copy } from "lucide-react"
import { toast } from "sonner"
import { Button } from "./ui"
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip"

export const CopyButton = ({ message }: { message: string }) => {

    async function handleCopy() {
        await navigator.clipboard.writeText(message)
        toast.success('Message copied to clipboard')
    }

    return (
        <Tooltip>
            <TooltipTrigger>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCopy}
                    className="h-8 w-8 rounded-full ring-0"
                >
                    <Copy size={14} className='text-foreground/70 hover:text-foreground transition-colors' />
                </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className='text-xs'>
                Copy
            </TooltipContent>
        </Tooltip>
    )
}