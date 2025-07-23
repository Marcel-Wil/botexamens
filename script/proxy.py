import urllib.request
import ssl

proxy = 'http://brd-customer-hl_790542c3-zone-residential_proxy1-country-be:exz8g2ifk1c0@brd.superproxy.io:33335'
url = 'https://geo.brdtest.com/mygeo.json'

opener = urllib.request.build_opener(
    urllib.request.ProxyHandler({'https': proxy, 'http': proxy}),
    urllib.request.HTTPSHandler(context=ssl._create_unverified_context())
)

try:
    response = opener.open(url)
    print(response.read().decode())
    print(f"Connection protocol used: {response.geturl().split(':')[0].upper()}")
    print(f"Response info: {response.info()}")
except Exception as e:
    print(f"Error: {e}")