#!/bin/bash

# Скрипт для запуска полного стека в режиме разработки

echo "🚀 Запускаю полный стек в режиме разработки..."

# Проверяем наличие .env файлов
if [ ! -f ".env.local" ]; then
    echo "⚠️  Файл .env.local не найден. Создайте его на основе .env.local.example"
    exit 1
fi

if [ ! -f "backend/.env" ]; then
    echo "⚠️  Файл backend/.env не найден. Создайте его на основе backend/.env.example"
    exit 1
fi

# Экспортируем переменные из backend/.env
export $(grep -v '^#' backend/.env | xargs)

# Запускаем полный стек
docker-compose -f docker-compose.local.yml up --build