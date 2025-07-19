import time
import os
import random
from datetime import datetime
from camoufox.sync_api import Camoufox
import requests
from bs4 import BeautifulSoup
import re

def extract_dates_from_html(html_content):
    soup = BeautifulSoup(html_content, "html.parser")

    results = []
    # Find the main div
    main_div = soup.find("div", id="timeSelectCollapse")
    if not main_div:
        return results

    # Find all <li class="hover-pointer" ...>
    for li in main_div.find_all("li", class_="hover-pointer"):
        data_target = li.get("data-target")
        if not data_target:
            continue
        # Extract date from data-target, e.g. "#TimeSlotCard19012026"
        m = re.search(r"TimeSlotCard(\d{2})(\d{2})(\d{4})", data_target)
        if not m:
            continue
        day, month, year = m.groups()
        formatted_date = f"{day}/{month}/{year}"

        # Get the text inside the <span>
        span = li.find("span", class_="TimeSlotListCardChildText")
        if span:
            text_value = span.get_text(strip=True)
        else:
            text_value = ""

        results.append({
            "date": formatted_date,
            "text": text_value
        })

    return results

def post_dates_to_api(dates):
    url = "http://localhost:8000/api/send-datums"
    try:
        response = requests.post(url, json=dates)
        response.raise_for_status()
        print(f"Successfully posted dates to {url}. Status code: {response.status_code}")
    except Exception as e:
        print(f"Failed to post dates to {url}: {e}")

def main():
    # WIZARD STEP 1
    naam = ""
    voornaam = ""
    rrn = ""
    gbdatum = ""
    tel = ""
    email = ""
    adres = ""
    postcode = ""

    # WIZARD STEP 3
    zeersteVRijbewijsDatum = ""
    zhuidigVRijbewijsDatum = ""
    zhuidigVRijbewijsGeldigTot = ""

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

if __name__ == "__main__":
    main()