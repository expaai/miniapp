#!/bin/bash

# Скрипт для деплоя Career Mini App Backend в продакшен

set -e  # Остановить выполнение при ошибке

echo "🚀 Начинаем деплой Career Mini App Backend..."

# Проверяем наличие .env файла
if [ ! -f ".env" ]; then
    echo "❌ Файл .env не найден. Создайте его на основе .env.example"
    echo "cp .env.example .env"
    echo "Отредактируйте .env и добавьте ваш OPENAI_API_KEY"
    exit 1
fi

# Проверяем наличие OPENAI_API_KEY
if ! grep -q "OPENAI_API_KEY=sk-" .env; then
    echo "⚠️  Предупреждение: OPENAI_API_KEY не настроен в .env файле"
    echo "Убедитесь, что вы добавили действующий ключ OpenAI"
fi

echo "📦 Останавливаем существующие контейнеры..."
docker-compose down

echo "🔨 Собираем новый Docker образ..."
docker-compose build --no-cache

echo "🚀 Запускаем сервисы..."
docker-compose up -d

echo "⏳ Ждем запуска сервиса..."
sleep 10

# Проверяем health check
echo "🔍 Проверяем статус сервиса..."
if curl -f http://localhost:8000/health > /dev/null 2>&1; then
    echo "✅ Backend успешно запущен!"
    echo "📖 API документация: http://localhost:8000/docs"
    echo "💚 Health check: http://localhost:8000/health"
else
    echo "❌ Ошибка запуска backend сервиса"
    echo "📋 Логи:"
    docker-compose logs career-backend
    exit 1
fi

echo "🎉 Деплой завершен успешно!"
echo ""
echo "📋 Полезные команды:"
echo "  Логи:           docker-compose logs -f career-backend"
echo "  Остановить:     docker-compose down"
echo "  Перезапустить:  docker-compose restart career-backend"
echo "  Статус:         docker-compose ps"
echo ""
echo "🔗 Endpoints:"
echo "  Health:         http://localhost:8000/health"
echo "  Upload Resume:  http://localhost:8000/upload-resume"
echo "  Analyze AI:     http://localhost:8000/analyze-resume-ai"
echo "  API Docs:       http://localhost:8000/docs"