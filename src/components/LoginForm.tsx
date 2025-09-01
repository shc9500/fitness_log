'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        if (error.message.includes('fetch')) {
          setMessage('Supabase 연결에 실패했습니다. 환경변수를 확인해주세요.')
        } else {
          setMessage(error.message)
        }
      } else {
        window.location.href = '/'
      }
    } catch (error: unknown) {
      console.error('Login error details:', error)
      const errorMessage = (error as Error)?.message || '알 수 없는 오류'
      setMessage(`로그인 오류: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="email">이메일</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1"
          placeholder="your@email.com"
        />
      </div>
      <div>
        <Label htmlFor="password">비밀번호</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="mt-1"
          placeholder="비밀번호를 입력하세요"
        />
      </div>
      {message && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
          {message}
        </div>
      )}
      <Button
        type="submit"
        disabled={loading}
        className="w-full"
      >
        {loading ? '로그인 중...' : '로그인'}
      </Button>
      <div className="text-center">
        <p className="text-sm text-gray-600">
          아직 계정이 없으신가요?{' '}
          <Link href="/signup" className="text-blue-600 hover:text-blue-500">
            회원가입
          </Link>
        </p>
      </div>
    </form>
  )
}