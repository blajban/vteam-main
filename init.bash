#!/bin/bash

echo "Initialising.."

touch .env
touch api-key.json

npm install

(cd ./services/app && exec npm install)

docker-compose up -d mongodb
docker-compose up -d rabbitmq

docker-compose up --build -d gateway

echo "Getting api-key..."
sleep 3

curl -s --request GET 'http://localhost:3500/api-key' | jq '{"key":.key}' > api-key.json

echo "Done!"
#docker-compose up --build
