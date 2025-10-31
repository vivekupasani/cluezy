"use client"

import { ToolInvocation } from "ai"
import {
    Calendar,
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

// Custom tooltip for the chart
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-card border border-border rounded-lg p-3 shadow-lg backdrop-blur-sm">
                <p className="text-xs font-medium text-muted-foreground mb-1">{payload[0].payload.time}</p>
                <p className="text-lg font-bold text-foreground">
                    {payload[0].value}°C
                </p>
                <p className="text-xs text-muted-foreground capitalize mt-1">
                    {payload[0].payload.description}
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs">
                    <span className="flex items-center gap-1">
                        <Droplets className="h-3 w-3" />
                        {payload[0].payload.humidity}%
                    </span>
                </div>
            </div>
        )
    }
    return null
}

export const WeatherSection = ({ tool }: WeatherSectionProps) => {
    const data = tool.state === "result" ? (tool.result as WeatherData) : undefined
    const [currentTime, setCurrentTime] = useState(new Date())

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000)
        return () => clearInterval(timer)
    }, [])

    if (!data || !data.list || data.list.length === 0) {
        return (
            <div className="flex flex-col w-full max-w-4xl mx-auto bg-gradient-to-br from-card to-card/50 backdrop-blur-sm px-6 py-5 rounded-2xl border border-border shadow-lg">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Cloud className="h-5 w-5 text-muted-foreground" />
                        <span className="text-sm font-semibold text-muted-foreground">WEATHER DATA</span>
                    </div>
                </div>
                <div className="py-12 flex flex-col items-center justify-center">
                    <Cloud className="h-16 w-16 text-muted-foreground/30 mb-4" />
                    <p className="text-muted-foreground">No weather data available</p>
                </div>
            </div>
        )
    }

    const currentWeather = data.list[0]
    const city = data.geocoding || data.city

    // Enhanced weather icon selection with more variety
    const getWeatherIcon = (weatherId?: number, size = 24) => {
        if (!weatherId) return <Cloud size={size} className="text-muted-foreground" />

        // Thunderstorm
        if (weatherId >= 200 && weatherId < 300)
            return <CloudRain size={size} className="text-blue-400 animate-pulse" />
        // Drizzle
        if (weatherId >= 300 && weatherId < 400)
            return <CloudDrizzle size={size} className="text-blue-300" />
        // Rain
        if (weatherId >= 500 && weatherId < 600)
            return <CloudRain size={size} className="text-blue-500" />
        // Snow
        if (weatherId >= 600 && weatherId < 700)
            return <CloudSnow size={size} className="text-cyan-300" />
        // Atmosphere (fog, mist, etc.)
        if (weatherId >= 700 && weatherId < 800)
            return <CloudFog size={size} className="text-gray-400" />
        // Clear
        if (weatherId === 800)
            return <Sun size={size} className="text-yellow-400" />
        // Clouds
        if (weatherId === 801)
            return <CloudSun size={size} className="text-yellow-300" />
        if (weatherId > 801)
            return <Cloud size={size} className="text-gray-400" />

        return <Cloud size={size} className="text-muted-foreground" />
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
        })
    }

    // Wind direction
    const getWindDirection = (deg?: number): string => {
        if (typeof deg !== "number") return "N/A"
        const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
        const index = Math.round(((deg % 360) / 45)) % 8
        return directions[index]
    }

    // Chart data - next 24 hours (8 data points at 3-hour intervals)
    const chartData = data.list.slice(0, 8).map((forecast) => ({
        name: new Date(forecast.dt * 1000).toLocaleTimeString('en-US', {
            hour: 'numeric',
            hour12: true
        }),
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
        description: day.descriptions[0], // Use first description of the day
        icon: day.icons[0], // Use first icon of the day
    })).slice(0, 5) // Show 5 days

    return (
        <div className="flex flex-col w-full max-w-5xl mx-auto px-6 py-5 rounded-2xl shadow-md">
            {/* Header */}
            {/* <div className="flex items-center justify-between pb-4 mb-5 border-b border-border/50">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        {getWeatherIcon(currentWeather.weather[0]?.id, 20)}
                    </div>
                    <span className="text-sm font-semibold tracking-wide">WEATHER FORECAST</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{city?.name}, {city?.country}</span>
                </div>
            </div> */}

            {/* Current Weather - Hero Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 mb-6 border-b border-border/50">
                {/* Left: Main Info */}
                <div className="flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-3">
                        <MapPin className="h-5 w-5 text-primary" />
                        <div>
                            <h2 className="text-2xl font-bold">{city?.name}</h2>
                            <p className="text-sm text-muted-foreground">{city?.country}</p>
                        </div>
                    </div>

                    <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-6xl font-bold">
                            {kelvinToCelsius(currentWeather.main.temp)}°
                        </span>
                        <span className="text-2xl text-muted-foreground">C</span>
                    </div>

                    <p className="text-lg capitalize text-muted-foreground mb-3">
                        {currentWeather.weather[0]?.description}
                    </p>

                    <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                            <span className="text-muted-foreground">Feels like</span>
                            <span className="font-semibold">{formatTempForDisplay(currentWeather.main.feels_like)}</span>
                        </span>
                        <span className="text-muted-foreground">•</span>
                        <span className="flex items-center gap-1">
                            <span className="text-muted-foreground">H:</span>
                            <span className="font-semibold">{formatTempForDisplay(currentWeather.main.temp_max)}</span>
                            <span className="text-muted-foreground">L:</span>
                            <span className="font-semibold">{formatTempForDisplay(currentWeather.main.temp_min)}</span>
                        </span>
                    </div>
                </div>

                {/* Right: Weather Icon & Quick Stats */}
                <div className="flex flex-col items-center justify-center">
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full"></div>
                        <div className="relative">
                            {getWeatherIcon(currentWeather.weather[0]?.id, 120)}
                        </div>
                    </div>
                    <div className="mt-6 grid grid-cols-2 gap-4 w-full">
                        <div className="bg-muted/50 rounded-lg p-3 text-center backdrop-blur-sm">
                            <Droplets className="h-4 w-4 mx-auto mb-1 text-blue-400" />
                            <p className="text-xs text-muted-foreground">Humidity</p>
                            <p className="text-lg font-bold">{currentWeather.main.humidity}%</p>
                        </div>
                        <div className="bg-muted/50 rounded-lg p-3 text-center backdrop-blur-sm">
                            <Wind className="h-4 w-4 mx-auto mb-1 text-cyan-400" />
                            <p className="text-xs text-muted-foreground">Wind</p>
                            <p className="text-lg font-bold">{(currentWeather.wind.speed * 3.6).toFixed(1)}</p>
                            <p className="text-xs text-muted-foreground">km/h</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Temperature Chart - 24 Hour Forecast */}
            <div className="pb-6 mb-6 border-b border-border/50">
                <div className="flex items-center gap-2 mb-4">
                    <Calendar className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-semibold tracking-wide">24-HOUR FORECAST</h3>
                </div>
                <div className="h-56 bg-muted/20 rounded-lg p-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.05} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                            <XAxis
                                dataKey="name"
                                stroke="hsl(var(--muted-foreground))"
                                fontSize={11}
                                tickLine={false}
                                axisLine={{ stroke: "hsl(var(--border))" }}
                            />
                            <YAxis
                                stroke="hsl(var(--muted-foreground))"
                                fontSize={11}
                                tickLine={false}
                                axisLine={{ stroke: "hsl(var(--border))" }}
                                tickFormatter={(value) => `${value}°`}
                                domain={['dataMin - 2', 'dataMax + 2']}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Area
                                type="monotone"
                                dataKey="temp"
                                stroke="hsl(var(--primary))"
                                fillOpacity={1}
                                fill="url(#tempGradient)"
                                strokeWidth={2.5}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Weather Statistics Grid */}
            <div className="pb-6 mb-6 border-b border-border/50">
                <div className="flex items-center gap-2 mb-4">
                    <Gauge className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-semibold tracking-wide">CURRENT CONDITIONS</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-muted/30 rounded-xl p-4 backdrop-blur-sm shadow-inner shadow-muted-foreground/10 border-b border-foreground/20 transition-colors">
                        <div className="flex items-center gap-2 mb-2">
                            <Wind className="h-4 w-4 text-cyan-400" />
                            <span className="text-xs font-medium text-muted-foreground">WIND</span>
                        </div>
                        <p className="text-2xl font-bold">{(currentWeather.wind.speed * 3.6).toFixed(1)}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            km/h {getWindDirection(currentWeather.wind.deg)}
                        </p>
                    </div>

                    <div className="bg-muted/30 rounded-xl p-4 backdrop-blur-sm shadow-inner shadow-muted-foreground/10 border-b border-foreground/20 transition-colors">
                        <div className="flex items-center gap-2 mb-2">
                            <Eye className="h-4 w-4 text-purple-400" />
                            <span className="text-xs font-medium text-muted-foreground">VISIBILITY</span>
                        </div>
                        <p className="text-2xl font-bold">
                            {(currentWeather.visibility / 1000).toFixed(1)}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">kilometers</p>
                    </div>

                    <div className="bg-muted/30 rounded-xl p-4 backdrop-blur-sm shadow-inner shadow-muted-foreground/10 border-b border-foreground/20 transition-colors">
                        <div className="flex items-center gap-2 mb-2">
                            <Droplets className="h-4 w-4 text-blue-400" />
                            <span className="text-xs font-medium text-muted-foreground">HUMIDITY</span>
                        </div>
                        <p className="text-2xl font-bold">{currentWeather.main.humidity}</p>
                        <p className="text-xs text-muted-foreground mt-1">percent</p>
                    </div>

                    <div className="bg-muted/30 rounded-xl p-4 backdrop-blur-sm shadow-inner shadow-muted-foreground/10 border-b border-foreground/20 transition-colors">
                        <div className="flex items-center gap-2 mb-2">
                            <Gauge className="h-4 w-4 text-orange-400" />
                            <span className="text-xs font-medium text-muted-foreground">PRESSURE</span>
                        </div>
                        <p className="text-2xl font-bold">{currentWeather.main.pressure}</p>
                        <p className="text-xs text-muted-foreground mt-1">hPa</p>
                    </div>
                </div>
            </div>

            {/* 5-Day Forecast */}
            <div className="pb-6">
                <div className="flex items-center gap-2 mb-4">
                    <Calendar className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-semibold tracking-wide">5-DAY FORECAST</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {dailyForecast.map((day, index) => (
                        <div
                            key={day.date}
                            className="bg-muted/30 shadow-inner shadow-muted-foreground/10 border-b border-foreground/20 rounded-xl p-4 backdrop-blur-sm transition-all duration-200"
                        >
                            <p className="text-sm font-semibold mb-3 text-center">
                                {index === 0 ? 'Today' : day.day}
                            </p>
                            <div className="flex justify-center mb-3">
                                {getWeatherIcon(day.icon, 40)}
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold mb-1">
                                    {day.temp}°
                                </p>
                                <p className="text-xs text-muted-foreground capitalize mb-2 line-clamp-2">
                                    {day.description}
                                </p>
                                <div className="flex justify-center gap-2 text-xs">
                                    <span className="text-muted-foreground">H: {day.maxTemp}°</span>
                                    <span className="text-muted-foreground">L: {day.minTemp}°</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sun Times */}
            {data.city?.sunrise && data.city?.sunset && (
                <div className="pb-4 mb-4 border-b border-border/50">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 bg-gradient-to-r from-orange-500/10 to-transparent rounded-lg p-3">
                            <Sunrise className="h-5 w-5 text-orange-400" />
                            <div>
                                <p className="text-xs text-muted-foreground">Sunrise</p>
                                <p className="text-sm font-semibold">{formatTime(data.city.sunrise)}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 bg-gradient-to-r from-purple-500/10 to-transparent rounded-lg p-3">
                            <Sunset className="h-5 w-5 text-purple-400" />
                            <div>
                                <p className="text-xs text-muted-foreground">Sunset</p>
                                <p className="text-sm font-semibold">{formatTime(data.city.sunset)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
                <span>Last updated: {currentTime.toLocaleTimeString()}</span>
                <span className="flex items-center gap-1">
                    {/* <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> */}
                    provided by open weather
                </span>
            </div>
        </div>
    )
}