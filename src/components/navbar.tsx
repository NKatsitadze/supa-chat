"use client"

import { useCurrentUser } from "@/services/supabase/hooks/useCurrentUser"

export default function NavBar () {
    const {user, isLoading} = useCurrentUser()

    return (
        <div className="border-b bg-background h-header">
            <nav></nav>
        </div>
    )
}