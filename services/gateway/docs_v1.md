# Gateway REST API documentation

## Launch event flows

### Rent scooter
```
GET /eventflows/rent_scooter/:scooterId/:userId
```
Generates a `rentScooter` event:
```
{
  ...
  "data": {
    "scooterId",
    "userId"
  }  
}
```

### Start simulation
```
GET /eventflows/simulate_scooters
```
Generates a `simulateScooters` event:
```
{
  ...
  "data": { }  
}
```

### Stop simulation
```
GET /eventflows/stop_simulation
```
Generates a `stopSimulation` event:
```
{
  ...
  "data": { }  
}
```

## Scooters
A scooter has the following attributes:

```
{
  "scooterId",
  "status",
  "userId",
  "properties": {
    "location",
    "lat",
    "lng",
    "speed",
    "battery"
  }
}
```

### Get all scooters in a city
```
GET /city/:city/scooter
```
Generates a `getScooters` RPC event:
```
{
  ...
  "data": {
    "location"
  }  
}
```
Example result:
```
[
  {
    "scooterId": 1,
    "status": "inactive",
    "userId": 0,
    "properties": {
      "location": "goteborg",
      "lat": 57.70217050702175,
      "lng": 11.988655132881263,
      "speed": "0",
      "battery": "100"
    },
    "log": []
  },
  {
    "scooterId": 3,
    "status": "inactive",
    "userId": 0,
    "properties": {
      "location": "goteborg",
      "lat": 57.6944650257589,
      "lng": 11.987281841865638,
      "speed": "0",
      "battery": "100"
    },
    "log": []
  },
  ...
]
```

### Get scooter with specific ID in a city
```
GET /city/:city/scooter/:scooterId
```
Generates a `getScooters` RPC event:
```
{
  ...
  "data": {
    "location",
    "scooterId"
  }  
}
```
Example result:
```
[
  {
    "scooterId": 5,
    "status": "inactive",
    "userId": 0,
    "properties": {
      "location": "goteborg",
      "lat": 57.68767550557455,
      "lng": 11.975608868232825,
      "speed": "0",
      "battery": "100"
    },
    "log": []
  }
]
```

### Add scooter to a city
```
POST /city/:city/scooter
```
Required parameters:
```
"lng"
"lat"
```
Generates a `addScooter` RPC event:
```
{
  ...
  "data": {
    "lng",
    "lat",
    "location"
  }  
}
```
Example result:
```
{
  "code": "200",
  "description": "Scooter added",
  "content": {
    "scooterId": 500,
    "status": "inactive",
    "userId": 0,
    "properties": {
      "location": "goteborg",
      "lat": 57.70217050702175,
      "lng": 11.956726116767982,
      "speed": 0,
      "battery": 100
    },
    "log": []
  }
}
```

### Update scooter in a city
```
PUT /city/:city/scooter/:scooterId
```
Optional parameters:
```
"status"
"location"
"lat"
"lng"
```
Generates a `updateScooter` RPC event:
```
{
  ...
  "data": {
    "scooterId",
    "status",
    "location",
    "lat",
    "lng"
  }  
}
```
Example result:
```
{
  "code": "200",
  "description": "Updated scooter",
  "content": {
    "scooterId": 500,
    "status": "available",
    "userId": 0,
    "properties": {
      "location": "goteborg",
      "lat": 5,
      "lng": 10,
      "speed": 0,
      "battery": 100
    },
    "log": []
  }
}
```

### Remove scooter in a city
```
DELETE /city/:city/scooter/:scooterId
```
Generates a `removeScooter` RPC event:
```
{
  ...
  "data": {
    "scooterId"
  }  
}
```
Example result:
```
{
  "code": "200",
  "description": "Removed scooter",
  "content": {
    "scooterId": 3,
    "status": "inactive",
    "userId": 0,
    "properties": {
      "location": "goteborg",
      "lat": 57.6944650257589,
      "lng": 11.987281841865638,
      "speed": "0",
      "battery": "100"
    },
    "log": []
  }
}
```

