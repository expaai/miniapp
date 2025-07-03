"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTelegram } from "@/hooks/use-telegram"
import { useAPI, CareerAdviceResponse, ProfessionSelectionRequest, JobMatchingRequest, UserRoleRequest, SessionStateRequest } from "@/hooks/use-api"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Home, TrendingUp, User, ChevronRight, Star, Crown, Zap, Target, Loader2 } from "lucide-react"
import ResumeImprovement from "@/components/resume-improvement"

type Role = "student" | "professional" | null
type Goal = string

const studentGoals = [
  "Хочу создать резюме",
  "Хочу улучшить резюме",
  "Хочу определиться с профессиональной целью",
  "Хочу получить личную консультацию",
]

const professionalGoals = [
  "Хочу улучшить резюме",
  "Хочу понять свои сильные и слабые стороны",
  "Хочу получить личную консультацию",
]

const additionalServices = [
  { title: "Понять сильные и слабые стороны", icon: "🎯", premium: false },
  { title: "Подбор подходящих вакансий", icon: "📊", premium: false },
  { title: "Пройти тесты", icon: "🧠", premium: false },
  { title: "Получить личную консультацию", icon: "👨‍💼", premium: true },
]

const professions = [
  "Frontend разработчик",
  "Backend разработчик",
  "Fullstack разработчик",
  "Mobile разработчик",
  "DevOps инженер",
  "Data Scientist",
  "AI/ML инженер",
  "Product Manager",
  "UX/UI дизайнер",
  "QA инженер"
]

