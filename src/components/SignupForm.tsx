'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'

export function SignupForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [success, setSuccess] = useState(false)

  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    if (password !== confirmPassword) {
      setMessage('비밀번호가 일치하지 않습니다.')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setMessage('비밀번호는 최소 6자 이상이어야 합니다.')
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/callback`,
        },
      })

      if (error) {
        if (error.message.includes('fetch')) {
          setMessage('Supabase 연결에 실패했습니다. 환경변수를 확인해주세요.')
        } else {
          setMessage(error.message)
        }
      } else {
        setSuccess(true)
        setMessage('회원가입이 완료되었습니다! 이메일을 확인하여 계정을 인증해주세요.')
      }
    } catch (error: unknown) {
      const errorMessage = (error as Error)?.message || '알 수 없는 오류'
      if (errorMessage.includes('fetch') || (error as Error)?.name === 'TypeError') {
        setMessage('Supabase 서버에 연결할 수 없습니다. 실제 Supabase URL과 키를 .env.local에 설정해주세요.')
      } else {
        setMessage('회원가입 중 오류가 발생했습니다: ' + errorMessage)
      }
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center">
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-green-800">{message}</p>
        </div>
        <Link
          href="/login"
          className="text-blue-600 hover:text-blue-500"
        >
          로그인 페이지로 돌아가기
        </Link>
      </div>
    )
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
          placeholder="최소 6자 이상"
        />
      </div>
      <div>
        <Label htmlFor="confirmPassword">비밀번호 확인</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="mt-1"
          placeholder="비밀번호를 다시 입력하세요"
        />
      </div>
      {message && (
        <div className={`text-sm p-3 rounded ${
          success 
            ? 'text-green-600 bg-green-50' 
            : 'text-red-600 bg-red-50'
        }`}>
          {message}
        </div>
      )}
      <Button
        type="submit"
        disabled={loading}
        className="w-full"
      >
        {loading ? '가입 중...' : '회원가입'}
      </Button>
      <div className="text-center">
        <p className="text-sm text-gray-600">
          이미 계정이 있으신가요?{' '}
          <Link href="/login" className="text-blue-600 hover:text-blue-500">
            로그인
          </Link>
        </p>
      </div>
    </form>
  )
}