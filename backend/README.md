# Career Mini App Backend

FastAPI бэкенд для Telegram мини-приложения карьерного консультанта.

## Функциональность

- **Карьерные советы**: Персонализированные рекомендации на основе целей и опыта
- **Анализ резюме**: Оценка и рекомендации по улучшению резюме
- **Карьерные тесты**: Тесты личности и профориентации
- **API документация**: Автоматическая документация через Swagger UI

## Быстрый старт

### 1. Установка зависимостей

```bash
cd backend
pip install -r requirements.txt
```

### 2. Настройка окружения

```bash
# Скопируйте файл конфигурации
cp .env.example .env

# Отредактируйте .env файл и добавьте ваш OpenAI API ключ
# OPENAI_API_KEY=your_actual_api_key_here
```

### 3. Запуск сервера

```bash
# Запуск в режиме разработки
python main.py

# Или через uvicorn
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 4. Проверка работы

- API документация: http://localhost:8000/docs
- Альтернативная документация: http://localhost:8000/redoc
- Проверка статуса: http://localhost:8000/

## API Эндпоинты

### Карьерные советы
```
POST /career-advice
```
Пример запроса:
```json
{
  "user_goal": "Стать senior разработчиком",
  "experience_level": "middle",
  "current_role": "Frontend Developer",
  "interests": ["React", "TypeScript", "Node.js"]
}
```

### Анализ резюме
```
POST /resume-analysis
```
Пример запроса:
```json
{
  "resume_text": "Текст резюме...",
  "target_position": "Senior Frontend Developer"
}
```

### Карьерный тест
```
POST /career-test
```
Пример запроса:
```json
{
  "answers": [4, 3, 5, 2, 4],
  "test_type": "personality"
}
```

## Разработка

### Структура проекта
```
backend/
├── main.py              # Основное FastAPI приложение
├── requirements.txt     # Python зависимости
├── .env.example        # Пример конфигурации
└── README.md           # Документация
```

### Добавление новых функций

1. Добавьте новые Pydantic модели для запросов/ответов
2. Создайте новые эндпоинты в `main.py`
3. Обновите документацию

### Интеграция с OpenAI

Для включения реальной AI функциональности:

1. Получите API ключ от OpenAI
2. Добавьте его в `.env` файл
3. Раскомментируйте и настройте OpenAI клиент в коде

## Деплой

### Локальный деплой
```bash
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Docker (планируется)
```bash
docker build -t career-backend .
docker run -p 8000:8000 career-backend
```

### Облачный деплой
Рекомендуемые платформы:
- Railway.app
- Render.com
- Heroku
- DigitalOcean App Platform

## Безопасность

- Никогда не коммитьте `.env` файл с реальными API ключами
- В продакшене настройте CORS для конкретных доменов
- Используйте HTTPS для всех запросов
- Добавьте rate limiting для API эндпоинтов

## Поддержка

Для вопросов и предложений создавайте issues в репозитории.