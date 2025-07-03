#!/bin/bash

# Скрипт для запуска только бэкенда в режиме разработки

echo "🚀 Запускаю бэкенд в режиме разработки..."

# Проверяем наличие OPENAI_API_KEY
if [ -z "$OPENAI_API_KEY" ]; then
    echo "⚠️  Переменная OPENAI_API_KEY не установлена."
    echo "Установите её: export OPENAI_API_KEY=your_key_here"
    echo "Или создайте .env.local файл в корне проекта с OPENAI_API_KEY=your_key"
    
    # Пытаемся загрузить из .env.local если есть
    if [ -f ".env.local" ]; then
        echo "📋 Загружаю переменные из .env.local..."
        export $(grep -v '^#' .env.local | xargs)
    fi
fi

# Запускаем бэкенд с PostgreSQL
docker-compose -f docker-compose.backend.yml up --build