## Parking spots (including charging stations)
A parking spot has the following attributes:

```
{
  "parkingId",
  "location",
  "properties": {
    "lat",
    "lng"
  },
  "charging",
  "rate"
}
```

### Get all parking spots (including charging stations) in a city
```
GET /city/:city/parking
```
Generates a `getParkingSpots` RPC event:
```
{
  ...
  "data": {
    "location"
  }  
}
```
Example result:
```
[
  {
    "parkingId": 34,
    "location": goteborg,
    "properties": {
      "lat": 57.699547164654355,
      "lng": 11.979589539157711
    },
    "charging": false,
    "rate": "c"
  },
  {
    "parkingId": 35,
    "location": goteborg,
    "properties": {
      "lat": 57.69853813372487,
      "lng": 11.977529602634274
    },
    "charging": true,
    "rate": "a"
  },
  ...
]
```

### Get all charging stations (parking spots where charging is true) in a city
```
GET /city/:city/charging
```
Generates a `getChargingstations` RPC event:
```
{
  ...
  "data": {
    "location"
  }  
}
```
Example result:
```
[
  {
    "parkingId": 24,
    "location": goteborg,
    "properties": {
      "lat": 57.699547164654355,
      "lng": 11.979589539157711
    },
    "charging": true,
    "rate": "c"
  },
  {
    "parkingId": 25,
    "location": goteborg,
    "properties": {
      "lat": 57.69853813372487,
      "lng": 11.977529602634274
    },
    "charging": true,
    "rate": "a"
  },
  ...
]
```

### Add parking spot (including charging station) to a city
```
POST /city/:city/parking
```
Required parameters:
```
"lng"
"lat"
"charging"
"rate"
```
Generates a `addParkingSpot` RPC event:
```
{
  ...
  "data": {
    "lng",
    "lat",
    "charging",
    "rate",
    "location"
  }  
}
```
Example result:
```
{
  "code": "200",
  "description": "Parkingspot added",
  "content": {
    "parkingId": 500,
    "location": "goteborg",
    "properties": {
      "lat": 57.70217050702175,
      "lng": 11.956726116767982
    },
    "charging": true,
    "rate": "a"
  }
}
```

### Update parking spot (including charging station) in a city
```
PUT /city/:city/parking/:parkingId
```
Optional parameters:
```
"location"
"lng"
"lat"
"charging"
"rate"
```
Generates a `updateParkingSpot` RPC event:
```
{
  ...
  "data": {
    "parkingId",
    "location",
    "lng",
    "lat",
    "charging",
    "rate"
  }  
}
```
Example result:
```
{
  "code": "200",
  "description": "Updated parkingspot",
  "content": {
    "parkingId": 500,
    "location": "goteborg",
    "properties": {
      "lat": 57.70217050702175,
      "lng": 11.956726116767982
    },
    "charging": false,
    "rate": "a"
  }
}
```

### Remove parking spot (or charigng station) in a city
```
DELETE /city/:city/parking/:parkingId
```
Generates a `removeParkingSpot` RPC event:
```
{
  ...
  "data": {
    "parkingId"
  }  
}
```
Example result:
```
{
  "code": "200",
  "description": "Removed parkingspot",
  "content": {
    "parkingId": 500,
    "location": "goteborg",
    "properties": {
      "lat": 57.70217050702175,
      "lng": 11.956726116767982
    },
    "charging": false,
    "rate": "a"
  }
}
```

## Users
A user has the following attributes:

```
{
  "userId",
  "name",
  "mobile",
  "mail",
  "city",
  "address",
  "zip",
  "admin",
  "balance"
}
```

