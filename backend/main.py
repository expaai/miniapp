from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import openai
import os
from datetime import datetime

app = FastAPI(title="Career Mini App API", version="1.0.0")

# CORS middleware для фронтенда
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # В продакшене указать конкретные домены
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Модели данных
class CareerAdviceRequest(BaseModel):
    user_goal: str
    experience_level: str
    current_role: Optional[str] = None
    interests: Optional[List[str]] = None

class CareerAdviceResponse(BaseModel):
    advice: str
    recommendations: List[str]
    next_steps: List[str]
    timestamp: datetime

class ResumeAnalysisRequest(BaseModel):
    resume_text: str
    target_position: Optional[str] = None

class ResumeAnalysisResponse(BaseModel):
    score: int  # 1-100
    strengths: List[str]
    improvements: List[str]
    missing_skills: List[str]
    recommendations: List[str]

class CareerTestRequest(BaseModel):
    answers: List[int]  # Ответы на вопросы теста
    test_type: str  # "personality", "skills", "interests"

class CareerTestResponse(BaseModel):
    result_type: str
    description: str
    recommended_careers: List[str]
    development_areas: List[str]

# Новые модели для логирования
class ProfessionSelectionRequest(BaseModel):
    user_id: Optional[str] = None
    selected_profession: str
    user_role: Optional[str] = None  # 'student' | 'professional'
    user_goal: Optional[str] = None
    timestamp: Optional[datetime] = None

class ProfessionSelectionResponse(BaseModel):
    success: bool
    message: str
    session_id: str

class JobMatchingRequest(BaseModel):
    session_id: str
    profession: str
    user_role: Optional[str] = None
    user_goal: Optional[str] = None
    job_url: Optional[str] = None

class JobMatchingResponse(BaseModel):
    jobs: List[dict]
    total_count: int
    session_id: str

# Эндпоинты
@app.get("/")
async def root():
    return {"message": "Career Mini App API", "version": "1.0.0"}

