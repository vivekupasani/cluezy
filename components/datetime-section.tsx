"use client"

import { ToolInvocation } from "ai"
import { Clock } from "lucide-react"
import { useEffect, useState } from "react"

interface DateTimeSectionProps {
    tool: ToolInvocation
}

export const DateTimeSection = ({ tool }: DateTimeSectionProps) => {
    const data = tool.state === "result" ? tool.result : undefined

    const [ctime, setTime] = useState(new Date().toLocaleTimeString())

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date().toLocaleTimeString())
        }, 1000)
        return () => clearInterval(timer)
    }, [])


    const hours = ctime?.split(":")[0] ?? "--"
    const minutes = ctime?.split(":")[1] ?? "--"
    const secondsRaw = ctime?.split(":")[2] ?? "--"
    const seconds = secondsRaw?.slice(0, 2) ?? "--"
    const ampm = secondsRaw?.slice(3, 5) ?? ""

    return (
        <div className="flex flex-col w-[95%] md:w-[98%] ml-3 sm:ml-3 mb-2 justify-center items-center bg-card/30 px-5 py-2 rounded-2xl border border-border">
            {/* Header */}
            <div className="flex w-full justify-between border-b border-border pt-2 pb-4">
                <span className="text-sm">CURRENT TIME</span>
                <span className="flex justify-center items-center">
                    <Clock className="h-3" />
                    <p className="text-xs">UTC </p>
                </span>
            </div>

            {/* Time Display */}
            <div className="py-8 flex flex-col items-center">
                <div className="relative">
                    <span className="text-6xl flex items-center justify-center gap-1">
                        {hours}
                        <p>:</p>
                        {minutes}
                        <p>:</p>
                        <p>{seconds}</p>
                        <p className="text-2xl opacity-0 pl-1">{ampm}</p>
                    </span>
                    <p className="absolute bottom-0 right-0 text-2xl">{ampm}</p>
                </div>

                <p>{data?.formatted?.date ?? "No date available"}</p>
            </div>

            {/* Extra Info */}
            <div className="flex w-full justify-between items-center gap-4 py-2">
                <div className="w-1/2 bg-muted py-3 px-4 flex flex-col rounded-lg">
                    <span className="text-[10px] text-foreground/50">LOCAL</span>
                    <span className="text-sm">
                        {data?.formatted?.iso_local ?? "N/A"}
                    </span>
                </div>
                <div className="w-1/2 bg-muted py-3 px-4 flex flex-col rounded-lg">
                    <span className="text-[10px] text-foreground/50">TIMESTAMP</span>
                    <span className="text-sm">{data?.timestamp ?? "N/A"}</span>
                </div>
            </div>
        </div>
    )
}
