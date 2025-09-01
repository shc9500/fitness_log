import { SignupForm } from '@/components/SignupForm'
import { DebugSupabase } from '@/components/DebugSupabase'

export default function SignupPage() {
  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">회원가입</h2>
        <p className="mt-2 text-sm text-gray-600">
          새 계정을 만들어 운동 기록을 시작하세요
        </p>
      </div>
      <SignupForm />
      <DebugSupabase />
    </div>
  )
}