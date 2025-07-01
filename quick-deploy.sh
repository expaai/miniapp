#!/bin/bash

# Быстрый деплой без проверок
# Использование: ./quick-deploy.sh

echo "🚀 Быстрый деплой..."

# Сборка
npm run build

# Загрузка на сервер
rsync -avz --delete dist/ root@37.233.84.111:/var/www/expa-ai.ru/

# Перезапуск Nginx
ssh root@37.233.84.111 "systemctl reload nginx"

echo "✅ Готово! https://expa-ai.ru"