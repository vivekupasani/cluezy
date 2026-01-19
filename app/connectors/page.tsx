import ConnectorsPageContent from '@/components/connectors-page-content';
import { HistoryDialog } from '@/components/history-dialog';

export default function ConnectorsPage() {
    return (
        <div className="CustomScrollbar mt-10 lg:mt-0 p-4 lg:p-8">
            <ConnectorsPageContent />
            <HistoryDialog />
        </div>
    );
}
