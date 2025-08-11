import time
import os
from dotenv import load_dotenv
from utils_sbat import make_session_sbat_login, get_available_exam_dates, transform_sbat_response
from datetime import datetime
from utils import post_dates_to_api_sbat
import json

exam_centers = {
    "Sint-Denijs-Westrem": 1,
    "Brakel": 7,
    "Eeklo": 8,
    "Erembodegem": 9,
    "Sint-Niklaas": 10
}

def main():
    load_dotenv()
    email = os.getenv("SBAT_EMAIL", "")
    psswd = os.getenv("SBAT_PSSWD", "")
    
    try:
        token = make_session_sbat_login(email, psswd)
        print("using token: " + token)
    except Exception as e:
        print(f"Failed to get token: {e}")
        time.sleep(30)
        return
    while True:
        for city, center_id in exam_centers.items():
            try:
                available_date = get_available_exam_dates(token, center_id, city)
            except Exception as e:
                print(f"Failed to get available exam dates: {e}")
                return
            city_log_dir = os.path.join(os.path.dirname(__file__), 'logs', city.lower())
            os.makedirs(city_log_dir, exist_ok=True)
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            file_path = os.path.join(city_log_dir, f'extracted_dates_{timestamp}.json')
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(available_date, f, indent=4)

                post_dates_to_api_sbat(available_date, city)
        print("sleeping zzz...")

        current_time = datetime.now()
        hour = current_time.hour
        minute = current_time.minute

        if 0 <= hour < 7:
            # Between midnight and 7 AM
            sleep_seconds = 300
        elif (hour == 7 and 0 <= minute < 30) or (16 <= hour < 17):
            # Between 7:00-7:29 and 16:00-16:59
            sleep_seconds = 30
        else:
            # All other times
            sleep_seconds = 60

        time.sleep(sleep_seconds)

if __name__ == "__main__":
    while True:
        main()
        print("Process ended. Restarting in 10 seconds...")
        time.sleep(10)