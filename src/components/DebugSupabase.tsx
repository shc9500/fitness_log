'use client'

export function DebugSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  console.log('Environment variables check:', { url, key: key ? 'exists' : 'missing' })
  
  return (
    <div className="fixed bottom-4 right-4 bg-red-600 text-white p-4 rounded text-xs max-w-sm z-50">
      <div><strong>🔴 ENV DEBUG:</strong></div>
      <div>URL: {url ? `${url.substring(0, 35)}...` : '❌ MISSING'}</div>
      <div>KEY: {key ? `${key.substring(0, 25)}...` : '❌ MISSING'}</div>
      <div>URL Valid: {url?.includes('supabase.co') ? '✅' : '❌'}</div>
      <div>KEY Valid: {key && key.length > 100 ? '✅' : '❌'}</div>
      <div>NODE_ENV: {process.env.NODE_ENV}</div>
    </div>
  )
}