import os
import requests
import json
from dotenv import load_dotenv


def post_dates_to_api(dates):
    load_dotenv()
    server = os.getenv("SERVER", "localhost")
    port = os.getenv("PORT", "8000")
    url = f"http://{server}:{port}/api/compare-datums"
    try:
        payload = dates
        headers = {"Accept": "application/json"}
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()
    except Exception as e:
        print(f"Failed to post dates to {url}: {e}")


def get_user_data_from_api(user_id: int) -> dict:
    load_dotenv()
    server = os.getenv("SERVER", "localhost")
    port = os.getenv("PORT", "8000")
    url = f"http://{server}:{port}/api/user/{user_id}"
    try:
        response = requests.get(url)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching user data from API: {e}")
        return {} 