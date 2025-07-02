#!/usr/bin/env python3
"""
Скрипт для тестирования подключения к базе данных PostgreSQL
"""

import os
import sys
from dotenv import load_dotenv
from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError

def test_database_connection():
    """
    Тестирует подключение к базе данных PostgreSQL
    """
    # Загружаем переменные окружения
    load_dotenv()
    
    database_url = os.getenv('DATABASE_URL')
    
    if not database_url:
        print("❌ ERROR: DATABASE_URL не найден в .env файле")
        print("Пожалуйста, добавьте DATABASE_URL в файл .env")
        return False
    
    print(f"🔗 Тестируем подключение к базе данных...")
    print(f"📍 URL: {database_url.replace(database_url.split('@')[0].split('//')[1], '***:***')}")
    
    try:
        # Создаем движок базы данных
        engine = create_engine(database_url)
        
        # Тестируем подключение
        with engine.connect() as connection:
            result = connection.execute(text("SELECT version();"))
            version = result.fetchone()[0]
            print(f"✅ Подключение успешно!")
            print(f"📊 Версия PostgreSQL: {version}")
            
            # Проверяем существующие таблицы
            result = connection.execute(text("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
                ORDER BY table_name;
            """))
            
            tables = [row[0] for row in result.fetchall()]
            
            if tables:
                print(f"📋 Существующие таблицы: {', '.join(tables)}")
            else:
                print("📋 Таблицы не найдены (база данных пустая)")
                print("💡 Запустите 'alembic upgrade head' для создания таблиц")
            
            return True
            
    except SQLAlchemyError as e:
        print(f"❌ Ошибка подключения к базе данных:")
        print(f"   {str(e)}")
        
        # Дополнительные советы по устранению ошибок
        error_str = str(e).lower()
        
        if "could not connect" in error_str:
            print("\n💡 Возможные причины:")
            print("   - Неверный хост или порт")
            print("   - База данных не создана на Beget")
            print("   - Проблемы с сетевым подключением")
            
        elif "authentication failed" in error_str:
            print("\n💡 Возможные причины:")
            print("   - Неверное имя пользователя или пароль")
            print("   - Пользователь не имеет доступа к базе данных")
            
        elif "database" in error_str and "does not exist" in error_str:
            print("\n💡 Возможные причины:")
            print("   - База данных не создана")
            print("   - Неверное имя базы данных в DATABASE_URL")
            
        return False
        
    except Exception as e:
        print(f"❌ Неожиданная ошибка: {str(e)}")
        return False

def main():
    print("🧪 Тестирование подключения к базе данных PostgreSQL")
    print("=" * 60)
    
    success = test_database_connection()
    
    print("=" * 60)
    
    if success:
        print("🎉 Тест подключения прошел успешно!")
        print("✅ Вы можете запускать приложение")
        sys.exit(0)
    else:
        print("💥 Тест подключения не прошел")
        print("📖 Проверьте инструкции в DATABASE_SETUP.md")
        sys.exit(1)

if __name__ == "__main__":
    main()