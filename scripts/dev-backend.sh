#!/bin/bash

# Скрипт для запуска только бэкенда в режиме разработки

echo "🚀 Запускаю бэкенд в режиме разработки..."

# Проверяем наличие .env файла
if [ ! -f "backend/.env" ]; then
    echo "⚠️  Файл backend/.env не найден. Создайте его на основе backend/.env.example"
    exit 1
fi

# Экспортируем переменные из .env
export $(grep -v '^#' backend/.env | xargs)

# Запускаем бэкенд с PostgreSQL
docker-compose -f docker-compose.backend.yml up --build