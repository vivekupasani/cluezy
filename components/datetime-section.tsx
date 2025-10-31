'use client'

import { ToolInvocation } from 'ai'
import { useEffect, useState } from 'react'

interface DateTimeSectionProps {
    tool: ToolInvocation
}

interface DateTimeData {
    timestamp?: number
    formatted?: {
        date?: string
        time?: string
        iso_local?: string
        iso_utc?: string
        timezone?: string
    }
    timezone?: {
        name?: string
        offset?: string
        abbreviation?: string
    }
    location?: {
        city?: string
        country?: string
    }
}

export const DateTimeSection = ({ tool }: DateTimeSectionProps) => {
    const data = tool.state === 'result' ? (tool.result as DateTimeData) : undefined
    const [currentTime, setCurrentTime] = useState(new Date())

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    // Format time
    const hours = currentTime.getHours()
    const minutes = currentTime.getMinutes()
    const seconds = currentTime.getSeconds()
    const ampm = hours >= 12 ? 'PM' : 'AM'
    const displayHours = hours % 12 || 12

    // Format date
    const dayName = currentTime.toLocaleDateString('en-US', { weekday: 'long' })
    const monthName = currentTime.toLocaleDateString('en-US', { month: 'long' })
    const dayNumber = currentTime.getDate()
    const year = currentTime.getFullYear()

    // Week number
    const getWeekNumber = (date: Date): number => {
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
        const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000
        return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
    }
    const weekNumber = getWeekNumber(currentTime)

    // Day progress
    const dayProgress = ((hours * 3600 + minutes * 60 + seconds) / 86400) * 100

    // Ordinal suffix
    const getOrdinalSuffix = (day: number): string => {
        if (day > 3 && day < 21) return 'th'
        switch (day % 10) {
            case 1:
                return 'st'
            case 2:
                return 'nd'
            case 3:
                return 'rd'
            default:
                return 'th'
        }
    }

    return (
        <div className="flex flex-col w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 rounded-2xl shadow-lg bg-background border border-border/40">
            {/* Time Display */}
            <div className="flex flex-col items-center justify-center py-6">
                {/* Digital Clock */}
                <div className="relative mb-6 w-full flex justify-center">
                    <div className="flex flex-wrap sm:flex-nowrap items-center justify-center gap-2 sm:gap-3">
                        <div className="bg-muted/50 rounded-2xl px-4 sm:px-6 py-3 sm:py-4 backdrop-blur-sm border border-border/30">
                            <span className="text-5xl sm:text-7xl font-bold tabular-nums">
                                {String(displayHours).padStart(2, '0')}
                            </span>
                        </div>
                        <span className="text-4xl sm:text-6xl font-bold text-primary animate-pulse">:</span>
                        <div className="bg-muted/50 rounded-2xl px-4 sm:px-6 py-3 sm:py-4 backdrop-blur-sm border border-border/30">
                            <span className="text-5xl sm:text-7xl font-bold tabular-nums">
                                {String(minutes).padStart(2, '0')}
                            </span>
                        </div>
                        <span className="text-4xl sm:text-6xl font-bold text-primary animate-pulse">:</span>
                        <div className="bg-muted/50 rounded-2xl px-4 sm:px-6 py-3 sm:py-4 backdrop-blur-sm border border-border/30">
                            <span className="text-5xl sm:text-7xl font-bold tabular-nums">
                                {String(seconds).padStart(2, '0')}
                            </span>
                        </div>

                        {/* AM/PM */}
                        <div className="flex flex-col gap-1 ml-2 sm:ml-3">
                            <div
                                className={`px-3 py-1 rounded-md text-sm sm:text-base font-semibold ${ampm === 'AM'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted/50 text-muted-foreground'
                                    }`}
                            >
                                AM
                            </div>
                            <div
                                className={`px-3 py-1 rounded-md text-sm sm:text-base font-semibold ${ampm === 'PM'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted/50 text-muted-foreground'
                                    }`}
                            >
                                PM
                            </div>
                        </div>
                    </div>
                </div>

                {/* Date Display */}
                <div className="text-center mb-4">
                    <p className="text-xl sm:text-2xl font-semibold mb-1">
                        {dayName}, {monthName} {dayNumber}
                        {getOrdinalSuffix(dayNumber)}
                    </p>
                    <p className="text-base sm:text-xl text-muted-foreground">{year}</p>
                    <p className="text-sm sm:text-base text-muted-foreground mt-1">
                        Week {weekNumber}
                    </p>
                </div>

                {/* Day Progress */}
                <div className="w-full max-w-md mt-4 px-4 sm:px-0">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                        <span>Day Progress</span>
                        <span>{dayProgress.toFixed(1)}%</span>
                    </div>
                    <div className="w-full h-2 bg-muted/50 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full transition-all duration-1000"
                            style={{ width: `${dayProgress}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div className="w-full h-[1px] bg-border mt-6"></div>

            {/* Location / Timezone Info */}
            {data?.timezone && (
                <div className="mt-4 text-center text-sm sm:text-base text-muted-foreground">
                    <p>
                        Timezone: <span className="font-medium">{data.timezone.name}</span>{' '}
                        ({data.timezone.abbreviation}, UTC{data.timezone.offset})
                    </p>
                    {data.location?.city && (
                        <p>
                            Location: {data.location.city}, {data.location.country}
                        </p>
                    )}
                </div>
            )}
        </div>
    )
}
