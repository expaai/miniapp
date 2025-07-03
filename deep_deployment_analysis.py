#!/usr/bin/env python3
import requests
import json
import sys
from datetime import datetime

def get_workflow_runs():
    """Получить последние запуски workflow"""
    url = "https://api.github.com/repos/expaai/miniapp/actions/runs"
    response = requests.get(url)
    
    if response.status_code != 200:
        print(f"❌ Ошибка получения workflow runs: {response.status_code}")
        print(response.text)
        return None
    
    return response.json()

def get_job_details(run_id):
    """Получить детали jobs для конкретного run"""
    url = f"https://api.github.com/repos/expaai/miniapp/actions/runs/{run_id}/jobs"
    response = requests.get(url)
    
    if response.status_code != 200:
        print(f"❌ Ошибка получения job details для run {run_id}: {response.status_code}")
        return None
    
    return response.json()

def analyze_failed_step(step):
    """Анализ провалившегося шага"""
    print(f"    ❌ Шаг '{step['name']}' провалился")
    print(f"       Статус: {step['conclusion']}")
    if 'started_at' in step and 'completed_at' in step:
        print(f"       Время выполнения: {step['started_at']} - {step['completed_at']}")

def main():
    print("🔍 ГЛУБОКИЙ АНАЛИЗ ПРОБЛЕМ ДЕПЛОЯ")
    print("=" * 50)
    
    # Получаем последние запуски
    runs_data = get_workflow_runs()
    if not runs_data:
        return
    
    print(f"📊 Найдено {len(runs_data['workflow_runs'])} запусков workflow")
    print()
    
    # Анализируем последние 10 запусков
    for i, run in enumerate(runs_data['workflow_runs'][:10]):
        print(f"🚀 Запуск #{i+1}: {run['name']}")
        print(f"   ID: {run['id']}")
        print(f"   Статус: {run['status']} / {run['conclusion']}")
        print(f"   Ветка: {run['head_branch']}")
        print(f"   Время: {run['created_at']}")
        print(f"   URL: {run['html_url']}")
        
        # Если запуск провалился, анализируем детали
        if run['conclusion'] == 'failure':
            print(f"   ❌ ПРОВАЛ - анализируем детали...")
            
            job_details = get_job_details(run['id'])
            if job_details and 'jobs' in job_details:
                for job in job_details['jobs']:
                    print(f"     📋 Job: {job['name']}")
                    print(f"        Статус: {job['status']} / {job['conclusion']}")
                    
                    if job['conclusion'] == 'failure':
                        print(f"        ❌ JOB ПРОВАЛИЛСЯ")
                        
                        # Анализируем шаги
                        for step in job['steps']:
                            if step['conclusion'] == 'failure':
                                analyze_failed_step(step)
                                
                                # Пытаемся получить логи (если доступны)
                                if 'number' in step:
                                    log_url = f"https://api.github.com/repos/expaai/miniapp/actions/jobs/{job['id']}/logs"
                                    print(f"        📝 Логи доступны по: {log_url}")
        
        print()
    
    print("🔍 АНАЛИЗ ЗАВЕРШЕН")
    print("=" * 50)
    
    # Подсчет статистики
    failed_runs = [run for run in runs_data['workflow_runs'][:10] if run['conclusion'] == 'failure']
    success_runs = [run for run in runs_data['workflow_runs'][:10] if run['conclusion'] == 'success']
    
    print(f"📈 СТАТИСТИКА (последние 10 запусков):")
    print(f"   ❌ Провалов: {len(failed_runs)}")
    print(f"   ✅ Успешных: {len(success_runs)}")
    print(f"   📊 Процент успеха: {len(success_runs)/10*100:.1f}%")
    
    if failed_runs:
        print(f"\n🚨 ПОСЛЕДНИЕ ПРОВАЛЫ:")
        for run in failed_runs[:3]:
            print(f"   - {run['name']} ({run['created_at']})")

if __name__ == "__main__":
    main()