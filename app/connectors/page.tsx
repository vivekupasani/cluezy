import ConnectorsPageContent from '@/components/connectors-page-content';
import { HistoryDialog } from '@/components/history-dialog';

export default function ConnectorsPage() {
    return (
        <div className="CustomScrollbar max-w-2xl mx-auto p-4 lg:p-8 h-full overflow-y-auto HiddenScrollbar">
            <ConnectorsPageContent />
            <HistoryDialog />
        </div>
    );
}
