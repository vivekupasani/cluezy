"use client"

import { ToolInvocation } from "ai"
import {
    Cloud,
    CloudDrizzle,
    CloudFog,
    CloudRain,
    CloudSnow,
    CloudSun,
    Droplets,
    Eye,
    Gauge,
    MapPin,
    Sun,
    Sunrise,
    Sunset,
    Wind
} from "lucide-react"
import { useEffect, useState } from "react"
import { Skeleton } from "./ui/skeleton"

interface WeatherSectionProps {
    tool: ToolInvocation
}

interface WeatherData {
    cod: string;
    message: number;
    cnt: number;
    list: Array<{
        dt: number;
        main: {
            temp: number;
            feels_like: number;
            temp_min: number;
            temp_max: number;
            pressure: number;
            humidity: number;
            sea_level?: number;
            grnd_level?: number;
        };
        weather: Array<{
            id: number;
            main: string;
            description: string;
            icon: string;
        }>;
        wind: {
            speed: number;
            deg: number;
            gust?: number;
        };
        visibility: number;
        pop: number;
        clouds?: {
            all: number;
        };
        dt_txt: string;
    }>;
    city: {
        name: string;
        country: string;
        sunrise: number;
        sunset: number;
        timezone: number;
        coord?: {
            lat: number;
            lon: number;
        };
    };
    geocoding?: {
        name: string;
        country: string;
        timezone: string;
    };
}

// Skeleton Loader Component
const WeatherSkeleton = () => {
    return (
        <div className="w-full px-3 sm:px-0 py-4">
            {/* Header Skeleton */}
            <div className="border border-border rounded-2xl p-4 sm:p-5 mb-3 sm:mb-4">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className="space-y-2">
                        <Skeleton className="h-4 sm:h-5 w-24 sm:w-32" />
                        <Skeleton className="h-10 sm:h-12 w-20 sm:w-24" />
                    </div>
                    <Skeleton className="h-12 w-12 sm:h-16 sm:w-16 rounded-xl" />
                </div>
                <Skeleton className="h-3 sm:h-4 w-36 sm:w-48" />
            </div>

            {/* Hourly Forecast Skeleton */}
            <div className="border border-border rounded-2xl p-4 sm:p-5 mb-3 sm:mb-4">
                <Skeleton className="h-3 sm:h-4 w-20 sm:w-24 mb-3 sm:mb-4" />
                <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className="h-16 w-12 sm:h-20 sm:w-14 rounded-xl flex-shrink-0" />
                    ))}
                </div>
            </div>

            {/* Stats Grid Skeleton */}
            <div className="border border-border rounded-2xl p-4 sm:p-5 mb-3 sm:mb-4">
                <Skeleton className="h-3 sm:h-4 w-16 sm:w-20 mb-3 sm:mb-4" />
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-14 sm:h-16 rounded-xl" />
                    ))}
                </div>
            </div>

            {/* Daily Forecast Skeleton */}
            <div className="border border-border rounded-2xl p-4 sm:p-5">
                <Skeleton className="h-3 sm:h-4 w-24 sm:w-28 mb-3 sm:mb-4" />
                <div className="space-y-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="h-10 sm:h-12 rounded-xl" />
                    ))}
                </div>
            </div>
        </div>
    )
}

