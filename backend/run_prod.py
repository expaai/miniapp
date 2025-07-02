#!/usr/bin/env python3
"""
Скрипт для запуска в продакшн режиме
Использует PostgreSQL и продакшн настройки
"""

import os
import subprocess
import sys

def main():
    # Устанавливаем переменную окружения для продакшна
    os.environ['ENVIRONMENT'] = 'production'
    
    print("🚀 Запуск в продакшн режиме...")
    print("📊 База данных: PostgreSQL (Beget)")
    print("🌐 Сервер: http://0.0.0.0:8000")
    print("-" * 50)
    
    try:
        # Запускаем uvicorn без автоперезагрузки для продакшна
        subprocess.run([
            sys.executable, "-m", "uvicorn", 
            "main:app", 
            "--host", "0.0.0.0", 
            "--port", "8000",
            "--workers", "1"  # Можно увеличить для продакшна
        ], check=True)
    except KeyboardInterrupt:
        print("\n👋 Сервер остановлен")
    except subprocess.CalledProcessError as e:
        print(f"❌ Ошибка запуска: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()