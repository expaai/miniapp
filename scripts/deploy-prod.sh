#!/bin/bash

# Скрипт для продакшен деплоя

echo "🚀 Запускаю продакшен деплой..."

# Проверяем наличие .env файла для продакшена
if [ ! -f ".env.prod" ]; then
    echo "⚠️  Файл .env.prod не найден. Создайте его с переменными:"
    echo "POSTGRES_PASSWORD=your_secure_password"
    echo "OPENAI_API_KEY=your_openai_key"
    exit 1
fi

# Останавливаем текущие контейнеры
echo "Останавливаю текущие контейнеры..."
docker-compose -f docker-compose.prod.yml down

# Экспортируем переменные из .env.prod
export $(grep -v '^#' .env.prod | xargs)

# Собираем образы заново
echo "Собираю образы..."
docker-compose -f docker-compose.prod.yml build --no-cache

# Запускаем в продакшене
echo "Запускаю в продакшене..."
docker-compose -f docker-compose.prod.yml up -d

# Ждем запуска
echo "Жду запуск сервисов..."
sleep 30

# Проверяем статус
echo "Проверяю статус сервисов..."
docker-compose -f docker-compose.prod.yml ps

# Проверяем health endpoint
echo "Проверяю API health..."
for i in {1..5}; do
    if curl -f http://localhost:8000/health > /dev/null 2>&1; then
        echo "✅ API работает"
        break
    else
        if [ $i -eq 5 ]; then
            echo "❌ API не отвечает после 5 попыток"
            docker-compose -f docker-compose.prod.yml logs backend
            exit 1
        else
            echo "Попытка $i: API не отвечает, жду..."
            sleep 10
        fi
    fi
done

echo "🎉 Продакшен деплой завершен!"
echo "Проверьте работу сервисов:"
echo "- Frontend: https://expa-ai.ru"
echo "- Backend API: https://api.expa-ai.ru"
echo "- Прямой доступ к API: http://localhost:8000"