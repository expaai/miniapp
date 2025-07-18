# Career Network Miniapp

Полнофункциональное мини-приложение для карьерного консультирования в Telegram с AI-powered бэкендом и современной системой деплоя на Docker.

## 🚀 Новая система деплоя

Проект использует Docker Compose для локальной разработки и продакшен деплоя.

### Архитектура

#### Frontend (Next.js)
- **Технологии**: Next.js 15, React, TypeScript, Tailwind CSS
- **UI**: Современный дизайн с градиентами и анимациями
- **Интеграция**: Telegram WebApp API для аутентификации
- **Адаптивность**: Оптимизировано для мобильных устройств
- **Docker**: Отдельные образы для разработки и продакшена

#### Backend (FastAPI)
- **Технологии**: Python, FastAPI, Pydantic
- **AI**: Интеграция с OpenAI для генерации карьерных советов
- **API**: RESTful API с автоматической документацией
- **CORS**: Настроен для работы с фронтендом
- **Docker**: Оптимизированные образы с multi-stage build

#### Infrastructure
- **PostgreSQL**: База данных в контейнере
- **Nginx**: Reverse proxy для продакшена
- **Docker Compose**: Оркестрация сервисов
- **GitHub Actions**: Автоматический деплой на VPS

## 🎯 Функциональность

### Реализовано
- ✅ **Выбор роли**: Студент или Профессионал
- ✅ **Постановка целей**: Персонализированный выбор целей
- ✅ **Карьерные советы**: AI-генерация персональных рекомендаций
- ✅ **Красивый UI**: Современный дизайн с анимациями
- ✅ **Telegram интеграция**: Получение данных пользователя

### В разработке
- 🔄 **Анализ резюме**: Загрузка и анализ резюме с рекомендациями
- 🔄 **Карьерные тесты**: Тесты личности и профориентации
- 🔄 **Подбор вакансий**: Поиск подходящих вакансий
- 🔄 **История консультаций**: Сохранение и просмотр истории

## 🛠 Быстрый старт

### Предварительные требования
- Docker и Docker Compose
- Git

### 1. Клонирование проекта

```bash
git clone <repository-url>
cd career-miniapp
```

### 2. Настройка окружения

**Для фронтенда** - создайте `.env.local`:

```env
VITE_API_URL=http://localhost:8000
```

**Для бэкенда** - создайте `backend/.env`:

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=career_network
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
OPENAI_API_KEY=your_openai_key
```

### 3. Запуск для разработки

**Только фронтенд:**
```bash
./scripts/dev-frontend.sh
```

**Только бэкенд с PostgreSQL:**
```bash
./scripts/dev-backend.sh
```

**Полный стек:**
```bash
./scripts/dev-fullstack.sh
```

### 4. Доступ к сервисам

- **Фронтенд**: http://localhost:3000
- **API документация**: http://localhost:8000/docs
- **API статус**: http://localhost:8000/health
- **PostgreSQL**: localhost:5432

## 📱 Использование

1. **Выберите роль**: Студент или Профессионал
2. **Укажите цели**: Выберите, что хотите улучшить
3. **Получите совет**: Нажмите на карточку для получения AI-совета
4. **Изучите рекомендации**: Просмотрите персональные советы и следующие шаги

## 🔧 API Эндпоинты

### Карьерные советы
```http
POST /career-advice
Content-Type: application/json

{
  "user_goal": "Стать senior разработчиком",
  "experience_level": "middle",
  "current_role": "Frontend Developer",
  "interests": ["React", "TypeScript"]
}
```

### Анализ резюме
```http
POST /resume-analysis
Content-Type: application/json

{
  "resume_text": "Текст резюме...",
  "target_position": "Senior Developer"
}
```

### Карьерный тест
```http
POST /career-test
Content-Type: application/json

