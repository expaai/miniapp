#!/usr/bin/env python3
import requests
import json
import sys

def get_latest_failed_run():
    """Получить последний провалившийся запуск"""
    url = "https://api.github.com/repos/expaai/miniapp/actions/runs"
    response = requests.get(url)
    
    if response.status_code != 200:
        print(f"❌ Ошибка: {response.status_code}")
        return None
    
    data = response.json()
    
    # Ищем последний провалившийся запуск
    for run in data['workflow_runs']:
        if run['conclusion'] == 'failure':
            return run
    
    return None

def get_job_logs(job_id):
    """Получить логи job"""
    url = f"https://api.github.com/repos/expaai/miniapp/actions/jobs/{job_id}/logs"
    response = requests.get(url)
    
    if response.status_code == 200:
        return response.text
    else:
        print(f"❌ Не удалось получить логи для job {job_id}: {response.status_code}")
        return None

def analyze_logs(logs, job_name):
    """Анализ логов для поиска ошибок"""
    print(f"\n🔍 АНАЛИЗ ЛОГОВ JOB: {job_name}")
    print("=" * 60)
    
    lines = logs.split('\n')
    error_lines = []
    
    # Ищем строки с ошибками
    for i, line in enumerate(lines):
        if any(keyword in line.lower() for keyword in ['error', 'failed', 'exception', 'traceback', 'fatal']):
            # Добавляем контекст (несколько строк до и после)
            start = max(0, i-3)
            end = min(len(lines), i+4)
            context = lines[start:end]
            error_lines.extend(context)
            error_lines.append("---")
    
    if error_lines:
        print("❌ НАЙДЕННЫЕ ОШИБКИ:")
        for line in error_lines:
            print(line)
    else:
        print("ℹ️ Явных ошибок не найдено, показываю последние 50 строк:")
        for line in lines[-50:]:
            print(line)

def main():
    print("🚨 ПОЛУЧЕНИЕ ДЕТАЛЬНЫХ ЛОГОВ ПОСЛЕДНЕГО ПРОВАЛА")
    print("=" * 60)
    
    # Получаем последний провалившийся запуск
    failed_run = get_latest_failed_run()
    if not failed_run:
        print("❌ Не найдено провалившихся запусков")
        return
    
    print(f"🎯 Анализируем провал: {failed_run['name']}")
    print(f"   ID: {failed_run['id']}")
    print(f"   Время: {failed_run['created_at']}")
    print(f"   URL: {failed_run['html_url']}")
    
    # Получаем детали jobs
    jobs_url = f"https://api.github.com/repos/expaai/miniapp/actions/runs/{failed_run['id']}/jobs"
    jobs_response = requests.get(jobs_url)
    
    if jobs_response.status_code != 200:
        print(f"❌ Ошибка получения jobs: {jobs_response.status_code}")
        return
    
    jobs_data = jobs_response.json()
    
    # Анализируем каждый провалившийся job
    for job in jobs_data['jobs']:
        if job['conclusion'] == 'failure':
            print(f"\n📋 Провалившийся Job: {job['name']}")
            print(f"   ID: {job['id']}")
            print(f"   Статус: {job['conclusion']}")
            
            # Получаем логи
            logs = get_job_logs(job['id'])
            if logs:
                analyze_logs(logs, job['name'])
            else:
                print("❌ Логи недоступны")
                
                # Показываем детали шагов
                print("\n📝 Детали шагов:")
                for step in job['steps']:
                    status_icon = "❌" if step['conclusion'] == 'failure' else "✅" if step['conclusion'] == 'success' else "⏸️"
                    print(f"   {status_icon} {step['name']}: {step['conclusion']}")
                    
                    if step['conclusion'] == 'failure':
                        print(f"      Время: {step.get('started_at', 'N/A')} - {step.get('completed_at', 'N/A')}")

if __name__ == "__main__":
    main()