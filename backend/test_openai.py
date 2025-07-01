#!/usr/bin/env python3

import os
from dotenv import load_dotenv
from openai import OpenAI

# Загружаем переменные окружения
load_dotenv()

def test_openai_api():
    """Тестирование OpenAI API"""
    try:
        # Получаем API ключ
        api_key = os.getenv('OPENAI_API_KEY')
        if not api_key:
            print("❌ OpenAI API ключ не найден в .env файле")
            return False
        
        print(f"✅ API ключ найден: {api_key[:10]}...")
        
        # Инициализируем клиент
        print("🔄 Инициализируем OpenAI клиент...")
        client = OpenAI(api_key=api_key)
        print("✅ OpenAI клиент успешно инициализирован")
        
        # Делаем тестовый запрос
        print("🔄 Отправляем тестовый запрос...")
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "user", "content": "Привет! Это тест. Ответь одним словом: работает"}
            ],
            max_tokens=10
        )
        
        result = response.choices[0].message.content
        print(f"✅ Ответ получен: {result}")
        return True
        
    except Exception as e:
        print(f"❌ Ошибка: {str(e)}")
        print(f"❌ Тип ошибки: {type(e).__name__}")
        return False

if __name__ == "__main__":
    print("🧪 Тестирование OpenAI API...")
    success = test_openai_api()
    if success:
        print("🎉 Тест прошел успешно!")
    else:
        print("💥 Тест провален!")