import requests
import json
from datetime import datetime
import os
import traceback

def get_required_field(data_dict, key):
    """Gets a field from a dictionary or raises a ValueError if it's missing or empty."""
    value = data_dict.get(key)
    if not value:
        raise ValueError(f"Missing or empty required field: '{key}'")
    return value

def enroll_in_exam(token:str, id_afspraak:int, personal_info):
    url = "https://api.rijbewijs.sbat.be/praktijk/api/exam/scheduleForExaminee"

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
        "Connection": "keep-alive",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-site",
        "Pragma": "no-cache",
        "Cache-Control": "no-cache",
    }

    
    theoryB = get_required_field(personal_info, "datum_slagen_theorieB")
    typeVoorlopig = get_required_field(personal_info, "type_voorlopig_rijbewijs")
    temporaryB = get_required_field(personal_info, "afgiftedatum_voorlopig_rijbewijsB")
    hoeveelstePoging = get_required_field(personal_info, "hoeveelste_poging")
   
    if hoeveelstePoging == 'oneOrTwo':
        selectedAttemptsOption = 1
    elif hoeveelstePoging == 'threeOrMore':
        selectedAttemptsOption = 2

    theoryB = datetime.strptime(theoryB, "%Y-%m-%d").strftime("%Y-%m-%dT%H:%M:%S.000Z")
    temporaryB = datetime.strptime(temporaryB, "%Y-%m-%d").strftime("%Y-%m-%dT%H:%M:%S.000Z")

    if typeVoorlopig.endswith(" maand"):
        duration = int(typeVoorlopig.split()[0])  # Get the number before "maand"
    elif typeVoorlopig in ("Model 3", "Stageattest"):
        duration = 12

    additional_info = {
        "theoryB": theoryB,
        "selectedTemporaryType": {
            "text": typeVoorlopig,
            "canExpire": True,
            "duration": duration,
            "offset": 5,
            "theoryCanExpire": True,
            "warning": "Het geselecteerde type examen vereist een geldig voorlopig rijbewijs B afgegeven sinds meer dan 5 maanden."
        },
        "temporaryB": temporaryB,
        "selectedAttemptsOption": selectedAttemptsOption,
        "hasHadAdditionalLessons": None
    }
    payload = {
        "additionalInformation": json.dumps(additional_info),  # <--- IMPORTANT: stringified JSON
        "examId": id_afspraak,
        "examType": "E2",
        "licenseType": "B"
    }
    response = requests.post(url, json=payload, headers=headers)
    print(f"Status Code: {response.status_code}")
    try:
        print("Response:", response.json())
    except ValueError:
        print("Response content:", response.text)

    return response


def make_session_sbat_login(email, psswd):
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

def get_available_exam_dates(token, id_examencentra, name_examencentra):
    proxy = 'http://brd-customer-hl_790542c3-zone-examen:ji6jdo7xgzmb@brd.superproxy.io:33335'
    proxies = {
        'http': proxy,
        'https': proxy
    }
    url = "https://api.rijbewijs.sbat.be/praktijk/api/exam/available"
    #PRAKTIJEXAMEN B - AUTO
    #B - licenseType
    #E2 - examType

    #PRAKTIJKEXAMEN B2 - MOTOR - OPENBAAR (TO TEST)
    #A1 - licenseType
    #E3 - examType
    payload = {
        "examCenterId": id_examencentra,
        "licenseType": "B",
        "examType": "E2",
        "startDate": datetime.today().strftime("%Y-%m-%dT00:00")
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

    try:
        response = requests.post(url, json=payload, headers=headers, proxies=proxies)
        response.raise_for_status()

        json_response = response.json()
        # Validate that the response has the expected structure
        if not isinstance(json_response, list):
            raise ValueError(f"Expected JSON list, got {type(json_response).__name__}: {json_response}")

        newdatums = transform_sbat_response(json_response)
        return {
            "newdatums": newdatums['newdatums'],
            "city": name_examencentra
        }
    except Exception as e:
        # Create error folder
        error_folder = f"{name_examencentra}-errors"
        error_dir = os.path.join(os.path.dirname(__file__), error_folder)
        os.makedirs(error_dir, exist_ok=True)

        # Generate timestamp for error file
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        error_filename = f"error_{timestamp}.json"
        error_filepath = os.path.join(error_dir, error_filename)

        # Prepare error data
        error_data = {
            "timestamp": datetime.now().isoformat(),
            "city": name_examencentra,
            "exam_center_id": id_examencentra,
            "error_type": type(e).__name__,
            "error_message": str(e),
            "traceback": traceback.format_exc(),
            "request_details": {
                "url": url,
                "payload": payload,
                "headers": {k: v for k, v in headers.items() if k != "Authorization"}  # Exclude token for security
            }
        }

        # Add response details if available
        if 'response' in locals():
            error_data["response_details"] = {
                "status_code": response.status_code,
                "headers": dict(response.headers),
                "text": response.text[:1000] if hasattr(response, 'text') else None  # Limit text length
            }
        
        # Write error to file
        try:
            with open(error_filepath, 'w', encoding='utf-8') as f:
                json.dump(error_data, f, indent=4, ensure_ascii=False)
            print(f"Error logged to: {error_filepath}")
        except Exception as file_error:
            print(f"Failed to write error log: {file_error}")
        
        print(f"Failed to get available exam dates for {name_examencentra} (ID: {id_examencentra}): {e}")
        raise

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
                "times": [time_str],
                'id_afspraak': item['id']
            }
        else:
            grouped[date_str]["times"].append(time_str)

    return {
        "newdatums": list(grouped.values())
    }