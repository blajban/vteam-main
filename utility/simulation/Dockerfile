FROM node:16

WORKDIR /shared
COPY ./shared/mq.js .
COPY ./shared/resources.js .
COPY ./shared/package.json .
RUN npm install

WORKDIR /utility/simulation
RUN npm install -g nodemon


COPY ./utility/simulation/package.json .
COPY ./utility/simulation/simulation.js .
COPY ./utility/simulation/src/scooter.js ./src/.
COPY ./utility/simulation/src/scooter_events.js ./src/.

RUN npm install



CMD [ "npm", "start" ]

