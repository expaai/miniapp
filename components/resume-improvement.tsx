"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  ArrowLeft,
  Upload,
  FileText,
  CheckCircle,
  Lightbulb,
  TrendingUp,
  ExternalLink,
  MapPin,
  DollarSign,
  Sparkles,
  Target,
  Users,
  Award,
} from "lucide-react"

interface ResumeImprovementProps {
  onBack: () => void
}

type Step = "instruction" | "upload" | "processing" | "results"

const professions = [
  "Frontend разработчик",
  "Backend разработчик",
  "Product Manager",
  "UX/UI Designer",
  "Data Scientist",
  "DevOps Engineer",
  "Marketing Manager",
  "Sales Manager",
]

const interestingFacts = [
  {
    title: "Знали ли вы?",
    text: "Рекрутеры тратят в среднем 6 секунд на первичный просмотр резюме. Важно сделать его максимально читаемым!",
    icon: "⏱️",
  },
  {
    title: "Интересный факт",
    text: "Резюме с фотографией получают на 40% больше откликов, но только в определенных сферах деятельности.",
    icon: "📸",
  },
  {
    title: "Статистика",
    text: "Кандидаты с опытом работы в стартапах получают на 25% больше предложений от IT-компаний.",
    icon: "🚀",
  },
  {
    title: "Совет",
    text: "Использование ключевых слов из описания вакансии увеличивает шансы прохождения ATS на 60%.",
    icon: "🎯",
  },
]

const mockJobs = [
  {
    title: "Senior Frontend Developer",
    company: "Яндекс",
    location: "Москва",
    salary: "300-400к ₽",
    match: 95,
  },
  {
    title: "React Developer",
    company: "Сбер",
    location: "Санкт-Петербург",
    salary: "250-350к ₽",
    match: 88,
  },
  {
    title: "Frontend Engineer",
    company: "Тинькофф",
    location: "Москва",
    salary: "280-380к ₽",
    match: 92,
  },
  {
    title: "UI Developer",
    company: "ВКонтакте",
    location: "Санкт-Петербург",
    salary: "250-350к ₽",
    match: 82,
  },
]

