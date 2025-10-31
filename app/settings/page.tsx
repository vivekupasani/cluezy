import SettingsSection from "@/components/settings-section";

export default async function SettingsPage() {
    return (
        <div className="h-screen bg-background text-foreground overflow-y-auto CustomScrollbar">
            <div className="max-w-7xl mx-auto p-6">
                <SettingsSection />
            </div>
        </div>
    );
}
