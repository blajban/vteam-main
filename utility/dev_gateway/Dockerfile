FROM node:16



WORKDIR /shared
COPY ./shared/mq.js .
COPY ./shared/resources.js .
COPY ./shared/package.json .
RUN npm install


WORKDIR /utility/dev_gateway
RUN npm install -g nodemon


COPY ./utility/dev_gateway/package.json .
COPY ./utility/dev_gateway/dev_gateway.js .

RUN npm install



CMD [ "npm", "start" ]

