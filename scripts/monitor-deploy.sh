#!/bin/bash

# Скрипт для мониторинга статуса деплоя
# Использование: ./scripts/monitor-deploy.sh

echo "🔍 Мониторинг статуса деплоя..."
echo "📋 Откройте GitHub Actions для детального просмотра: https://github.com/expaai/miniapp/actions"
echo ""

# Функция для проверки статуса API
check_api_status() {
    echo "🔄 Проверяю статус API..."
    
    # Проверяем локальный API (если запущен)
    if curl -s http://localhost:8000/health > /dev/null 2>&1; then
        echo "✅ Локальный API (localhost:8000) - работает"
    else
        echo "❌ Локальный API (localhost:8000) - недоступен"
    fi
    
    # Проверяем продакшен API
    if curl -s https://api.expa-ai.ru/health > /dev/null 2>&1; then
        echo "✅ Продакшен API (api.expa-ai.ru) - работает"
    else
        echo "❌ Продакшен API (api.expa-ai.ru) - недоступен"
    fi
    
    echo ""
}

# Функция для проверки статуса фронтенда
check_frontend_status() {
    echo "🔄 Проверяю статус фронтенда..."
    
    # Проверяем локальный фронтенд
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo "✅ Локальный фронтенд (localhost:3000) - работает"
    else
        echo "❌ Локальный фронтенд (localhost:3000) - недоступен"
    fi
    
    # Проверяем продакшен фронтенд
    if curl -s https://expa-ai.ru > /dev/null 2>&1; then
        echo "✅ Продакшен фронтенд (expa-ai.ru) - работает"
    else
        echo "❌ Продакшен фронтенд (expa-ai.ru) - недоступен"
    fi
    
    echo ""
}

# Функция для проверки Docker контейнеров
check_docker_status() {
    echo "🔄 Проверяю статус Docker контейнеров..."
    
    if command -v docker > /dev/null 2>&1; then
        echo "📦 Запущенные контейнеры:"
        docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep -E "(career|nginx|postgres)" || echo "Нет запущенных контейнеров проекта"
    else
        echo "❌ Docker не установлен или недоступен"
    fi
    
    echo ""
}

# Функция для показа последних логов
show_recent_logs() {
    echo "📋 Последние логи (если контейнеры запущены):"
    
    if command -v docker > /dev/null 2>&1; then
        # Показываем логи backend
        if docker ps | grep -q "backend"; then
            echo "🔧 Backend логи (последние 10 строк):"
            docker logs --tail 10 $(docker ps -q --filter "name=backend") 2>/dev/null || echo "Нет логов backend"
            echo ""
        fi
        
        # Показываем логи nginx
        if docker ps | grep -q "nginx"; then
            echo "🌐 Nginx логи (последние 5 строк):"
            docker logs --tail 5 $(docker ps -q --filter "name=nginx") 2>/dev/null || echo "Нет логов nginx"
            echo ""
        fi
    fi
}

# Основная функция мониторинга
main() {
    while true; do
        clear
        echo "🚀 Мониторинг деплоя Career Mini App"
        echo "⏰ $(date '+%Y-%m-%d %H:%M:%S')"
        echo "═══════════════════════════════════════════════════════════════"
        echo ""
        
        check_api_status
        check_frontend_status
        check_docker_status
        show_recent_logs
        
        echo "═══════════════════════════════════════════════════════════════"
        echo "🔄 Обновление через 30 секунд... (Ctrl+C для выхода)"
        echo "📋 GitHub Actions: https://github.com/expaai/miniapp/actions"
        
        sleep 30
    done
}

# Запуск мониторинга
main