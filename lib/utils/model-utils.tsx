import { Bot, Brain, Eye, FileText } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

export interface ModelCapability {
    icon: React.ReactNode;
    color: string;
    colorDark: string;
}

export function getProviderIcon(providerId: string) {
    // Try to use SVG logos if they exist
    return (
        <div className="shrink-0 rounded-full border border-border/40 p-0.5 bg-background overflow-hidden flex items-center justify-center size-6">
            <Image
                src={`/providers/logos/${providerId}.svg`}
                alt={providerId}
                width={16}
                height={16}
                className="rounded-full object-contain"
                onError={(e) => {
                    // If image fails, fallback to Bot icon
                    (e.target as any).style.display = 'none';
                }}
            />
            <Bot className="size-4 text-muted-foreground absolute" style={{ zIndex: -1 }} />
        </div>
    );
}

export function getModelCapabilities(model: any): ModelCapability[] {
    const capabilities: ModelCapability[] = [];

    // Logic based on provider or specific model traits
    // Since the provided snippet had specific modalities, we'll try to map them

    // Image input/vision
    if (model.id.includes('vision') || model.id.includes('claude-3') || model.id.includes('gpt-4o') || model.id.includes('gemini')) {
        capabilities.push({
            icon: <Eye className="h-4 w-4" />,
            color: "hsl(168 54% 52%)",
            colorDark: "hsl(168 54% 74%)",
        });
    }

    // File/PDF processing (simplified logic)
    if (model.id.includes('claude') || model.id.includes('gemini') || model.id.includes('gpt-4')) {
        capabilities.push({
            icon: <FileText className="h-4 w-4" />,
            color: "hsl(237 55% 57%)",
            colorDark: "hsl(237 75% 77%)",
        });
    }

    // Reasoning / Advanced Intelligence
    if (model.id.includes('o1') || model.id.includes('o3') || model.id.includes('reasoning') || model.id.includes('405b')) {
        capabilities.push({
            icon: <Brain className="h-4 w-4" />,
            color: "hsl(263 58% 53%)",
            colorDark: "hsl(263 58% 75%)",
        });
    }

    return capabilities;
}

export function formatModelName(fullId: string) {
    if (!fullId) return "Select model";
    // Extract name from ID if it's like "org/name"
    const parts = fullId.split('/');
    const name = parts.length > 1 ? parts[1] : parts[0];
    return name.replace(/-/g, ' ');
}
