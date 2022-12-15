FROM node:16

WORKDIR /shared
COPY ./shared/mq.js .
COPY ./shared/mongowrapper.js .
COPY ./shared/resources.js .
COPY ./shared/package.json .
COPY ./shared/dummy_data/scooter_service/scooters.json ./dummy_data/scooter_service/scooters.json
RUN npm install

WORKDIR /services/scooter_service
RUN npm install -g nodemon


COPY ./services/scooter_service/package.json .
COPY ./services/scooter_service/scooter_service.js .
COPY ./services/scooter_service/scooter_handler.js .
COPY ./services/scooter_service/fleet_handler.js .

RUN npm install



CMD [ "npm", "start" ]

