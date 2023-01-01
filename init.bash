#!/bin/bash

echo Initialising..

touch .env

(cd ./services/app && exec npm install)

docker-compose up -d mongodb
docker-compose up -d rabbitmq

docker-compose up --build -d gateway

curl -s --request GET 'http://localhost:3500/api-key' | jq '{"key":.key}' > api-key.json

#docker-compose up --build


