#!/bin/bash

# Скрипт для запуска только фронтенда в режиме разработки

echo "🚀 Запускаю фронтенд в режиме разработки..."

# Проверяем наличие .env файла
if [ ! -f ".env.local" ]; then
    echo "⚠️  Файл .env.local не найден. Создайте его на основе .env.local.example"
    exit 1
fi

# Запускаем фронтенд
docker-compose -f docker-compose.frontend.yml up --build