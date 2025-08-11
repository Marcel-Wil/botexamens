from utils import get_user_data_from_api
from utils_sbat import make_session_sbat_login, enroll_in_exam
import sys
exam_centers = {
    "Sint-Denijs-Westrem": 1,
    "Brakel": 7,
    "Eeklo": 8,
    "Erembodegem": 9,
    "Sint-Niklaas": 10
}

def get_required_field(data_dict, key):
    """Gets a field from a dictionary or raises a ValueError if it's missing or empty."""
    value = data_dict.get(key)
    if not value:
        raise ValueError(f"Missing or empty required field: '{key}'")
    return value

def auto_inschrijven_sbat(user_id: int, city_code: int, id_afspraak: int):
    try:
        user_data = get_user_data_from_api(user_id)
        if not user_data:
            raise ValueError("Failed to get user data from API.")
        peronsal_info = get_required_field(user_data, "personal_info")
        sbat_email = get_required_field(peronsal_info, "sbat_email")
        sbat_psswd = get_required_field(peronsal_info, "sbat_password")
        token = make_session_sbat_login(sbat_email, sbat_psswd)
        if not token:
            raise ValueError("Failed to get token from Sbat API.")

        #enroll in exam
        response = enroll_in_exam(token, id_afspraak, peronsal_info)
        if response.status_code != 200:
            raise ValueError("Failed to enroll in exam.")
        print("ENROLLMENT_SUCCESS")
    except Exception as e:
        print("ENROLLMENT_FAILED")
        print(f"An error occurred during automation for user {user_id}: {e}")
        return
    

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Error: No user ID or city code provided.")
        sys.exit(1)
    try:
        user_id = int(sys.argv[1])
        city_code = int(sys.argv[2])
        id_afspraak = int(sys.argv[3])
        auto_inschrijven_sbat(user_id, city_code, id_afspraak)
    except ValueError:
        print("user_id must be an integer, city_code must be a string")
        sys.exit(1)