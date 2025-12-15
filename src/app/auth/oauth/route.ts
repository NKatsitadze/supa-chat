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
      const host =
        request.headers.get('x-forwarded-host') ??
        request.headers.get('host')

      const proto =
        request.headers.get('x-forwarded-proto') ?? 'https'

      return NextResponse.redirect(`${proto}://${host}${next}`)
    }
  }

  return NextResponse.redirect('/auth/error')
}
