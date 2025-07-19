from bs4 import BeautifulSoup
import re
import json


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

# Example usage (now expects HTML content as a string):
with open("logs/outputHTML_2025-07-17_16-34-0.html", "r", encoding="utf-8") as f:
    html_content = f.read()
dates = extract_dates_from_html(html_content)
print(json.dumps(dates, indent=4))