### Get all users
```
GET /users
```
Generates a `getUsers` RPC event:
```
{
  ...
  "data": { }  
}
```
Example result:
```
[
  {
    "userId": 2,
    "name": "Sanna Wahlgren",
    "mobile": "0705554933",
    "mail": "sanna.wahlgren@torhamn.com",
    "city": "Torhamn",
    "address": "Torhamnsstigen 35",
    "zip": "37042",
    "admin": false,
    "balance": 0
  },
  {
    "userId": 3,
    "name": "Anni Öhrn",
    "mobile": "0705554085",
    "mail": "anni.ohrn@karlskrona.com",
    "city": "Karlskrona",
    "address": "Karlskronagatan 24",
    "zip": "37130",
    "admin": false,
    "balance": 0
  },
  ...
]
```

### Get user with specific ID
```
GET /users/:userId
```
Generates a `getUsers` RPC event:
```
{
  ...
  "data": {
    "userId"
  }  
}
```
Example result:
```
[
  {
    "userId": 2,
    "name": "Sanna Wahlgren",
    "mobile": "0705554933",
    "mail": "sanna.wahlgren@torhamn.com",
    "city": "Torhamn",
    "address": "Torhamnsstigen 35",
    "zip": "37042",
    "admin": false,
    "balance": 0
  }
]
```

### Add user
```
POST /users
```
Required parameters:
```
"name"
"mobile"
"mail"
"city"
"address"
"zip"
"admin"
```
Generates a `addUser` RPC event:
```
{
  ...
  "data": {
    "name",
    "mobile",
    "mail",
    "city",
    "address",
    "zip",
    "admin"
  }  
}
```
Example result:
```
{
  "code": "200",
  "description": "User added",
  "content": {
    "userId": 25,
    "name": "Sanna Wahlgren",
    "mobile": "0705554933",
    "mail": "sanna.wahlgren@torhamn.com",
    "city": "Torhamn",
    "address": "Torhamnsstigen 35",
    "zip": "37042",
    "admin": false,
    "balance": 0
  }
}
```

### Update user
```
PUT /users/:userId
```
Optional parameters:
```
"name"
"mobile"
"mail"
"city"
"address"
"zip"
"admin"
"balance"
```
Generates a `updateUser` RPC event:
```
{
  ...
  "data": {
    "userId",
    "name",
    "mobile",
    "mail",
    "city",
    "address",
    "zip",
    "admin",
    "balance"
  }  
}
```
Example result:
```
{
  "code": "200",
  "description": "Updated user",
  "content": {
    "userId": 25,
    "name": "Sanna Wahlgren",
    "mobile": "0705554933",
    "mail": "sanna.wahlgren@torhamn.com",
    "city": "Torhamn",
    "address": "Torhamnsstigen 35",
    "zip": "37042",
    "admin": false,
    "balance": 500
  }
}
```

### Remove user
```
DELETE /users/:userId
```
Generates a `removeUser` RPC event:
```
{
  ...
  "data": {
    "userId"
  }  
}
```
Example result:
```
{
  "code": "200",
  "description": "Removed parkingspot",
  "content": {
    "userId": 35,
    "name": "Sanna Wahlgren",
    "mobile": "0705554933",
    "mail": "sanna.wahlgren@torhamn.com",
    "city": "Torhamn",
    "address": "Torhamnsstigen 35",
    "zip": "37042",
    "admin": false,
    "balance": 0
  }
}
```

## Invoices
An invoice have the following attributes:

```
{
  "invoiceId"
  "userId",
  "status",
  "start": {
    "lat",
    "lng",
    "time"  
  },
  "end": {
    "lat",
    "lng",
    "time"  
  },
  "price"
}
```

### Add invoice
```
POST /invoice
```
Required parameters:
```
"userId"
"startLat"
"startLng"
"startTime"
"endLat"
"endLng"
"endTime"
```
Generates a `addInvoice` RPC event:
```
{
  ...
  "data": {
    "userId",
    "start": {
      "lat",
      "lng",
      "time"
    },
    "end": {
      "lat",
      "lng",
      "time
    }
  }  
}
```
Example result:
```
{
  "code": "200",
  "description": "Invoice added",
  "content": {
    "invoiceId": 1,
    "userId": 2,
    "status": "pending",
    "start": {
      "lat": "45.43344324",
      "lng": "32.454543654,
      "time": "2022-11-01T11:00:00Z"  
    },
    "end": {
      "lat": "58.58502",
      "lng": "58.58502",
      "time": "2022-11-01T11:00:00Z"
    },
    "price": 247.9
  }
}
```

