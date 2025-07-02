# 🚀 Деплой Backend на VPS

## Подготовка VPS

### 1. Подключение к серверу

```bash
# Подключитесь к вашему VPS
ssh user@your-server-ip

# Обновите систему
sudo apt update && sudo apt upgrade -y
```

### 2. Установка зависимостей

```bash
# Установите Python 3.11+
sudo apt install python3.11 python3.11-venv python3-pip -y

# Установите Git
sudo apt install git -y

# Установите Nginx (опционально)
sudo apt install nginx -y
```

### 3. Клонирование проекта

```bash
# Клонируйте репозиторий
git clone https://github.com/your-username/career-miniapp.git
cd career-miniapp/backend
```

### 4. Настройка окружения

```bash
# Создайте виртуальное окружение
python3.11 -m venv venv
source venv/bin/activate

# Установите зависимости
pip install -r requirements.txt

# Создайте .env файл
cp .env.example .env
nano .env
```

```env
# Содержимое .env файла
OPENAI_API_KEY=your_openai_api_key_here
ALLOWED_ORIGINS=https://your-domain.com,https://t.me
ENVIRONMENT=production
HOST=0.0.0.0
PORT=8000
```

### 5. Запуск приложения

```bash
# Тестовый запуск
uvicorn main:app --host 0.0.0.0 --port 8000

# Создайте systemd сервис для автозапуска
sudo nano /etc/systemd/system/career-backend.service
```

```ini
[Unit]
Description=Career Backend API
After=network.target

[Service]
Type=simple
User=your-username
WorkingDirectory=/home/your-username/career-miniapp/backend
Environment=PATH=/home/your-username/career-miniapp/backend/venv/bin
ExecStart=/home/your-username/career-miniapp/backend/venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
# Запустите сервис
sudo systemctl daemon-reload
sudo systemctl enable career-backend
sudo systemctl start career-backend
```

### 6. Настройка Nginx (опционально)

```bash
# Создайте конфигурацию Nginx
sudo nano /etc/nginx/sites-available/career-backend
```

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Активируйте конфигурацию
sudo ln -s /etc/nginx/sites-available/career-backend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Проверьте статус
curl http://your-server-ip/health
```

## 🔧 Обновление фронтенда

После успешного деплоя обновите `.env.local` в корне проекта:

```env
NEXT_PUBLIC_API_URL=http://your-server-ip:8000
# Или с доменом:
# NEXT_PUBLIC_API_URL=https://your-domain.com
```

## 📊 Мониторинг

- **Логи**: `sudo journalctl -u career-backend -f`
- **Статус сервиса**: `sudo systemctl status career-backend`
- **Health check**: `curl http://your-server-ip:8000/health`
- **API docs**: `http://your-server-ip:8000/docs`

## 🔄 Обновления

```bash
# Подключитесь к серверу
ssh user@your-server-ip
cd career-miniapp

# Обновите код
git pull origin main
cd backend

# Активируйте окружение и обновите зависимости
source venv/bin/activate
pip install -r requirements.txt

# Перезапустите сервис
sudo systemctl restart career-backend
```

## 💡 Полезные команды

```bash
# Перезапуск приложения
sudo systemctl restart career-backend

# Просмотр логов
sudo journalctl -u career-backend -f

# Проверка статуса
sudo systemctl status career-backend

# Остановка/запуск
sudo systemctl stop career-backend
sudo systemctl start career-backend

# Проверка портов
sudo netstat -tlnp | grep :8000
```

## 💰 Преимущества VPS

VPS предоставляет:
- Полный контроль над сервером
- Постоянная работа без засыпания
- Возможность настройки под ваши нужды
- Более низкая стоимость при долгосрочном использовании

## 🔒 Безопасность

- ✅ Настройте firewall: `sudo ufw enable && sudo ufw allow 22,80,443,8000/tcp`
- ✅ Переменные окружения в .env файле
- ✅ CORS настроен для конкретных доменов
- ✅ Регулярно обновляйте систему: `sudo apt update && sudo apt upgrade`
- ✅ Используйте SSL сертификаты (Let's Encrypt)

## 🚨 Troubleshooting

### Сервис не запускается
```bash
sudo journalctl -u career-backend -n 50
sudo systemctl status career-backend
```

### Приложение не отвечает
```bash
sudo systemctl restart career-backend
sudo netstat -tlnp | grep :8000
```

### Проблемы с CORS
Проверьте .env файл:
```bash
cat .env | grep ALLOWED_ORIGINS
```

### Проблемы с портами
```bash
# Проверьте, что порт свободен
sudo lsof -i :8000
# Убейте процесс, если нужно
sudo kill -9 PID
```