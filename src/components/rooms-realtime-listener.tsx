'use client'

import { useEffect } from 'react'
import { createClient } from '@/services/supabase/client'
import { useRouter } from 'next/navigation'

export function RoomsRealtimeListener({ userId }: { userId: string }) {
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel(`user:${userId}:rooms`)
      .on('broadcast', { event: 'ROOM_INVITE' }, () => {
        router.refresh()
      })
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [userId, router])

  return null
}
