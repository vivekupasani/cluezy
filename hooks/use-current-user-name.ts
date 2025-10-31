import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export const useCurrentUserName = () => {
  const [name, setName] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfileName = async () => {
      const { data, error } = await createClient().auth.getSession()
      if (error) {
        console.error(error)
      }
      console.log("User meta data : ", data.session?.user.user_metadata)
      setName(data.session?.user.user_metadata.full_name ?? '?')
    }

    fetchProfileName()
  }, [])

  return name || '?'
}

export const useCurrentUserEmail = () => {
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    const fetchProfileName = async () => {
      const { data, error } = await createClient().auth.getSession()
      if (error) {
        console.error(error)
      }
      console.log("User meta data : ", data.session?.user.user_metadata)
      setEmail(data.session?.user.user_metadata.email ?? '?')
    }

    fetchProfileName()
  }, [])

  return email || '?'
}
