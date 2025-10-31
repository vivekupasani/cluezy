"use client"
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

export const useCurrentUserData = () => {
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        const fetchUserData = async () => {
            const supabase = await createClient()
            const {
                data: { user: supabaseUser }
            } = await supabase.auth.getUser()

            setUser(supabaseUser ?? null)
        }
        fetchUserData()
    }, [])

    return user
}
