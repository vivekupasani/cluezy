import { ToolInvocation } from "ai";
import { Spinner } from "./ui/spinner";

export function ConnectorSearchSection({
    tool,
}: {
    tool: ToolInvocation,
}) {

    if (tool.state === 'result') return null

    return (
        <div className='mt-4'>
            <Spinner className='ml-2' />
        </div>
    )
}