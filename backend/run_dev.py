#!/usr/bin/env python3
"""
Скрипт для запуска в режиме разработки
Использует SQLite и локальные настройки
"""

import os
import subprocess
import sys

def main():
    # Устанавливаем переменную окружения для разработки
    os.environ['ENVIRONMENT'] = 'development'
    
    print("🔧 Запуск в режиме разработки...")
    print("📊 База данных: SQLite (локальная)")
    print("🌐 Сервер: http://localhost:8000")
    print("📝 Документация: http://localhost:8000/docs")
    print("-" * 50)
    
    try:
        # Переходим в директорию backend
        backend_dir = os.path.dirname(os.path.abspath(__file__))
        os.chdir(backend_dir)
        
        # Запускаем uvicorn с автоперезагрузкой
        subprocess.run([
            sys.executable, "-m", "uvicorn", 
            "main:app", 
            "--host", "0.0.0.0", 
            "--port", "8000", 
            "--reload"
        ], check=True)
    except KeyboardInterrupt:
        print("\n👋 Сервер остановлен")
    except subprocess.CalledProcessError as e:
        print(f"❌ Ошибка запуска: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()