@app.post("/career-advice", response_model=CareerAdviceResponse)
async def get_career_advice(request: CareerAdviceRequest):
    """
    Генерация персонализированных карьерных советов на основе целей и опыта пользователя
    """
    try:
        # Формируем промпт для AI
        prompt = f"""
        Ты карьерный консультант. Дай персонализированный совет пользователю:
        
        Цель: {request.user_goal}
        Уровень опыта: {request.experience_level}
        Текущая роль: {request.current_role or 'Не указана'}
        Интересы: {', '.join(request.interests) if request.interests else 'Не указаны'}
        
        Предоставь:
        1. Общий совет (2-3 предложения)
        2. 3-5 конкретных рекомендаций
        3. 3-4 следующих шага
        
        Отвечай на русском языке, будь конкретным и практичным.
        """
        
        # Пока что возвращаем мок-данные (позже интегрируем с OpenAI)
        advice = f"Для достижения цели '{request.user_goal}' с уровнем опыта '{request.experience_level}' рекомендую сосредоточиться на развитии ключевых навыков и построении профессиональной сети."
        
        recommendations = [
            "Изучите актуальные технологии в вашей области",
            "Найдите ментора или карьерного консультанта",
            "Развивайте soft skills: коммуникация и лидерство",
            "Создайте план профессионального развития на год",
            "Участвуйте в профессиональных мероприятиях и конференциях"
        ]
        
        next_steps = [
            "Обновите резюме и LinkedIn профиль",
            "Определите 3 ключевых навыка для развития",
            "Найдите 5 компаний мечты и изучите их требования",
            "Запланируйте еженедельное время для обучения"
        ]
        
        return CareerAdviceResponse(
            advice=advice,
            recommendations=recommendations,
            next_steps=next_steps,
            timestamp=datetime.now()
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка генерации совета: {str(e)}")

@app.post("/resume-analysis", response_model=ResumeAnalysisResponse)
async def analyze_resume(request: ResumeAnalysisRequest):
    """
    Анализ резюме и предоставление рекомендаций по улучшению
    """
    try:
        # Мок-анализ резюме (позже интегрируем с AI)
        score = 75  # Базовая оценка
        
        strengths = [
            "Четкая структура резюме",
            "Релевантный опыт работы",
            "Указаны конкретные достижения"
        ]
        
        improvements = [
            "Добавить больше количественных метрик",
            "Улучшить описание ключевых навыков",
            "Добавить раздел с проектами"
        ]
        
        missing_skills = [
            "Современные технологии в области",
            "Навыки управления проектами",
            "Знание английского языка"
        ]
        
        recommendations = [
            "Переформулируйте достижения в формате STAR",
            "Добавьте ключевые слова из описания вакансии",
            "Сократите резюме до 1-2 страниц",
            "Добавьте ссылки на портфолио или проекты"
        ]
        
        return ResumeAnalysisResponse(
            score=score,
            strengths=strengths,
            improvements=improvements,
            missing_skills=missing_skills,
            recommendations=recommendations
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка анализа резюме: {str(e)}")

@app.post("/career-test", response_model=CareerTestResponse)
async def process_career_test(request: CareerTestRequest):
    """
    Обработка результатов карьерного теста
    """
    try:
        # Простая логика обработки теста (позже можно усложнить)
        avg_score = sum(request.answers) / len(request.answers)
        
        if request.test_type == "personality":
            if avg_score >= 4:
                result_type = "Лидер и новатор"
                description = "Вы прирожденный лидер, который любит инновации и изменения"
                recommended_careers = ["Менеджер проекта", "Предприниматель", "Консультант"]
            elif avg_score >= 3:
                result_type = "Командный игрок"
                description = "Вы отлично работаете в команде и цените стабильность"
                recommended_careers = ["Аналитик", "Специалист по продукту", "HR-менеджер"]
            else:
                result_type = "Независимый специалист"
                description = "Вы предпочитаете работать самостоятельно и глубоко погружаться в задачи"
                recommended_careers = ["Разработчик", "Дизайнер", "Исследователь"]
        else:
            result_type = "Универсальный профиль"
            description = "У вас разносторонние интересы и способности"
            recommended_careers = ["Продакт-менеджер", "Бизнес-аналитик", "Маркетолог"]
        
        development_areas = [
            "Развитие коммуникативных навыков",
            "Изучение новых технологий",
            "Развитие лидерских качеств",
            "Улучшение аналитических способностей"
        ]
        
        return CareerTestResponse(
            result_type=result_type,
            description=description,
            recommended_careers=recommended_careers,
            development_areas=development_areas
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка обработки теста: {str(e)}")

@app.post("/log-profession-selection", response_model=ProfessionSelectionResponse)
async def log_profession_selection(request: ProfessionSelectionRequest):
    """
    Логирование выбора профессии пользователем
    """
    try:
        # Генерируем уникальный session_id
        import uuid
        session_id = str(uuid.uuid4())
        
        # Логируем данные (в будущем сохранять в БД)
        log_data = {
            "session_id": session_id,
            "user_id": request.user_id,
            "selected_profession": request.selected_profession,
            "user_role": request.user_role,
            "user_goal": request.user_goal,
            "timestamp": request.timestamp or datetime.now(),
            "action": "profession_selection"
        }
        
        print(f"[PROFESSION_SELECTION] {log_data}")
        
        return ProfessionSelectionResponse(
            success=True,
            message="Выбор профессии успешно зарегистрирован",
            session_id=session_id
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка логирования выбора профессии: {str(e)}")

@app.post("/get-job-matches", response_model=JobMatchingResponse)
async def get_job_matches(request: JobMatchingRequest):
    """
    Получение подходящих вакансий и логирование запроса
    """
    try:
        # Логируем запрос подборки вакансий
        log_data = {
            "session_id": request.session_id,
            "profession": request.profession,
            "user_role": request.user_role,
            "user_goal": request.user_goal,
            "job_url": request.job_url,
            "timestamp": datetime.now(),
            "action": "job_matching_request"
        }
        
        print(f"[JOB_MATCHING] {log_data}")
        
        # Мок-данные вакансий (позже заменить на реальную логику)
        jobs_map = {
            "AI/ML инженер": [
                {
                    "id": 1,
                    "title": "Senior ML Engineer",
                    "company": "Яндекс",
                    "location": "Москва",
                    "salary": "300 000 - 450 000 ₽",
                    "type": "Полная занятость",
                    "description": "Разработка и внедрение ML-моделей для поисковых алгоритмов"
                },
                {
                    "id": 2,
                    "title": "AI Research Scientist",
                    "company": "Сбер",
                    "location": "Санкт-Петербург",
                    "salary": "250 000 - 400 000 ₽",
                    "type": "Полная занятость",
                    "description": "Исследования в области искусственного интеллекта и NLP"
                }
            ],
            "DevOps": [
                {
                    "id": 1,
                    "title": "Senior DevOps Engineer",
                    "company": "Тинькофф",
                    "location": "Москва",
                    "salary": "250 000 - 350 000 ₽",
                    "type": "Полная занятость",
                    "description": "Автоматизация CI/CD процессов и управление облачной инфраструктурой"
                }
            ]
        }
        
        # Получаем вакансии для профессии
        jobs = jobs_map.get(request.profession, [
            {
                "id": 1,
                "title": "IT Специалист",
                "company": "TechCorp",
                "location": "Москва",
                "salary": "150 000 - 250 000 ₽",
                "type": "Полная занятость",
                "description": "Работа в сфере информационных технологий"
            }
        ])
        
        # Адаптируем вакансии под роль пользователя
        if request.user_role == "student":
            jobs = [{
                **job,
                "title": job["title"].replace("Senior", "Junior") if "Senior" in job["title"] else job["title"],
                "description": job["description"] + " (Позиция для начинающих специалистов)"
            } for job in jobs]
        elif request.user_role == "professional":
            jobs = [{
                **job,
                "title": "Senior " + job["title"] if "Senior" not in job["title"] and "Lead" not in job["title"] else job["title"],
                "description": job["description"] + " (Позиция для опытных специалистов)"
            } for job in jobs]
        
        # Логируем результат
        result_log = {
            "session_id": request.session_id,
            "jobs_count": len(jobs),
            "timestamp": datetime.now(),
            "action": "job_matching_result"
        }
        
        print(f"[JOB_MATCHING_RESULT] {result_log}")
        
        return JobMatchingResponse(
            jobs=jobs,
            total_count=len(jobs),
            session_id=request.session_id
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ошибка получения вакансий: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)