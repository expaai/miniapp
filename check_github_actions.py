#!/usr/bin/env python3
import requests
import json

def check_github_actions():
    url = 'https://api.github.com/repos/expaai/miniapp/actions/runs?per_page=3'
    
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        
        print(f"Total workflow runs: {data.get('total_count', 'N/A')}")
        print("\n=== Latest Workflow Runs ===")
        
        if 'workflow_runs' in data and data['workflow_runs']:
            for i, run in enumerate(data['workflow_runs'][:3], 1):
                print(f"\n{i}. {run.get('name', 'N/A')}")
                print(f"   Status: {run.get('status', 'N/A')}")
                print(f"   Conclusion: {run.get('conclusion', 'N/A')}")
                print(f"   Created: {run.get('created_at', 'N/A')}")
                print(f"   Branch: {run.get('head_branch', 'N/A')}")
                print(f"   URL: {run.get('html_url', 'N/A')}")
        else:
            print("No workflow runs found")
            
    except requests.exceptions.RequestException as e:
        print(f"Error fetching GitHub Actions data: {e}")
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON response: {e}")

if __name__ == '__main__':
    check_github_actions()