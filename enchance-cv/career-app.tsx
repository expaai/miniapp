"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Home, TrendingUp, User, ChevronRight, Star, Crown, Zap, Target } from "lucide-react"

type Role = "student" | "professional" | null
type Goal = string

const studentGoals = [
  "хочу создать резюме",
  "хочу улучшить резюме",
  "хочу определиться с профессиональной целью",
  "хочу получить личную консультацию",
]

const professionalGoals = [
  "хочу улучшить резюме",
  "хочу понять свои сильные и слабые стороны",
  "хочу получить личную консультацию",
]

const additionalServices = [
  { title: "Понять сильные и слабые стороны", icon: "🎯", premium: false },
  { title: "Подбор подходящих вакансий", icon: "📊", premium: false },
  { title: "Пройти тесты", icon: "🧠", premium: false },
  { title: "Получить личную консультацию", icon: "👨‍💼", premium: true },
]

export default function CareerMiniApp() {
  const [currentScreen, setCurrentScreen] = useState<"role" | "goals" | "main">("role")
  const [selectedRole, setSelectedRole] = useState<Role>(null)
  const [selectedGoals, setSelectedGoals] = useState<Goal[]>([])
  const [userName] = useState("Александр")

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role)
    setCurrentScreen("goals")
  }

  const handleGoalToggle = (goal: Goal) => {
    setSelectedGoals((prev) => (prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]))
  }

  const handleContinue = () => {
    if (selectedGoals.length > 0) {
      setCurrentScreen("main")
    }
  }

  const currentGoals = selectedRole === "student" ? studentGoals : professionalGoals

  if (currentScreen === "role") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute bottom-40 right-10 w-40 h-40 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full blur-3xl opacity-20"></div>
        </div>

        <div className="max-w-sm mx-auto pt-12 relative z-10">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-amber-500/25">
              <Crown className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-3">
              Привет, {userName}!
            </h1>
            <p className="text-gray-300 text-lg">Выберите свою роль для персонализации опыта</p>
          </div>

          <div className="space-y-6">
            <Card
              className="cursor-pointer hover:scale-105 transition-all duration-300 border-0 bg-gradient-to-r from-emerald-500 to-teal-600 shadow-2xl shadow-emerald-500/25 hover:shadow-emerald-500/40"
              onClick={() => handleRoleSelect("student")}
            >
              <CardContent className="p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Студент</h3>
                    <p className="text-emerald-100">Начинаю карьерный путь</p>
                  </div>
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <span className="text-3xl">🎓</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:scale-105 transition-all duration-300 border-0 bg-gradient-to-r from-purple-600 to-blue-600 shadow-2xl shadow-purple-500/25 hover:shadow-purple-500/40"
              onClick={() => handleRoleSelect("professional")}
            >
              <CardContent className="p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Профессионал</h3>
                    <p className="text-purple-100">Развиваю карьеру дальше</p>
                  </div>
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <span className="text-3xl">💼</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (currentScreen === "goals") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-32 right-8 w-24 h-24 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full blur-2xl opacity-30"></div>
          <div className="absolute bottom-32 left-8 w-32 h-32 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full blur-2xl opacity-30"></div>
        </div>

        <div className="max-w-sm mx-auto pt-8 relative z-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-xl">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-3">
              Ваши цели
            </h1>
            <p className="text-gray-300 text-lg">Выберите, что хотите улучшить</p>
          </div>

          <div className="space-y-4 mb-8">
            {currentGoals.map((goal, index) => (
              <div
                key={index}
                className={`
                  relative p-5 rounded-2xl cursor-pointer transition-all duration-300 border
                  ${
                    selectedGoals.includes(goal)
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 border-blue-400 shadow-2xl shadow-blue-500/25 scale-105"
                      : "bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 hover:scale-102"
                  }
                `}
                onClick={() => handleGoalToggle(goal)}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`capitalize font-medium ${selectedGoals.includes(goal) ? "text-white" : "text-gray-200"}`}
                  >
                    {goal}
                  </span>
                  {selectedGoals.includes(goal) && (
                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                {selectedGoals.includes(goal) && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur-xl"></div>
                )}
              </div>
            ))}
          </div>

          <Button
            onClick={handleContinue}
            disabled={selectedGoals.length === 0}
            className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 border-0 shadow-2xl shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-300"
          >
            <span className="mr-2">Продолжить</span>
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-purple-900 shadow-2xl">
        <div className="max-w-sm mx-auto p-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="w-14 h-14 border-2 border-white/20">
                <AvatarFallback className="bg-gradient-to-r from-amber-500 to-orange-600 text-white text-lg font-bold">
                  {userName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                <Crown className="w-3 h-3 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Привет, {userName}!</h1>
              <div className="flex items-center gap-2">
                <span className="text-purple-200">{selectedRole === "student" ? "Студент" : "Профессионал"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-sm mx-auto p-4 pb-24">
        {/* Current Task */}
        <div className="mb-8 mt-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Zap className="w-6 h-6 text-amber-500 mr-2" />
            На повестке:
          </h2>
          <Card className="border-0 bg-gradient-to-r from-blue-600 to-purple-600 shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105">
            <CardContent className="p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <h3 className="font-bold text-white text-lg capitalize mb-2">{selectedGoals[0]}</h3>
                  <p className="text-blue-100 mb-3">Начать сейчас</p>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full mr-2"></div>
                    <span className="text-sm text-blue-100">Готово к запуску</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <ChevronRight className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Services */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <Star className="w-6 h-6 text-amber-500 mr-2" />
            Дополнительные возможности
          </h2>
          <div className="space-y-4">
            {additionalServices.map((service, index) => (
              <Card
                key={index}
                className={`cursor-pointer transition-all duration-300 hover:scale-105 border-0 shadow-xl ${
                  service.premium
                    ? "bg-gradient-to-r from-amber-50 to-orange-50 shadow-amber-500/10 hover:shadow-amber-500/20"
                    : "bg-white shadow-gray-500/10 hover:shadow-gray-500/20"
                }`}
              >
                <CardContent className="p-5 relative overflow-hidden">
                  {service.premium && (
                    <div className="absolute top-2 right-2">
                      <Crown className="w-4 h-4 text-amber-500" />
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          service.premium
                            ? "bg-gradient-to-r from-amber-500 to-orange-600"
                            : "bg-gradient-to-r from-gray-500 to-gray-600"
                        }`}
                      >
                        <span className="text-xl">{service.icon}</span>
                      </div>
                      <div>
                        <span className={`font-semibold ${service.premium ? "text-gray-900" : "text-gray-900"}`}>
                          {service.title}
                        </span>
                        {service.premium && <div className="text-xs text-amber-600 font-medium">Премиум функция</div>}
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-200/50 shadow-2xl">
        <div className="max-w-sm mx-auto">
          <div className="flex justify-around py-3">
            <Button variant="ghost" className="flex-col h-auto py-3 px-6 bg-blue-50 text-blue-600 rounded-2xl">
              <Home className="w-6 h-6 mb-1" />
              <span className="text-xs font-semibold">Главная</span>
            </Button>
            <Button variant="ghost" className="flex-col h-auto py-3 px-6 hover:bg-gray-50 rounded-2xl">
              <TrendingUp className="w-6 h-6 mb-1 text-gray-400" />
              <span className="text-xs text-gray-400">Мой путь</span>
            </Button>
            <Button variant="ghost" className="flex-col h-auto py-3 px-6 hover:bg-gray-50 rounded-2xl">
              <User className="w-6 h-6 mb-1 text-gray-400" />
              <span className="text-xs text-gray-400">Профиль</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
