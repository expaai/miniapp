"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useAPI, JobMatchingRequest } from "@/hooks/use-api"

// Конфигурация API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.expa-ai.ru'
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
  ChevronDown,
  Briefcase,
} from "lucide-react"

interface ResumeImprovementProps {
  onBack: () => void
  selectedRole?: 'student' | 'professional' | null
  selectedGoal?: string
  selectedProfession?: string
  sessionId?: string
}

type Step = "instruction" | "upload" | "processing" | "results"

// Основной список профессий для кнопок (10 штук)
const professions = [
  "AI/ML инженер",
  "DevOps инженер",
  "Product Manager",
  "Специалист по кибербезопасности",
  "Backend-разработчик",
  "Frontend-разработчик",
  "Product Marketing",
  "Data Science",
  "Системный аналитик",
  "QA инженер",
]

// Полный справочник профессий для автокомплита
const allProfessions = [
  // Основные IT профессии
  "AI/ML инженер",
  "DevOps инженер",
  "Product Manager",
  "Специалист по кибербезопасности",
  "Backend-разработчик",
  "Frontend-разработчик",
  "Product Marketing",
  "Data Science",
  "Системный аналитик",
  "QA инженер",
  "Fullstack-разработчик",
  "Mobile-разработчик",
  "iOS-разработчик",
  "Android-разработчик",
  "React Native разработчик",
  "Flutter разработчик",
  "Game Developer",
  "Unity разработчик",
  "Unreal Engine разработчик",
  "Blockchain разработчик",
  "Smart Contract разработчик",
  "Web3 разработчик",
  "Системный администратор",
  "Сетевой администратор",
  "Database Administrator (DBA)",
  "Cloud Engineer",
  "AWS Engineer",
  "Azure Engineer",
  "Google Cloud Engineer",
  "Site Reliability Engineer (SRE)",
  "Platform Engineer",
  "Infrastructure Engineer",
  "Security Engineer",
  "Penetration Tester",
  "Information Security Analyst",
  "CISO (Chief Information Security Officer)",
  "Data Engineer",
  "Data Analyst",
  "Business Intelligence Analyst",
  "Machine Learning Engineer",
  "Deep Learning Engineer",
  "Computer Vision Engineer",
  "NLP Engineer",
  "Research Scientist",
  "UX/UI Designer",
  "UX Designer",
  "UI Designer",
  "Product Designer",
  "Interaction Designer",
  "Service Designer",
  "Design System Designer",
  "Technical Writer",
  "Documentation Specialist",
  "Business Analyst",
  "Technical Analyst",
  "Requirements Analyst",
  "Scrum Master",
  "Agile Coach",
  "Project Manager",
  "Technical Project Manager",
  "Program Manager",
  "Release Manager",
  "Product Owner",
  "Product Marketing Manager",
  "Growth Product Manager",
  "Technical Product Manager",
  "API Product Manager",
  "Platform Product Manager",
  "Sales Engineer",
  "Solutions Engineer",
  "Customer Success Engineer",
  "Technical Support Engineer",
  "Implementation Engineer",
  "Integration Engineer",
  "Test Engineer",
  "Automation QA Engineer",
  "Manual QA Engineer",
  "Performance Test Engineer",
  "Security Test Engineer",
  "QA Lead",
  "Test Manager",
  "Software Architect",
  "Solution Architect",
  "Enterprise Architect",
  "Cloud Architect",
  "Security Architect",
  "Data Architect",
  "API Architect",
  "Microservices Architect",
  // C-level и руководящие позиции
  "CTO (Chief Technology Officer)",
  "CPO (Chief Product Officer)",
  "CDO (Chief Data Officer)",
  "CIO (Chief Information Officer)",
  "CISO (Chief Information Security Officer)",
  "Chief Digital Officer",
  "Chief Innovation Officer",
  "Chief AI Officer",
  "Технический директор",
  "Директор по продукту",
  "Директор по разработке",
  "Директор по информационным технологиям",
  "Директор по цифровой трансформации",
  "Директор по инновациям",
  "Директор по данным",
  "Директор по информационной безопасности",
  "Руководитель отдела разработки",
  "Руководитель IT-отдела",
  "Руководитель отдела продукта",
  "Руководитель отдела аналитики",
  "Руководитель отдела тестирования",
  "Руководитель отдела DevOps",
  "Руководитель отдела безопасности",
  "Head of Engineering",
  "Head of Product",
  "Head of Data",
  "Head of Security",
  "Head of DevOps",
  "Head of QA",
  "Head of Design",
  "Head of Analytics",
  "VP of Engineering",
  "VP of Product",
  "VP of Technology",
  "VP of Data",
  "Engineering Manager",
  "Product Manager",
  "Data Science Manager",
  "Security Manager",
  "QA Manager",
  "DevOps Manager",
  "Platform Manager",
  "Technical Lead",
  "Team Lead",
  "Squad Lead",
  "Chapter Lead",
  "Tribe Lead",
  "Principal Engineer",
  "Staff Engineer",
  "Distinguished Engineer",
  "Fellow Engineer",
  "Архитектор решений",
  "Ведущий разработчик",
  "Старший разработчик",
  "Ментор разработчиков",
  // Специализированные роли
  "Consultant",
  "Technical Consultant",
  "IT Consultant",
  "Digital Consultant",
  "Transformation Consultant",
  "Freelancer",
  "Independent Contractor",
  "Entrepreneur",
  "Startup Founder",
  "Tech Entrepreneur",
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
  {
    title: "Факт о карьере",
    text: "IT-специалисты меняют работу в среднем каждые 2-3 года, что считается нормой в индустрии.",
    icon: "💼",
  },
  {
    title: "Зарплатная статистика",
    text: "Разработчики с опытом работы с облачными технологиями зарабатывают на 30% больше.",
    icon: "☁️",
  },
  {
    title: "Тренд рынка",
    text: "Спрос на DevOps-инженеров вырос на 75% за последние 2 года.",
    icon: "📈",
  },
  {
    title: "Интересно знать",
    text: "Резюме на английском языке получают на 50% больше откликов в международных компаниях.",
    icon: "🌍",
  },
  {
    title: "Факт о навыках",
    text: "Soft skills упоминаются в 92% вакансий для руководящих позиций в IT.",
    icon: "🤝",
  },
  {
    title: "Статистика собеседований",
    text: "Кандидаты с GitHub-портфолио проходят техническое собеседование в 3 раза чаще.",
    icon: "💻",
  },
  {
    title: "Карьерный совет",
    text: "Участие в open-source проектах повышает шансы на трудоустройство на 40%.",
    icon: "🔓",
  },
  {
    title: "Тренд образования",
    text: "65% IT-специалистов продолжают обучение и получают сертификации ежегодно.",
    icon: "🎓",
  },
  {
    title: "Факт о удаленке",
    text: "85% IT-компаний предлагают гибридный или полностью удаленный формат работы.",
    icon: "🏠",
  },
  {
    title: "Интересная статистика",
    text: "Женщины в IT зарабатывают в среднем на 15% меньше мужчин, но разрыв сокращается.",
    icon: "👩‍💻",
  },
  {
    title: "Факт о стартапах",
    text: "Работа в стартапе дает опыт, эквивалентный 3-5 годам в крупной корпорации.",
    icon: "⚙️",
  },
  {
    title: "Тренд технологий",
    text: "Знание Kubernetes увеличивает зарплату DevOps-инженера на 25-40%.",
    icon: "📊",
  },
  {
    title: "Карьерный факт",
    text: "Product Manager'ы с техническим бэкграундом зарабатывают на 20% больше.",
    icon: "💼",
  },
  {
    title: "Статистика найма",
    text: "Компании тратят в среднем 23 дня на поиск и найм одного IT-специалиста.",
    icon: "📅",
  },
  {
    title: "Интересный тренд",
    text: "Спрос на специалистов по кибербезопасности растет на 35% ежегодно.",
    icon: "🔒",
  },
  {
    title: "Факт о обучении",
    text: "Bootcamp-выпускники находят работу в среднем за 6 месяцев после окончания.",
    icon: "⚡",
  },
  {
    title: "Зарплатный факт",
    text: "Архитекторы решений входят в топ-3 самых высокооплачиваемых IT-ролей.",
    icon: "🏗️",
  },
  {
    title: "Статистика роста",
    text: "Data Science остается одной из самых быстрорастущих профессий (+22% в год).",
    icon: "📈",
  },
  {
    title: "Карьерный совет",
    text: "Ментворство ускоряет карьерный рост на 50% по сравнению с самостоятельным развитием.",
    icon: "👨‍🏫",
  },
  {
    title: "Факт о навыках",
    text: "Знание Python остается самым востребованным навыком в Data Science и ML.",
    icon: "🐍",
  },
  {
    title: "Интересная статистика",
    text: "Agile-сертификации увеличивают шансы на получение руководящей роли на 60%.",
    icon: "🔄",
  },
  {
    title: "Тренд рынка",
    text: "Компании готовы платить премию до 40% за опыт работы с микросервисами.",
    icon: "🔧",
  },
  {
    title: "Факт о собеседованиях",
    text: "Технические собеседования в среднем длятся 45-90 минут в зависимости от уровня.",
    icon: "⏰",
  },
  {
    title: "Карьерная статистика",
    text: "QA-инженеры с опытом автоматизации зарабатывают на 35% больше мануальных тестеров.",
    icon: "🤖",
  },
  {
    title: "Интересный факт",
    text: "Код-ревью улучшает качество кода на 60% и является стандартной практикой в 95% команд.",
    icon: "👀",
  },
  {
    title: "Тренд образования",
    text: "Онлайн-курсы по программированию прошли более 50 миллионов человек за последний год.",
    icon: "💻",
  },
  {
    title: "Факт о продуктивности",
    text: "Разработчики тратят только 30% времени на написание кода, остальное - на планирование и отладку.",
    icon: "⚖️",
  },
  {
    title: "Статистика выгорания",
    text: "42% IT-специалистов испытывают профессиональное выгорание, но компании активно с этим борются.",
    icon: "🔥",
  },
  {
    title: "Карьерный факт",
    text: "Переход из разработки в менеджмент увеличивает зарплату на 40-60% в течение 2-3 лет.",
    icon: "📈",
  },
  {
    title: "Интересная тенденция",
    text: "No-code/Low-code платформы создают новые роли, но не заменяют традиционную разработку.",
    icon: "🎨",
  },
  {
    title: "Факт о командах",
    text: "Самые продуктивные команды состоят из 5-9 человек и используют Scrum или Kanban.",
    icon: "👥",
  },
  {
    title: "Статистика инноваций",
    text: "ИИ и машинное обучение интегрируются в 78% новых IT-продуктов.",
    icon: "🧠",
  },
  {
    title: "Карьерный совет",
    text: "Нетворкинг через профессиональные конференции приводит к новой работе в 35% случаев.",
    icon: "🤝",
  },
  {
    title: "Факт о технологиях",
    text: "React остается самым популярным фронтенд-фреймворком среди разработчиков.",
    icon: "⚛️",
  },
  {
    title: "Интересная статистика",
    text: "Компании с разнообразными командами показывают на 35% лучшие финансовые результаты.",
    icon: "🌈",
  },
  {
    title: "Тренд безопасности",
    text: "DevSecOps становится стандартом - безопасность интегрируется в процесс разработки с самого начала.",
    icon: "🛡️",
  },
  {
    title: "Факт о росте",
    text: "Junior разработчики достигают Middle уровня в среднем за 2-3 года активной практики.",
    icon: "📚",
  },
  {
    title: "Статистика собеседований",
    text: "Живое кодирование на собеседовании практикуют 89% IT-компаний для технических ролей.",
    icon: "💻",
  },
  {
    title: "Карьерный факт",
    text: "Специалисты с опытом работы в международных проектах получают на 45% больше предложений.",
    icon: "🌍",
  },
  {
    title: "Интересный тренд",
    text: "Blockchain-разработчики входят в топ-5 самых высокооплачиваемых IT-специальностей.",
    icon: "⛓️",
  },
  {
    title: "Факт о обучении",
    text: "Парное программирование ускоряет обучение новых разработчиков на 40%.",
    icon: "👫",
  },
  {
    title: "Статистика удержания",
    text: "Компании с хорошей инженерной культурой удерживают сотрудников на 50% дольше.",
    icon: "🏢",
  },
  {
    title: "Карьерный совет",
    text: "Регулярные 1-on-1 встречи с руководителем ускоряют карьерный рост на 25%.",
    icon: "💬",
  },
  {
    title: "Факт о будущем",
    text: "К 2030 году прогнозируется нехватка 85 миллионов IT-специалистов по всему миру.",
    icon: "🔮",
  },
  {
    title: "Интересная статистика",
    text: "Компании с техническим долгом тратят на 40% больше времени на разработку новых функций.",
    icon: "⚠️",
  },
  {
    title: "Тренд работы",
    text: "4-дневная рабочая неделя тестируется в 15% IT-компаний с положительными результатами.",
    icon: "📅",
  },
]

