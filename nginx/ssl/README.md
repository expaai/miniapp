# SSL Сертификаты

Для продакшен деплоя необходимо разместить SSL-сертификаты в этой директории.

## Структура файлов

```
nginx/ssl/
├── expa-ai.ru.crt          # Сертификат для основного домена
├── expa-ai.ru.key          # Приватный ключ для основного домена
├── api.expa-ai.ru.crt      # Сертификат для API домена
├── api.expa-ai.ru.key      # Приватный ключ для API домена
└── README.md               # Этот файл
```

## Получение сертификатов

### Вариант 1: Let's Encrypt (бесплатно)

```bash
# Установите certbot
sudo apt install certbot

# Получите сертификаты
sudo certbot certonly --standalone -d expa-ai.ru -d api.expa-ai.ru

# Скопируйте сертификаты
sudo cp /etc/letsencrypt/live/expa-ai.ru/fullchain.pem ./expa-ai.ru.crt
sudo cp /etc/letsencrypt/live/expa-ai.ru/privkey.pem ./expa-ai.ru.key
sudo cp /etc/letsencrypt/live/api.expa-ai.ru/fullchain.pem ./api.expa-ai.ru.crt
sudo cp /etc/letsencrypt/live/api.expa-ai.ru/privkey.pem ./api.expa-ai.ru.key
```

### Вариант 2: Самоподписанные сертификаты (для тестирования)

```bash
# Создайте самоподписанные сертификаты
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout expa-ai.ru.key \
  -out expa-ai.ru.crt \
  -subj "/C=RU/ST=Moscow/L=Moscow/O=Organization/OU=OrgUnit/CN=expa-ai.ru"

openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout api.expa-ai.ru.key \
  -out api.expa-ai.ru.crt \
  -subj "/C=RU/ST=Moscow/L=Moscow/O=Organization/OU=OrgUnit/CN=api.expa-ai.ru"
```

## Права доступа

Установите правильные права доступа:

```bash
chmod 600 *.key
chmod 644 *.crt
```

## Автоматическое обновление Let's Encrypt

Добавьте в crontab для автоматического обновления:

```bash
# Обновление каждые 3 месяца
0 0 1 */3 * certbot renew --quiet && docker-compose -f /opt/career-miniapp/docker-compose.prod.yml restart nginx
```