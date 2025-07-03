# 🔧 План исправления деплоя Career Mini App

## ✅ Выполненные исправления

### 1. Исправлены пути в workflow файлах
- **deploy-backend.yml**: Изменены пути с `/home/user/career-miniapp/backend/` на `/opt/career-backend/`
- **deploy-full.yml**: Проверены и исправлены пути для backend деплоя
- Добавлены правильные `sudo` команды для systemctl операций

### 2. Исправлена конфигурация systemd сервиса
- Изменен `ExecStart` с `python main.py` на `uvicorn main:app --host 0.0.0.0 --port 8000`
- Установлен правильный пользователь `www-data`
- Настроены правильные права доступа

### 3. Улучшена обработка виртуального окружения
- Использование `sudo venv/bin/pip` вместо активации окружения
- Принудительная переустановка зависимостей с `--force-reinstall`
- Проверка версии httpx после установки

### 4. Добавлены диагностические инструменты
- **diagnose-vps.yml**: Workflow для проверки состояния VPS
- **test-backend-deploy.yml**: Тестовый workflow для отладки
- **check_workflow_errors.py**: Скрипт для анализа ошибок GitHub Actions

## 🚀 Следующие шаги

### Шаг 1: Диагностика VPS
1. Перейти в GitHub Actions: https://github.com/expaai/miniapp/actions
2. Запустить workflow "Diagnose VPS State" вручную
3. Проверить результаты диагностики

### Шаг 2: Тестирование backend деплоя
1. Запустить workflow "Test Backend Deploy" вручную
2. Проанализировать текущее состояние сервера
3. При необходимости исправить найденные проблемы

### Шаг 3: Исправление конкретных проблем
В зависимости от результатов диагностики:

#### Если директория `/opt/career-backend` не существует:
```bash
sudo mkdir -p /opt/career-backend
sudo chown -R www-data:www-data /opt/career-backend
```

#### Если systemd сервис не настроен:
```bash
sudo systemctl daemon-reload
sudo systemctl enable career-backend
```

#### Если есть проблемы с правами доступа:
```bash
sudo chown -R www-data:www-data /opt/career-backend
sudo chmod -R 755 /opt/career-backend
```

### Шаг 4: Включение автоматического деплоя
После успешного тестирования:
1. В `deploy-backend.yml` раскомментировать секцию `on: push:`
2. Протестировать автоматический деплой

## 🔍 Возможные проблемы и решения

### Проблема: SSH ключи или доступ
**Решение**: Проверить секреты в GitHub:
- `VPS_HOST`
- `VPS_USERNAME` 
- `VPS_SSH_KEY`

### Проблема: Права доступа sudo
**Решение**: Убедиться, что пользователь имеет sudo права без пароля:
```bash
echo "$VPS_USERNAME ALL=(ALL) NOPASSWD:ALL" | sudo tee /etc/sudoers.d/$VPS_USERNAME
```

### Проблема: Конфликт портов
**Решение**: Проверить, что порт 8000 свободен:
```bash
sudo lsof -i :8000
sudo kill -9 <PID>
```

### Проблема: Зависимости Python
**Решение**: Очистить и пересоздать виртуальное окружение:
```bash
sudo rm -rf /opt/career-backend/venv
sudo python3 -m venv /opt/career-backend/venv
```

## 📊 Мониторинг после исправления

### Команды для проверки состояния:
```bash
# Статус сервиса
sudo systemctl status career-backend

# Логи сервиса
sudo journalctl -u career-backend -f

# Health check
curl http://localhost:8000/health

# Проверка процессов
sudo lsof -i :8000
```

### Полезные URL:
- **API Health**: https://api.expa-ai.ru/health
- **API Docs**: https://api.expa-ai.ru/docs
- **Frontend**: https://expa-ai.ru/
- **GitHub Actions**: https://github.com/expaai/miniapp/actions

## 🎯 Ожидаемый результат

После выполнения всех шагов:
1. ✅ Backend API доступен по адресу https://api.expa-ai.ru
2. ✅ Health endpoint возвращает `{"status":"healthy"}`
3. ✅ Автоматический деплой работает при push в main
4. ✅ Frontend корректно подключается к backend
5. ✅ Все зависимости обновлены (включая httpx)

---

**Статус**: 🔄 В процессе исправления  
**Последнее обновление**: $(date)  
**Следующий шаг**: Запуск диагностики VPS