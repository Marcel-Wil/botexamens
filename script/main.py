import time
import os
import json
import time
import random
import json
from datetime import datetime
from camoufox.sync_api import Camoufox
import requests
import urllib3
from dotenv import load_dotenv
from scrapehtml import extract_dates_from_html
from utils import get_user_data_from_api, post_dates_to_api, get_cities_from_api

import sentry_sdk
load_dotenv()

sentry_sdk.init(
    dsn=os.getenv("SENTRY_DSN"),
    # Add data like request headers and IP for users,
    # see https://docs.sentry.io/platforms/python/data-management/data-collected/ for more info
    send_default_pii=True,
   
)


def make_post_request(payload, cookie_string):
    """Makes a POST request to the specified URL with the given payload and cookies."""
    post_url = "https://examencentrum-praktijk.autoveiligheid.be/TimeSelect/AjaxPartialTimeSelectNew"
    
    proxy = 'http://brd-customer-hl_790542c3-zone-examen:ji6jdo7xgzmb@brd.superproxy.io:33335'
    proxies = {
        'http': proxy,
        'https': proxy
    }
    
    headers = {
        'Cookie': cookie_string
    }

    try:
        response = requests.post(post_url, data=payload, headers=headers, proxies=proxies, verify=False)
        response.raise_for_status()
        return response.text
    except requests.exceptions.RequestException as e:
        print(f"Failed to make POST request: {e}")
        return None

def session_maker():
    load_dotenv()
    naam = os.getenv("NAAM", "")
    voornaam = os.getenv("VOORNAAM", "")
    rrn = os.getenv("RRN", "")
    gbdatum = os.getenv("GBDATUM", "")
    tel = os.getenv("TEL", "")
    email = os.getenv("EMAIL", "")
    adres = os.getenv("ADRES", "")
    postcode = os.getenv("POSTCODE", "")

    # WIZARD STEP 3
    zeersteVRijbewijsDatum = os.getenv("ZEERSTE_V_RIJBEWIJS_DATUM", "")
    zhuidigVRijbewijsDatum = os.getenv("ZHUIDIG_V_RIJBEWIJS_DATUM", "")
    zhuidigVRijbewijsGeldigTot = os.getenv("ZHUIDIG_V_RIJBEWIJS_GELDIG_TOT", "")

    with Camoufox(os=["macos", "windows"], geoip=True, humanize=True, headless=False) as browser:
        page = browser.new_page()
        page.goto("https://examencentrum-praktijk.autoveiligheid.be/Afspraak/nieuw")

        # Wait for the first input to be visible
        def human_type(selector, text):
            delay = random.choice([100, 150, 200])
            page.locator(selector).type(text, delay=delay)

        page.wait_for_selector("#naam")
        page.wait_for_selector("#submitButton")
        human_type("#naam", naam)
        human_type("#voornaam", voornaam)
        human_type("#rrn", rrn)
        human_type("#gbdatum", gbdatum)
        page.click('body')  # Click away to close the date picker
        human_type("#tel", tel)
        human_type("#email", email)
        human_type("#adres", adres)
        human_type("#postcode", postcode)
        page.wait_for_timeout(4000)
        page.click("#submitButton")

        # WIZARD STEP 2
        page.wait_for_selector("#catBE2")
        page.click("#catBE2")
        page.click("button.m-2:nth-child(4)")
        page.wait_for_timeout(4000)

        # WIZARD STEP 3
        page.wait_for_selector("#voorwaardenCheck")
        checkbox = page.locator("#voorwaardenCheck")
        modelrijbewijs = page.locator("#modelVRijbewijs")
        modelrijbewijs.select_option("M36")
        human_type("#zeersteVRijbewijsDatum", zeersteVRijbewijsDatum)
        page.click('body') 
        human_type("#zhuidigVRijbewijsDatum", zhuidigVRijbewijsDatum)
        page.click('body') 
        human_type("#zhuidigVRijbewijsGeldigTot", zhuidigVRijbewijsGeldigTot)
        page.click('body') 
        checkbox.check()
        page.wait_for_timeout(4000)
        page.click("button.btn-phone-50")
        
        page.wait_for_url("**/TijdSelectie", timeout=60000)
        current_url = page.url

        try:
            data_id = current_url.split('/')[-2]
        except IndexError:
            print(f"Could not extract dataId from URL: {current_url}")
            return


        cookies = page.context.cookies()
        cookie_string = "; ".join([f"{cookie['name']}={cookie['value']}" for cookie in cookies])

        urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

  
        while True:
            try:
                cities = get_cities_from_api()
            except Exception as e:
                print(f"Error fetching cities from API: {e}")
                return
            
            for city in cities:
                payload = {
                    'selectedEcId': city['code'],
                    'dataId': data_id
                }

                response_text = make_post_request(payload, cookie_string)
                if response_text:
                    extracted_dates = extract_dates_from_html(response_text)
                    
                    city_log_dir = os.path.join(os.path.dirname(__file__), 'logs', city['name'].lower())
                    os.makedirs(city_log_dir, exist_ok=True)
                    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                    file_path = os.path.join(city_log_dir, f'extracted_dates_{timestamp}.json')
                    with open(file_path, 'w', encoding='utf-8') as f:
                        json.dump(extracted_dates, f, indent=4)
                    post_dates_to_api(extracted_dates, city['name'])
            time.sleep(100)
        

if __name__ == "__main__":
    while True:
        session_maker()        
        print("Process ended. Restarting in 10 seconds...")
        time.sleep(10)
