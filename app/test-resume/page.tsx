'use client'

import { useRouter } from 'next/navigation'
import ResumeImprovement from '../../components/resume-improvement'

export default function TestResumePage() {
  const router = useRouter()

  console.log('🧪 ТЕСТОВАЯ СТРАНИЦА ЗАГРУЖЕНА')

  return (
    <ResumeImprovement 
      onBack={() => {
        console.log('🔙 НАЖАТА КНОПКА НАЗАД - ВОЗВРАЩАЕМСЯ НА ПРЕДЫДУЩИЙ ЭКРАН')
        router.back()
      }}
    />
  )
}