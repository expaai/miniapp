# Настройка секретов GitHub для автоматического деплоя

Для работы автоматического деплоя через GitHub Actions необходимо настроить следующие секреты в репозитории:

## Как добавить секреты

1. Перейдите в Settings → Secrets and variables → Actions
2. Нажмите "New repository secret"
3. Добавьте каждый из секретов ниже

## Обязательные секреты

### SSH_HOST
- **Описание**: IP-адрес вашего VPS сервера
- **Пример**: `192.168.1.100` или `your-server.com`

### SSH_USERNAME
- **Описание**: Имя пользователя для SSH подключения
- **Пример**: `root` или `ubuntu`

### SSH_PRIVATE_KEY
- **Описание**: Приватный SSH ключ для подключения к серверу
- **Как получить**:
  ```bash
  # На вашем компьютере
  cat ~/.ssh/id_rsa
  # Скопируйте весь вывод, включая -----BEGIN и -----END строки
  ```

### POSTGRES_PASSWORD
- **Описание**: Пароль для PostgreSQL базы данных
- **Пример**: `secure_password_123`
- **Важно**: Используйте сложный пароль!

### OPENAI_API_KEY
- **Описание**: API ключ для OpenAI
- **Как получить**: https://platform.openai.com/api-keys
- **Пример**: `sk-...`

## Проверка настройки

После добавления всех секретов:

1. Сделайте коммит и пуш в ветку `main`
2. Проверьте вкладку Actions в GitHub
3. Убедитесь, что деплой запустился без ошибок

## Подготовка VPS сервера

На VPS сервере должны быть установлены:

```bash
# Обновление системы
sudo apt update && sudo apt upgrade -y

# Установка Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Установка Docker Compose
sudo apt install docker-compose-plugin -y

# Добавление пользователя в группу docker
sudo usermod -aG docker $USER

# Создание директории для проекта
sudo mkdir -p /opt/career-miniapp
sudo chown $USER:$USER /opt/career-miniapp
```

## Настройка доменов

Убедитесь, что DNS записи настроены:

- `expa-ai.ru` → IP вашего VPS
- `api.expa-ai.ru` → IP вашего VPS
- `www.expa-ai.ru` → IP вашего VPS

## SSL сертификаты

После первого деплоя настройте SSL сертификаты на сервере:

```bash
# Подключитесь к серверу
ssh your-user@your-server-ip

# Перейдите в директорию проекта
cd /opt/career-miniapp

# Установите certbot
sudo apt install certbot -y

# Получите сертификаты
sudo certbot certonly --standalone -d expa-ai.ru -d www.expa-ai.ru -d api.expa-ai.ru

# Скопируйте сертификаты
sudo cp /etc/letsencrypt/live/expa-ai.ru/fullchain.pem ./nginx/ssl/expa-ai.ru.crt
sudo cp /etc/letsencrypt/live/expa-ai.ru/privkey.pem ./nginx/ssl/expa-ai.ru.key
sudo cp /etc/letsencrypt/live/api.expa-ai.ru/fullchain.pem ./nginx/ssl/api.expa-ai.ru.crt
sudo cp /etc/letsencrypt/live/api.expa-ai.ru/privkey.pem ./nginx/ssl/api.expa-ai.ru.key

# Установите права
sudo chmod 600 ./nginx/ssl/*.key
sudo chmod 644 ./nginx/ssl/*.crt

# Перезапустите nginx
sudo docker-compose -f docker-compose.prod.yml restart nginx
```