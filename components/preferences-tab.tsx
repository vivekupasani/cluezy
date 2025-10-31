"use client";
import { useState } from "react";

export default function PreferencesTab() {
    const [name, setName] = useState("");
    const [occupation, setOccupation] = useState("");
    const [traits, setTraits] = useState<string[]>([]);
    const [traitInput, setTraitInput] = useState("");
    const [additionalInfo, setAdditionalInfo] = useState("");
    const [boringTheme, setBoringTheme] = useState(false);
    const [hidePersonal, setHidePersonal] = useState(false);
    const suggestedTraits = ["friendly", "witty", "concise", "curious", "empathetic", "creative", "patient"];

    const addTrait = (trait: string) => {
        if (trait && !traits.includes(trait) && traits.length < 100) {
            setTraits([...traits, trait]);
            setTraitInput("");
        }
    };

    const removeTrait = (trait: string) => {
        setTraits(traits.filter((t) => t !== trait));
    };

    const handleTraitKeyDown = (e: any) => {
        if (e.key === "Enter" || e.key === "Tab") {
            e.preventDefault();
            addTrait(traitInput);
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-8">Customize Cluezy AI</h1>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-medium mb-2">
                        What should Cluezy AI call you?
                    </label>
                    <input
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">What do you do?</label>
                    <input
                        type="text"
                        placeholder="Engineer, student, etc."
                        value={occupation}
                        onChange={(e) => setOccupation(e.target.value)}
                        className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">
                        What traits should Cluezy AI have?
                    </label>
                    <input
                        type="text"
                        placeholder="Type a trait and press Enter or Tab..."
                        value={traitInput}
                        onChange={(e) => setTraitInput(e.target.value)}
                        onKeyDown={handleTraitKeyDown}
                        className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <div className="flex flex-wrap gap-2 mt-3">
                        {suggestedTraits.map((trait) => (
                            <button
                                key={trait}
                                onClick={() => addTrait(trait)}
                                className="px-3 py-1 text-xs bg-secondary hover:bg-secondary/80 rounded-full"
                                disabled={traits.includes(trait)}
                            >
                                {trait} +
                            </button>
                        ))}
                    </div>

                    {traits.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                            {traits.map((trait) => (
                                <span
                                    key={trait}
                                    className="px-3 py-1 text-xs bg-primary/20 text-primary rounded-full flex items-center gap-2"
                                >
                                    {trait}
                                    <button onClick={() => removeTrait(trait)}>×</button>
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">
                        Anything else Cluezy AI should know about you?
                    </label>
                    <textarea
                        value={additionalInfo}
                        onChange={(e) => setAdditionalInfo(e.target.value)}
                        className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px]"
                    />
                </div>

                <div className="flex justify-end">
                    <button className="px-6 py-2 bg-primary text-primary-foreground rounded-md">
                        Save Preferences
                    </button>
                </div>
            </div>

            <div className="mt-12">
                <h2 className="text-xl font-semibold mb-6">Visual Options</h2>
                <div className="space-y-4">
                    <ToggleOption
                        label="Boring Theme"
                        description="Tone down the pink."
                        enabled={boringTheme}
                        setEnabled={setBoringTheme}
                    />
                    <ToggleOption
                        label="Hide Personal Information"
                        description="Hide your name and email from UI."
                        enabled={hidePersonal}
                        setEnabled={setHidePersonal}
                    />
                </div>
            </div>
        </div>
    );
}

function ToggleOption({ label, description, enabled, setEnabled }: any) {
    return (
        <div className="flex items-start justify-between py-3">
            <div>
                <h3 className="text-sm font-medium mb-1">{label}</h3>
                <p className="text-xs text-muted-foreground">{description}</p>
            </div>
            <button
                onClick={() => setEnabled(!enabled)}
                className={`ml-4 w-11 h-6 rounded-full transition-colors ${enabled ? "bg-primary" : "bg-secondary"
                    }`}
            >
                <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform ${enabled ? "translate-x-5" : "translate-x-0.5"
                        }`}
                />
            </button>
        </div>
    );
}
