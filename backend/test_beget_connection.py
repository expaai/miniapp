#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Тест подключения к PostgreSQL на Beget по их примеру
"""

import psycopg2

print("🧪 Тестирование подключения к PostgreSQL на Beget")
print("=" * 60)

try:
    print("🔗 Подключаемся к базе данных...")
    
    conn = psycopg2.connect("""
        host=raputitechit.beget.app
        port=5432
        sslmode=disable
        dbname=default_db
        user=cloud_user
        password=v!y0sUEs*uQ4suuhl&&jj?
        target_session_attrs=read-write
    """)
    
    print("✅ Подключение успешно!")
    
    q = conn.cursor()
    q.execute('SELECT version()')
    
    version = q.fetchone()
    print(f"📊 Версия PostgreSQL: {version[0]}")
    
    # Проверим существующие таблицы
    q.execute("""
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
    """)
    
    tables = q.fetchall()
    print(f"📋 Найдено таблиц: {len(tables)}")
    for table in tables:
        print(f"   - {table[0]}")
    
    conn.close()
    print("✅ Тест подключения прошел успешно!")
    
except Exception as e:
    print(f"❌ Ошибка подключения: {e}")
    print("\n💡 Возможные причины:")
    print("   - База данных не создана на Beget")
    print("   - Неправильные параметры подключения")
    print("   - PostgreSQL сервер недоступен")
    print("   - Проблемы с сетевым подключением")