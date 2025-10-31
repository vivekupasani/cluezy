import { ToolInvocation } from "ai"
import { Skeleton } from "./ui/skeleton"

interface YoutubeVideoAnalysisSectionProps {
    tool: ToolInvocation
}

export const YoutubeVideoAnalysisSection = ({
    tool,
}: YoutubeVideoAnalysisSectionProps) => {
    const data = tool.state === "result" ? tool.result : undefined
    const isToolLoading = tool.state === "call"

    console.log("youtube data :", data)

    return (
        <div className="p-1 flex items-center justify-center w-full max-w-3xl pl-6">
            {isToolLoading && (
                <Skeleton className="w-full aspect-video rounded-lg" />
            )}

            {!isToolLoading && data?.videoId && (
                <div className="w-full aspect-video rounded-lg overflow-hidden">
                    <iframe
                        src={`https://www.youtube.com/embed/${data.videoId}?enablejsapi=1`}
                        className="w-full h-full rounded-lg"
                        title={data.details?.title || "YouTube video"}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                    />
                </div>
            )}
        </div>
    )
}
