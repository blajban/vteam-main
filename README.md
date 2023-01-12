# vteam

A scooter rental system school project at Blekinge Tekniska Högskola.

![Scooter app](https://github.com/blajban/vteam-main/blob/main/readme/scooter_app.png "Scooter app")

## Install and run
You need two different GitHub OAuth apps for the system to be able to log in and use the system as intended. Make sure the one for CLIENT has device flow enabled.

1. Clone repo
2. Add a `.env` file to the root folder and add the following:
```
TESTTOKEN="testa1"
TESTADMINID="1"
GITHUB_WEB_CLIENT_ID="your_id"
GITHUB_WEB_CLIENT_SECRET="your_secret"
```
The `TESTTOKEN` and `TESTADMINID` can be used with the REST API to test the system, including adding your Github account as an admin after you have logged in through the app or the web and created the user.

3. Add a `.env` file to the `/services/app` folder and add the following:
```
GITHUB_CLIENT_ID="your_id"
```
This OAuth app needs to have device flow enabled.

4. Run `./init.bash --prod` to get the system up and running.
5. Run the `demo.py` script to add content like scooters and parking spots to the system.

### Web application
Go to `localhost:9001` to use the web application. A user account is created automatically when you login via Github OAuth. You can give this user admin rights via the gateway once you have logged in.

### Gateway/REST API
The gateway/REST API is found at `localhost:3500`. See the [documentation](https://github.com/blajban/vteam-main/wiki/REST-API-docs-v1) for more information. Use the `TESTTOKEN` and `TESTADMINID` to get started, such as giving yourself admin rights.

#### Tests for REST API
Test the REST API using postman or newman.

1. Install Newman:
`npm install -g newman`
2. Make sure system is running.
3. Run tests:
`newman run services/gateway/tests/Gateway.postman_collection.json`

You can also import the test collection to Postman and run the tests there.

### App
Run the app using your phone:
1. Go to `/services/app` and run `expo start`. Run `npm install` if expo doesn't start.
2. Scan the qr code using the Expo Go app on your phone.
3. Login to the system, all locations and scooters should load automatically (in Stockholm, Gothenburg and Malmö)
4. To rent a scooter, create and scan a qr code using a scooter id (touch a scooter to see the id).

### Coverage report
backend ./coverage
App     ./services/app/coverage