import { ToolInvocation } from 'ai'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, ChevronDown, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'

export function ConnectorSearchSection({ tool }: { tool: ToolInvocation }) {
    const [activeStep, setActiveStep] = useState<number>(0)
    const [collapsed, setCollapsed] = useState(false)

    useEffect(() => {
        if (tool.state === 'partial-call') {
            setActiveStep(0)
        } else if (tool.state === 'call') {
            setActiveStep(0)
            const timer = setTimeout(() => setActiveStep(1), 1500)
            return () => clearTimeout(timer)
        } else if (tool.state === 'result') {
            setActiveStep(2)
        }
    }, [tool.state])

    const isCompleted = tool.state === 'result'
    const isLoading = tool.state === 'call' || tool.state === 'partial-call'

    const steps = [
        { id: 0, label: `Running ${tool.toolName}` },
        { id: 1, label: 'Reviewing results' },
        { id: 2, label: 'Completed' },
    ]

    return (
        <div className="w-full rounded-xl border border-border bg-muted/60 dark:bg-card/40 shadow-sm overflow-hidden mt-4">
            {/* Header row */}
            <button
                onClick={() => setCollapsed(v => !v)}
                className="w-full flex items-center justify-between gap-2 px-4 py-3 group hover:bg-muted/40 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <AnimatePresence mode="wait">
                        {isLoading ? (
                            <motion.span
                                key="loader"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Loader2 className="h-3.5 w-3.5 text-muted-foreground animate-spin" />
                            </motion.span>
                        ) : (
                            <motion.span
                                key="check"
                                initial={{ opacity: 0, scale: 0.6 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.25, type: 'spring', stiffness: 200 }}
                            >
                                <CheckCircle2 className="h-3.5 w-3.5 text-foreground" />
                            </motion.span>
                        )}
                    </AnimatePresence>

                    <span className="text-xs font-medium text-foreground tracking-wide">
                        {isLoading ? 'Thinking…' : 'Completed'}
                    </span>
                </div>

                <motion.div
                    animate={{ rotate: collapsed ? 0 : 180 }}
                    transition={{ duration: 0.2 }}
                    className="text-muted-foreground group-hover:text-foreground transition-colors"
                >
                    <ChevronDown className="h-3.5 w-3.5" />
                </motion.div>
            </button>

            {/* Steps panel */}
            <AnimatePresence initial={false}>
                {!collapsed && (
                    <motion.div
                        key="steps-panel"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                        className="overflow-hidden"
                    >
                        <div className="border-t border-border/60" />
                        <div className="relative flex flex-col gap-0 pt-2 pb-2 px-4 pl-[16px]">
                            {/* Background track */}
                            <div className="absolute left-[29px] top-6 bottom-6 w-px bg-border" />

                            {/* Animated fill */}
                            <motion.div
                                className="absolute left-[29px] top-6 w-px bg-foreground"
                                initial={false}
                                animate={{ scaleY: activeStep === 0 ? 0 : activeStep === 1 ? 0.5 : 1 }}
                                transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
                                style={{ bottom: '1rem', transformOrigin: 'top' }}
                            />

                            {steps.map((step, index) => {
                                const isPast = activeStep > index
                                const isActive = activeStep === index
                                const isFuture = activeStep < index

                                return (
                                    <div
                                        key={step.id}
                                        className={`relative flex items-center gap-2 py-2.5 px-2 rounded-lg transition-colors ${isActive ? 'bg-muted/50' : ''
                                            }`}
                                    >
                                        {/* Node */}
                                        <div className="relative flex items-center justify-center w-[11px] h-[11px] flex-shrink-0 z-10">
                                            <motion.div
                                                animate={{
                                                    borderColor:
                                                        isPast || isActive
                                                            ? 'hsl(var(--foreground))'
                                                            : 'hsl(var(--muted-foreground))',
                                                    scale:
                                                        isActive && index !== 2
                                                            ? [1, 1.15, 1]
                                                            : 1,
                                                }}
                                                transition={{
                                                    scale: {
                                                        repeat: isActive && index !== 2 ? Infinity : 0,
                                                        duration: 1.8,
                                                        ease: 'easeInOut',
                                                    },
                                                    borderColor: { duration: 0.3 },
                                                }}
                                                className="absolute inset-0 rounded-full border bg-background"
                                            />
                                            <AnimatePresence>
                                                {(isPast || (isActive && index === 2)) && (
                                                    <motion.div
                                                        initial={{ scale: 0, opacity: 0 }}
                                                        animate={{ scale: 1, opacity: 1 }}
                                                        exit={{ scale: 0, opacity: 0 }}
                                                        transition={{
                                                            duration: 0.2,
                                                            type: 'spring',
                                                            stiffness: 300,
                                                        }}
                                                        className="absolute h-[5px] w-[5px] rounded-full bg-foreground z-10"
                                                    />
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        {/* Label */}
                                        <motion.span
                                            animate={{ opacity: isFuture ? 0.35 : 1 }}
                                            transition={{ duration: 0.3 }}
                                            className={`text-xs leading-none tracking-wide ${isActive
                                                ? 'text-foreground font-medium'
                                                : 'text-muted-foreground'
                                                }`}
                                        >
                                            {step.label}
                                        </motion.span>

                                        {/* Active pulse tag */}
                                        <AnimatePresence>
                                            {isActive && index !== 2 && (
                                                <motion.span
                                                    initial={{ opacity: 0, scale: 0.85 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.85 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="ml-auto text-[10px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full"
                                                >
                                                    In progress
                                                </motion.span>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                )
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}