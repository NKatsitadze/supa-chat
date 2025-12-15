import { NextResponse } from 'next/server'
import { createClient } from '@/services/supabase/server'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')

  let next = url.searchParams.get('next') ?? '/'
  if (!next.startsWith('/')) next = '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const forwardedHost = request.headers.get('x-forwarded-host')
      const forwardedProto =
        request.headers.get('x-forwarded-proto') ?? 'https'

      const baseUrl = forwardedHost
        ? `${forwardedProto}://${forwardedHost}`
        : url.origin

      return NextResponse.redirect(`${baseUrl}${next}`)
    }
  }

  return NextResponse.redirect('/auth/error')
}
