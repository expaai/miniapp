'use client'

import { useState } from 'react'
import ResumeImprovement from './components/resume-improvement'

export default function TestResumePage() {
  const [showResume, setShowResume] = useState(true)

  if (showResume) {
    return (
      <ResumeImprovement 
          onBack={() => setShowResume(false)}
          selectedRole={null}
          selectedGoal={undefined}
        />
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Тест компонента ResumeImprovement</h1>
        <button 
          onClick={() => setShowResume(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Показать компонент ResumeImprovement
        </button>
      </div>
    </div>
  )
}