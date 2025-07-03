import requests
import json

# Проверяем ошибки в Deploy Backend to VPS
response = requests.get('https://api.github.com/repos/expaai/miniapp/actions/runs/16045947869/jobs')
data = response.json()

print('Deploy Backend to VPS job details:')
for job in data['jobs']:
    print(f'Job: {job["name"]}, Status: {job["status"]}, Conclusion: {job["conclusion"]}')
    if job['conclusion'] == 'failure':
        print(f'Job URL: {job["html_url"]}')
        print('Steps:')
        for step in job['steps']:
            if step['conclusion'] == 'failure':
                print(f'  - Failed step: {step["name"]}')
                print(f'    Started: {step["started_at"]}')
                print(f'    Completed: {step["completed_at"]}')

print('\n' + '='*50 + '\n')

# Проверяем ошибки в Deploy Full Stack
response2 = requests.get('https://api.github.com/repos/expaai/miniapp/actions/runs/16045947643/jobs')
data2 = response2.json()

print('Deploy Full Stack job details:')
for job in data2['jobs']:
    print(f'Job: {job["name"]}, Status: {job["status"]}, Conclusion: {job["conclusion"]}')
    if job['conclusion'] == 'failure':
        print(f'Job URL: {job["html_url"]}')
        print('Steps:')
        for step in job['steps']:
            if step['conclusion'] == 'failure':
                print(f'  - Failed step: {step["name"]}')
                print(f'    Started: {step["started_at"]}')
                print(f'    Completed: {step["completed_at"]}')