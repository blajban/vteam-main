import requests
import json

URL = "http://localhost:3500"
ADM_ID = "1"
ADM_TOKEN = "testa1"
CITIES = [
    "malmo",
    "goteborg",
    "stockholm"
]

# Get api key for future calls
response = requests.request("GET", f"{URL}/api-key", headers={}, data={})
APIKEY = response.json()['key']
HEADERS = {
  'x-api-key': APIKEY,
  'x-access-token': ADM_TOKEN
}


# Add scooters
print("Adding scooters...")

route = "/v1/eventflows/addRandomScooters/"
for city in CITIES:
    response = requests.request("GET", f"{URL}{route}{city}/1000/{ADM_ID}", headers=HEADERS, data={})

print("Added scooters...")

# Add rates
print("Adding rates...")
with open('shared/dummy_data/location_service/rates.json') as f:
    rates = json.load(f)
    
    for rate in rates:
        payload = json.dumps({
            "newRate": {
                "id": rate['id'],
                "name": rate['name'],
                "tariff": rate['tariff']
            }
        })
        jsonHeaders = HEADERS
        jsonHeaders['Content-Type'] = 'application/json'
        route = "/v1/rates/"
        
        response = requests.request("POST", f"{URL}{route}{ADM_ID}", headers=jsonHeaders, data=payload)

print("Added rates...")


# Add locations
print("Adding parking spots...")
for city in CITIES:
    with open(f'shared/dummy_data/location_service/{city}Locations.json') as f:
        locations = json.load(f)

        for location in locations:
            payload = json.dumps({
                "location": city,
                "object": {
                    "properties": location['properties'],
                    "charging": location['charging'],
                    "rate": location['rate']
                }
            })
            jsonHeaders = HEADERS
            jsonHeaders['Content-Type'] = 'application/json'
            route1 = "/v1/city/"
            route2 = "/parking/"

            response = requests.request("POST", f"{URL}{route1}{city}{route2}{ADM_ID}", headers=jsonHeaders, data=payload)
            
print("Added parking spots...")

print("All set!")