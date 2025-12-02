"use client"

import { SearchResultItem } from "@/lib/types"
import { createContext, useState } from "react"
import { SearchResults } from "./search-results"
import { Sidebar, SidebarContent } from "./ui/sidebar"

export interface SourcesDialogProps {
    sources: SearchResultItem[]
}

interface SourcesDialogContextType {
    sources: SearchResultItem[]
    isSourceDialogOpen: boolean
    setSources: (sources: SearchResultItem[]) => void
    setIsSourceDialogOpen: (open: boolean) => void
}

export const SourcesDialogContext = createContext<SourcesDialogContextType | null>(null)

export const SourcesDialogProvider = ({ children }: { children: React.ReactNode }) => {
    const [sources, setSources] = useState<SearchResultItem[]>([])
    const [isSourceDialogOpen, setIsSourceDialogOpen] = useState(false)

    return (
        <SourcesDialogContext.Provider
            value={{
                sources,
                isSourceDialogOpen,
                setSources,
                setIsSourceDialogOpen
            }}
        >
            {children}
        </SourcesDialogContext.Provider>
    )
}

export const SourcesDialog = ({ sources }: SourcesDialogProps) => {

    const dummySearchResults: SearchResultItem[] = [
        {
            title: "What is Artificial Intelligence?",
            url: "https://example.com/ai",
            content: "Artificial Intelligence is the simulation of human intelligence processes by machines.",
            summary: "AI simulates human intelligence through machines."
        },
        {
            title: "Learn TypeScript Basics",
            url: "https://example.com/typescript",
            content: "TypeScript extends JavaScript by adding static types, helping you catch errors earlier.",
            summary: "TypeScript adds optional static types to JavaScript."
        },
        {
            title: "Next.js 15 New Features",
            url: "https://example.com/nextjs-15",
            content: "Next.js 15 introduces TurboPack enhancements, improved routing, and server components.",
            summary: "Key upgrades include TurboPack improvements and new routing."
        },
        {
            title: "How Blockchain Works",
            url: "https://example.com/blockchain",
            content: "Blockchain is a decentralized ledger used to record transactions across many computers.",
            summary: "Decentralized ledger technology enabling secure transactions."
        },
        {
            title: "Understanding Firebase Firestore",
            url: "https://example.com/firestore",
            content: "Firestore is a scalable NoSQL database for realtime apps using client-side SDKs."
        }
    ]

    return (
        <Sidebar
            side="right"
            className="fixed right-0 top-0 w-[92%] md:w-[80%] rounded-s-3xl h-screen 
                       z-50 flex items-start justify-start p-4 bg-background 
                       border-l border-border overflow-y-scroll CustomScrollbar"
        >
            <SidebarContent>
                <SearchResults
                    results={sources ?? dummySearchResults}
                    displayMode="list"
                />
            </SidebarContent>
        </Sidebar>
    )
}
