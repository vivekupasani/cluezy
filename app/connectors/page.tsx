import ConnectorsPageContent from '@/components/connectors-page-content';
import { HistoryDialog } from '@/components/history-dialog';
import Link from 'next/link';

export default function ConnectorsPage() {
    return (
        <div className="flex-1 overflow-auto CustomScrollbar h-full mt-10 lg:mt-0 p-4 lg:p-8">
            <header className="max-w-2xl mx-auto mb-2">
                <h1 className="text-3xl font-medium tracking-normal">
                    Connectors
                </h1>

                <p className="text-muted-foreground mt-2 text-sm">
                    Connect your tools to search across them and take action.
                </p>

                <p className="text-muted-foreground mt-1 text-xs">
                    Powered by <Link href="https://supermemory.ai" target="_blank" className="font-medium hover:text-primary">Supermemory</Link>
                </p>
            </header>

            <ConnectorsPageContent />
            <HistoryDialog />
        </div>
    );
}
