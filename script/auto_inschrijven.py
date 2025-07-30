import random
import time
import os
import sys
from camoufox import Camoufox
from utils import get_user_data_from_api


addons = ["/home/linux/Desktop/firefox_addons/nocaptcha"]

def auto_inschrijven(user_id: int):
    try:
        user_data = get_user_data_from_api(user_id)
    
        if not user_data:
            print("Failed to get user data.")
            return
        personal_info = user_data.get("personal_info", {})
        achternaam = personal_info.get("achternaam", "")
        voornaam = personal_info.get("voornaam", "")
        rrn = personal_info.get("rrn", "")
        gbdatum = personal_info.get("gbdatum", "")
        tel = personal_info.get("tel", "")
        email = personal_info.get("email", "")
        adres = personal_info.get("adres", "")
        postcode = personal_info.get("postcode", "")

        license_info = user_data.get("license_info", {})
        zeersteVRijbewijsDatum = license_info.get("zeersteVRijbewijsDatum", "")
        zhuidigVRijbewijsDatum = license_info.get("zhuidigVRijbewijsDatum", "")
        zhuidigVRijbewijsGeldigTot = license_info.get("zhuidigVRijbewijsGeldigTot", "")
        
        with Camoufox(os=["macos", "windows"], humanize=True, headless=False, addons=addons) as browser:
            page = browser.new_page()

            page.goto("https://examencentrum-praktijk.autoveiligheid.be/Afspraak/nieuw")
            page.wait_for_timeout(1000)

            # Wait for the first input to be visible
            def human_type(selector, text):
                delay = random.choice([100, 150, 200])
                page.locator(selector).type(text, delay=delay)

            page.wait_for_selector("#naam")
            page.wait_for_selector("#submitButton")
            human_type("#naam", achternaam)
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
            page.click("#ec1005");

            #pak uren uit de lijst
            time_select_collapse = page.locator("#timeSelectCollapse")
            date_list_items = time_select_collapse.locator("li.TimeSlotListItem")
            #click op de eerste datum in de lijst en kies de eerste uur
            item = date_list_items.nth(0)
            date_header = item.locator("li.hover-pointer")
            if date_header:
                date_header.click()
                first_button = item.locator("button.buttenAsLink").first
                first_button.click()
                #click op bevesitg button maar wacht misschien 10 seconden zodat captcha zeker solved is
                page.wait_for_timeout(10000)
                print("ENROLLMENT_SUCCESS")
                return
                #TODO: CLICK OP BEVESTIG BUTTON + maybe send info to our server
            
            print("Tijdstip niet gevonden")
            print("ENROLLMENT_FAILED")
            return

    except Exception as e:
        print("ENROLLMENT_FAILED")
        print(f"An error occurred during automation for user {user_id}: {e}")
        # The absence of the success message will indicate failure to the Laravel job

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Error: No user ID provided.")
        sys.exit(1)
    try:
        user_id = int(sys.argv[1])
        auto_inschrijven(user_id)
    except ValueError:
        print("Error: User ID must be an integer.")
        sys.exit(1)