FROM node:16



WORKDIR /shared
COPY ./shared/mq.js .
COPY ./shared/resources.js .
COPY ./shared/package.json .
RUN npm install


WORKDIR /utility/logger
RUN npm install -g nodemon


COPY ./utility/logger/package.json .
COPY ./utility/logger/logger.js .
RUN npm install



CMD [ "npm", "start" ]

