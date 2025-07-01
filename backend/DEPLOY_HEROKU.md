# 🚀 Деплой Backend на Heroku

## Быстрый деплой (один клик)

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/expaai/miniapp/tree/main/backend)

## Ручной деплой

### 1. Установите Heroku CLI

```bash
# macOS
brew tap heroku/brew && brew install heroku

# Или скачайте с https://devcenter.heroku.com/articles/heroku-cli
```

### 2. Войдите в Heroku

```bash
heroku login
```

### 3. Создайте приложение

```bash
cd backend
heroku create career-backend-api
# Или с уникальным именем:
# heroku create your-unique-backend-name
```

### 4. Настройте переменные окружения

```bash
# Обязательно - OpenAI API ключ
heroku config:set OPENAI_API_KEY=your_openai_api_key_here

# Опционально - CORS домены
heroku config:set ALLOWED_ORIGINS="https://expaai.github.io,https://t.me"

# Окружение
heroku config:set ENVIRONMENT=production
```

### 5. Деплой

```bash
# Инициализируйте git (если еще не сделано)
git init
git add .
git commit -m "Initial backend commit"

# Добавьте Heroku remote
heroku git:remote -a career-backend-api

# Деплой только backend папки
git subtree push --prefix=backend heroku main
```

### 6. Проверьте деплой

```bash
# Откройте приложение
heroku open

# Проверьте логи
heroku logs --tail

# Проверьте health check
curl https://your-app-name.herokuapp.com/health
```

## 🔧 Обновление фронтенда

После успешного деплоя обновите `.env.local` в корне проекта:

```env
NEXT_PUBLIC_API_URL=https://your-app-name.herokuapp.com
```

## 📊 Мониторинг

- **Логи**: `heroku logs --tail`
- **Метрики**: https://dashboard.heroku.com/apps/your-app-name/metrics
- **Health check**: https://your-app-name.herokuapp.com/health
- **API docs**: https://your-app-name.herokuapp.com/docs

## 🔄 Обновления

```bash
# После изменений в коде
git add .
git commit -m "Update backend"
git subtree push --prefix=backend heroku main
```

## 💡 Полезные команды

```bash
# Перезапуск приложения
heroku restart

# Масштабирование
heroku ps:scale web=1

# Переменные окружения
heroku config
heroku config:set KEY=value
heroku config:unset KEY

# Подключение к базе (если добавите)
heroku pg:psql
```

## 🆓 Бесплатный план

Heroku предоставляет:
- 550-1000 часов в месяц бесплатно
- Автоматическое засыпание после 30 минут неактивности
- Пробуждение при первом запросе (~10-30 секунд)

## 🔒 Безопасность

- ✅ HTTPS по умолчанию
- ✅ Переменные окружения защищены
- ✅ CORS настроен для конкретных доменов
- ✅ Автоматические обновления безопасности

## 🚨 Troubleshooting

### Ошибка деплоя
```bash
heroku logs --tail
```

### Приложение не отвечает
```bash
heroku ps
heroku restart
```

### Проблемы с CORS
Проверьте `ALLOWED_ORIGINS` в настройках:
```bash
heroku config:get ALLOWED_ORIGINS
```