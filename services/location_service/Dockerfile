FROM node:16

WORKDIR /shared
COPY ./shared/mq.js .
COPY ./shared/resources.js .
COPY ./shared/package.json .
RUN npm install

WORKDIR /services/location_service
RUN npm install -g nodemon


COPY ./services/location_service/package.json .
COPY ./services/location_service/index.js .

RUN npm install



CMD [ "npm", "start" ]