### Get all invoices for a specific user
```
GET /invoice/user/:userId
```
Generates a `getInvoices` RPC event:
```
{
  ...
  "data": {
    "userId"
  }  
}
```
Example result:
```
[
  {
    "invoiceId": 1,
    "userId": 2,
    "status": "paid",
    "start": {
      "lat": "45.43344324",
      "lng": "32.454543654,
      "time": "2022-11-01T11:00:00Z"  
    },
    "end": {
      "lat": "58.58502",
      "lng": "58.58502",
      "time": "2022-11-01T11:00:00Z"
    },
    "price": 247.9
  },
  {
    "invoiceId": 2,
    "userId": 2,
    "status": "pending",
    "start": {
      "lat": "45.43344324",
      "lng": "32.454543654,
      "time": "2022-12-01T11:00:00Z"  
    },
    "end": {
      "lat": "58.58502",
      "lng": "58.58502",
      "time": "2022-12-01T11:00:00Z"
    },
    "price": 247.9
  },
  ...
]
```

### Get invoice with a specific ID
```
GET /invoice/:invoiceId
```
Generates a `getInvoices` RPC event:
```
{
  ...
  "data": {
    "invoiceId"
  }  
}
```
Example result:
```
[
  {
    "invoiceId": 1,
    "userId": 2,
    "status": "paid",
    "start": {
      "lat": "45.43344324",
      "lng": "32.454543654,
      "time": "2022-11-01T11:00:00Z"  
    },
    "end": {
      "lat": "58.58502",
      "lng": "58.58502",
      "time": "2022-11-01T11:00:00Z"
    },
    "price": 247.9
  }
]
```

## Rates
A rate has the following attributes:

```
"rateId": {
  "name",
  "tariff"
}
```

### Get all rates
```
GET /rates
```
Generates a `getRates` RPC event:
```
{
  ...
  "data": { }  
}
```
Example result:
```
[
  {
    "a": {
      "name": "A rate name",
      "tariff": 200
    },
    "b": {
      "name": "Another rate name",
      "tariff": 400
    },
    "c": {
      "name": "Yet another rate name",
      "tariff": 600
    }
  }
]
```

### Get rate with specific ID
```
GET /rates/:rateId
```
Generates a `getRates` RPC event:
```
{
  ...
  "data": { 
    "rateId"
  }  
}
```
Example result:
```
[
  {
    "a": {
      "name": "A rate name",
      "tariff": 200
    }
  }
]
```

### Add rate
```
POST /rates
```
Required parameters:
```
"name"
"tariff"
```
Generates a `addRate` RPC event:
```
{
  ...
  "data": { 
    "tariff"
  }  
}
```
Example result:
```
{
  "code": "200",
  "description": "Rate added",
  "content": {
      "d": {
        "name": "Still a rate name",
        "tariff": 600
      }
  }
}
```

### Update rate
```
PUT /rates/:rateId
```
Optional parameters:
```
"name"
"tariff"
```
Generates a `updateRate` RPC event:
```
{
  ...
  "data": {
    "rateId",
    "name",
    "tariff"
  }  
}
```
Example result:
```
{
  "code": "200",
  "description": "Updated rate",
  "content": {
    "d": {
      "name": "This is a new name",
      "tariff": 700
    }
  }
}
```

### Remove rate
```
DELETE /rates/:rateId
```
Generates a `removeRate` RPC event:
```
{
  ...
  "data": {
    "rateId"
  }  
}
```
Example result:
```
{
  "code": "200",
  "description": "Removed rate",
  "content": {
    "d": {
      "name": "This is a new name",
      "tariff": 700
    }
  }
}
```


