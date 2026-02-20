'use server'

import { getRedisClient, RedisWrapper } from '@/lib/redis/config'
import { revalidatePath } from 'next/cache'

export interface UserPlanDetailsProps {
    userId: string
    name?: string
    email?: string
    phoneNumber?: string,
    priceId: string
    planName: string
    isActive: boolean
    customerId?: string
}

async function getRedis(): Promise<RedisWrapper> {
    return await getRedisClient()
}

const USER_PREMIUM_VERSION = 'v3'
function getUserPremiumKey(userId: string) {
    return `user:${USER_PREMIUM_VERSION}:premium:${userId}`
}

export async function getUserPlan(
    userId: string
): Promise<UserPlanDetailsProps | null> {
    try {
        const redis = await getRedis()
        const key = getUserPremiumKey(userId)
        const data = await redis.hgetall<Record<string, any>>(key)

        if (!data || Object.keys(data).length === 0) {
            return null
        }

        const premiumData = { ...data }

        return premiumData as UserPlanDetailsProps
    } catch (error) {
        console.error('Error fetching user premium:', error)
        return null
    }
}

export async function saveUserPlanDetails(data: UserPlanDetailsProps) {
    try {
        const redis = await getRedis()
        const pipeline = redis.pipeline()
        const key = getUserPremiumKey(data.userId)

        pipeline.hmset(key, data)
        if (data.customerId) {
            pipeline.set(`customer:${data.customerId}:userId`, data.userId)
        }
        await pipeline.exec()

        revalidatePath('/')
        return data
    } catch (error) {
        console.error('Error saving user premium:', error)
        throw error
    }
}

export async function revokeUserPlan(userId: string) {
    try {
        const redis = await getRedis()
        const key = getUserPremiumKey(userId)

        const existingData = await getUserPlan(userId)

        if (existingData) {
            const newData: UserPlanDetailsProps = {
                ...existingData,
                planName: 'Free',
                priceId: '',
                isActive: false,
                customerId: ''
            }

            // Delete the customer mapping first
            if (existingData.customerId) {
                await redis.del(`customer:${existingData.customerId}:userId`)
            }

            await redis.hmset(key, newData)
        }

        revalidatePath('/')
        console.log(`User premium revoked/reset for: ${userId}`)
        return true
    } catch (error) {
        console.error('Error revoking user premium:', error)
        throw error
    }
}

export async function getUserIdByCustomer(customerId: string): Promise<string | null> {
    try {
        const redis = await getRedis()
        return await redis.get<string>(`customer:${customerId}:userId`)
    } catch (error) {
        console.error('Error getting email by customer:', error)
        return null
    }
}
