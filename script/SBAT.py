import time
import os
from dotenv import load_dotenv
import requests
from datetime import datetime
from utils import post_dates_to_api_sbat


exam_centers = {
    "Sint-Denijs-Westrem": 1,
    "Brakel": 7,
    "Eeklo": 8,
    "Erembodegem": 9,
    "Sint-Niklaas": 10
}

def transform_sbat_response(raw_sbat_data):
    if not raw_sbat_data:
        return {
            "newdatums": []
        }

    grouped = {}

    # Loop directly over list of exam slots
    for item in raw_sbat_data:
        dt_from = datetime.fromisoformat(item['from'])
        date_str = dt_from.strftime("%d/%m/%Y")
        time_str = dt_from.strftime("%H:%M")
        weekday_short = dt_from.strftime("%a").lower()

        # Create label like "tue 05/08"
        text_str = f"{weekday_short} {dt_from.strftime('%d/%m')}"

        if date_str not in grouped:
            grouped[date_str] = {
                "date": date_str,
                "text": text_str,
                "times": [time_str]
            }
        else:
            grouped[date_str]["times"].append(time_str)

    return {
        "newdatums": list(grouped.values())
    }


def make_session_sbat_login():
        load_dotenv()
        email = os.getenv("SBAT_EMAIL", "")
        psswd = os.getenv("SBAT_PSSWD", "")
        url = "https://api.rijbewijs.sbat.be/praktijk/api/user/authenticate"
        payload = {
            "username": email,
            "password": psswd
        }

        headers = {
            "Content-Type": "application/json",
            "User-Agent": "Mozilla/5.0",
            "Origin": "https://rijbewijs.sbat.be",
            "Referer": "https://rijbewijs.sbat.be/praktijk/examen/Login"
        }

        response = requests.post(url, json=payload, headers=headers)
        return response.text.strip()

#PRAKTIJEXAMEN B - AUTO
#B - licenseType
#E2 - examType

#PRAKTIJKEXAMEN B2 - MOTOR - OPENBAAR (TO TEST)
#A1 - licenseType
#E3 - examType

def get_available_exam_dates(token, id_examencentra, name_examencentra):
    url = "https://api.rijbewijs.sbat.be/praktijk/api/exam/available"

    payload = {
        "examCenterId": id_examencentra,
        "licenseType": "A1",
        "examType": "E3",
        "startDate": "2025-08-03T00:00"
    }

    headers = {
        "Host": "api.rijbewijs.sbat.be",
        "User-Agent": "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:141.0) Gecko/20100101 Firefox/141.0",
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate, br, zstd",
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
        "Origin": "https://rijbewijs.sbat.be",
        "Referer": "https://rijbewijs.sbat.be/",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-site",
        "Pragma": "no-cache",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "Priority": "u=0"
    }

    response = requests.post(url, json=payload, headers=headers)

    if response.status_code == 200:
        try:
            response = requests.post(url, json=payload, headers=headers)
            response.raise_for_status()
            newdatums = transform_sbat_response(response.json())
            return {
                "newdatums": newdatums['newdatums'],
                "city": name_examencentra
            }
        except Exception as e:
            print(f"Failed to fetch or process data for {name_examencentra} (ID: {id_examencentra}): {e}")
            return {
                "newdatums": [],
                "city": name_examencentra
            }
    return response


if __name__ == "__main__":
    while True:
        try:
            token = make_session_sbat_login()
            print("using token: " + token)
        except Exception as e:
            print(f"Failed to get token: {e}")
            time.sleep(30)
            continue
        while True:
            for city, center_id in exam_centers.items():
                try:
                    available_date = get_available_exam_dates(token, center_id, city)
                    post_dates_to_api_sbat(available_date, city)
                except Exception as e:
                    error_msg = str(e).lower()
                    print(f"⚠️ Error for {city}: {e}")
                    if "403" in error_msg or "unauthorized" in error_msg or "token" in error_msg:
                        break
                    else:
                        continue
            print("sleeping zzz...")
            time.sleep(60)