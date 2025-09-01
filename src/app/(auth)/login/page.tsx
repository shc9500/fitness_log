import { LoginForm } from '@/components/LoginForm'

export default function LoginPage() {
  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">로그인</h2>
        <p className="mt-2 text-sm text-gray-600">
          계정에 로그인하여 운동 기록을 관리하세요
        </p>
      </div>
      <LoginForm />
    </div>
  )
}