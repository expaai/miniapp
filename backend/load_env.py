import os
from dotenv import load_dotenv

def load_environment():
    """
    Загружает переменные окружения в зависимости от среды:
    - Если ENVIRONMENT=development или не установлена, загружает .env.local
    - Если ENVIRONMENT=production, загружает .env.production
    - Всегда загружает базовый .env как fallback
    """
    # Сначала загружаем базовый .env
    load_dotenv('.env')
    
    # Определяем среду
    environment = os.getenv('ENVIRONMENT', 'development')
    
    if environment == 'development':
        # Для разработки загружаем .env.local (перезаписывает базовые настройки)
        if os.path.exists('.env.local'):
            load_dotenv('.env.local', override=True)
            print("🔧 Загружена локальная среда разработки (.env.local)")
        else:
            print("⚠️  Файл .env.local не найден, используются настройки из .env")
    elif environment == 'production':
        # Для продакшна загружаем .env.production
        if os.path.exists('.env.production'):
            load_dotenv('.env.production', override=True)
            print("🚀 Загружена продакшн среда (.env.production)")
        else:
            print("⚠️  Файл .env.production не найден, используются настройки из .env")
    
    # Выводим информацию о текущей конфигурации
    db_url = os.getenv('DATABASE_URL', 'не установлен')
    if 'sqlite' in db_url.lower():
        print(f"📊 База данных: SQLite (локальная разработка)")
    elif 'postgresql' in db_url.lower():
        print(f"📊 База данных: PostgreSQL (продакшн)")
    else:
        print(f"📊 База данных: {db_url}")
    
    return environment

if __name__ == "__main__":
    load_environment()