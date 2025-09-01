'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function EmailVerificationCallback() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const router = useRouter()

  useEffect(() => {
    const handleEmailVerification = async () => {
      const supabase = createClient()
      
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          setStatus('error')
          setMessage('인증 처리 중 오류가 발생했습니다.')
          return
        }

        if (data.session) {
          setStatus('success')
          setMessage('이메일 인증이 완료되었습니다! 잠시 후 홈으로 이동합니다.')
          
          setTimeout(() => {
            router.push('/')
          }, 2000)
        } else {
          setStatus('error')
          setMessage('인증에 실패했습니다. 다시 시도해주세요.')
        }
      } catch (error) {
        setStatus('error')
        setMessage('예상치 못한 오류가 발생했습니다.')
      }
    }

    handleEmailVerification()
  }, [router])

  return (
    <div className="text-center">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">이메일 인증</h2>
      </div>
      
      {status === 'loading' && (
        <div>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">인증을 처리하고 있습니다...</p>
        </div>
      )}

      {status === 'success' && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-800">{message}</p>
        </div>
      )}

      {status === 'error' && (
        <div className="space-y-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">{message}</p>
          </div>
          <a
            href="/login"
            className="inline-block text-blue-600 hover:text-blue-500"
          >
            로그인 페이지로 돌아가기
          </a>
        </div>
      )}
    </div>
  )
}