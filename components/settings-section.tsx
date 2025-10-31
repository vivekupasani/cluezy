"use client";

import { CurrentUserAvatar } from "@/components/current-user-avatar";
import { useCurrentUserEmail, useCurrentUserName } from "@/hooks/use-current-user-name";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { Info, Monitor, Moon, Sun } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import CommunityTab from "./community-tab";
import ContactTab from "./contact-tab";
import ModelsTab from "./models-tab";
import PreferencesTab from "./preferences-tab";

export default function SettingsSection() {
    const [currentTab, setCurrentTab] = useState("preferences");
    const router = useRouter();

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/");
        router.refresh();
    };

    const renderTabContent = () => {
        switch (currentTab) {
            case "preferences":
                return <PreferencesTab />;
            case "models":
                return <ModelsTab />;
            case "community":
                return <CommunityTab />;
            case "contact":
                return <ContactTab />;
            default:
                return null;
        }
    };

    return (
        <>
            {/* Header */}
            <div className="flex items-center justify-end mb-8">
                {/* <button className="flex items-center gap-2 hover:bg-accent hover:text-accent-foreground rounded-md px-2 py-1 transition-colors">
                    <ArrowLeft size={18} />
                    <span className="text-sm">Back to Chat</span>
                </button> */}
                <div className="flex items-center gap-3 bg-card px-3 py-2 rounded-full shadow-inner shadow-card-foreground/10 border border-border">
                    <button className="p-1.5 rounded-full hover:bg-muted transition-colors">
                        <Monitor size={16} className="text-card-foreground/80" />
                    </button>
                    <button className="p-1.5 rounded-full hover:bg-muted transition-colors">
                        <Sun size={16} className="text-card-foreground/80" />
                    </button>
                    <button className="p-1.5 rounded-full hover:bg-muted transition-colors">
                        <Moon size={16} className="text-card-foreground/80" />
                    </button>
                </div>
            </div>

            <div className="flex gap-8">
                {/* Left Sidebar */}
                <div className="hidden md:block w-80 flex-shrink-0">
                    <div className="flex flex-col items-center gap-3 mb-6">
                        <CurrentUserAvatar className="w-36 h-36 rounded-full bg-muted overflow-hidden" />
                        <h2 className="text-xl font-semibold">{useCurrentUserName()}</h2>
                        <p className="text-sm text-muted-foreground">{useCurrentUserEmail()}</p>
                        <span className="text-xs px-3 py-1 bg-primary/20 text-primary rounded-full">
                            Free Plan
                        </span>
                    </div>

                    {/* Message Usage */}
                    <div className="bg-gradient-to-br from-card via-card/95 to-card/90 backdrop-blur-sm shadow-inner shadow-card-foreground/20 border-b border-border rounded-lg p-4 mb-6">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Message Usage</span>
                            <span className="text-xs text-muted-foreground">
                                Resets tomorrow at 5:29 AM
                            </span>
                        </div>

                        <div className="mt-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold">Standard</span>
                                <span className="text-sm font-semibold">0/20</span>
                            </div>
                            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                                <div className="bg-primary h-full w-0 rounded-full transition-all" />
                            </div>
                            <p className="text-xs text-muted-foreground mt-2">
                                20 messages remaining
                            </p>
                        </div>

                        <div className="flex gap-2 mt-4 p-3 bg-muted/50 rounded-md">
                            <Info
                                size={16}
                                className="flex-shrink-0 mt-0.5 text-muted-foreground"
                            />
                            <p className="text-xs text-muted-foreground italic leading-relaxed">
                                Each tool call (e.g. search grounding) used in a reply consumes
                                an additional standard credit.
                            </p>
                        </div>
                    </div>

                    {/* ✅ Keyboard Shortcuts (restored) */}
                    <div className="bg-gradient-to-br from-card via-card/95 to-card/90 backdrop-blur-sm shadow-inner shadow-card-foreground/20 border border-border rounded-lg p-4">
                        <h3 className="text-sm font-semibold mb-3">Keyboard Shortcuts</h3>
                        <div className="space-y-2">
                            <ShortcutItem label="Search" keys={["Ctrl", "K"]} />
                            <ShortcutItem label="New Chat" keys={["Ctrl", "Shift", "O"]} />
                            <ShortcutItem label="Toggle Sidebar" keys={["Ctrl", "B"]} />
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 max-w-3xl">
                    {/* Tabs */}
                    <div className="flex gap-6 border-b border-border mb-6">
                        {["preferences", "models", "community", "contact"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setCurrentTab(tab)}
                                className={cn(
                                    "pb-3 text-sm font-medium text-muted-foreground hover:text-foreground",
                                    currentTab === tab && "border-b-2 border-primary text-foreground"
                                )}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>

                    {renderTabContent()}
                </div>
            </div>
        </>
    );
}

/* Small helper component for shortcut rows */
function ShortcutItem({ label, keys }: { label: string; keys: string[] }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{label}</span>
            <div className="flex gap-1">
                {keys.map((key) => (
                    <kbd
                        key={key}
                        className="px-2 py-0.5 text-xs bg-muted rounded font-mono"
                    >
                        {key}
                    </kbd>
                ))}
            </div>
        </div>
    );
}
