import { ConnectorsClientPage } from '@/components/connectors-page-content'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Connectors',
  description:
    'Connect your favorite tools and services to Cluezy. Manage integrations, sync data, and enhance your AI-powered workflow.'
}

export default function ConnectorsPage() {
  return <ConnectorsClientPage />
}
