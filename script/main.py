import time
import os
import random
from datetime import datetime
from camoufox.sync_api import Camoufox
import requests


def main2():
    proxy_config = {
        'server': 'brd.superproxy.io:33335',
        'username': 'brd-customer-hl_790542c3-zone-residential_proxy1-country-be',
        'password': 'exz8g2ifk1c0'
    }
    with Camoufox(os=["macos", "windows"], geoip=True, humanize=True, proxy=proxy_config, headless=False) as browser:
        page = browser.new_page(ignore_https_errors=True)
        page.goto("https://geo.brdtest.com/mygeo.json")
        time.sleep(30)

def post_dates_to_api(dates):
    server = os.getenv("SERVER", "localhost")
    port = os.getenv("PORT", "8000")
    url = f"http://{server}:{port}/api/compare-datums"
    try:
        payload = {"newdatums": dates}
        headers = {"Accept": "application/json"}
        response = requests.post(url, json=payload, headers=headers)
        response.raise_for_status()
        print(f"Successfully posted dates to {url}. Response: {response.json()}")
    except Exception as e:
        print(f"Failed to post dates to {url}: {e}")

from dotenv import load_dotenv

def main():
    cert_path = os.path.join(os.path.dirname(__file__), 'certs', 'new_cert', 'brightdata.crt')
    os.environ['SSL_CERT_FILE'] = cert_path
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

    with Camoufox(os=["macos", "windows"], geoip=True, humanize=True) as browser:
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

        # WIZARD STEP 4
        while True:
            try:
                html_content = None
                # Wait for the button to be present. If it's not, something is wrong.
                page.wait_for_selector("#ec1004", timeout=20000)

                def handle_response(response):
                    nonlocal html_content
                    if "AjaxPartialTimeSelectNew" in response.url and response.request.method == "POST":
                        print(f"Captured response from {response.url}")
                        try:
                            html_content = response.text()
                        except Exception as e:
                            print(f"Error getting response text: {e}")

                # Listen for responses before clicking
                page.on("response", handle_response)

                print("Clicking the 'Deurne' button...")
                page.click("#ec1004")

                # Wait for the response to be captured
                page.wait_for_timeout(5000)

                page.remove_listener("response", handle_response)

                if html_content:
                    if not os.path.exists("logs/deurne"):
                        os.makedirs("logs/deurne")
                    
                    from scrapehtml import extract_dates_from_html
                    import json
                    
                    timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
                    filename = f"logs/deurne/outputHTML_{timestamp}.json"

                    print(f"Extracting dates and saving response to {filename}")
                    dates = extract_dates_from_html(html_content)
                    with open(filename, "w", encoding="utf-8") as f:
                        json.dump(dates, f, indent=4)
                    print("Save complete.")
                    post_dates_to_api(dates)
                else:
                    print("Could not capture the HTML content in this interval.")

                print("Waiting for 60 seconds before next check...")
                time.sleep(60)
            except Exception as e:
                print(f"An error occurred: {e}")
                print("This might be due to a session timeout, rate limit, or block.")
                print("Exiting the program gracefully.")
                break
        
        browser.close()
        time.sleep(5)
        main()

if __name__ == "__main__":
    main2()