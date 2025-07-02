#!/bin/bash

# Скрипт для запуска фронтенда в режиме разработки
# Устанавливает правильные переменные окружения

echo "🎨 Запуск фронтенда в режиме разработки..."
echo "🌐 URL: http://localhost:3000"
echo "🔗 API: http://localhost:8000"
echo "-" * 50

# Устанавливаем переменные окружения для разработки
export NODE_ENV=development
export NEXT_PUBLIC_API_URL=http://localhost:8000

# Запускаем Next.js dev server
npm run dev