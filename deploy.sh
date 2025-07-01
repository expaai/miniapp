#!/bin/bash

# Скрипт для быстрого деплоя на VPS
# Использование: ./deploy.sh

set -e  # Остановить выполнение при ошибке

echo "🚀 Начинаем деплой на expa-ai.ru..."

# Проверяем, что мы в правильной директории
if [ ! -f "package.json" ]; then
    echo "❌ Ошибка: package.json не найден. Запустите скрипт из корня проекта."
    exit 1
fi

# Собираем проект
echo "📦 Сборка проекта..."
npm run build

if [ ! -d "dist" ]; then
    echo "❌ Ошибка: папка dist не создана после сборки."
    exit 1
fi

# Создаем бэкап на сервере
echo "💾 Создание бэкапа на сервере..."
ssh root@37.233.84.111 "if [ -d '/var/www/expa-ai.ru' ]; then cp -r /var/www/expa-ai.ru /var/www/expa-ai.ru.backup.\$(date +%Y%m%d_%H%M%S); fi"

# Загружаем файлы на сервер
echo "📤 Загрузка файлов на сервер..."
rsync -avz --delete dist/ root@37.233.84.111:/var/www/expa-ai.ru/

# Устанавливаем правильные права доступа
echo "🔐 Установка прав доступа..."
ssh root@37.233.84.111 "chown -R www-data:www-data /var/www/expa-ai.ru && chmod -R 755 /var/www/expa-ai.ru"

# Перезапускаем Nginx
echo "🔄 Перезапуск Nginx..."
ssh root@37.233.84.111 "systemctl reload nginx"

# Проверяем статус
echo "✅ Проверка доступности сайта..."
if curl -s -o /dev/null -w "%{http_code}" https://expa-ai.ru | grep -q "200"; then
    echo "🎉 Деплой успешно завершен! Сайт доступен: https://expa-ai.ru"
else
    echo "⚠️  Деплой завершен, но сайт может быть временно недоступен. Проверьте вручную."
fi

echo "📊 Статистика:"
echo "   - Локальная сборка: ✅"
echo "   - Загрузка на сервер: ✅"
echo "   - Права доступа: ✅"
echo "   - Перезапуск Nginx: ✅"
echo ""
echo "🔗 Ваш сайт: https://expa-ai.ru"