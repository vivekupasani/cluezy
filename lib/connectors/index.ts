import { composio } from '../composio'
import { authorizeToolKit, createSession, getToolKits } from '../services/tools'
import {
  CONNECTOR_CONFIGS,
  ConnectorProvider,
  PROVIDER_MAP,
  TOOLKIT_MAP
} from './types'

function getBaseUrl() {
  if (process.env.NODE_ENV === 'development') {
    return process.env.NGROK_URL || 'http://localhost:3000'
  }
  return 'https://cluezy.site'
}

export async function createConnection(
  provider: ConnectorProvider,
  userId: string
) {
  console.log(`🔗 Creating connection for ${provider}, userId: ${userId}`)
  const toolkitSlug = PROVIDER_MAP[provider]
  const baseUrl = getBaseUrl()
  const redirectUrl = `${baseUrl}/api/connectors/${provider}/callback`

  // Composio handles the redirect and connection.
  // We just need the authorization URL.
  const connectionRequest = await authorizeToolKit(
    userId,
    toolkitSlug,
    redirectUrl
  )

  console.log(
    `✅ ${CONNECTOR_CONFIGS[provider].name} connection request created`
  )
  return connectionRequest.redirectUrl
}

// Get connection details for a specific provider
export async function getConnection(
  provider: ConnectorProvider,
  userId: string
) {
  console.log(`🔍 Getting connection for ${provider}, userId: ${userId}`)
  try {
    const toolkitSlug = PROVIDER_MAP[provider]
    const session = await createSession(userId)
    const toolkits = await session.toolkits({ toolkits: [toolkitSlug] })
    const toolkit = toolkits.items.find(
      (item: any) => item.slug === toolkitSlug
    )

    if (!toolkit || !toolkit.connection?.isActive) {
      console.log(`❌ No active connection found for ${provider}`)
      return null
    }

    const connection = toolkit.connection
    const accountId = connection?.connectedAccount?.id || toolkit.slug

    console.log(`✅ Found connection for ${provider}:`, {
      id: accountId,
      email:
        (connection as any)?.connectedAccount?.connectionParams?.email ||
        'connected',
      createdAt: (connection as any)?.connectedAccount?.createdAt
    })

    return {
      id: accountId,
      provider: provider,
      email:
        (connection as any)?.connectedAccount?.connectionParams?.email ||
        'Connected Account',
      createdAt: (connection as any)?.connectedAccount?.createdAt
    }
  } catch (error) {
    console.error(
      `❌ Error getting ${CONNECTOR_CONFIGS[provider].name} connection:`,
      error
    )
    return null
  }
}

// List all connections for a user
export async function listUserConnections(userId: string) {
  try {
    console.log('listing user connections', userId)
    const connectedToolkits = await getToolKits(userId)

    if (!connectedToolkits || connectedToolkits.items.length === 0) {
      return []
    }

    // console.log("Connected toolkits raw response: ", JSON.stringify(connectedToolkits, null, 2));

    return connectedToolkits.items.map((toolkit: any) => {
      const provider = TOOLKIT_MAP[toolkit.slug] as ConnectorProvider
      const connection = toolkit.connection
      const accountId =
        connection?.connectedAccount?.id || connection?.id || toolkit.slug

      return {
        id: accountId,
        provider: provider,
        slug: toolkit.slug,
        icon: provider ? CONNECTOR_CONFIGS[provider]?.icon : toolkit.icon,
        name: provider ? CONNECTOR_CONFIGS[provider]?.name : toolkit.name,
        email:
          (connection as any)?.connectedAccount?.connectionParams?.email ||
          'Connected Account',
        createdAt: (connection as any)?.connectedAccount?.createdAt,
        isActive: connection?.isActive
      }
    })
  } catch (error) {
    console.error('Error listing user connections:', error)
    return []
  }
}

// Delete connection by ID
export async function deleteConnection(connectionId: string, userId?: string) {
  console.log(`🗑️ Deleting connection with ID: ${connectionId}`)
  try {
    // Composio uses account IDs or toolkit slugs for deletion.
    // If we have the connectionId (account ID), we can delete it directly.
    await composio.connectedAccounts.delete(connectionId)
    console.log(`✅ Successfully deleted connection:`, connectionId)
    return { id: connectionId }
  } catch (error) {
    console.error(`❌ Error deleting connection ${connectionId}:`, error)
    return null
  }
}

// Trigger manual sync - Composio might not have a direct manual sync like SuperMemory
// but it fetches data when tools are called. We'll leave it as a no-op or placeholder.
export async function manualSync(provider: ConnectorProvider, userId: string) {
  console.log(
    `🔄 Manual sync for Composio is handled automatically during tool calls: ${provider}`
  )
  return { success: true, message: 'Sync handled by Composio dynamically' }
}

// Get sync status
export async function getSyncStatus(
  provider: ConnectorProvider,
  userId: string
) {
  console.log(`📊 Getting sync status for ${provider}, userId: ${userId}`)
  try {
    const connection = await getConnection(provider, userId)

    if (!connection) {
      console.log(`❌ No connection found for ${provider} status check`)
      return null
    }

    // Composio doesn't expose document counts in the same way.
    const status = {
      isConnected: true,
      documentCount: 0, // Placeholder
      lastSync: connection.createdAt,
      email: connection.email,
      status: 'active'
    }

    return status
  } catch (error) {
    console.error(
      `❌ Error getting sync status for ${CONNECTOR_CONFIGS[provider].name}:`,
      error
    )
    return null
  }
}
