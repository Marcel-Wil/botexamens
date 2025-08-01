import os
import requests
import json
from dotenv import load_dotenv


def post_dates_to_api(dates, city_name):
    load_dotenv()
    server = os.getenv("SERVER", "127.0.0.1")
    port = os.getenv("PORT", "8000")
    url = f"http://{server}:{port}/api/compare-datums"
    try:
        payload = {
            'newdatums': dates['newdatums'],  
            'city': city_name
        }
        headers = {"Accept": "application/json"}
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()
        print(f"Successfully posted dates for {city_name}.")
    except Exception as e:
        print(f"Failed to post dates to {url} for {city_name}: {e}")
        if 'response' in locals():
            print(f"Response content: {response.text}")


def get_user_data_from_api(user_id: int) -> dict:
    load_dotenv()
    server = os.getenv("SERVER", "127.0.0.1")
    port = os.getenv("PORT", "8000")
    url = f"http://{server}:{port}/api/user/{user_id}"
    try:
        response = requests.get(url)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching user data from API: {e}")
        return {}

def get_cities_from_api():
    """Fetches all cities from the API."""
    load_dotenv()
    server = os.getenv("SERVER", "127.0.0.1")
    port = os.getenv("PORT", "8000")
    url = f"http://{server}:{port}/api/cities"
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error fetching cities from API: {e}")
        return [] 