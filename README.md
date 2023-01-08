# vteam-main

## Test REST API
Test using postman or newman.

1. Install Newman:
`npm install -g newman`
2. Make sure system is running:
`./init.bash --prod`
3. Run tests:
`newman run services/gateway/tests/Gateway.postman_collection.json`

You can also import the test collection to Postman and run the tests there.