{
  "answers": [4, 3, 5, 2, 4],
  "test_type": "personality"
}
```

## 🏗 Структура проекта

```
career-miniapp/
├── app/                    # Next.js app directory
├── components/             # React компоненты
├── hooks/                  # Custom hooks (включая API)
├── career-app.tsx          # Главный компонент
├── backend/
│   ├── main.py             # FastAPI приложение
│   ├── models.py           # SQLAlchemy модели
│   ├── database.py         # Настройка БД
│   ├── requirements.txt    # Python зависимости
│   └── .env.example       # Пример конфигурации
└── README.md              # Этот файл
```

## 🚀 Продакшен деплой

### Настройка для продакшена

1. **Создайте `.env.prod`** в корне проекта:

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=secure_password
POSTGRES_DB=career_network
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
OPENAI_API_KEY=your_openai_key
```

2. **Настройте SSL-сертификаты** в `nginx/ssl/` для доменов

### Ручной деплой

```bash
./scripts/deploy-prod.sh
```

### Автоматический деплой через GitHub Actions

При пуше в ветку `main` автоматически запускается деплой на VPS.

**Настройки секретов в GitHub:**

- `SSH_HOST` - IP-адрес VPS
- `SSH_USERNAME` - имя пользователя для SSH
- `SSH_PRIVATE_KEY` - приватный ключ для SSH
- `POSTGRES_PASSWORD` - пароль для PostgreSQL
- `OPENAI_API_KEY` - ключ API OpenAI

### Структура Docker Compose файлов

- `docker-compose.frontend.yml` - локальная разработка фронтенда
- `docker-compose.backend.yml` - локальная разработка бэкенда с PostgreSQL
- `docker-compose.local.yml` - локальная разработка полного стека
- `docker-compose.prod.yml` - продакшен деплой с Nginx

### Dockerfile структура

- `Dockerfile.frontend` - разработка фронтенда
- `Dockerfile.frontend.prod` - продакшен фронтенда
- `backend/Dockerfile` - разработка бэкенда
- `backend/Dockerfile.prod` - продакшен бэкенда

## 🔐 Безопасность

- ✅ CORS настроен для безопасной работы
- ✅ Валидация данных через Pydantic
- ✅ Переменные окружения для API ключей
- ⚠️ В продакшене настройте HTTPS и ограничьте CORS

## 🤝 Разработка

### Добавление новых функций

1. **Бэкенд**: Добавьте новые эндпоинты в `backend/main.py`
2. **Фронтенд**: Обновите `hooks/use-api.ts` для новых API вызовов
3. **UI**: Создайте новые компоненты или экраны

### Интеграция с OpenAI

Для включения реальной AI функциональности:
1. Получите API ключ от OpenAI
2. Добавьте его в `backend/.env`
3. Раскомментируйте OpenAI интеграцию в коде

## 📞 Поддержка

Для вопросов и предложений создавайте issues в репозитории.

---

**Статус**: 🟢 Активная разработка  
**Версия**: 1.0.0  
**Последнее обновление**: Январь 2025

Карьерное приложение для развития профессиональных навыков, созданное как Telegram Mini App.

> Обновлено: настроены права доступа для GitHub Actions

## 🚀 Возможности

- **Персонализация**: Выбор роли (студент/профессионал) для персонализированного опыта
- **Целеполагание**: Определение карьерных целей и задач
- **Интерактивность**: Полная интеграция с Telegram Web App API
- **Тактильная обратная связь**: Haptic feedback для улучшения UX
- **Адаптивный дизайн**: Оптимизировано для мобильных устройств

## 🛠 Технологии

- **Next.js 15** - React фреймворк
- **TypeScript** - Типизация
- **Tailwind CSS** - Стилизация
- **Radix UI** - UI компоненты
- **Telegram Web App API** - Интеграция с Telegram

## 📦 Установка

1. Клонируйте репозиторий:
```bash
git clone <your-repo-url>
cd career-miniapp
```

2. Установите зависимости:
```bash
npm install
# или
pnpm install
```

3. Запустите в режиме разработки:
```bash
npm run dev
# или
pnpm dev
```

