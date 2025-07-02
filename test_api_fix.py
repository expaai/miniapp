#!/usr/bin/env python3
import requests
import json

def test_api():
    base_url = "https://api.expa-ai.ru"
    
    print("🔍 Тестирование API после исправления httpx...")
    
    # Тест 1: Health check
    try:
        response = requests.get(f"{base_url}/health", timeout=10)
        print(f"✅ Health check: {response.status_code}")
        print(f"📄 Response: {response.text}")
    except Exception as e:
        print(f"❌ Health check failed: {e}")
        return
    
    # Тест 2: Анализ резюме с AI
    test_data = {
        "resume_text": "Иван Иванов\nПрограммист Python\nОпыт работы: 3 года\nНавыки: Python, Django, PostgreSQL",
        "profession": "Python разработчик"
    }
    
    try:
        print("\n🤖 Тестирование анализа резюме...")
        response = requests.post(
            f"{base_url}/analyze-resume-ai",
            json=test_data,
            headers={"Content-Type": "application/json"},
            timeout=30
        )
        
        print(f"📊 Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ SUCCESS! API работает!")
            print(f"📝 Analysis length: {len(result.get('analysis', ''))} chars")
            print(f"🎯 Success: {result.get('success')}")
            print(f"💬 Message: {result.get('message')}")
        else:
            print(f"❌ FAILED! Status: {response.status_code}")
            print(f"📄 Response: {response.text}")
            
    except Exception as e:
        print(f"❌ API test failed: {e}")

if __name__ == "__main__":
    test_api()