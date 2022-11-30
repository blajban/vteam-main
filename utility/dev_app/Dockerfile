FROM node:16

WORKDIR /utility/dev_app

COPY ./utility/dev_app/package.json .
COPY ./utility/dev_app/src .
COPY ./utility/dev_app/public .
RUN npm install

CMD [ "npm", "start" ]

