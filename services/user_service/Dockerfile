FROM node:16

WORKDIR /shared
COPY ./shared/mq.js .
COPY ./shared/resources.js .
COPY ./shared/package.json .
RUN npm install

WORKDIR /services/user_service
RUN npm install -g nodemon


COPY ./services/user_service/package.json .
COPY ./services/user_service/user_service.js .

RUN npm install



CMD [ "npm", "start" ]