export const WeatherSection = ({ tool }: WeatherSectionProps) => {
    const data = tool.state === "result" ? (tool.result as WeatherData) : undefined
    const [currentTime, setCurrentTime] = useState(new Date())

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    // Show skeleton while loading or if no data
    if (tool.state === "call" || !data || !data.list || data.list.length === 0) {
        return <WeatherSkeleton />
    }

    const currentWeather = data.list[0]
    const city = data.geocoding || data.city

    // Enhanced weather icon selection with more variety
    const getWeatherIcon = (weatherId?: number, size?: number) => {
        const iconSize = size || 20
        if (!weatherId) return <Cloud size={iconSize} className="text-muted-foreground" />

        // Thunderstorm
        if (weatherId >= 200 && weatherId < 300)
            return <CloudRain size={iconSize} className="text-blue-400" />
        // Drizzle
        if (weatherId >= 300 && weatherId < 400)
            return <CloudDrizzle size={iconSize} className="text-blue-300" />
        // Rain
        if (weatherId >= 500 && weatherId < 600)
            return <CloudRain size={iconSize} className="text-blue-500" />
        // Snow
        if (weatherId >= 600 && weatherId < 700)
            return <CloudSnow size={iconSize} className="text-cyan-300" />
        // Atmosphere (fog, mist, etc.)
        if (weatherId >= 700 && weatherId < 800)
            return <CloudFog size={iconSize} className="text-gray-400" />
        // Clear
        if (weatherId === 800)
            return <Sun size={iconSize} className="text-yellow-400" />
        // Clouds
        if (weatherId === 801)
            return <CloudSun size={iconSize} className="text-yellow-300" />
        if (weatherId > 801)
            return <Cloud size={iconSize} className="text-gray-400" />

        return <Cloud size={iconSize} className="text-muted-foreground" />
    }

    // Temperature conversion
    const kelvinToCelsius = (temp?: number): number => {
        if (typeof temp !== "number") return 0
        return Math.round(temp - 273.15)
    }

    const formatTempForDisplay = (temp?: number): string => {
        if (typeof temp !== "number") return "N/A"
        return `${kelvinToCelsius(temp)}°`
    }

    // Time formatting
    const formatTime = (timestamp: number): string => {
        return new Date(timestamp * 1000).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
        }).replace(':00', '')
    }

    // Wind direction
    const getWindDirection = (deg?: number): string => {
        if (typeof deg !== "number") return "N/A"
        const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
        const index = Math.round(((deg % 360) / 45)) % 8
        return directions[index]
    }

    // Chart data - next 24 hours (6 data points for mobile, 8 for desktop)
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
    const chartDataPoints = isMobile ? 6 : 8
    const chartData = data.list.slice(0, chartDataPoints).map((forecast) => ({
        name: new Date(forecast.dt * 1000).toLocaleTimeString('en-US', {
            hour: 'numeric',
            hour12: true
        }).replace(' ', '').toLowerCase(),
        time: new Date(forecast.dt * 1000).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        }),
        temp: kelvinToCelsius(forecast.main.temp),
        feels_like: kelvinToCelsius(forecast.main.feels_like),
        description: forecast.weather[0]?.description || "",
        humidity: forecast.main.humidity,
        icon: forecast.weather[0]?.id,
    }))

    // Daily forecast - group by day and get one forecast per day
    const dailyForecast = Object.values(
        data.list.reduce((acc: { [key: string]: any }, forecast) => {
            const date = new Date(forecast.dt * 1000).toLocaleDateString()

            if (!acc[date]) {
                acc[date] = {
                    date,
                    day: new Date(forecast.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
                    fullDate: new Date(forecast.dt * 1000),
                    temps: [],
                    descriptions: [],
                    icons: [],
                }
            }

            acc[date].temps.push(kelvinToCelsius(forecast.main.temp))
            acc[date].descriptions.push(forecast.weather[0]?.description || "")
            acc[date].icons.push(forecast.weather[0]?.id)

            return acc
        }, {})
    ).map((day: any) => ({
        ...day,
        temp: Math.round(day.temps.reduce((a: number, b: number) => a + b, 0) / day.temps.length),
        minTemp: Math.min(...day.temps),
        maxTemp: Math.max(...day.temps),
        description: day.descriptions[0],
        icon: day.icons[0],
    })).slice(0, 5)

    return (
        <div className="w-[95%] md:w-full mx-auto px-3 sm:px-0 md:px-6 py-4 md:py-6 border border-border rounded-2xl bg-background mt-4">
            {/* Current Weather - Hero Card */}
            <div className="bg-muted border border-border rounded-2xl p-4 sm:p-5 md:p-6 mb-3 sm:mb-4">
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                            <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                            <span className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
                                {city?.name}, {city?.country}
                            </span>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl sm:text-5xl md:text-6xl font-light tracking-tight">
                                {kelvinToCelsius(currentWeather.main.temp)}°
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl bg-muted/30 border border-border ml-3 flex-shrink-0">
                        {getWeatherIcon(currentWeather.weather[0]?.id, 32)}
                    </div>
                </div>

                <p className="text-sm text-muted-foreground capitalize mb-1.5 sm:mb-2 line-clamp-1">
                    {currentWeather.weather[0]?.description}
                </p>
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs text-muted-foreground">
                    <span className="whitespace-nowrap">Feels like {formatTempForDisplay(currentWeather.main.feels_like)}</span>
                    <span className="hidden sm:inline">•</span>
                    <span className="whitespace-nowrap">H: {formatTempForDisplay(currentWeather.main.temp_max)}</span>
                    <span className="hidden sm:inline">•</span>
                    <span className="whitespace-nowrap">L: {formatTempForDisplay(currentWeather.main.temp_min)}</span>
                </div>
            </div>

            {/* Hourly Forecast - Horizontal Scroll Card */}
            <div className="bg-muted border border-border rounded-2xl p-4 sm:p-5 md:p-6 mb-3 sm:mb-4">
                <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase mb-3 sm:mb-4">Hourly</h3>
                <div className="flex gap-2 sm:gap-3 flex-wrap overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
                    {chartData.map((hour, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center gap-1.5 sm:gap-2 min-w-[52px] sm:min-w-[56px] p-2 rounded-xl bg-muted/20 border border-border/50 flex-shrink-0"
                        >
                            <span className="text-xs text-muted-foreground whitespace-nowrap">{hour.name}</span>
                            {getWeatherIcon(hour.icon, 18)}
                            <span className="text-sm font-medium">{hour.temp}°</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Weather Details - Compact Grid Card */}
            <div className="bg-muted border border-border rounded-2xl p-4 sm:p-5 md:p-6 mb-3 sm:mb-4">
                <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase mb-3 sm:mb-4">Details</h3>
                <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <div className="p-3 rounded-xl bg-muted/20 border border-border/50">
                        <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                            <Wind className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-muted-foreground flex-shrink-0" />
                            <span className="text-xs text-muted-foreground truncate">Wind</span>
                        </div>
                        <p className="text-base sm:text-lg font-semibold truncate">{(currentWeather.wind.speed * 3.6).toFixed(1)}</p>
                        <p className="text-xs text-muted-foreground truncate">km/h {getWindDirection(currentWeather.wind.deg)}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-muted/20 border border-border/50">
                        <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                            <Droplets className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-muted-foreground flex-shrink-0" />
                            <span className="text-xs text-muted-foreground truncate">Humidity</span>
                        </div>
                        <p className="text-base sm:text-lg font-semibold truncate">{currentWeather.main.humidity}%</p>
                        <p className="text-xs text-muted-foreground truncate">Relative</p>
                    </div>

                    <div className="p-3 rounded-xl bg-muted/20 border border-border/50">
                        <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                            <Eye className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-muted-foreground flex-shrink-0" />
                            <span className="text-xs text-muted-foreground truncate">Visibility</span>
                        </div>
                        <p className="text-base sm:text-lg font-semibold truncate">{(currentWeather.visibility / 1000).toFixed(1)}</p>
                        <p className="text-xs text-muted-foreground truncate">km</p>
                    </div>

                    <div className="p-3 rounded-xl bg-muted/20 border border-border/50">
                        <div className="flex items-center gap-1.5 sm:gap-2 mb-1">
                            <Gauge className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-muted-foreground flex-shrink-0" />
                            <span className="text-xs text-muted-foreground truncate">Pressure</span>
                        </div>
                        <p className="text-base sm:text-lg font-semibold truncate">{currentWeather.main.pressure}</p>
                        <p className="text-xs text-muted-foreground truncate">hPa</p>
                    </div>
                </div>
            </div>

            {/* 5-Day Forecast - List Style Card */}
            <div className="bg-muted border border-border rounded-2xl p-4 sm:p-5 md:p-6 mb-3 sm:mb-4">
                <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase mb-3 sm:mb-4">5-Day Forecast</h3>
                <div className="space-y-1.5 sm:space-y-2">
                    {dailyForecast.map((day, index) => (
                        <div
                            key={day.date}
                            className="flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-muted/20 border border-border/50 hover:bg-muted/30 transition-colors"
                        >
                            <span className="text-xs sm:text-sm font-medium w-12 sm:w-14 md:w-16 flex-shrink-0">
                                {index === 0 ? 'Today' : day.day}
                            </span>

                            <div className="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0 mx-1.5 sm:mx-2">
                                {getWeatherIcon(day.icon, 18)}
                                <span className="text-xs text-muted-foreground capitalize truncate hidden xs:inline">
                                    {day.description}
                                </span>
                            </div>

                            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 text-xs sm:text-sm ml-1 flex-shrink-0">
                                <span className="text-muted-foreground min-w-[24px] sm:min-w-[28px] text-right">{day.minTemp}°</span>
                                <div className="w-10 sm:w-12 md:w-16 h-1 bg-gradient-to-r from-blue-400 to-orange-400 rounded-full"></div>
                                <span className="font-semibold min-w-[24px] sm:min-w-[28px]">{day.maxTemp}°</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sun Times Card */}
            {data.city?.sunrise && data.city?.sunset && (
                <div className="bg-muted border border-border rounded-2xl p-4 sm:p-5 md:p-6 mb-3 sm:mb-4">
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                        <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/20 border border-border/50">
                            <Sunrise className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-orange-400 flex-shrink-0" />
                            <div className="min-w-0">
                                <p className="text-xs text-muted-foreground">Sunrise</p>
                                <p className="text-sm font-medium truncate">{formatTime(data.city.sunrise)}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/20 border border-border/50">
                            <Sunset className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-400 flex-shrink-0" />
                            <div className="min-w-0">
                                <p className="text-xs text-muted-foreground">Sunset</p>
                                <p className="text-sm font-medium truncate">{formatTime(data.city.sunset)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer */}
            <div className="text-center text-xs text-muted-foreground pt-2">
                <span>Updated {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
        </div>
    )
}