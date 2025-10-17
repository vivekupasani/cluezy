"use client"

import { ToolInvocation } from "ai"
import {
    Calendar,
    Cloud,
    CloudDrizzle,
    CloudRain,
    CloudSnow,
    Droplets,
    Eye,
    Gauge,
    MapPin,
    Sun,
    Wind,
} from "lucide-react"
import { useState } from "react"
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

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
        };
        visibility: number;
        pop: number;
        dt_txt: string;
    }>;
    city: {
        name: string;
        country: string;
        sunrise: number;
        sunset: number;
        timezone: number;
    };
    geocoding: {
        name: string;
        country: string;
        timezone: string;
    };
}

// Custom tooltip for the chart
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                <p className="text-sm font-medium">{label}</p>
                <p className="text-sm text-foreground/70">
                    Temp: <span className="font-medium">{payload[0].value}°C</span>
                </p>
                <p className="text-xs text-foreground/50 capitalize">
                    {payload[0].payload.description}
                </p>
            </div>
        )
    }
    return null
}

export const WeatherSection = ({ tool }: WeatherSectionProps) => {
    const data = tool.state === "result" ? (tool.result as WeatherData) : undefined

    const [currentTime, setCurrentTime] = useState(
        new Date().toLocaleTimeString()
    )

    if (!data || !data.list || data.list.length === 0) {
        return (
            <div className="flex flex-col w-[99%] mx-2 justify-center items-center bg-card/30 px-5 py-2 rounded-2xl border border-border">
                <div className="flex w-full justify-between border-b border-border pt-2 pb-4">
                    <span className="text-sm">WEATHER DATA</span>
                    <span className="flex justify-center items-center">
                        <Cloud className="h-3" />
                        <p className="text-xs">N/A</p>
                    </span>
                </div>
                <div className="py-8 flex flex-col items-center">
                    <p>No weather data available</p>
                </div>
            </div>
        )
    }

    const currentWeather = data.list?.[0]
    const city = data.geocoding || data.city || {}

    // Weather icon selection
    const getWeatherIcon = (weatherId?: number, size = 24) => {
        if (!weatherId) return <Cloud size={size} className="text-gray-400" />

        if (weatherId >= 200 && weatherId < 300)
            return <CloudRain size={size} className="text-blue-400" />
        if (weatherId >= 300 && weatherId < 500)
            return <CloudDrizzle size={size} className="text-blue-300" />
        if (weatherId >= 500 && weatherId < 600)
            return <CloudRain size={size} className="text-blue-500" />
        if (weatherId >= 600 && weatherId < 700)
            return <CloudSnow size={size} className="text-gray-300" />
        if (weatherId >= 700 && weatherId < 800)
            return <Cloud size={size} className="text-gray-400" />
        if (weatherId === 800)
            return <Sun size={size} className="text-yellow-400" />
        return <Cloud size={size} className="text-gray-400" />
    }

    // Separate functions for display and chart data
    const formatTempForDisplay = (temp?: number) => {
        if (typeof temp !== "number") return "N/A"
        return `${Math.round(temp - 273.15)}°C`
    }

    const formatTempForChart = (temp?: number) => {
        if (typeof temp !== "number") return 0 // Return 0 instead of "N/A" for charts
        return Math.round(temp - 273.15)
    }

    const formatTime = (timestamp?: number) => {
        if (!timestamp) return "N/A"
        return new Date(timestamp * 1000).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    // Prepare chart data for the next 3 days - ensure all values are numbers
    const chartData = data.list.slice(0, 8).map((forecast) => ({
        name: new Date(forecast.dt * 1000).toLocaleTimeString('en-US', {
            hour: 'numeric',
            hour12: true
        }),
        time: new Date(forecast.dt * 1000).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        }),
        temp: formatTempForChart(forecast.main.temp),
        feels_like: formatTempForChart(forecast.main.feels_like),
        description: forecast.weather[0]?.description || "No description",
        humidity: forecast.main.humidity,
        date: new Date(forecast.dt * 1000).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        }),
        fullDate: new Date(forecast.dt * 1000)
    }))

    // Group by day for daily forecast - ensure all temperature values are numbers
    const dailyForecast = data.list.reduce((acc: any[], forecast) => {
        const date = new Date(forecast.dt * 1000).toLocaleDateString()
        const existingDay = acc.find(item => item.date === date)
        const currentTemp = formatTempForChart(forecast.main.temp)
        const minTemp = formatTempForChart(forecast.main.temp_min)
        const maxTemp = formatTempForChart(forecast.main.temp_max)

        if (!existingDay) {
            acc.push({
                date,
                day: new Date(forecast.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' }),
                temp: currentTemp,
                minTemp: minTemp,
                maxTemp: maxTemp,
                description: forecast.weather[0]?.description || "No description",
                icon: forecast.weather[0]?.id,
                humidity: forecast.main.humidity
            })
        } else {
            // Update min/max temps - ensure we're comparing numbers
            existingDay.minTemp = Math.min(existingDay.minTemp, minTemp)
            existingDay.maxTemp = Math.max(existingDay.maxTemp, maxTemp)
        }

        return acc
    }, []).slice(0, 3)

    return data ? (
        <div className="flex flex-col w-[95%] md:w-[98%] ml-3 sm:ml-3 mb-2 justify-center items-center bg-card/30 px-5 py-2 rounded-2xl border border-border">
            {/* Header */}
            <div className="flex w-full justify-between border-b border-border pt-2 pb-4">
                <span className="text-sm">WEATHER FORECAST</span>
                <span className="flex justify-center items-center gap-1">
                    <p className="text-xs">{city?.name ?? "Unknown"}</p>
                </span>
            </div>

            {/* Current Weather */}
            <div className="w-full py-6 border-b border-border">
                <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-2">
                            <MapPin className="h-4 text-foreground/50" />
                            <span className="text-lg font-medium">
                                {city?.name ?? "Unknown"}, {city?.country ?? "N/A"}
                            </span>
                        </div>
                        <div className="text-4xl font-bold">
                            {formatTempForDisplay(currentWeather?.main?.temp)}
                        </div>
                        <div className="text-sm text-foreground/50 capitalize mt-1">
                            {currentWeather?.weather?.[0]?.description ?? "No description"}
                        </div>
                    </div>
                    <div className="text-right">
                        {getWeatherIcon(currentWeather?.weather?.[0]?.id, 48)}
                        <div className="text-xs text-foreground/50 mt-1">
                            Feels like {formatTempForDisplay(currentWeather?.main?.feels_like)}
                        </div>
                    </div>
                </div>
            </div>

            {/* Temperature Chart */}
            <div className="w-full py-6 border-b border-border">
                <div className="flex items-center gap-2 mb-4">
                    <Calendar className="h-4" />
                    <span className="text-sm">24-HOUR FORECAST</span>
                </div>
                <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                            <defs>
                                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
                            <XAxis
                                dataKey="name"
                                stroke="#6b7280"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#6b7280"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `${value}°`}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Area
                                type="monotone"
                                dataKey="temp"
                                stroke="#3b82f6"
                                fillOpacity={1}
                                fill="url(#tempGradient)"
                                strokeWidth={2}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Weather Stats */}
            <div className="w-full py-6 border-b border-border">
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted py-3 px-4 flex flex-col rounded-lg">
                        <span className="text-[10px] text-foreground/50 flex items-center gap-1">
                            <Wind className="h-3" />
                            WIND
                        </span>
                        <span className="text-sm">
                            {currentWeather?.wind?.speed
                                ? `${(currentWeather.wind.speed * 3.6).toFixed(1)} KpH`
                                : "N/A"}
                        </span>
                    </div>
                    <div className="bg-muted py-3 px-4 flex flex-col rounded-lg">
                        <span className="text-[10px] text-foreground/50 flex items-center gap-1">
                            <Eye className="h-3" />
                            VISIBILITY
                        </span>
                        <span className="text-sm">
                            {currentWeather?.visibility
                                ? `${(currentWeather.visibility / 1000).toFixed(1)} km`
                                : "N/A"}
                        </span>
                    </div>
                    <div className="bg-muted py-3 px-4 flex flex-col rounded-lg">
                        <span className="text-[10px] text-foreground/50 flex items-center gap-1">
                            <Droplets className="h-3" />
                            HUMIDITY
                        </span>
                        <span className="text-sm">
                            {currentWeather?.main?.humidity ?? "N/A"}%
                        </span>
                    </div>
                    <div className="bg-muted py-3 px-4 flex flex-col rounded-lg">
                        <span className="text-[10px] text-foreground/50 flex items-center gap-1">
                            <Gauge className="h-3" />
                            PRESSURE
                        </span>
                        <span className="text-sm">
                            {currentWeather?.main?.pressure ?? "N/A"} hPa
                        </span>
                    </div>
                </div>
            </div>

            {/* 3-Day Forecast Summary */}
            <div className="w-full py-6">
                <div className="flex items-center gap-2 mb-4">
                    <Calendar className="h-4" />
                    <span className="text-sm">3-DAY OUTLOOK</span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                    {dailyForecast.map((day, index) => (
                        <div
                            key={day.date}
                            className="bg-muted/50 rounded-lg p-3 flex flex-col items-center text-center"
                        >
                            <div className="text-sm font-medium mb-2">
                                {index === 0 ? 'Today' : day.day}
                            </div>
                            {getWeatherIcon(day.icon, 32)}
                            <div className="text-lg font-bold mt-2">
                                {day.temp}°C
                            </div>
                            <div className="text-xs text-foreground/50 capitalize mt-1">
                                {day.description}
                            </div>
                            <div className="text-xs text-foreground/60 mt-1">
                                H: {day.maxTemp}° L: {day.minTemp}°
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Last Updated */}
            <div className="w-full pt-4 border-t border-border">
                <div className="text-xs text-foreground/50 flex justify-between">
                    <span>Last Updated</span>
                    <span>{currentTime}</span>
                </div>
            </div>
        </div>
    ) : (
        <h1></h1>
    )
}