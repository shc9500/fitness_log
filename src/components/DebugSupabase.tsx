'use client'

export function DebugSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded text-xs max-w-sm">
      <div><strong>Debug Info:</strong></div>
      <div>URL: {url ? url.substring(0, 30) + '...' : 'MISSING'}</div>
      <div>KEY: {key ? key.substring(0, 20) + '...' : 'MISSING'}</div>
      <div>URL Valid: {url?.includes('supabase.co') ? '✅' : '❌'}</div>
      <div>KEY Valid: {key?.length > 100 ? '✅' : '❌'}</div>
    </div>
  )
}