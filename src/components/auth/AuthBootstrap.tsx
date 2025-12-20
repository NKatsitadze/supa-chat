'use client'

import { useEffect } from 'react'
import { createClient } from '@/services/supabase/client'

export default function AuthBootstrap() {
  useEffect(() => {
    const run = async () => {
      const supabase = createClient()

      const { data } = await supabase.auth.getUser()
      const user = data.user

      if (!user) return

      if (!user.user_metadata?.preferred_username) {
        const generated = user.email?.split('@')[0].replaceAll('.', '').toLowerCase()

        if (!generated) return

        await supabase.auth.updateUser({
          data: { preferred_username: generated },
        })

        await supabase.from('user_profile').update({ name: generated }).eq('id', user.id)
      }
    }

    run()
  }, [])

  return null
}
