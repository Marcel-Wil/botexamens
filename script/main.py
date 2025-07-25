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
from script.utils import get_user_data_from_api, post_dates_to_api


addons = ["/home/linux/Desktop/firefox_addons/nocaptcha"]

def auto_inschrijven(user_id: int):
    user_data = get_user_data_from_api(user_id)
    if not user_data:
        return

    personal_info = user_data.get("personal_info", {})
    naam = personal_info.get("naam", "")
    voornaam = personal_info.get("voornaam", "")
    rrn = personal_info.get("rrn", "")
    gbdatum = personal_info.get("gbdatum", "")
    tel = personal_info.get("tel", "")
    email = personal_info.get("email", "")
    adres = personal_info.get("adres", "")
    postcode = personal_info.get("postcode", "")

    license_info = user_data.get("license_info", {})
    zeersteVRijbewijsDatum = license_info.get("zeerste_v_rijbewijs_datum", "")
    zhuidigVRijbewijsDatum = license_info.get("zhuidig_v_rijbewijs_datum", "")
    zhuidigVRijbewijsGeldigTot = license_info.get("zhuidig_v_rijbewijs_geldig_tot", "")

    with Camoufox(os=["macos", "windows"], humanize=True, headless=False, addons=addons) as browser:
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
        page.wait_for_timeout(8000)
        page.click("#submitButton")

        # WIZARD STEP 2
        page.wait_for_selector("#catBE2")
        page.click("#catBE2")
        page.click("button.m-2:nth-child(4)")
        page.wait_for_timeout(8000)

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
        page.wait_for_timeout(8000)
        page.click("button.btn-phone-50")
        page.wait_for_url("**/TijdSelectie", timeout=60000)

        #functionaliteit van button clicken en inschrijven via modal
        page.click("#ec1004");

        #pak uren uit de lijst
        time_select_collapse = page.locator("#timeSelectCollapse")
        time_select_collapse.wait_for(state="visible", timeout=5000)
        date_list_items = time_select_collapse.locator("li.TimeSlotListItem")

        #click op de eerste datum in de lijst en kies de eerste uur
        item = date_list_items.nth(0)
        date_header = item.locator("li.hover-pointer")
        if date_header.is_visible():
            date_header.click()
            first_button = item.locator("button.buttenAsLink").first
            first_button.click()
            #click op bevesitg button maar wacht misschien 10 seconden zodat captcha zeker solved is
            page.wait_for_timeout(10000)
            #TODO: CLICK OP BEVESTIG BUTTON + maybe send info to our server
        
    
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

    with Camoufox(os=["macos", "windows"], geoip=True, humanize=True, headless=True) as browser:
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
        page.wait_for_timeout(8000)
        page.click("#submitButton")

        # WIZARD STEP 2
        page.wait_for_selector("#catBE2")
        page.click("#catBE2")
        page.click("button.m-2:nth-child(4)")
        page.wait_for_timeout(8000)

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
        page.wait_for_timeout(8000)
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

        post_url = "https://examencentrum-praktijk.autoveiligheid.be/TimeSelect/AjaxPartialTimeSelectNew"
        payload = {
            'selectedEcId': '1004',
            'dataId': data_id
        }

        proxy = 'http://brd-customer-hl_790542c3-zone-examen:ji6jdo7xgzmb@brd.superproxy.io:33335'
        proxies = {
            'http': proxy,
            'https': proxy
        }
        
        target_headers = {
            'Cookie': cookie_string
        }

        while True:
            try:
                response = requests.post(post_url, data=payload, headers=target_headers, proxies=proxies, verify=False)
                response.raise_for_status()


                extracted_dates = extract_dates_from_html(response.text)
                
                deurne_log_dir = os.path.join(os.path.dirname(__file__), 'logs', 'deurne')
                os.makedirs(deurne_log_dir, exist_ok=True)
                timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
                file_path = os.path.join(deurne_log_dir, f'extracted_dates_{timestamp}.json')
                with open(file_path, 'w', encoding='utf-8') as f:
                    json.dump(extracted_dates, f, indent=4)
                post_dates_to_api(extracted_dates)
            except requests.exceptions.RequestException as e:
                print(f"Failed to make POST request: {e}")
                return
            
            time.sleep(100)
        

if __name__ == "__main__":
    while True:
        session_maker()
        print("Process ended. Restarting in 10 seconds...")
        time.sleep(10)