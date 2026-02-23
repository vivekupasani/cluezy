"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";
import { Globe, GlobeLock, Settings2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useHistoryDialog } from "./history-dialog";
import { useSidebar } from "./ui/sidebar";

interface ExcludedDomainsDialogProps {
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    trigger?: React.ReactNode;
}

export function ExcludedDomainsDialog({
    open,
    onOpenChange,
    trigger
}: ExcludedDomainsDialogProps) {
    const [domainInput, setDomainInput] = useState("");
    const [excludedDomains, setExcludedDomains] = useState<string[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const { toggleSidebar, setOpenMobile, state } = useSidebar()
    const { setHistoryDialogIsOpen } = useHistoryDialog()
    const isMobile = useIsMobile()
    // Helper to handle uncontrolled/controlled state
    const showDialog = open !== undefined ? open : isOpen;
    const setShowDialog = onOpenChange || setIsOpen;

    useEffect(() => {
        // Load from local storage on mount
        const saved = localStorage.getItem("excluded-domains");
        if (saved) {
            try {
                setExcludedDomains(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse excluded domains", e);
            }
        }
    }, []);

    const saveDomains = (domains: string[]) => {
        setExcludedDomains(domains);
        localStorage.setItem("excluded-domains", JSON.stringify(domains));
        window.dispatchEvent(new CustomEvent('excluded-domains-updated', { detail: domains }));
    };

    const addDomain = () => {
        const domain = domainInput.trim().toLowerCase();

        if (!domain) return;

        if (!domain.includes(".") || domain.includes(" ")) {
            toast.error("Please enter a valid domain (e.g., wikipedia.org)");
            return;
        }

        if (excludedDomains.includes(domain)) {
            toast.error("Domain is already in the exclusion list");
            return;
        }

        const newDomains = [...excludedDomains, domain];
        saveDomains(newDomains);
        setDomainInput("");
        toast.success(`Added ${domain} to excluded domains`);
    };

    const removeDomain = (domainToRemove: string) => {
        const newDomains = excludedDomains.filter((d) => d !== domainToRemove);
        saveDomains(newDomains);
        toast.success(`Removed ${domainToRemove}`);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addDomain();
        }
    };

    return (
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
            {trigger ? (
                <DialogTrigger asChild>
                    {trigger}
                </DialogTrigger>
            ) : (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <DialogTrigger asChild>
                            <Button
                                onClick={() => {
                                    setOpenMobile(false)
                                }}
                                variant="ghost" size="icon" className="rounded-full text-muted-foreground hover:text-foreground">
                                <Settings2 className="w-4 h-4" />
                            </Button>
                        </DialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Excluded Domains</p>
                    </TooltipContent>
                </Tooltip>
            )}

            <DialogContent className="w-[95%] md:w-full max-w-2xl h-[50vh] sm:h-[60vh] p-0 bg-background/95 backdrop-blur-sm text-popover-foreground border border-border rounded-2xl overflow-hidden flex flex-col gap-0 cosmic-glass HiddenScrollbar">
                <DialogHeader className="sr-only">
                    <DialogTitle>Excluded Sources</DialogTitle>
                    <DialogDescription>Manage domains to exclude from search results</DialogDescription>
                </DialogHeader>

                {/* Input Header Area */}
                <div className="flex-shrink-0 py-2 px-6 mr-4">
                    <div className="flex items-center gap-3 mb-1">
                        <Globe className="w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Add a domain to exclude (e.g. wikipedia.org)..."
                            value={domainInput}
                            onChange={(e) => setDomainInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="border-none bg-transparent truncate focus-visible:ring-0 focus-visible:ring-offset-0 text-sm h-8 flex-1 placeholder:text-muted-foreground/70 text-foreground/90 px-0 shadow-none"
                        />
                        {/* <Button
                            onClick={addDomain}
                            size="sm"
                            variant="ghost"
                            className="md:hidden h-8 w-8 p-0 rounded-full hover:bg-muted"
                        >
                            <Plus className="w-4 h-4" />
                        </Button> */}
                    </div>
                    <div className='w-full h-[1px] bg-border mt-2' />
                </div>

                {/* Content List Area */}
                <div className="flex-1 overflow-y-auto py-2 px-4">
                    {excludedDomains.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center select-none">
                            <GlobeLock className="w-12 h-12 text-muted-foreground/20 mb-4" />
                            <p className="text-sm text-muted-foreground font-medium">No excluded sources</p>
                            <p className="text-xs text-muted-foreground/60 mt-1 max-w-[200px]">
                                Add domains above to prevent them from appearing in search results.
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-1">
                            <div className="px-2 mb-2">
                                <h3 className="text-[11px] font-semibold text-muted-foreground/50 uppercase tracking-wider">
                                    Excluded Sites
                                </h3>
                            </div>
                            {excludedDomains.map((domain) => (
                                <div
                                    key={domain}
                                    className="group flex items-center justify-between px-3 py-2 text-sm rounded-md hover:bg-accent/50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted/50 text-muted-foreground">
                                            <Globe className="w-3 h-3" />
                                        </div>
                                        <span className="text-foreground/80 font-medium">{domain}</span>
                                    </div>
                                    <button
                                        onClick={() => removeDomain(domain)}
                                        className="opacity-100 md:opacity-0 group-hover:opacity-100 px-1 p-1 hover:bg-background/50 hover:text-primary text-muted-foreground transition-all duration-200 rounded-lg"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer Status Bar */}
                <div className="flex-none border-t border-border/50 bg-background/50 px-4 md:px-6 py-3">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground/50 font-medium">
                            {excludedDomains.length} sources excluded
                        </span>
                        <div className="flex items-center gap-2 text-muted-foreground/40">
                            <Settings2 className="w-3 h-3" />
                            <span>Global search settings</span>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