export default function ResumeImprovement({ onBack }: ResumeImprovementProps) {
  console.log('🚀 КОМПОНЕНТ RESUMEIMPROVEMENT ЗАГРУЖЕН!')
  const [currentStep, setCurrentStep] = useState<Step>("instruction")
  const [selectedProfession, setSelectedProfession] = useState("")
  const [customProfession, setCustomProfession] = useState("")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [currentFactIndex, setCurrentFactIndex] = useState(0)
  const [jobUrl, setJobUrl] = useState("")
  
  console.log('📍 Current step:', currentStep)
  console.log('📊 Все состояния:', { currentStep, selectedProfession, customProfession, uploadedFile })

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFactIndex((prev) => (prev + 1) % interestingFacts.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const files = event.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      if (file.type === 'application/pdf' || 
            file.type === 'application/msword' || 
            file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
            file.type === 'text/plain') {
        setUploadedFile(file)
      }
    }
  }

  const triggerFileInput = () => {
    const fileInput = document.getElementById('file-input') as HTMLInputElement
    if (fileInput) {
      fileInput.click()
    }
  }

  const handleNext = () => {
    if (currentStep === "instruction") {
      setCurrentStep("upload")
    } else if (currentStep === "upload") {
      setCurrentStep("processing")
      // Simulate processing
      setTimeout(() => {
        setCurrentStep("results")
      }, 3000)
    }
  }

  const canProceed = () => {
    if (currentStep === "instruction") {
      return selectedProfession !== "" || customProfession.trim() !== ""
    }
    if (currentStep === "upload") {
      return uploadedFile !== null
    }
    return false
  }

  console.log('📋 Текущий шаг:', currentStep)
  
  if (currentStep === "instruction") {
    console.log('📝 РЕНДЕРИМ ЭКРАН ИНСТРУКЦИЙ')
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-purple-700 text-white p-4">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8 pt-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-xl font-semibold">Улучшить резюме</h1>
          </div>

          {/* How it works card */}
          <Card className="bg-gradient-to-r from-blue-500 to-purple-600 border-0 mb-6 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="bg-white/20 rounded-full p-2">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">Как это работает</h3>
                  <p className="text-white/90 text-sm leading-relaxed">
                    Загрузите свое резюме, и мы разберем его по лучшим методикам. Вы получите
                    персональные рекомендации для улучшения.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profession selection */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-5 w-5 text-white" />
              <h3 className="font-semibold text-white">Выберите профессию</h3>
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4">
              {professions.map((profession) => (
                <Button
                  key={profession}
                  variant={selectedProfession === profession ? "secondary" : "outline"}
                  className={`h-auto p-3 text-left justify-start text-sm ${
                    selectedProfession === profession
                      ? "bg-white text-purple-600 hover:bg-white/90 shadow-md"
                      : "bg-white/20 text-white border-white/40 hover:bg-white/30 backdrop-blur-sm"
                  }`}
                  onClick={() => {
                    setSelectedProfession(profession)
                    setCustomProfession("")
                  }}
                >
                  {profession}
                </Button>
              ))}
            </div>

            <Input
              placeholder="Или напишите свою профессию"
              value={customProfession}
              onChange={(e) => {
                setCustomProfession(e.target.value)
                setSelectedProfession("")
              }}
              className="bg-white/20 border-white/40 text-white placeholder:text-white/70 backdrop-blur-sm"
            />
          </div>

          {/* Job URL input */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <ExternalLink className="h-5 w-5 text-white" />
              <h3 className="font-semibold text-white">Ссылка на вакансию</h3>
              <Badge variant="secondary" className="bg-white/20 text-white text-xs">
                Опционально
              </Badge>
            </div>
            <Input
              placeholder="Или вставьте ссылку на вакансию"
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
              className="bg-white/20 border-white/40 text-white placeholder:text-white/70 backdrop-blur-sm"
            />
            <p className="text-white/60 text-xs mt-2">
              Мы адаптируем рекомендации под конкретную вакансию
            </p>
          </div>

          {/* Continue button */}
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 font-semibold py-3 shadow-lg border-0"
          >
            Продолжить
          </Button>
        </div>
      </div>
    )
  }

  if (currentStep === "upload") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-purple-700 text-white p-4">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8 pt-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentStep("instruction")}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-xl font-semibold">Загрузить резюме</h1>
          </div>

          {/* Upload area */}
          <div className="mb-8">
            <input
                id="file-input"
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileUpload}
                className="hidden"
              />
            <div 
              className="border-2 border-dashed border-white/40 rounded-lg p-8 text-center cursor-pointer hover:border-white/60 transition-colors backdrop-blur-sm bg-white/5"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={triggerFileInput}
            >
              <div className="bg-blue-500/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Upload className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-white mb-2">Загрузите резюме</h3>
              <p className="text-white/70 text-sm mb-4">
                Перетащите файл сюда или выберите с устройства
              </p>
              <p className="text-white/60 text-xs mb-4">
                  Поддерживаются форматы: PDF, DOC, DOCX, TXT
                </p>
              <Button 
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 border-0 shadow-lg"
                onClick={(e) => {
                  e.stopPropagation()
                  triggerFileInput()
                }}
              >
                Выбрать файл
              </Button>
            </div>

            {uploadedFile && (
              <div className="mt-4 p-4 bg-white/20 rounded-lg backdrop-blur-sm border border-white/30">
                <div className="flex items-center gap-3">
                  <div className="bg-green-500/20 rounded-full p-2">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-white">{uploadedFile.name}</p>
                    <p className="text-white/70 text-sm">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <FileText className="h-5 w-5 text-white/60" />
                </div>
              </div>
            )}
          </div>

          {/* Continue button */}
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 font-semibold py-3 shadow-lg border-0"
          >
            Анализировать резюме
          </Button>
        </div>
      </div>
    )
  }

  if (currentStep === "processing") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-purple-700 text-white p-4">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8 pt-4">
            <div className="w-10 h-10" /> {/* Spacer */}
            <h1 className="text-xl font-semibold">Анализируем резюме</h1>
          </div>

          {/* Processing animation */}
          <div className="text-center mb-8">
            <div className="relative w-32 h-32 mx-auto mb-6">
              <div className="absolute inset-0 border-4 border-white/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-t-4 border-white border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-4 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center">
                34%
              </div>
            </div>
            <h2 className="text-xl font-semibold mb-2">Анализируем резюме</h2>
            <p className="text-white/80">Это займет несколько секунд...</p>
          </div>

          {/* Interesting facts */}
          <Card className="bg-white/20 backdrop-blur-sm border-white/30 shadow-lg">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="bg-white/20 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <div className="text-2xl">{interestingFacts[currentFactIndex].icon}</div>
                </div>
                <h3 className="font-semibold text-white mb-2">
                  {interestingFacts[currentFactIndex].title}
                </h3>
                <p className="text-white/90 text-sm leading-relaxed">
                  {interestingFacts[currentFactIndex].text}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (currentStep === "results") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-purple-700 text-white p-4">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6 pt-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-xl font-semibold">Результаты анализа</h1>
          </div>

          {/* Score */}
          <Card className="bg-gradient-to-r from-green-500 to-emerald-600 border-0 mb-6 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <CheckCircle className="h-6 w-6 text-white" />
                <span className="text-lg font-semibold text-white">Основные изменения</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-white/90">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">Добавлены ключевые навыки для Frontend разработчика</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">Улучшено описание достижений с конкретными цифрами</span>
                </div>
                <div className="flex items-center gap-2 text-white/90">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">Оптимизирована структура для ATS-систем</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <div className="mb-6">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Рекомендации
            </h3>
            <div className="space-y-3">
              <Card className="bg-white/20 backdrop-blur-sm border-white/30 shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-orange-500/20 rounded-full p-2">
                      <Lightbulb className="h-4 w-4 text-orange-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white mb-1">Технические навыки</h4>
                      <p className="text-white/80 text-sm">
                        Добавьте опыт работы с TypeScript и Next.js - эти технологии очень востребованы
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/20 backdrop-blur-sm border-white/30 shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-purple-500/20 rounded-full p-2">
                      <TrendingUp className="h-4 w-4 text-purple-400" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white mb-1">Проекты</h4>
                      <p className="text-white/80 text-sm">
                        Опишите 2-3 ключевых проекта с указанием технологий и результатов
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Additional tips */}
          <div className="mb-6">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Дополнительные советы
            </h3>
            <Card className="bg-white/20 backdrop-blur-sm border-white/30 shadow-lg">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-500/20 rounded-full p-2">
                    <Users className="h-4 w-4 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white mb-1">Создайте профиль на LinkedIn</h4>
                    <p className="text-white/80 text-sm mb-3">
                      Добавьте портфолио на GitHub
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Job matches */}
          <div className="mb-6">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Users className="h-5 w-5" />
              Подходящие вакансии
            </h3>
            <div className="space-y-3">
              <Card className="bg-white/20 backdrop-blur-sm border-white/30 shadow-lg">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium text-white">Senior Frontend Developer</h4>
                      <p className="text-white/80 text-sm">Яндекс</p>
                    </div>
                    <Badge className="bg-green-500 text-white font-semibold">
                      95% совпадение
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-white/70 text-sm">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      Москва
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      200-300к ₽
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 font-semibold py-3 shadow-lg border-0">
              Скачать улучшенное резюме
            </Button>
            <Button
              variant="outline"
              className="w-full border-white/40 text-gray-800 hover:bg-white/20 hover:text-white backdrop-blur-sm"
              onClick={() => setCurrentStep("instruction")}
            >
              Анализировать другое резюме
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Fallback to instruction step if currentStep is invalid
  console.log('⚠️ НЕИЗВЕСТНЫЙ ШАГ, ВОЗВРАЩАЕМСЯ К ИНСТРУКЦИЯМ')
  setCurrentStep("instruction")
  return null
}