export default function CareerMiniApp() {
  const router = useRouter()
  const [currentScreen, setCurrentScreen] = useState<"role" | "goals" | "profession" | "main" | "advice" | "resume">("role")
  
  // Отладка изменений currentScreen
  useEffect(() => {
    console.log('🔄 currentScreen изменился на:', currentScreen)
  }, [currentScreen])
  const [selectedRole, setSelectedRole] = useState<Role>(null)
  const [selectedGoal, setSelectedGoal] = useState<Goal>("")
  const [selectedProfession, setSelectedProfession] = useState<string>("")
  const [careerAdvice, setCareerAdvice] = useState<CareerAdviceResponse | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  
  // Логирование для отладки
  console.log('🔄 РЕНДЕР КОМПОНЕНТА! currentScreen:', currentScreen, 'selectedGoal:', selectedGoal)
  const { user, isReady, showMainButton, hideMainButton, showBackButton, hideBackButton, hapticFeedback } = useTelegram()
  const { getCareerAdvice, loading, error, clearError, logProfessionSelection, getJobMatches, saveUserRole, saveUserGoal, getSessionState } = useAPI()
  const [sessionId, setSessionId] = useState<string>("")
  
  // Получаем имя пользователя из Telegram или используем по умолчанию
  const userName = user?.first_name || "Пользователь"

  // Функция для сохранения состояния в localStorage
  const saveStateToLocalStorage = () => {
    const state = {
      selectedRole,
      selectedGoal,
      selectedProfession,
      sessionId,
      currentScreen
    }
    localStorage.setItem('careerAppState', JSON.stringify(state))
  }

  // Функция для загрузки состояния из localStorage
  const loadStateFromLocalStorage = () => {
    try {
      const savedState = localStorage.getItem('careerAppState')
      if (savedState) {
        const state = JSON.parse(savedState)
        return state
      }
    } catch (error) {
      console.error('Ошибка при загрузке состояния из localStorage:', error)
    }
    return null
  }

  // Инициализация состояния при загрузке компонента
  useEffect(() => {
    if (!isReady || !user?.id || isInitialized) return

    const initializeState = async () => {
      try {
        // Сначала пытаемся получить состояние с сервера
        const sessionStateRequest: SessionStateRequest = {
          user_id: user.id.toString()
        }
        
        const sessionState = await getSessionState(sessionStateRequest)
        
        if (sessionState && sessionState.current_screen !== 'role') {
          // Восстанавливаем состояние с сервера
          if (sessionState.user_role) {
            setSelectedRole(sessionState.user_role as Role)
          }
          if (sessionState.career_goal) {
            setSelectedGoal(sessionState.career_goal)
          }
          if (sessionState.selected_profession) {
            setSelectedProfession(sessionState.selected_profession)
          }
          if (sessionState.session_id) {
            setSessionId(sessionState.session_id)
          }
          setCurrentScreen(sessionState.current_screen as any)
        } else {
          // Если нет данных на сервере, пытаемся загрузить из localStorage
          const localState = loadStateFromLocalStorage()
          if (localState) {
            if (localState.selectedRole) setSelectedRole(localState.selectedRole)
            if (localState.selectedGoal) setSelectedGoal(localState.selectedGoal)
            if (localState.selectedProfession) setSelectedProfession(localState.selectedProfession)
            if (localState.sessionId) setSessionId(localState.sessionId)
            if (localState.currentScreen && localState.currentScreen !== 'role') {
              setCurrentScreen(localState.currentScreen)
            }
          }
        }
      } catch (error) {
        console.error('Ошибка при инициализации состояния:', error)
        // В случае ошибки пытаемся загрузить из localStorage
        const localState = loadStateFromLocalStorage()
        if (localState) {
          if (localState.selectedRole) setSelectedRole(localState.selectedRole)
          if (localState.selectedGoal) setSelectedGoal(localState.selectedGoal)
          if (localState.selectedProfession) setSelectedProfession(localState.selectedProfession)
          if (localState.sessionId) setSessionId(localState.sessionId)
          if (localState.currentScreen && localState.currentScreen !== 'role') {
            setCurrentScreen(localState.currentScreen)
          }
        }
      } finally {
        setIsInitialized(true)
      }
    }

    initializeState()
  }, [isReady, user?.id, isInitialized, getSessionState])

  // Сохраняем состояние в localStorage при изменениях
  useEffect(() => {
    if (isInitialized) {
      saveStateToLocalStorage()
    }
  }, [selectedRole, selectedGoal, selectedProfession, sessionId, currentScreen, isInitialized])

  const handleRoleSelect = async (role: Role) => {
    hapticFeedback.impact('light')
    setSelectedRole(role)
    
    // Сохраняем роль пользователя на сервер
    if (user?.id) {
      try {
        const userRoleRequest: UserRoleRequest = {
          user_id: user.id.toString(),
          user_role: role
        }
        
        const response = await saveUserRole(userRoleRequest)
        if (response?.session_id) {
          setSessionId(response.session_id)
        }
      } catch (error) {
        console.error('Ошибка при сохранении роли пользователя:', error)
      }
    }
    
    setCurrentScreen("goals")
  }

  const handleGoalSelect = async (goal: Goal) => {
    hapticFeedback.impact('light')
    setSelectedGoal(goal)
    
    // Сохраняем цель пользователя на сервер
    if (user?.id) {
      try {
        const userGoalRequest = {
          user_id: user.id.toString(),
          user_goal: goal
        }
        
        await saveUserGoal(userGoalRequest)
      } catch (error) {
        console.error('Ошибка при сохранении цели пользователя:', error)
      }
    }
  }

  const handleContinue = () => {
    if (selectedGoal) {
      hapticFeedback.notification('success')
      setCurrentScreen("main")
    }
  }

  const handleGetCareerAdvice = async () => {
    console.log('🔥 КНОПКА НАЖАТА! selectedGoal:', selectedGoal, 'selectedRole:', selectedRole)
    console.log('🔍 Текущий currentScreen ДО изменения:', currentScreen)
    
    if (!selectedGoal || !selectedRole) {
      console.log('❌ Нет selectedGoal или selectedRole')
      return
    }
    
    hapticFeedback.impact('medium')
    
    // Если выбрана цель улучшения резюме, переходим к экрану резюме
    console.log('🔍 Проверяем цель:', selectedGoal.toLowerCase())
    const isImproveResume = selectedGoal.toLowerCase().includes('хочу улучшить резюме')
    console.log('🔍 Содержит "хочу улучшить резюме"?', isImproveResume)
    
    if (isImproveResume) {
      console.log('✅ ПЕРЕХОДИМ К ЭКРАНУ РЕЗЮМЕ!')
      console.log('🔄 Вызываем setCurrentScreen("resume")')
      setCurrentScreen('resume')
      console.log('📱 setCurrentScreen("resume") вызван')
      
      // Принудительно проверяем состояние через setTimeout
      setTimeout(() => {
        console.log('⏰ Проверка состояния через 100мс - currentScreen должен быть "resume"')
      }, 100)
      
      // Дополнительная проверка через 500мс
      setTimeout(() => {
        console.log('⏰ Проверка состояния через 500мс - currentScreen должен быть "resume"')
      }, 500)
      
      return
    }
    
    clearError()
    
    const request = {
      user_goal: selectedGoal,
      experience_level: selectedRole === 'student' ? 'junior' : 'middle',
      current_role: selectedRole === 'student' ? undefined : 'Специалист',
      interests: [selectedGoal]
    }
    
    const response = await getCareerAdvice(request)
    if (response) {
      setCareerAdvice(response)
      setCurrentScreen('advice')
      hapticFeedback.notification('success')
    }
  }

  // Управление кнопками Telegram при смене экранов
  useEffect(() => {
    if (!isReady) return

    // Всегда скрываем MainButton, так как используем собственные кнопки в интерфейсе
    hideMainButton()

    if (currentScreen === "goals") {
      showBackButton(() => {
        hapticFeedback.impact('light')
        setCurrentScreen("role")
      })
    } else if (currentScreen === "profession") {
      showBackButton(() => {
        hapticFeedback.impact('light')
        setCurrentScreen("goals")
      })
    } else if (currentScreen === "main") {
      showBackButton(() => {
        hapticFeedback.impact('light')
        setCurrentScreen("profession")
      })
    } else if (currentScreen === "advice") {
      showBackButton(() => {
        hapticFeedback.impact('light')
        setCurrentScreen("main")
      })
    } else if (currentScreen === "resume") {
      showBackButton(() => {
        hapticFeedback.impact('light')
        setCurrentScreen("goals")
      })
    } else {
      hideBackButton()
    }

    return () => {
      hideMainButton()
      hideBackButton()
    }
  }, [currentScreen, isReady, showBackButton, hideBackButton, hideMainButton, hapticFeedback])

  // Определяем текущие цели в зависимости от роли
  const currentGoals = selectedRole === "student" ? studentGoals : professionalGoals

  // Функция для фильтрации дополнительных услуг
  const getFilteredAdditionalServices = () => {
    if (!selectedGoal) return additionalServices
    
    const selectedGoalLower = selectedGoal.toLowerCase()
    
    return additionalServices.filter(service => {
      const serviceLower = service.title.toLowerCase()
      
      // Исключаем услуги, которые дублируют выбранную цель
      if (serviceLower.includes('резюме') && selectedGoalLower.includes('резюме')) {
        return false
      }
      if (serviceLower.includes('сильные и слабые стороны') && selectedGoalLower.includes('сильные и слабые стороны')) {
        return false
      }
      
      return true
    })
  }

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
                    <h3 className="text-xl font-bold text-white mb-2">Студент 🎓</h3>
                    <p className="text-emerald-100">Начинаю карьерный путь</p>
                  </div>
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                    <span className="text-3xl">🎓</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:scale-105 transition-all duration-300 border-0 bg-gradient-to-r from-blue-600 to-purple-700 shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40"
              onClick={() => handleRoleSelect("professional")}
            >
              <CardContent className="p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2">Профессионал</h3>
                    <p className="text-blue-100">Развиваю карьеру</p>
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
  } else if (currentScreen === "goals") {
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
                    selectedGoal === goal
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 border-blue-400 shadow-2xl shadow-blue-500/25 scale-105"
                      : "bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 hover:scale-102"
                  }
                `}
                onClick={() => handleGoalSelect(goal)}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`font-medium ${selectedGoal === goal ? "text-white" : "text-gray-200"}`}
                  >
                    {goal}
                  </span>
                  {selectedGoal === goal && (
                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                {selectedGoal === goal && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl blur-xl"></div>
                )}
              </div>
            ))}
          </div>

          <Button
            onClick={handleContinue}
            disabled={!selectedGoal}
            className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 border-0 shadow-2xl shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-300"
          >
            <span className="mr-2">Продолжить</span>
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    )
  } else if (currentScreen === "profession") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-32 right-8 w-24 h-24 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full blur-2xl opacity-30"></div>
          <div className="absolute bottom-32 left-8 w-32 h-32 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full blur-2xl opacity-30"></div>
        </div>

        <div className="max-w-sm mx-auto pt-8 relative z-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-xl">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-3">
              Выберите профессию
            </h1>
            <p className="text-gray-300 text-lg">Это поможет подобрать подходящие вакансии</p>
          </div>

          <div className="space-y-3 mb-8">
            {professions.map((profession, index) => (
              <div
                key={index}
                className={`
                  relative p-4 rounded-xl cursor-pointer transition-all duration-300 border
                  ${
                    selectedProfession === profession
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 border-blue-400 shadow-xl shadow-blue-500/25 scale-105"
                      : "bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 hover:scale-102"
                  }
                `}
                onClick={() => {
                  hapticFeedback.impact('light')
                  setSelectedProfession(profession)
                }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">{profession}</span>
                  {selectedProfession === profession && (
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <Button
            onClick={async () => {
              if (selectedProfession) {
                hapticFeedback.notification('success')
                
                // Логируем выбор профессии
                const professionRequest: ProfessionSelectionRequest = {
                  user_id: user?.id?.toString(),
                  selected_profession: selectedProfession,
                  user_role: selectedRole || undefined,
                  user_goal: selectedGoal,
                  timestamp: new Date().toISOString()
                }
                
                const logResponse = await logProfessionSelection(professionRequest)
                if (logResponse?.session_id) {
                  setSessionId(logResponse.session_id)
                  console.log('✅ Профессия залогирована, session_id:', logResponse.session_id)
                }
                
                setCurrentScreen("main")
              }
            }}
            disabled={!selectedProfession}
            className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-0 shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300"
          >
            <span className="mr-2">Продолжить</span>
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    )
  } else if (currentScreen === "advice" && careerAdvice) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute bottom-40 right-10 w-40 h-40 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full blur-3xl opacity-20"></div>
        </div>

        <div className="max-w-sm mx-auto pt-8 relative z-10">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-xl">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-3">
              Ваш карьерный совет
            </h1>
            <p className="text-gray-300 text-lg">Персональные рекомендации</p>
          </div>

          <div className="space-y-6 mb-8">
            {/* Основной совет */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 border">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-white mb-3">💡 Главный совет</h3>
                <p className="text-gray-200 leading-relaxed">{careerAdvice.advice}</p>
              </CardContent>
            </Card>

            {/* Рекомендации */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 border">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-white mb-3">🎯 Рекомендации</h3>
                <div className="space-y-2">
                  {careerAdvice.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                      <p className="text-gray-200 text-sm">{rec}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Следующие шаги */}
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 border">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-white mb-3">🚀 Следующие шаги</h3>
                <div className="space-y-3">
                  {careerAdvice.next_steps.map((step, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold">{index + 1}</span>
                      </div>
                      <p className="text-gray-200 text-sm">{step}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <Button
            onClick={() => setCurrentScreen("main")}
            className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 border-0 shadow-2xl shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300"
          >
            <span className="mr-2">Вернуться к главной</span>
            <Home className="w-5 h-5" />
          </Button>
        </div>
      </div>
    )
  } else if (currentScreen === "resume") {
    console.log('🎯 РЕНДЕРИМ ЭКРАН РЕЗЮМЕ!')
    return (
      <ResumeImprovement 
        onBack={() => {
          hapticFeedback.impact('light')
          setCurrentScreen("goals")
        }}
        selectedRole={selectedRole}
        selectedGoal={selectedGoal}
        selectedProfession={selectedProfession}
      />
    )
  } else if (currentScreen === "main") {
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
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-white">{userName}</h2>
                <p className="text-gray-300 text-sm capitalize">{selectedRole === "student" ? "Студент" : "Профессионал"}</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm font-semibold">4.9</span>
                </div>
                <p className="text-gray-400 text-xs">Рейтинг</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-sm mx-auto p-6">
          {/* Selected Goal Card */}
          <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Ваша цель</h3>
                  <p className="text-sm text-gray-600">{selectedGoal}</p>
                </div>
              </div>
              <Button
                onClick={handleGetCareerAdvice}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white border-0 shadow-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Получаем совет...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Получить карьерный совет
                  </>
                )}
              </Button>
              {error && (
                <p className="text-red-600 text-sm mt-2 text-center">{error}</p>
              )}
            </CardContent>
          </Card>

          {/* Additional Services */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Дополнительные услуги</h3>
            <div className="space-y-3">
              {getFilteredAdditionalServices().map((service, index) => (
                <Card 
                  key={index} 
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => {
                    if (service.title === "Подбор подходящих вакансий") {
                      hapticFeedback.impact('light')
                      setCurrentScreen("profession")
                    }
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{service.icon}</span>
                        <div>
                          <h4 className="font-medium text-gray-900">{service.title}</h4>
                          {service.premium && (
                            <span className="inline-flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full mt-1">
                              <Crown className="w-3 h-3" />
                              Premium
                            </span>
                          )}
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
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
          <div className="max-w-sm mx-auto px-6 py-4">
            <div className="flex justify-around">
              <Button variant="ghost" className="flex-col h-auto py-3 px-6 bg-blue-50 text-blue-600 rounded-2xl">
                <Home className="w-6 h-6 mb-1" />
                <span className="text-xs">Главная</span>
              </Button>
              <Button variant="ghost" className="flex-col h-auto py-3 px-6 hover:bg-gray-50 rounded-2xl">
                <TrendingUp className="w-6 h-6 mb-1 text-gray-400" />
                <span className="text-xs text-gray-400">Статистика</span>
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
  } else if (currentScreen === "resume") {
    return (
      <ResumeImprovement 
        onBack={() => setCurrentScreen("goals")}
        selectedRole={selectedRole}
        selectedGoal={selectedGoal}
        selectedProfession={selectedProfession}
        sessionId={sessionId}
      />
    )
  }

  // Показываем загрузку пока состояние не инициализировано
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-amber-500/25">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Загрузка...</h2>
          <p className="text-gray-300">Восстанавливаем ваше состояние</p>
        </div>
      </div>
    )
  }

  // Fallback - не должно происходить
  return null
}
