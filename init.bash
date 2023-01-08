#!/bin/bash

echo "Initialising.."

touch .env

npm install

(cd ./services/app && exec npm install)

docker-compose up -d mongodb
docker-compose up -d rabbitmq

docker-compose up --build -d gateway

echo "Getting api-key..."
sleep 3

curl -s --request GET 'http://localhost:3500/api-key' | jq '{"key":.key}' > ./services/web/src/api-key.json
curl -s --request GET 'http://localhost:3500/api-key' | jq '{"key":.key}' > ./services/app/api-key.json

echo "Done!"

PRODFILE="docker-compose-prod.yml"

if [[ $1 == "--prod" ]]
then
    echo "$PRODFILE"
    docker-compose -f "$PRODFILE" up -d --build payment_service
    docker-compose -f "$PRODFILE" up -d --build user_service
    docker-compose -f "$PRODFILE" up -d --build location_service
    docker-compose -f "$PRODFILE" up -d --build scooter_service
    docker-compose -f "$PRODFILE" up -d --build simulation
    docker-compose -f "$PRODFILE" up -d --build web

    echo "Up and running!"
fi
