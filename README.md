# Career Mini App для Telegram

Карьерное приложение для развития профессиональных навыков, созданное как Telegram Mini App.

## 🚀 Возможности

- **Персонализация**: Выбор роли (студент/профессионал) для персонализированного опыта
- **Целеполагание**: Определение карьерных целей и задач
- **Интерактивность**: Полная интеграция с Telegram Web App API
- **Тактильная обратная связь**: Haptic feedback для улучшения UX
- **Адаптивный дизайн**: Оптимизировано для мобильных устройств

## 🛠 Технологии

- **Next.js 15** - React фреймворк
- **TypeScript** - Типизация
- **Tailwind CSS** - Стилизация
- **Radix UI** - UI компоненты
- **Telegram Web App API** - Интеграция с Telegram

## 📦 Установка

1. Клонируйте репозиторий:
```bash
git clone <your-repo-url>
cd career-miniapp
```

2. Установите зависимости:
```bash
npm install
# или
pnpm install
```

3. Запустите в режиме разработки:
```bash
npm run dev
# или
pnpm dev
```

4. Откройте [http://localhost:3000](http://localhost:3000) в браузере.

## 🚀 Развертывание

### GitHub Pages (рекомендуется)

1. Создайте репозиторий на GitHub
2. Загрузите код в репозиторий
3. Включите GitHub Pages в настройках репозитория
4. GitHub Actions автоматически соберет и развернет приложение

### Ручная сборка

```bash
npm run build
```

Статические файлы будут созданы в папке `dist/`.

## 🤖 Настройка Telegram Bot

1. Создайте бота через [@BotFather](https://t.me/BotFather)
2. Получите токен бота
3. Настройте Mini App через команду `/newapp`
4. Укажите URL вашего развернутого приложения
5. Загрузите иконку и описание

### Пример настройки в BotFather:

```
/newapp
@your_bot_name
Career Mini App
Карьерное приложение для развития профессиональных навыков
https://yourusername.github.io/career-miniapp/
```

## 🔧 Конфигурация

### Переменные окружения

Создайте файл `.env.local`:

```env
NEXT_PUBLIC_APP_URL=https://yourusername.github.io/career-miniapp
NEXT_PUBLIC_BOT_USERNAME=your_bot_username
```

### Настройка домена

Если используете собственный домен, обновите `assetPrefix` в `next.config.mjs`:

```javascript
assetPrefix: process.env.NODE_ENV === 'production' ? 'https://yourdomain.com' : '',
```

## 📱 Тестирование

### В браузере
Приложение можно тестировать в обычном браузере, но некоторые функции Telegram будут недоступны.

### В Telegram
1. Добавьте бота в Telegram
2. Откройте Mini App через меню бота
3. Или используйте прямую ссылку: `https://t.me/your_bot_name/app`

## 🎨 Кастомизация

### Цветовая схема
Основные цвета можно изменить в `tailwind.config.ts` и компонентах.

### Контент
Тексты и логика находятся в `career-app.tsx`.

### Telegram интеграция
Настройки Telegram Web App в `hooks/use-telegram.ts`.

## 📄 Структура проекта

```
career-miniapp/
├── app/                    # Next.js App Router
│   ├── globals.css        # Глобальные стили
│   ├── layout.tsx         # Основной layout
│   └── page.tsx           # Главная страница
├── components/            # UI компоненты
│   ├── ui/               # Базовые UI компоненты
│   └── theme-provider.tsx
├── hooks/                 # React хуки
│   ├── use-telegram.ts   # Telegram Web App API
│   └── use-toast.ts
├── lib/                   # Утилиты
├── public/               # Статические файлы
├── career-app.tsx        # Основной компонент приложения
└── README.md
```

## 🐛 Отладка

### Общие проблемы

1. **Приложение не загружается в Telegram**
   - Проверьте HTTPS (обязательно для Mini Apps)
   - Убедитесь, что URL доступен извне
   - Проверьте консоль браузера на ошибки

2. **Telegram API не работает**
   - Убедитесь, что скрипт `telegram-web-app.js` загружен
   - Проверьте, что приложение открыто в Telegram

3. **Стили не применяются**
   - Проверьте правильность путей в `assetPrefix`
   - Убедитесь, что CSS файлы доступны

## 📞 Поддержка

Если у вас возникли вопросы или проблемы:

1. Проверьте [документацию Telegram Mini Apps](https://core.telegram.org/bots/webapps)
2. Изучите [примеры Mini Apps](https://github.com/telegram-mini-apps)
3. Создайте issue в репозитории

## 📝 Лицензия

MIT License - см. файл LICENSE для деталей.