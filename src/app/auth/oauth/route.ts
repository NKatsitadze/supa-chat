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
      const siteUrl =
        process.env.NEXT_PUBLIC_SITE_URL ??
        (() => {
          const proto = request.headers.get('x-forwarded-proto') ?? 'https'
          const host = request.headers.get('x-forwarded-host')
          return host ? `${proto}://${host}` : undefined
        })()

      if (!siteUrl) {
        // absolute last resort (should never happen)
        return NextResponse.redirect('/')
      }

      return NextResponse.redirect(`${siteUrl}${next}`)
    }
  }

  return NextResponse.redirect('/auth/error')
}
