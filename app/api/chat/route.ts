import { cookies } from 'next/headers'

import { getUserPlan, UserPlanDetailsProps } from '@/lib/actions/user-premium'
import { getCurrentUserId } from '@/lib/auth/get-current-user'
import { createToolCallingStreamResponse } from '@/lib/streaming/create-tool-calling-stream'
import { Model } from '@/lib/types/models'
import { authenticatedRateLimit, getClientIdentifier, unauthenticatedRateLimit } from '@/lib/utils/rate-limit'
import { isProviderEnabled } from '@/lib/utils/registry'

export const maxDuration = 30

const DEFAULT_MODEL: Model = {
  "id": "gpt-4o-mini",
  "name": "GPT-4o mini",
  "provider": "OpenAI",
  "providerId": "openai",
  "enabled": true,
  "toolCallType": "native"
}

export async function POST(req: Request) {
  try {
    const { messages, id: chatId, excludeDomains, selectedApps, isIncognito } = await req.json()
    const referer = req.headers.get('referer')
    const isSharePage = referer?.includes('/share/')
    let userPlanDetails: UserPlanDetailsProps | null = null
    // Parallelize authentication and identifier fetching
    const [userId, identifier] = await Promise.all([
      getCurrentUserId(),
      Promise.resolve(getClientIdentifier(req))
    ])

    console.log("user id : ", userId)

    if (userId === "anonymous") {
      const { success, limit, remaining } = await unauthenticatedRateLimit.limit(identifier);
      console.log("Remaining credits for the day : ", remaining)

      if (!success) {
        return new Response(
          `You've used all your free ${limit} searches for today. Sign in to unlock unlimited access and premium features!`,
          {
            status: 429,
            statusText: 'Too Many Requests',
          }
        );
      }
    }
    else {
      userPlanDetails = await getUserPlan(userId);
      //check if user is paid plan or not
      if (userPlanDetails?.planName === "Free") {
        const { success, reset, remaining } = await authenticatedRateLimit.limit(userId);
        console.log("Remaining credits for the day : ", remaining)

        if (!success) {
          const resetDate = new Date(reset);
          return new Response(
            `You've reached your free usage limit. Upgrade to Pro for unlimited access, or come back at ${resetDate} to continue your research!`,
            {
              status: 429,
              statusText: 'Too Many Requests',
            }
          );
        }
      }
    }

    if (isSharePage) {
      return new Response('Chatting is disabled on shared links. Start a new conversation to continue.', {
        status: 403,
        statusText: 'Forbidden'
      })
    }

    const cookieStore = await cookies()
    const modelJson = cookieStore.get('selectedModel')?.value

    let selectedModel = DEFAULT_MODEL

    if (modelJson) {
      try {
        selectedModel = JSON.parse(modelJson) as Model
      } catch (e) {
        console.error('Failed to parse selected model:', e)
      }
    }

    if (
      !isProviderEnabled(selectedModel.providerId) ||
      selectedModel.enabled === false
    ) {
      return new Response(
        `Selected provider is not enabled ${selectedModel.providerId}`,
        {
          status: 404,
          statusText: 'Not Found'
        }
      )
    }

    // Transform app names from kebab-case (e.g., 'google-drive') to connector format (e.g., 'googledrive')
    const transformedApps = selectedApps.map((app: string) => app.replace(/-/g, ''))

    return createToolCallingStreamResponse({
      messages,
      model: selectedModel,
      chatId,
      searchMode: true,
      userId,
      excludeDomains,
      selectedApps: transformedApps,
      userPlanDetails: userPlanDetails,
      isIncognito
    })
  } catch (error) {
    console.error('API route error:', error)
    return new Response('Error processing your request', {
      status: 500,
      statusText: 'Internal Server Error'
    })
  }
}
