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
    text: "75% резюме отклоняются из-за грамматических ошибок. Всегда проверяйте текст перед отправкой!",
    icon: "✍️",
  },
  {
    title: "Совет дня",
    text: "Используйте числа и конкретные достижения. 'Увеличил продажи на 25%' звучит лучше чем 'улучшил показатели'.",
    icon: "📊",
  },
]

const mockJobs = [
  {
    title: "Senior Frontend Developer",
    company: "Яндекс",
    location: "Москва",
    salary: "200-300к ₽",
    match: 95,
  },
  {
    title: "React Developer",
    company: "Сбер",
    location: "Санкт-Петербург",
    salary: "180-250к ₽",
    match: 88,
  },
  {
    title: "Frontend Team Lead",
    company: "Тинькофф",
    location: "Москва",
    salary: "250-350к ₽",
    match: 82,
  },
]

export default function ResumeImprovement() {
  const [currentStep, setCurrentStep] = useState<Step>("instruction")
  const [selectedProfession, setSelectedProfession] = useState("")
  const [customProfession, setCustomProfession] = useState("")
  const [jobUrl, setJobUrl] = useState("")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [currentFact, setCurrentFact] = useState(0)
  const [progress, setProgress] = useState(0)

  // Simulate processing
  useEffect(() => {
    if (currentStep === "processing") {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setTimeout(() => setCurrentStep("results"), 500)
            return 100
          }
          return prev + 2
        })
      }, 100)

      const factInterval = setInterval(() => {
        setCurrentFact((prev) => (prev + 1) % interestingFacts.length)
      }, 3000)

      return () => {
        clearInterval(interval)
        clearInterval(factInterval)
      }
    }
  }, [currentStep])

  const handleFileUpload = (file: File) => {
    setUploadedFile(file)
    setCurrentStep("processing")
    setProgress(0)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    if (files[0]) {
      handleFileUpload(files[0])
    }
  }

  if (currentStep === "instruction") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-purple-900 shadow-2xl">
          <div className="max-w-sm mx-auto p-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-lg font-bold text-white">Улучшить резюме</h1>
            </div>
          </div>
        </div>

        <div className="max-w-sm mx-auto p-4 space-y-6">
          {/* Instructions */}
          <Card className="border-0 bg-gradient-to-r from-blue-600 to-purple-600 shadow-2xl shadow-blue-500/25">
            <CardContent className="p-6 text-white">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-bold text-lg mb-2">Как это работает</h2>
                  <p className="text-blue-100 leading-relaxed">
                    Загрузите свое резюме, и мы разберем его по лучшим методикам. Вы получите персональные рекомендации
                    для улучшения.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profession Selection */}
          <Card className="shadow-xl">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <Target className="w-5 h-5 text-amber-500 mr-2" />
                Выберите профессию
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  {professions.map((profession) => (
                    <Badge
                      key={profession}
                      variant={selectedProfession === profession ? "default" : "outline"}
                      className={`p-3 cursor-pointer text-center justify-center h-auto ${
                        selectedProfession === profession ? "bg-blue-500 hover:bg-blue-600" : "hover:bg-gray-50"
                      }`}
                      onClick={() => setSelectedProfession(profession)}
                    >
                      {profession}
                    </Badge>
                  ))}
                </div>

                <div className="space-y-3">
                  <Input
                    placeholder="Или напишите свою профессию"
                    value={customProfession}
                    onChange={(e) => setCustomProfession(e.target.value)}
                    className="border-gray-200"
                  />

                  <Input
                    placeholder="Или вставьте ссылку на вакансию"
                    value={jobUrl}
                    onChange={(e) => setJobUrl(e.target.value)}
                    className="border-gray-200"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Button
            onClick={() => setCurrentStep("upload")}
            disabled={!selectedProfession && !customProfession && !jobUrl}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            Продолжить
          </Button>
        </div>
      </div>
    )
  }

  if (currentStep === "upload") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-purple-900 shadow-2xl">
          <div className="max-w-sm mx-auto p-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10"
                onClick={() => setCurrentStep("instruction")}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-lg font-bold text-white">Загрузить резюме</h1>
            </div>
          </div>
        </div>

        <div className="max-w-sm mx-auto p-4">
          {/* Selected Profession */}
          <Card className="mb-6 border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="font-medium">{selectedProfession || customProfession || "Вакансия по ссылке"}</span>
              </div>
            </CardContent>
          </Card>

          {/* Upload Zone */}
          <Card
            className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors cursor-pointer"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Загрузите резюме</h3>
              <p className="text-gray-600 mb-4">Перетащите файл сюда или выберите с устройства</p>
              <p className="text-sm text-gray-500 mb-4">Поддерживаются форматы: PDF, DOC, DOCX</p>

              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <FileText className="w-4 h-4 mr-2" />
                  Выбрать файл
                </Button>
              </label>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (currentStep === "processing") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-sm mx-auto text-center">
          {/* Progress Circle */}
          <div className="relative w-32 h-32 mx-auto mb-8">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="url(#gradient)"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 50}`}
                strokeDashoffset={`${2 * Math.PI * 50 * (1 - progress / 100)}`}
                className="transition-all duration-300"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">{progress}%</span>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">Анализируем резюме</h2>
          <p className="text-purple-200 mb-8">Это займет несколько секунд...</p>

          {/* Interesting Fact Card */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 transition-all duration-500">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-3">{interestingFacts[currentFact].icon}</div>
              <h3 className="font-bold text-white mb-2">{interestingFacts[currentFact].title}</h3>
              <p className="text-gray-200 text-sm leading-relaxed">{interestingFacts[currentFact].text}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (currentStep === "results") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-purple-900 shadow-2xl">
          <div className="max-w-sm mx-auto p-4">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10"
                onClick={() => setCurrentStep("instruction")}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="text-lg font-bold text-white">Результаты анализа</h1>
            </div>
          </div>
        </div>

        <div className="max-w-sm mx-auto p-4 space-y-6 pb-20">
          {/* Main Changes */}
          <Card className="border-0 bg-gradient-to-r from-emerald-500 to-teal-600 shadow-2xl shadow-emerald-500/25">
            <CardContent className="p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <Award className="w-6 h-6" />
                <h2 className="font-bold text-lg">Основные изменения</h2>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span className="text-emerald-100">Добавлены ключевые навыки для Frontend разработчика</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span className="text-emerald-100">Улучшено описание достижений с конкретными цифрами</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span className="text-emerald-100">Оптимизирована структура для ATS-систем</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className="shadow-xl">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <Lightbulb className="w-5 h-5 text-amber-500 mr-2" />
                Рекомендации
              </h3>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-xl">
                  <h4 className="font-semibold text-blue-900 mb-2">Технические навыки</h4>
                  <p className="text-blue-700 text-sm">
                    Добавьте опыт работы с TypeScript и Next.js - эти технологии очень востребованы
                  </p>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl">
                  <h4 className="font-semibold text-purple-900 mb-2">Проекты</h4>
                  <p className="text-purple-700 text-sm">
                    Опишите 2-3 ключевых проекта с указанием технологий и результатов
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Tips */}
          <Card className="shadow-xl">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 text-green-500 mr-2" />
                Дополнительные советы
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Создайте профиль на LinkedIn</span>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Добавьте портфолио на GitHub</span>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Job Matches */}
          <Card className="shadow-xl">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center">
                <Users className="w-5 h-5 text-blue-500 mr-2" />
                Подходящие вакансии
              </h3>
              <div className="space-y-3">
                {mockJobs.map((job, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-xl hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">{job.title}</h4>
                        <p className="text-gray-600 text-sm">{job.company}</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">{job.match}% совпадение</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {job.salary}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Button className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            Скачать улучшенное резюме
          </Button>
        </div>
      </div>
    )
  }

  return null
}