const getJobsForProfession = (profession: string, userRole?: 'student' | 'professional' | null, userGoal?: string) => {
  // Базовая карта вакансий
  const jobsMap: { [key: string]: any[] } = {
    'AI/ML инженер': [
      {
        id: 1,
        title: "Senior ML Engineer",
        company: "Яндекс",
        location: "Москва",
        salary: "300 000 - 450 000 ₽",
        type: "Полная занятость",
        description: "Разработка и внедрение ML-моделей для поисковых алгоритмов"
      },
      {
        id: 2,
        title: "AI Research Scientist",
        company: "Сбер",
        location: "Санкт-Петербург",
        salary: "250 000 - 400 000 ₽",
        type: "Полная занятость",
        description: "Исследования в области искусственного интеллекта и NLP"
      },
      {
        id: 3,
        title: "Machine Learning Engineer",
        company: "VK",
        location: "Москва",
        salary: "280 000 - 380 000 ₽",
        type: "Полная занятость",
        description: "Создание рекомендательных систем и алгоритмов персонализации"
      }
    ],
    'DevOps': [
      {
        id: 1,
        title: "Senior DevOps Engineer",
        company: "Тинькофф",
        location: "Москва",
        salary: "250 000 - 350 000 ₽",
        type: "Полная занятость",
        description: "Автоматизация CI/CD процессов и управление облачной инфраструктурой"
      },
      {
        id: 2,
        title: "Platform Engineer",
        company: "Ozon",
        location: "Москва",
        salary: "220 000 - 320 000 ₽",
        type: "Полная занятость",
        description: "Разработка и поддержка платформенных решений на Kubernetes"
      },
      {
        id: 3,
        title: "Site Reliability Engineer",
        company: "Авито",
        location: "Москва",
        salary: "200 000 - 300 000 ₽",
        type: "Полная занятость",
        description: "Обеспечение надежности и производительности высоконагруженных систем"
      }
    ],
    'Product manager': [
      {
        id: 1,
        title: "Senior Product Manager",
        company: "Wildberries",
        location: "Москва",
        salary: "200 000 - 300 000 ₽",
        type: "Полная занятость",
        description: "Управление продуктовой линейкой мобильного приложения"
      },
      {
        id: 2,
        title: "Product Owner",
        company: "Kaspersky",
        location: "Москва",
        salary: "180 000 - 280 000 ₽",
        type: "Полная занятость",
        description: "Развитие продуктов кибербезопасности для корпоративного сегмента"
      },
      {
        id: 3,
        title: "Lead Product Manager",
        company: "Мегафон",
        location: "Санкт-Петербург",
        salary: "220 000 - 320 000 ₽",
        type: "Полная занятость",
        description: "Стратегическое планирование и запуск новых цифровых продуктов"
      }
    ],
    'Backend-разработчик': [
      {
        id: 1,
        title: "Senior Backend Developer",
        company: "Яндекс",
        location: "Москва",
        salary: "250 000 - 400 000 ₽",
        type: "Полная занятость",
        description: "Разработка высоконагруженных сервисов на Go и Python"
      },
      {
        id: 2,
        title: "Java Developer",
        company: "Сбер",
        location: "Москва",
        salary: "200 000 - 320 000 ₽",
        type: "Полная занятость",
        description: "Разработка банковских систем и микросервисной архитектуры"
      },
      {
        id: 3,
        title: "Python Backend Engineer",
        company: "VK",
        location: "Санкт-Петербург",
        salary: "180 000 - 280 000 ₽",
        type: "Полная занятость",
        description: "Создание API для социальных сетей и мессенджеров"
      }
    ],
    'Frontend-разработчик': [
      {
        id: 1,
        title: "Senior Frontend Developer",
        company: "Тинькофф",
        location: "Москва",
        salary: "200 000 - 300 000 ₽",
        type: "Полная занятость",
        description: "Разработка современных веб-приложений на React и TypeScript"
      },
      {
        id: 2,
        title: "React Developer",
        company: "Ozon",
        location: "Москва",
        salary: "180 000 - 280 000 ₽",
        type: "Полная занятость",
        description: "Создание пользовательских интерфейсов для e-commerce платформы"
      },
      {
        id: 3,
        title: "Frontend Team Lead",
        company: "Авито",
        location: "Москва",
        salary: "250 000 - 350 000 ₽",
        type: "Полная занятость",
        description: "Техническое лидерство команды и архитектурные решения"
      }
    ]
  }
  
  // Возвращаем вакансии для конкретной профессии или общие IT вакансии
  return jobsMap[profession] || [
    {
      id: 1,
      title: "IT Специалист",
      company: "TechCorp",
      location: "Москва",
      salary: "150 000 - 250 000 ₽",
      type: "Полная занятость",
      description: "Работа в сфере информационных технологий"
    },
    {
      id: 2,
      title: "Software Engineer",
      company: "StartupXYZ",
      location: "Санкт-Петербург",
      salary: "120 000 - 200 000 ₽",
      type: "Полная занятость",
      description: "Разработка программного обеспечения"
    },
    {
      id: 3,
      title: "Technical Specialist",
      company: "InnovateTech",
      location: "Новосибирск",
      salary: "100 000 - 180 000 ₽",
      type: "Полная занятость",
      description: "Техническая поддержка и развитие IT-решений"
    }
  ]

  // Получаем базовые вакансии для профессии
  const baseJobs = jobsMap[profession] || jobsMap['Другое'] || []
  
  // Фильтруем и адаптируем вакансии под роль пользователя
  let filteredJobs = baseJobs.map(job => ({ ...job }))
  
  if (userRole === 'student') {
    // Для студентов показываем junior/intern позиции
    filteredJobs = filteredJobs.map(job => ({
      ...job,
      title: job.title.includes('Senior') ? job.title.replace('Senior', 'Junior') : 
             job.title.includes('Lead') ? job.title.replace('Lead', 'Junior') :
             job.title,
      salary: job.salary.replace(/\d+/g, (match: string) => {
        const num = parseInt(match)
        return Math.floor(num * 0.6).toString() // Снижаем зарплату на 40% для junior позиций
      }),
      description: job.description + ' (Позиция для начинающих специалистов)'
    }))
  } else if (userRole === 'professional') {
    // Для профессионалов показываем senior/lead позиции
    filteredJobs = filteredJobs.map(job => ({
      ...job,
      title: job.title.includes('Junior') ? job.title.replace('Junior', 'Senior') : 
             !job.title.includes('Senior') && !job.title.includes('Lead') ? 'Senior ' + job.title :
             job.title,
      salary: job.salary.replace(/\d+/g, (match: string) => {
        const num = parseInt(match)
        return Math.floor(num * 1.3).toString() // Увеличиваем зарплату на 30% для senior позиций
      }),
      description: job.description + ' (Позиция для опытных специалистов)'
    }))
  }
  
  return filteredJobs
}

