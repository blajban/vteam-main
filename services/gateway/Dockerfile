FROM node:16



WORKDIR /shared
COPY ./shared/mq.js .
COPY ./shared/resources.js .
COPY ./shared/package.json .
RUN npm install


WORKDIR /services/gateway
RUN npm install -g nodemon


COPY ./services/gateway/package.json .
COPY ./services/gateway/gateway.js .

RUN npm install



CMD [ "npm", "start" ]

