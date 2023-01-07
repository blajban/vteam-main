FROM node:16

WORKDIR /shared
COPY ./shared/mq.js .
COPY ./shared/resources.js .
COPY ./shared/package.json .
COPY ./shared/mongowrapper.js .
COPY ./shared/dummy_data/payment_service/invoices.json ./dummy_data/payment_service/invoices.json
RUN npm install

WORKDIR /services/payment_service
RUN npm install -g nodemon


COPY ./services/payment_service/package.json .
COPY ./services/payment_service/invoice_handler.js .
COPY ./services/payment_service/index.js .
COPY ./services/payment_service/filler.js .

RUN npm install



CMD [ "npm", "start" ]