export default function ResumeImprovement({ onBack, selectedRole, selectedGoal, selectedProfession, sessionId }: ResumeImprovementProps) {
  console.log('🚀 КОМПОНЕНТ RESUMEIMPROVEMENT ЗАГРУЖЕН!')
  console.log('🎯 Получены props:', { selectedRole, selectedGoal, selectedProfession, sessionId })
  const [currentStep, setCurrentStep] = useState<Step>("instruction")

  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [currentFactIndex, setCurrentFactIndex] = useState(0)
  const [jobUrl, setJobUrl] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<string | null>(null)
  const [apiJobs, setApiJobs] = useState<any[]>([])
  
  // Состояния для выбора профессии
  const [localSelectedProfession, setLocalSelectedProfession] = useState(selectedProfession || "")
  const [customProfession, setCustomProfession] = useState("")
  const [showCustomInput, setShowCustomInput] = useState(false)
  const [filteredProfessions, setFilteredProfessions] = useState<string[]>([])
  
  const { getJobMatches, logProfessionSelection, loading: apiLoading } = useAPI()
  
  // Обработчики для выбора профессии
  const handleProfessionSelect = async (profession: string) => {
    setLocalSelectedProfession(profession)
    setShowCustomInput(false)
    setCustomProfession("")
    
    // Логируем выбор профессии
    if (sessionId) {
      try {
        await logProfessionSelection({
          user_id: `user_${Date.now()}`,
          session_id: sessionId,
          profession: profession,
          user_role: selectedRole || 'professional',
          user_goal: selectedGoal || '',
          timestamp: new Date().toISOString()
        })
      } catch (error) {
        console.error('Failed to log profession selection:', error)
      }
    }
  }
  
  const handleCustomProfessionChange = (value: string) => {
    setCustomProfession(value)
    if (value.length > 0) {
      const filtered = allProfessions.filter(prof => 
        prof.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5)
      setFilteredProfessions(filtered)
    } else {
      setFilteredProfessions([])
    }
  }
  
  const handleCustomProfessionSubmit = async () => {
    if (customProfession.trim()) {
      await handleProfessionSelect(customProfession.trim())
    }
  }
  
  // Fetch jobs from API when component mounts
  useEffect(() => {
    const fetchJobs = async () => {
      const profession = localSelectedProfession || customProfession
      if (profession && sessionId) {
        try {
          const jobRequest: JobMatchingRequest = {
            user_id: `user_${Date.now()}`,
            session_id: sessionId,
            profession: profession,
            user_role: selectedRole || 'professional',
            user_goal: selectedGoal || '',
            timestamp: new Date().toISOString()
          }
          const response = await getJobMatches(jobRequest)
          setApiJobs(response.jobs || [])
        } catch (error) {
          console.error('Failed to fetch jobs:', error)
          // Fallback to hardcoded jobs if API fails
          setApiJobs(getJobsForProfession(profession, selectedRole, selectedGoal))
        }
      }
    }
    fetchJobs()
  }, [localSelectedProfession, customProfession, sessionId, selectedRole, selectedGoal, getJobMatches])
  
  console.log('📍 Current step:', currentStep)
  console.log('📊 Все состояния:', { currentStep, selectedProfession, uploadedFile, selectedRole, selectedGoal })

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFactIndex((prev) => (prev + 1) % interestingFacts.length)
    }, 5000) // Увеличено до 5 секунд
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

  const extractTextFromFile = async (file: File): Promise<string> => {
    console.log('🔥 Отправляем файл на сервер для обработки:', file.name, 'тип:', file.type, 'размер:', file.size, 'байт')
    
    try {
      // Создаем FormData для отправки файла
      const formData = new FormData()
      formData.append('file', file)
      
      // Отправляем файл на backend
      const response = await fetch(`${API_BASE_URL}/upload-resume`, {
        method: 'POST',
        body: formData
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || `Ошибка сервера: ${response.status}`)
      }
      
      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.message)
      }
      
      console.log('🔥 Текст успешно извлечен на сервере:', result.message)
      return result.extracted_text
      
    } catch (error) {
      console.error('🔥 ОШИБКА при обработке файла на сервере:', error)
      throw new Error(`Не удалось обработать файл: ${error.message}`)
    }
  }

  const formatAIResponse = (response: string): string => {
    // Улучшаем форматирование ответа ИИ
    let formatted = response
      // Добавляем эмодзи к заголовкам
      .replace(/Общее впечатление/g, '🎯 Общее впечатление')
      .replace(/Сильные стороны/g, '✅ Сильные стороны')
      .replace(/Области для улучшения/g, '🔧 Области для улучшения')
      .replace(/Предложения по переформулировке/g, '✏️ Предложения по переформулировке')
      .replace(/Адаптация под российский рынок/g, '🇷🇺 Адаптация под российский рынок')
      .replace(/Рекомендации по адаптации/g, '🎯 Рекомендации по адаптации')
      .replace(/Приоритетные изменения/g, '⚡ Приоритетные изменения')
      .replace(/Заключение/g, '🏆 Заключение')
      // Убираем лишние кавычки и скобки
      .replace(/"/g, '')
      .replace(/\[|\]/g, '')
      // Улучшаем форматирование списков
      .replace(/- /g, '• ')
      .replace(/\d+\. /g, (match) => `${match.charAt(0)}. `)
    
    return formatted
  }

  const analyzeResumeWithAI = async (resumeText: string, profession: string, jobUrl?: string) => {
    console.log('🔥 Отправляем резюме на анализ через backend API')
    console.log('🔥 Длина текста резюме:', resumeText.length, 'символов')
    console.log('🔥 Профессия:', profession)
    console.log('🔥 URL вакансии:', jobUrl || 'не указан')

    try {
      // Отправляем запрос на backend для анализа
      const response = await fetch(`${API_BASE_URL}/analyze-resume-ai`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          resume_text: resumeText,
          profession: profession,
          job_url: jobUrl
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || `Ошибка сервера: ${response.status}`)
      }

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.message)
      }
      
      console.log('🔥 Анализ успешно получен с сервера')
       return result.analysis
    } catch (error) {
      console.error('Ошибка анализа резюме:', error)
      if (error.name === 'AbortError') {
        return 'Превышено время ожидания ответа от сервера. Попробуйте еще раз.'
      }
      if (error.message.includes('API ключ не настроен')) {
        return 'Сервис анализа временно недоступен. Обратитесь к администратору.'
      }
      return `Произошла ошибка при анализе резюме: ${error.message}. Попробуйте еще раз.`
    }
  }

  const handleNext = async () => {
    console.log('🔥 КНОПКА ПРОДОЛЖИТЬ НАЖАТА! Текущий шаг:', currentStep)
    console.log('🔥 selectedProfession:', selectedProfession)
    console.log('🔥 canProceed():', canProceed())
    
    if (currentStep === "instruction") {
      console.log('🔥 ПЕРЕХОДИМ К ЗАГРУЗКЕ!')
      setCurrentStep("upload")
    } else if (currentStep === "upload") {
      console.log('🔥 ПЕРЕХОДИМ К ОБРАБОТКЕ!')
      setCurrentStep("processing")
      setIsAnalyzing(true)
      
      if (uploadedFile) {
        try {
          console.log('🔥 Начинаем извлечение текста из файла...')
          const resumeText = await extractTextFromFile(uploadedFile)
          console.log('🔥 Текст извлечен, начинаем анализ...')
          
          const profession = selectedProfession
          const result = await analyzeResumeWithAI(resumeText, profession, jobUrl)
          console.log('🔥 Анализ завершен, форматируем результат...')
          
          const formattedResult = formatAIResponse(result)
          setAnalysisResult(formattedResult)
          
          console.log('🔥 Результат установлен, завершаем анализ...')
          
          // Минимальное время показа экрана обработки (3 секунды для чтения фактов)
          setTimeout(() => {
            setIsAnalyzing(false)
            setCurrentStep("results")
            console.log('🔥 Переход к результатам завершен!')
          }, 3000)
          
        } catch (error) {
          console.error('Ошибка при обработке:', error)
          setAnalysisResult(`Ошибка при обработке резюме: ${error.message || error}`)
          
          // В случае ошибки тоже завершаем анализ
          setTimeout(() => {
            setIsAnalyzing(false)
            setCurrentStep("results")
          }, 2000)
        }
      } else {
        console.error('Файл не загружен!')
        setAnalysisResult('Файл резюме не был загружен.')
        setTimeout(() => {
          setIsAnalyzing(false)
          setCurrentStep("results")
        }, 2000)
      }
    }
  }

  const canProceed = () => {
    const result = (() => {
      if (currentStep === "instruction") {
        return (localSelectedProfession && localSelectedProfession.trim() !== "") || 
               (customProfession && customProfession.trim() !== "")
      }
      if (currentStep === "upload") {
        return uploadedFile !== null
      }
      return false
    })()
    
    console.log('🔍 canProceed проверка:', {
      currentStep,
      selectedProfession: localSelectedProfession || customProfession,
      uploadedFile: uploadedFile?.name,
      result
    })
    
    return result
  }

  console.log('📋 Текущий шаг:', currentStep)
  
  if (currentStep === "instruction") {
    console.log('📝 РЕНДЕРИМ ЭКРАН ИНСТРУКЦИЙ')
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-600 to-purple-700 text-white p-4">
        <div className="max-w-2xl mx-auto">
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
              <h3 className="font-semibold text-white">Профессия</h3>
            </div>

            <div className="space-y-3">
              {/* Simple text input */}
              <Input
                placeholder="Введите название профессии (например: Frontend разработчик)"
                value={customProfession}
                onChange={(e) => handleCustomProfessionChange(e.target.value)}
                className="bg-white/20 border-white/40 text-white placeholder:text-white/70 backdrop-blur-sm"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleCustomProfessionSubmit()
                  }
                }}
              />
              
              {/* Filtered suggestions */}
              {filteredProfessions.length > 0 && (
                <div className="bg-white/20 border border-white/40 rounded-lg backdrop-blur-sm">
                  {filteredProfessions.map((profession) => (
                    <button
                      key={profession}
                      onClick={() => handleProfessionSelect(profession)}
                      className="w-full text-left px-4 py-2 text-white hover:bg-white/20 first:rounded-t-lg last:rounded-b-lg"
                    >
                      {profession}
                    </button>
                  ))}
                </div>
              )}
              
              {/* Popular professions */}
               <div className="text-white/70 text-sm">
                 <p className="mb-2">Популярные профессии:</p>
                 <div className="flex flex-wrap gap-2">
                   {allProfessions.slice(0, 6).map((profession) => (
                     <button
                       key={profession}
                       onClick={() => handleProfessionSelect(profession)}
                       className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-full text-xs transition-colors"
                     >
                       {profession}
                     </button>
                   ))}
                 </div>
               </div>
               
               {/* Selected profession display */}
               {(localSelectedProfession || customProfession) && (
                 <div className="bg-white/20 border border-white/40 rounded-lg p-3 backdrop-blur-sm">
                   <div className="flex items-center gap-2">
                     <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                     <p className="text-white font-medium">Выбрана профессия: {localSelectedProfession || customProfession}</p>
                   </div>
                 </div>
               )}
            </div>
          </div>

          {/* Job URL input */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <ExternalLink className="h-5 w-5 text-white" />
              <h3 className="font-semibold text-white">Ссылка на вакансию</h3>
              <Badge variant="secondary" className="bg-white/20 text-white text-xs pointer-events-none">
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
        <div className="max-w-2xl mx-auto">
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
              <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-bold rounded-lg px-2 py-1 flex items-center justify-center">
                в процессе
              </div>
            </div>
            <h2 className="text-xl font-semibold mb-2">Анализируем резюме</h2>
            <p className="text-white/80">Обычно это занимает до 1-2 минут...</p>
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

          {/* Analysis Result */}
          {analysisResult && (
            <Card className="bg-white/20 backdrop-blur-sm border-white/30 shadow-lg mb-6 w-full max-w-full overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="h-6 w-6 text-green-400" />
                  <span className="text-xl font-semibold text-white">Анализ резюме</span>
                </div>
                <div className="text-white/90 text-sm leading-relaxed whitespace-pre-wrap break-words overflow-auto max-w-full">
                  {analysisResult}
                </div>
              </CardContent>
            </Card>
          )}



          {/* Additional Recommendations */}
          <div className="mb-6">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Дополнительные рекомендации
            </h3>
            <div className="grid grid-cols-1 gap-4">
              {/* Online Consultation */}
              <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <h4 className="font-bold text-white text-lg mb-2">Онлайн консультация</h4>
                    <p className="text-white/90 text-sm mb-4 leading-relaxed">Персональная консультация с HR-экспертом</p>
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-semibold py-2.5 shadow-lg">
                      Заказать
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Knowledge Base */}
              <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h4 className="font-bold text-white text-lg mb-2">База знаний</h4>
                    <p className="text-white/90 text-sm mb-4 leading-relaxed">Доступ к профессиональным материалам</p>
                    <Button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 hover:from-purple-600 hover:to-purple-700 transition-all duration-300 font-semibold py-2.5 shadow-lg">
                      Получить доступ
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* LinkedIn Profile */}
              <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <h4 className="font-bold text-white text-lg mb-2">LinkedIn профиль</h4>
                    <p className="text-white/90 text-sm mb-4 leading-relaxed">Оптимизация профиля в LinkedIn</p>
                    <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white border-0 hover:from-green-600 hover:to-green-700 transition-all duration-300 font-semibold py-2.5 shadow-lg">
                      Получить помощь
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Job matches */}
          <div className="mb-6">
            <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Подходящие вакансии
            </h3>
            <div className="space-y-3">
              {(apiJobs.length > 0 ? apiJobs : getJobsForProfession(localSelectedProfession || customProfession, selectedRole, selectedGoal)).map((job) => (
                <Card key={job.id} className="bg-white/20 backdrop-blur-sm border-white/30 shadow-lg hover:bg-white/25 transition-colors cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-white">{job.title}</h4>
                        <p className="text-white/80 text-sm">{job.company}</p>
                      </div>
                      <Badge className="bg-green-500/20 text-green-400 border-green-400/30">
                        {job.type}
                      </Badge>
                    </div>
                    <p className="text-white/70 text-sm mb-2">{job.description}</p>
                    <div className="flex items-center gap-4 text-white/70 text-sm">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        {job.salary}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
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