4. Откройте [http://localhost:3000](http://localhost:3000) в браузере.

## 🚀 Развертывание

### GitHub Pages (рекомендуется)

1. Создайте репозиторий на GitHub
2. Загрузите код в репозиторий
3. Включите GitHub Pages в настройках репозитория
4. GitHub Actions автоматически соберет и развернет приложение

### Ручная сборка

```bash
npm run build
```

Статические файлы будут созданы в папке `dist/`.

## 🤖 Настройка Telegram Bot

1. Создайте бота через [@BotFather](https://t.me/BotFather)
2. Получите токен бота
3. Настройте Mini App через команду `/newapp`
4. Укажите URL вашего развернутого приложения
5. Загрузите иконку и описание

### Пример настройки в BotFather:

```
/newapp
@your_bot_name
Career Mini App
Карьерное приложение для развития профессиональных навыков
https://yourusername.github.io/career-miniapp/
```

## 🔧 Конфигурация

### Переменные окружения

Создайте файл `.env.local`:

```env
# URL для API backend (ОБЯЗАТЕЛЬНО для продакшена)
NEXT_PUBLIC_API_URL=https://your-backend-domain.com

# Настройки для Telegram Mini App
NEXT_PUBLIC_APP_URL=https://yourusername.github.io/career-miniapp
NEXT_PUBLIC_BOT_USERNAME=your_bot_username

# OpenAI API ключ (если используется фронтенд)
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key
```

**ВАЖНО**: Замените `https://your-backend-domain.com` на реальный URL вашего развернутого backend сервера. Без этого миниапп не сможет обрабатывать файлы резюме.

### Настройка домена

Если используете собственный домен, обновите `assetPrefix` в `next.config.mjs`:

```javascript
assetPrefix: process.env.NODE_ENV === 'production' ? 'https://yourdomain.com' : '',
```

## 📱 Тестирование

### В браузере
Приложение можно тестировать в обычном браузере, но некоторые функции Telegram будут недоступны.

### В Telegram
1. Добавьте бота в Telegram
2. Откройте Mini App через меню бота
3. Или используйте прямую ссылку: `https://t.me/your_bot_name/app`

## 🎨 Кастомизация

### Цветовая схема
Основные цвета можно изменить в `tailwind.config.ts` и компонентах.

### Контент
Тексты и логика находятся в `career-app.tsx`.

### Telegram интеграция
Настройки Telegram Web App в `hooks/use-telegram.ts`.

## 📄 Структура проекта

```
career-miniapp/
├── app/                    # Next.js App Router
│   ├── globals.css        # Глобальные стили
│   ├── layout.tsx         # Основной layout
│   └── page.tsx           # Главная страница
├── components/            # UI компоненты
│   ├── ui/               # Базовые UI компоненты
│   └── theme-provider.tsx
├── hooks/                 # React хуки
│   ├── use-telegram.ts   # Telegram Web App API
│   └── use-toast.ts
├── lib/                   # Утилиты
├── public/               # Статические файлы
├── career-app.tsx        # Основной компонент приложения
└── README.md
```

## 🐛 Отладка

### Общие проблемы

1. **Приложение не загружается в Telegram**
   - Проверьте HTTPS (обязательно для Mini Apps)
   - Убедитесь, что URL доступен извне
   - Проверьте консоль браузера на ошибки

2. **Telegram API не работает**
   - Убедитесь, что скрипт `telegram-web-app.js` загружен
   - Проверьте, что приложение открыто в Telegram

3. **Стили не применяются**
   - Проверьте правильность путей в `assetPrefix`
   - Убедитесь, что CSS файлы доступны

## 📞 Поддержка

Если у вас возникли вопросы или проблемы:

1. Проверьте [документацию Telegram Mini Apps](https://core.telegram.org/bots/webapps)
2. Изучите [примеры Mini Apps](https://github.com/telegram-mini-apps)
3. Создайте issue в репозитории

## 📝 Лицензия

MIT License - см. файл LICENSE для деталей.