# Настройка автоматического деплоя на VPS

## 1. Настройка SSH ключей

### Генерация SSH ключа для деплоя (если еще нет)
```bash
ssh-keygen -t rsa -b 4096 -C "deploy@expa-ai.ru" -f ~/.ssh/deploy_key
```

### Добавление публичного ключа на VPS
```bash
# Скопировать публичный ключ
cat ~/.ssh/deploy_key.pub

# На VPS добавить ключ в authorized_keys
ssh root@37.233.84.111
echo "ВАША_ПУБЛИЧНАЯ_ЧАСТЬ_КЛЮЧА" >> ~/.ssh/authorized_keys
```

## 2. Настройка GitHub Secrets

Перейдите в настройки репозитория: `Settings > Secrets and variables > Actions`

Добавьте следующие секреты:

### VPS_HOST
```
37.233.84.111
```

### VPS_USERNAME
```
root
```

### VPS_SSH_KEY
```bash
# Скопируйте содержимое приватного ключа
cat ~/.ssh/deploy_key
# Вставьте весь вывод в секрет VPS_SSH_KEY
```

## 3. Процесс работы

Теперь ваш workflow:

1. **Локальная разработка** → Вносите изменения в код
2. **Git push** → `git add . && git commit -m "описание" && git push origin main`
3. **Автоматический деплой** → GitHub Action автоматически:
   - Собирает проект
   - Подключается к VPS
   - Обновляет файлы на сервере
   - Перезапускает Nginx

## 4. Мониторинг деплоя

- Статус деплоя: `https://github.com/ВАШЕ_ИМЯ/career-miniapp/actions`
- Логи деплоя доступны в каждом запуске Action

## 5. Откат изменений (если что-то пошло не так)

```bash
# На VPS есть автоматические бэкапы
ssh root@37.233.84.111
ls /var/www/expa-ai.ru.backup.*

# Восстановление из бэкапа
cp -r /var/www/expa-ai.ru.backup.ДАТА/* /var/www/expa-ai.ru/
systemctl reload nginx
```

## 6. Альтернативный простой способ (без GitHub Actions)

Если не хотите настраивать автоматический деплой, можете использовать простой скрипт:

```bash
#!/bin/bash
# deploy.sh

# Собрать проект локально
npm run build

# Загрузить на сервер
scp -r dist/* root@37.233.84.111:/var/www/expa-ai.ru/

# Перезапустить Nginx
ssh root@37.233.84.111 "systemctl reload nginx"

echo "Деплой завершен!"
```

Использование: `chmod +x deploy.sh && ./deploy.sh`